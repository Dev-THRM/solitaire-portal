import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const resume = await prisma.resume.findUnique({
      where: { applicationId: id },
      select: {
        id: true,
        extractionStatus: true,
        extractionError: true,
        categorizationStatus: true,
        categorizationError: true,
        categorizedAt: true,
        parsedSections: true,
      },
    });

    return NextResponse.json({ success: true, data: resume ?? null });
  } catch (err) {
    console.error('[admin/applications/[id]/resume/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch resume status' }, { status: 500 });
  }
}
