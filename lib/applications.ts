import path from 'path';
import prisma from './prisma';
// Dynamic import for extractAndCategorize is used inside createApplication
// so route handlers like /api/apply/admin (listing applications) do not load pdf-parse or pdfjs-dist at module startup.
import { sendApplicationEmail, sendConfirmationEmail, sendStatusUpdateEmail } from './email';
import { appendApplicationToSheet } from './sheets';

export interface CreateApplicationDto {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  coverLetter: string;
  resumeUrl?: string;
}

export async function createApplication(data: CreateApplicationDto) {
  const job = await prisma.job.findUnique({ where: { id: data.jobId } });
  if (!job) throw new Error('JOB_NOT_FOUND');
  if (!job.isActive) throw new Error('JOB_INACTIVE');

  const duplicate = await prisma.application.findFirst({
    where: { jobId: data.jobId, email: data.email },
  });
  if (duplicate) throw new Error('ALREADY_APPLIED');

  const application = await prisma.application.create({ data });

  // Fire-and-forget: extract resume text + categorize via Gemini (lazy-loaded)
  if (data.resumeUrl) {
    const filename = data.resumeUrl.split('/').pop() ?? '';
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    import('./categorization')
      .then(({ extractAndCategorize }) => extractAndCategorize(application.id, filePath))
      .catch((err) => console.error('[categorization] Unexpected error:', err));
  }

  // Fire-and-forget: email + Sheets
  const appliedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  Promise.allSettled([
    sendApplicationEmail({
      applicantName: `${data.firstName} ${data.lastName}`,
      applicantEmail: data.email,
      applicantPhone: data.phone,
      currentCtc: data.currentCtc,
      expectedCtc: data.expectedCtc,
      noticePeriod: data.noticePeriod,
      jobTitle: job.title,
      company: 'Solitaire Consultancy',
      coverLetter: data.coverLetter,
      resumeUrl: data.resumeUrl,
      appliedAt,
    }),
    sendConfirmationEmail(data.email, `${data.firstName} ${data.lastName}`, job.title),
    appendApplicationToSheet({
      applicationId: application.id,
      jobTitle: job.title,
      company: 'Solitaire Consultancy',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      currentCtc: data.currentCtc,
      expectedCtc: data.expectedCtc,
      noticePeriod: data.noticePeriod,
      coverLetter: data.coverLetter,
      resumeUrl: data.resumeUrl,
      appliedAt,
    }),
  ]).catch(() => {});

  return application;
}

export async function listApplications(jobId?: string) {
  const applications = await prisma.application.findMany({
    where: jobId ? { jobId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      job: { select: { title: true, location: true } },
    },
  });

  return applications.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
}

export async function updateApplicationStatus(id: string, status: string, jobId?: string) {
  const data: any = { status: status as any };
  if (jobId) {
    data.jobId = jobId;
  }
  const app = await prisma.application.update({
    where: { id },
    data,
    include: { job: true },
  });

  sendStatusUpdateEmail(
    app.email,
    `${app.firstName} ${app.lastName}`,
    app.job.title,
    status,
  ).catch((err) => console.error('[status-email] Failed:', err));

  return app;
}
