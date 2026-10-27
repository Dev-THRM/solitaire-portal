import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createJob } from '@/lib/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JobSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(1),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']),
  experienceMin: z.number().int().nonnegative().optional(),
  experienceMax: z.number().int().nonnegative().optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  description: z.string().min(10),
  requirements: z.string().min(10),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = JobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const job = await createJob(parsed.data as any);
    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (err) {
    console.error('[jobs/admin/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 500 });
  }
}
