import prisma from './prisma';
import { Prisma } from '@prisma/client';

export interface CreateJobDto {
  title: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT' | 'INTERNSHIP';
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string;
  isActive?: boolean;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface JobQueryParams {
  search?: string;
  type?: string;
  location?: string;
  page?: string;
  limit?: string;
}

const PAGE_SIZE = 10;

export async function listJobs(params: JobQueryParams) {
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const limit = Math.min(50, parseInt(params.limit ?? String(PAGE_SIZE), 10));
  const skip = (page - 1) * limit;

  const where: Prisma.JobWhereInput = {
    isActive: true,
  };

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
    ];
  }

  if (params.type) {
    where.type = params.type as any;
  }

  if (params.location) {
    where.location = { contains: params.location };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        location: true,
        type: true,
        experienceMin: true,
        experienceMax: true,
        salaryMin: true,
        salaryMax: true,
        description: true,
        requirements: true,
        isActive: true,
        createdAt: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    success: true,
    jobs: jobs.map((j) => ({
      ...j,
      company: 'Solitaire Consultancy',
      createdAt: j.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(id: string) {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return null;
  return {
    ...job,
    company: 'Solitaire Consultancy',
    createdAt: job.createdAt.toISOString(),
  };
}

export async function createJob(data: CreateJobDto) {
  return prisma.job.create({ data });
}

export async function updateJob(id: string, data: UpdateJobDto) {
  return prisma.job.update({ where: { id }, data });
}

export async function deleteJob(id: string) {
  return prisma.job.delete({ where: { id } });
}

export async function listAllJobs() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  });
  return jobs.map((j) => ({
    ...j,
    company: 'Solitaire Consultancy',
    createdAt: j.createdAt.toISOString(),
  }));
}

