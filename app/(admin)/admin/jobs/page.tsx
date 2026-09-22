'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminGetJobs, adminDeleteJob, adminUpdateJob, type Job, JOB_TYPE_LABELS } from '@/app/_lib/api';
import { getToken } from '@/app/_lib/auth';
import { Briefcase, MapPin, DollarSign, Users, MoreVertical, Edit2, Trash2, Power, PowerOff } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 20 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--color-primary)' }}>Manage Jobs</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>{jobs.length} active listings on your portal</p>
        </div>
        <Link href="/admin/jobs/new" id="admin-new-job-btn" className="btn btn-primary btn-lg" style={{ borderRadius: 12, boxShadow: '0 10px 25px rgba(30,73,106,0.2)' }}>
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 24px', background: 'white', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--color-border)' }}>
          <Briefcase size={48} color="var(--color-text-muted)" opacity={0.3} style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, color: 'var(--color-text)' }}>No jobs yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 24 }}>Post your first job listing to get started</p>
          <Link href="/admin/jobs/new" className="btn btn-primary">Post a Job</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {jobs.map((job) => (
             <div key={job.id} style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.borderColor = 'var(--color-primary-light)';
               e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
               e.currentTarget.style.transform = 'translateY(-2px)';
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.borderColor = 'var(--color-border)';
               e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
               e.currentTarget.style.transform = 'none';
             }}
             >
               {/* Header: Title & Badges */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                 <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                   <Briefcase size={18} strokeWidth={1.5} />
                 </div>
                 <div style={{ display: 'flex', gap: 8 }}>
                   <span style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 6 }}>
                     {JOB_TYPE_LABELS[job.type]}
                   </span>
                 </div>
               </div>

               {/* Title & Info */}
               <div style={{ marginBottom: 16, flex: 1 }}>
                 <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10, lineHeight: 1.3 }}>{job.title}</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                   <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                     <MapPin size={13} /> {job.location}
                   </span>
                   <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                     <DollarSign size={13} /> {job.salaryMin != null && job.salaryMax != null ? `₹${job.salaryMin.toLocaleString('en-IN')} - ₹${job.salaryMax.toLocaleString('en-IN')}` : 'Not set'}
                   </span>
                   <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                     <Users size={13} /> {job._count?.applications ?? 0} Apps
                   </span>
                 </div>
               </div>

               {/* Footer: Actions & Status */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                 <button
                   id={`toggle-active-${job.id}`}
                   onClick={() => handleToggleActive(job)}
                   style={{ 
                     fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 20, border: 'none', cursor: 'pointer',
                     background: job.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                     color: job.isActive ? '#059669' : '#dc2626',
                     display: 'flex', alignItems: 'center', gap: 4, transition: 'opacity 0.2s'
                   }}
                   onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                   onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                 >
                   {job.isActive ? <Power size={11} /> : <PowerOff size={11} />}
                   {job.isActive ? 'Active' : 'Paused'}
                 </button>
                 <div style={{ display: 'flex', gap: 4 }}>
                   <Link href={`/admin/jobs/${job.id}`} id={`edit-job-${job.id}`} style={{ padding: '6px', color: 'var(--color-text-muted)', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                   onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
                     <Edit2 size={14} />
                   </Link>
                   <button
                     id={`delete-job-${job.id}`}
                     onClick={() => handleDelete(job.id)}
                     disabled={deleting === job.id}
                     style={{ padding: '6px', color: 'var(--color-text-muted)', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                     onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
