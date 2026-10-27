import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { listCategories, createCategory } from '@/lib/categories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().min(1),
});

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const categories = await listCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error('[admin/categories/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = CreateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const category = await createCategory(parsed.data);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A category with that name already exists' }, { status: 409 });
    }
    console.error('[admin/categories/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
