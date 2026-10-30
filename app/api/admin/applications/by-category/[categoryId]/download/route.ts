import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { resolveUploadedFilePath } from '@/lib/uploadPath';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvEscape(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  // Wrap in quotes if it contains commas, quotes, or newlines
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(values: (string | null | undefined)[]): string {
  return values.map(csvEscape).join(',');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { categoryId } = await params;

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Check if specific applicationIds were requested
    const { searchParams } = new URL(request.url);
    const appIdsParam = searchParams.get('applicationIds');
    const requestedAppIds = appIdsParam ? appIdsParam.split(',').map((s) => s.trim()).filter(Boolean) : null;

    // Fetch applications that have this category assigned (active)
    const candidateCategories = await prisma.candidateCategory.findMany({
      where: {
        categoryId,
        isActive: true,
        ...(requestedAppIds && requestedAppIds.length > 0
          ? { resume: { applicationId: { in: requestedAppIds } } }
          : {}),
      },
      include: {
        resume: {
          include: {
            application: {
              include: {
                job: { select: { title: true } },
              },
            },
          },
        },
      },
      orderBy: { confidence: 'desc' },
    });

    // Build CSV header + rows
    const csvHeader = buildCsvRow([
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Job Applied For',
      'Status',
      'Current Salary',
      'Expected Salary',
      'Notice Period',
      'Match Confidence',
      'Match Source',
      'Evidence',
      'Applied On',
      'Resume File',
    ]);

    const csvRows: string[] = [csvHeader];
    const resumeFiles: { name: string; path: string }[] = [];

    for (const cc of candidateCategories) {
      const app = cc.resume.application;
      const fileName = app.resumeUrl ? app.resumeUrl.split('/').pop() ?? '' : '';
      const sanitizedName = `${app.firstName}_${app.lastName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      const ext = fileName ? path.extname(fileName) : '.pdf';
      const zipEntryName = `resumes/${sanitizedName}_${app.id.slice(-6)}${ext}`;

      if (fileName) {
        const filePath = resolveUploadedFilePath(fileName);
        if (fs.existsSync(filePath)) {
          resumeFiles.push({ name: zipEntryName, path: filePath });
        }
      }

      csvRows.push(
        buildCsvRow([
          app.firstName,
          app.lastName,
          app.email,
          app.phone,
          app.job?.title,
          app.status,
          app.currentCtc,
          app.expectedCtc,
          app.noticePeriod,
          `${Math.round(cc.confidence * 100)}%`,
          cc.source,
          cc.evidence,
          new Date(app.createdAt).toLocaleDateString('en-AE', {
            timeZone: 'Asia/Dubai',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          zipEntryName,
        ]),
      );
    }

    const csvContent = csvRows.join('\r\n');

    // Build ZIP in-memory using JSZip
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const JSZip = require('jszip');
    const zip = new JSZip();

    // Add CSV
    const safeCatName = category.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    zip.file(`${safeCatName}_applicants.csv`, csvContent);

    // Add resume files
    for (const rf of resumeFiles) {
      try {
        const fileBuffer = fs.readFileSync(rf.path);
        zip.file(rf.name, fileBuffer);
      } catch (err) {
        console.warn(`[download] Could not read resume file: ${rf.path}`, err);
      }
    }

    const zipBuffer: Buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeCatName}_applicants_${new Date().toISOString().slice(0, 10)}.zip"`,
        'Content-Length': String(zipBuffer.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[admin/applications/by-category/download] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to generate download' }, { status: 500 });
  }
}
