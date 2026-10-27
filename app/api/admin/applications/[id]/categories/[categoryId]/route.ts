import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; categoryId: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id, categoryId } = await params;
    const resume = await prisma.resume.findUnique({
      where: { applicationId: id },
      select: { id: true },
    });

    if (!resume) {
      return NextResponse.json({ success: false, error: 'No resume found for this application' }, { status: 404 });
    }

    await prisma.candidateCategory.updateMany({
      where: { resumeId: resume.id, categoryId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Category removed' });
  } catch (err) {
    console.error('[admin/applications/[id]/categories/[categoryId]/DELETE] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to remove category' }, { status: 500 });
  }
}
