import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { updateApplicationStatus } from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const StatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'CATEGORIZED', 'ACCEPTED', 'SWITCHED', 'ON_HOLD', 'REJECTED']),
  jobId: z.string().cuid().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = StatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const application = await updateApplicationStatus(id, parsed.data.status, parsed.data.jobId);
    return NextResponse.json({ success: true, data: application });
  } catch (err) {
    console.error('[apply/admin/[id]/status/PATCH] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
