import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getApplicationById } from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: application });
  } catch (err) {
    console.error('[apply/admin/[id]/GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch application' }, { status: 500 });
  }
}
