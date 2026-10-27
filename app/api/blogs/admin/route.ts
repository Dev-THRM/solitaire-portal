import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createBlog } from '@/lib/blogs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CreateBlogSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(5),
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

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = CreateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const blog = await createBlog(parsed.data);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (err) {
    console.error('[blogs/admin/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}
