'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminGetJobs, adminGetApplications, type Job, type Application, JOB_TYPE_LABELS } from '@/app/_lib/api';
import { getToken, getAdminInfo } from '@/app/_lib/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }

    Promise.all([
      adminGetJobs(token),
      adminGetApplications(token),
    ]).then(([jobsRes, appsRes]) => {
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    }).catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const admin = getAdminInfo();
  const activeJobs = jobs.filter((j) => j.isActive).length;
  const todayApps = applications.filter((a) => {
    const d = new Date(a.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const STATS = [
    { label: 'Total Jobs', value: jobs.length, icon: '💼', color: '#6366f1', sub: `${activeJobs} active` },
    { label: 'Applications', value: applications.length, icon: '📨', color: '#8b5cf6', sub: `${todayApps} today` },
    { label: 'Active Listings', value: activeJobs, icon: '✅', color: '#22c55e', sub: `${jobs.length - activeJobs} paused` },
    { label: 'Pending Review', value: applications.filter((a) => a.status === 'PENDING').length, icon: '⏳', color: '#f59e0b', sub: 'need attention' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 96, borderRadius: 16 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>
          Welcome back, {admin?.name ?? 'Admin'} 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Here's what's happening with your job portal
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 36 }}>
        {STATS.map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '20px 22px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>{stat.label}</p>
                <p style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 4 }}>{stat.sub}</p>
              </div>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
        <Link href="/admin/jobs/new" id="dash-new-job-btn" className="btn btn-primary">
          + Post New Job
        </Link>
        <Link href="/admin/applications" id="dash-view-apps-btn" className="btn btn-outline">
          View All Applications
        </Link>
      </div>

      {/* Recent Applications */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17 }}>Recent Applications</h2>
          <Link href="/admin/applications" style={{ fontSize: 13, color: 'var(--color-primary)' }}>View all →</Link>
        </div>
        {applications.slice(0, 5).length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No applications yet
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['Applicant', 'Job', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app, i) => (
                <tr key={app.id} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-surface-2)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500 }}>{app.firstName} {app.lastName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--color-text-muted)' }}>{app.job?.title}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${app.status === 'PENDING' ? 'badge-warning' : app.status === 'SHORTLISTED' ? 'badge-success' : app.status === 'REJECTED' ? 'badge-error' : 'badge-neutral'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-subtle)' }}>
                    {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
