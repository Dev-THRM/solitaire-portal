import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const AddManualCategorySchema = z.object({
  categoryId: z.string().cuid(),
  confidence: z.number().min(0).max(1).optional(),
  evidence: z.string().min(1).optional(),
});

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
      select: { id: true },
    });

    if (!resume) {
      return NextResponse.json({ success: true, data: [] });
    }

    const assignments = await prisma.candidateCategory.findMany({
      where: { resumeId: resume.id, isActive: true },
      include: { category: { select: { id: true, name: true, description: true } } },
      orderBy: { confidence: 'desc' },
    });

    return NextResponse.json({ success: true, data: assignments });
  } catch (err) {
    console.error('[admin/applications/[id]/categories/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = AddManualCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const resume = await prisma.resume.findUnique({
      where: { applicationId: id },
      select: { id: true },
    });

    if (!resume) {
      return NextResponse.json({ success: false, error: 'No resume found for this application' }, { status: 404 });
    }

    const assignment = await prisma.candidateCategory.upsert({
      where: { resumeId_categoryId: { resumeId: resume.id, categoryId: parsed.data.categoryId } },
      create: {
        resumeId: resume.id,
        categoryId: parsed.data.categoryId,
        confidence: parsed.data.confidence ?? 1.0,
        evidence: parsed.data.evidence ?? 'Manually assigned by admin',
        source: 'MANUAL',
        isActive: true,
      },
      update: {
        confidence: parsed.data.confidence ?? 1.0,
        evidence: parsed.data.evidence ?? 'Manually assigned by admin',
        source: 'MANUAL',
        isActive: true,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'P2003') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    console.error('[admin/applications/[id]/categories/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to add category' }, { status: 500 });
  }
}
