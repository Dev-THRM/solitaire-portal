'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminGetJobs, adminDeleteJob, adminUpdateJob, type Job, JOB_TYPE_LABELS } from '@/app/_lib/api';
import { getToken } from '@/app/_lib/auth';

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchJobs() {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    try {
      const res = await adminGetJobs(token);
      setJobs(res.data);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchJobs(); }, []);

  async function handleToggleActive(job: Job) {
    const token = getToken()!;
    await adminUpdateJob(token, job.id, { isActive: !job.isActive });
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, isActive: !j.isActive } : j));
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this job? This will also delete all its applications.')) return;
    setDeleting(id);
    const token = getToken()!;
    await adminDeleteJob(token, id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeleting(null);
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Manage Jobs</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{jobs.length} total jobs</p>
        </div>
        <Link href="/admin/jobs/new" id="admin-new-job-btn" className="btn btn-primary">
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
          <h3>No jobs yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 24 }}>Post your first job listing to get started</p>
          <Link href="/admin/jobs/new" className="btn btn-primary">Post a Job</Link>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['Job Title', 'Company', 'Type', 'Applications', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <tr key={job.id} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'hsl(240,20%,99%)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 2 }}>📍 {job.location}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--color-text-muted)' }}>{job.company}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-primary">{JOB_TYPE_LABELS[job.type]}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, textAlign: 'center' }}>
                    <Link href={`/admin/applications?jobId=${job.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      {job._count?.applications ?? 0}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      id={`toggle-active-${job.id}`}
                      onClick={() => handleToggleActive(job)}
                      className={`badge ${job.isActive ? 'badge-success' : 'badge-neutral'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {job.isActive ? '● Active' : '○ Paused'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/admin/jobs/${job.id}`} id={`edit-job-${job.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button
                        id={`delete-job-${job.id}`}
                        onClick={() => handleDelete(job.id)}
                        className="btn btn-sm"
                        disabled={deleting === job.id}
                        style={{ background: 'hsl(0,84%,95%)', color: 'hsl(0,84%,38%)', border: 'none' }}
                      >
                        {deleting === job.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
