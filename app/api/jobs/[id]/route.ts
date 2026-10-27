import { NextResponse } from 'next/server';
import { getJobById } from '@/lib/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (err) {
    console.error('[jobs/[id]/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch job' }, { status: 500 });
  }
}
