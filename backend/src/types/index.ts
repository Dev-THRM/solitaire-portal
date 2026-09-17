// ── Shared TypeScript types used across the backend ──────────────────────────

export interface AuthPayload {
  adminId: string;
  email: string;
}

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

export interface CreateApplicationDto {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
}

export interface JobQueryParams {
  search?: string;
  type?: string;
  location?: string;
  page?: string;
  limit?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Extend Express Request to include the authenticated admin
declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}
