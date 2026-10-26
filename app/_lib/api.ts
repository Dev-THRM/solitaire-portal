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
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'CATEGORIZED' | 'ACCEPTED' | 'SWITCHED' | 'ON_HOLD' | 'REJECTED';
  createdAt: string;
};

export type PaginatedJobs = {
  jobs: Job[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

// ── Categorization types ─────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { candidateCategories: number };
};

export type ResumeStatus = {
  id: string;
  extractionStatus: 'PENDING' | 'DONE' | 'FAILED';
  extractionError: string | null;
  categorizationStatus: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';
  categorizationError: string | null;
  categorizedAt: string | null;
  parsedSections: { summary: string; experience: string; skills: string; education: string } | null;
} | null;

export type CandidateCategory = {
  id: string;
  resumeId: string;
  categoryId: string;
  category: { id: string; name: string; description: string };
  confidence: number;
  evidence: string;
  source: 'LLM' | 'MANUAL';
  isActive: boolean;
  createdAt: string;
};

// ── Fetch helper ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const headers = new Headers(init?.headers);
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
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
export async function submitApplication(data: FormData): Promise<{ success: boolean; message: string }> {
  return apiFetch('/api/apply', {
    method: 'POST',
    body: data,
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

// ── Categories (taxonomy management) ────────────────────────────────────────
export async function adminGetCategories(token: string): Promise<{ success: boolean; data: Category[] }> {
  return apiFetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
}

export async function adminCreateCategory(token: string, data: { name: string; description: string }) {
  return apiFetch<{ success: boolean; data: Category }>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateCategory(
  token: string,
  id: string,
  data: { name?: string; description?: string; isActive?: boolean },
) {
  return apiFetch<{ success: boolean; data: Category }>(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminDeactivateCategory(token: string, id: string) {
  return apiFetch<{ success: boolean }>(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ── Categorization (per-application) ────────────────────────────────────────
export async function adminGetResumeStatus(
  token: string,
  applicationId: string,
): Promise<{ success: boolean; data: ResumeStatus }> {
  return apiFetch(`/api/admin/applications/${applicationId}/resume`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetApplicationCategories(
  token: string,
  applicationId: string,
): Promise<{ success: boolean; data: CandidateCategory[] }> {
  return apiFetch(`/api/admin/applications/${applicationId}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminTriggerCategorization(
  token: string,
  applicationId: string,
): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/api/admin/applications/${applicationId}/categorize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminAddManualCategory(
  token: string,
  applicationId: string,
  data: { categoryId: string; confidence?: number; evidence?: string },
): Promise<{ success: boolean; data: CandidateCategory }> {
  return apiFetch(`/api/admin/applications/${applicationId}/categories`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminRemoveCategory(
  token: string,
  applicationId: string,
  categoryId: string,
) {
  return apiFetch(`/api/admin/applications/${applicationId}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetAlternateSuggestions(
  token: string,
  applicationId: string,
): Promise<{
  success: boolean;
  data: { appliedJobTitle: string; threshold: number; suggestions: CandidateCategory[] };
}> {
  return apiFetch(`/api/admin/applications/${applicationId}/alternate-suggestions`, {
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
  CATEGORIZED: 'Categorized',
  ACCEPTED: 'Accepted',
  SWITCHED: 'Switched',
  ON_HOLD: 'On Hold',
  REJECTED: 'Rejected',
};
