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
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(values: (string | null | undefined)[]): string {
  return values.map(csvEscape).join(',');
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { applicationIds, label } = body as {
      applicationIds?: string[];
      label?: string;
    };

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No applications specified for download' },
        { status: 400 },
      );
    }

    // Fetch the specific applications
    const applications = await prisma.application.findMany({
      where: {
        id: { in: applicationIds },
      },
      include: {
        job: { select: { title: true } },
        resume: {
          include: {
            candidateCategories: {
              where: { isActive: true },
              include: { category: { select: { name: true } } },
              orderBy: { confidence: 'desc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (applications.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No applications found matching the selected IDs' },
        { status: 404 },
      );
    }

    // Build CSV
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
      'Matched Categories',
      'Applied On',
      'Resume File',
    ]);

    const csvRows: string[] = [csvHeader];
    const resumeFiles: { name: string; path: string }[] = [];

    for (const app of applications) {
      const fileName = app.resumeUrl ? app.resumeUrl.split('/').pop() ?? '' : '';
      const sanitizedName = `${app.firstName}_${app.lastName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      const ext = fileName ? path.extname(fileName) : '.pdf';
      const zipEntryName = fileName
        ? `resumes/${sanitizedName}_${app.id.slice(-6)}${ext}`
        : 'No resume attached';

      if (fileName) {
        const filePath = resolveUploadedFilePath(fileName);
        if (fs.existsSync(filePath)) {
          resumeFiles.push({ name: zipEntryName, path: filePath });
        }
      }

      const categoriesStr = (app.resume?.candidateCategories ?? [])
        .map((c) => `${c.category.name} (${Math.round(c.confidence * 100)}%)`)
        .join('; ');

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
          categoriesStr || 'None',
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

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const JSZip = require('jszip');
    const zip = new JSZip();

    const safeLabel = (label || 'applicants').replace(/[^a-zA-Z0-9_-]/g, '_');
    zip.file(`${safeLabel}_details.csv`, csvContent);

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

    const dateStr = new Date().toISOString().slice(0, 10);
    const downloadFilename = `${safeLabel}_${dateStr}.zip`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': String(zipBuffer.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[admin/applications/download/POST] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to generate download' },
      { status: 500 },
    );
  }
}

