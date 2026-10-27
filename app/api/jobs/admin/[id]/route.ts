import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { updateJob, deleteJob } from '@/lib/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JobSchema = z.object({
  title: z.string().min(3).optional(),
  location: z.string().min(1).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']).optional(),
  experienceMin: z.number().int().nonnegative().optional(),
  experienceMax: z.number().int().nonnegative().optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  description: z.string().min(10).optional(),
  requirements: z.string().min(10).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = JobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const job = await updateJob(id, parsed.data as any);
    return NextResponse.json({ success: true, data: job });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    console.error('[jobs/admin/[id]/PUT] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update job' }, { status: 500 });
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
    await deleteJob(id);
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    console.error('[jobs/admin/[id]/DELETE] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete job' }, { status: 500 });
  }
}
