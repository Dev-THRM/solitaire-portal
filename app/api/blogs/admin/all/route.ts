import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { listAllBlogsAdmin } from '@/lib/blogs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    const result = await listAllBlogsAdmin(params);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[blogs/admin/all/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
