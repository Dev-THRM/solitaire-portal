import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { listAllJobs } from '@/lib/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const jobs = await listAllJobs();
    return NextResponse.json({ success: true, data: jobs });
  } catch (err) {
    console.error('[jobs/admin/all/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
