import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { categorizeResume, extractAndCategorize } from '@/lib/categorization';
import { resolveUploadedFilePath } from '@/lib/uploadPath';

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
      const filePath = resolveUploadedFilePath(filename);

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

      await extractAndCategorize(applicationId, filePath);

      return NextResponse.json({
        success: true,
        message: 'Extraction and categorization completed successfully.',
      });
    }

    // Extraction already done — just re-run categorization
    await categorizeResume(resume.id);

    return NextResponse.json({
      success: true,
      message: 'Categorization completed successfully.',
    });
  } catch (err) {
    console.error('[admin/applications/[id]/categorize/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to trigger categorization' }, { status: 500 });
  }
}
