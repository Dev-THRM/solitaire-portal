import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { updateCategory, deactivateCategory } from '@/lib/categories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const category = await updateCategory(id, parsed.data);
    return NextResponse.json({ success: true, data: category });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    if (err?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A category with that name already exists' }, { status: 409 });
    }
    console.error('[admin/categories/[id]/PUT] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await deactivateCategory(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    console.error('[admin/categories/[id]/DELETE] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to deactivate category' }, { status: 500 });
  }
}
