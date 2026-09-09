// ── API utility for calling the Express backend ───────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT' | 'INTERNSHIP';
  salary?: string;
  description: string;
  requirements: string;
  benefits?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { applications: number };
};

export type Application = {
  id: string;
  jobId: string;
  job?: { title: string; company: string };
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';
  createdAt: string;
};

export type PaginatedJobs = {
  jobs: Job[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }

  return res.json();
}

// ── Jobs ────────────────────────────────────────────────────────────────────
export async function getJobs(
  params: Record<string, string> = {},
): Promise<PaginatedJobs & { success: boolean }> {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/api/jobs${qs ? `?${qs}` : ''}`);
}

export async function getJob(id: string): Promise<{ success: boolean; data: Job }> {
  return apiFetch(`/api/jobs/${id}`);
}

// ── Applications ────────────────────────────────────────────────────────────
export async function submitApplication(data: {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiFetch('/api/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Admin ───────────────────────────────────────────────────────────────────
export async function adminLogin(email: string, password: string) {
  return apiFetch<{ success: boolean; data: { token: string; admin: object } }>(
    '/api/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
  );
}

export async function adminGetJobs(token: string): Promise<{ success: boolean; data: Job[] }> {
  return apiFetch('/api/jobs/admin/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminCreateJob(token: string, data: Partial<Job>) {
  return apiFetch('/api/jobs/admin', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateJob(token: string, id: string, data: Partial<Job>) {
  return apiFetch(`/api/jobs/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminDeleteJob(token: string, id: string) {
  return apiFetch(`/api/jobs/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetApplications(
  token: string,
  jobId?: string,
): Promise<{ success: boolean; data: Application[] }> {
  const qs = jobId ? `?jobId=${jobId}` : '';
  return apiFetch(`/api/apply/admin${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ── Type labels ────────────────────────────────────────────────────────────
export const JOB_TYPE_LABELS: Record<Job['type'], string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

export const STATUS_LABELS: Record<Application['status'], string> = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
};
