import prisma from '../config/db';
import { CreateApplicationDto } from '../types';
// [DISABLED FOR BASIC TESTING]
// import { sendApplicationEmail, sendConfirmationEmail } from './email.service';
// import { appendApplicationToSheet } from './sheets.service';

export async function createApplication(data: CreateApplicationDto) {
  // 1. Verify job exists and is active
  const job = await prisma.job.findUnique({ where: { id: data.jobId } });
  if (!job) throw new Error('JOB_NOT_FOUND');
  if (!job.isActive) throw new Error('JOB_INACTIVE');

  // 2. Prevent duplicate applications from the same email for the same job
  const duplicate = await prisma.application.findFirst({
    where: { jobId: data.jobId, email: data.email },
  });
  if (duplicate) throw new Error('ALREADY_APPLIED');

  // 3. Persist the application
  const application = await prisma.application.create({ data });

  // 4. [DISABLED FOR BASIC TESTING] Fire-and-forget: email + Sheets
  // const appliedAt = new Date().toLocaleString('en-IN', {
  //   timeZone: 'Asia/Kolkata',
  //   dateStyle: 'medium',
  //   timeStyle: 'short',
  // });
  //
  // Promise.allSettled([
  //   sendApplicationEmail({
  //     applicantName: `${data.firstName} ${data.lastName}`,
  //     applicantEmail: data.email,
  //     applicantPhone: data.phone,
  //     jobTitle: job.title,
  //     company: job.company,
  //     coverLetter: data.coverLetter,
  //     resumeUrl: data.resumeUrl,
  //     appliedAt,
  //   }),
  //   sendConfirmationEmail(data.email, `${data.firstName} ${data.lastName}`, job.title),
  //   appendApplicationToSheet({
  //     applicationId: application.id,
  //     jobTitle: job.title,
  //     company: job.company,
  //     firstName: data.firstName,
  //     lastName: data.lastName,
  //     email: data.email,
  //     phone: data.phone,
  //     coverLetter: data.coverLetter,
  //     resumeUrl: data.resumeUrl,
  //     appliedAt,
  //   }),
  // ]).then((results) => {
  //   results.forEach((r, i) => {
  //     if (r.status === 'rejected') {
  //       console.error(`Notification ${i} failed:`, r.reason);
  //     }
  //   });
  // });

  return application;
}

export async function listApplications(jobId?: string) {
  return prisma.application.findMany({
    where: jobId ? { jobId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      job: { select: { title: true, company: true } },
    },
  });
}

export async function getApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
}

export async function updateApplicationStatus(id: string, status: string) {
  return prisma.application.update({
    where: { id },
    data: { status: status as any },
  });
}
