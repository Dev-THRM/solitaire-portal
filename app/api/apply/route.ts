import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { createApplication } from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ApplicationSchema = z.object({
  jobId: z.string().cuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      const clean = val.replace(/[\s\-\(\)]/g, '');
      if (clean.startsWith('+91')) {
        return /^\d{10}$/.test(clean.slice(3));
      }
      if (clean.startsWith('+971')) {
        return /^\d{9}$/.test(clean.slice(4));
      }
      const digits = clean.replace(/\D/g, '');
      return digits.length === 10 || digits.length === 9;
    },
    { message: 'Phone must be exactly 9 digits for Dubai / UAE or 10 digits for India' }
  ),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  noticePeriod: z.string().optional(),
  coverLetter: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get('resumeFile') as File | null;

    if (!resumeFile || typeof resumeFile === 'string') {
      return NextResponse.json({ success: false, error: 'Resume document is required' }, { status: 400 });
    }

    // Validate size (5MB limit)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Validate extension
    const ext = path.extname(resumeFile.name || '').toLowerCase();
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    if (!allowed.includes(ext)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only PDF, DOC/DOCX, and JPG/JPEG/PNG images are allowed.',
      }, { status: 400 });
    }

    // Save file to public/uploads
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    const bytes = await resumeFile.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(bytes));

    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key !== 'resumeFile') {
        rawData[key] = value.toString();
      }
    });

    const parsed = ApplicationSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.format(),
      }, { status: 400 });
    }

    const applicationData = {
      ...parsed.data,
      resumeUrl: `/uploads/${filename}`,
      coverLetter: parsed.data.coverLetter || '',
    };

    const application = await createApplication(applicationData);

    return NextResponse.json({
      success: true,
      data: { id: application.id },
      message: 'Application submitted successfully. We will be in touch!',
    }, { status: 201 });
  } catch (err: any) {
    if (err instanceof Error) {
      if (err.message === 'JOB_NOT_FOUND') {
        return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
      }
      if (err.message === 'JOB_INACTIVE') {
        return NextResponse.json({ success: false, error: 'This job is no longer accepting applications' }, { status: 400 });
      }
      if (err.message === 'ALREADY_APPLIED') {
        return NextResponse.json({ success: false, error: 'You have already applied for this job' }, { status: 409 });
      }
    }
    console.error('[apply/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 });
  }
}
