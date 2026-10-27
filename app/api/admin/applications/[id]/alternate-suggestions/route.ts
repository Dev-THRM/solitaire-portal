import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIDENCE_THRESHOLD = parseFloat(
  process.env.CATEGORIZATION_CONFIDENCE_THRESHOLD ?? '0.65',
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id: applicationId } = await params;
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true } },
        resume: {
          select: {
            id: true,
            candidateCategories: {
              where: { isActive: true, confidence: { gte: CONFIDENCE_THRESHOLD } },
              include: { category: { select: { id: true, name: true, description: true } } },
              orderBy: { confidence: 'desc' },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    const suggestions = application.resume?.candidateCategories ?? [];

    return NextResponse.json({
      success: true,
      data: {
        appliedJobTitle: application.job.title,
        threshold: CONFIDENCE_THRESHOLD,
        suggestions,
      },
    });
  } catch (err) {
    console.error('[admin/applications/[id]/alternate-suggestions/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch alternate suggestions' }, { status: 500 });
  }
}
