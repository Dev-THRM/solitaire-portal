import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { CreateJobDto, UpdateJobDto, JobQueryParams } from '../types';

const PAGE_SIZE = 10;

export async function listJobs(params: JobQueryParams) {
  const page = Math.max(1, parseInt(params.page ?? '1'));
  const limit = Math.min(50, parseInt(params.limit ?? String(PAGE_SIZE)));
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
        isActive: true,
        createdAt: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({ where: { id } });
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

// Admin: list ALL jobs including inactive
export async function listAllJobs() {
  return prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  });
}
