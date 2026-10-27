import { NextResponse } from 'next/server';
import { listPublishedBlogs } from '@/lib/blogs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    const result = await listPublishedBlogs(params);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[blogs/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
