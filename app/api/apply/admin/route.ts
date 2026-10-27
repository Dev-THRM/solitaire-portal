import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { listApplications } from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId') || undefined;

    const applications = await listApplications(jobId);
    return NextResponse.json({ success: true, data: applications });
  } catch (err) {
    console.error('[apply/admin/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}
