import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { getBlogByIdAdmin, updateBlog, deleteBlog } from '@/lib/blogs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UpdateBlogSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(5).optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  readTime: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  keywords: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const blog = await getBlogByIdAdmin(id);
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error('[blogs/admin/[id]/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const blog = await updateBlog(id, parsed.data);
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error('[blogs/admin/[id]/PUT] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
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
    await deleteBlog(id);
    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    console.error('[blogs/admin/[id]/DELETE] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
