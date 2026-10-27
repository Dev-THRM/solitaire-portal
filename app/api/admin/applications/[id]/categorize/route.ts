import { NextResponse } from 'next/server';
import path from 'path';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { categorizeResume, extractAndCategorize } from '@/lib/categorization';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id: applicationId } = await params;
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { id: true, resumeUrl: true },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    if (!application.resumeUrl) {
      return NextResponse.json({ success: false, error: 'This application has no resume file' }, { status: 400 });
    }

    const resume = await prisma.resume.findUnique({ where: { applicationId } });

    // If never extracted or extraction failed, run full pipeline
    if (!resume || resume.extractionStatus !== 'DONE' || !resume.rawText) {
      const filename = application.resumeUrl.split('/').pop() ?? '';
      const filePath = path.join(process.cwd(), 'public/uploads', filename);

      if (resume) {
        await prisma.resume.update({
          where: { id: resume.id },
          data: {
            extractionStatus: 'PENDING',
            extractionError: null,
            categorizationStatus: 'PENDING',
            categorizationError: null,
          },
        });
      }

      extractAndCategorize(applicationId, filePath).catch((err) =>
        console.error('[extraction] Triggered re-run error:', err),
      );

      return NextResponse.json({
        success: true,
        message: 'Re-extraction and categorization started. Check back in a few seconds.',
      });
    }

    // Extraction already done — just re-run categorization
    categorizeResume(resume.id).catch((err) =>
      console.error('[categorization] Triggered re-run error:', err),
    );

    return NextResponse.json({
      success: true,
      message: 'Categorization started. Check back in a few seconds.',
    });
  } catch (err) {
    console.error('[admin/applications/[id]/categorize/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to trigger categorization' }, { status: 500 });
  }
}
