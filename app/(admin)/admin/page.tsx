'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminGetJobs, adminGetApplications, type Job, type Application } from '@/app/_lib/api';
import { getToken, getAdminInfo } from '@/app/_lib/auth';
import { Briefcase, Inbox, Activity, AlertCircle, ArrowRight, User } from 'lucide-react';

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
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'var(--color-primary)', sub: `${activeJobs} active` },
    { label: 'Applications', value: applications.length, icon: Inbox, color: '#3b82f6', sub: `${todayApps} today` },
    { label: 'Active Listings', value: activeJobs, icon: Activity, color: '#10b981', sub: `${jobs.length - activeJobs} paused` },
    { label: 'Pending Review', value: applications.filter((a) => a.status === 'PENDING').length, icon: AlertCircle, color: '#f59e0b', sub: 'need attention' },
  ];

  if (loading) return (
    <div className="bento-grid" style={{ gap: 24, maxWidth: 1200 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="bento-col-3 skeleton" style={{ height: 140, borderRadius: 24 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--color-primary)' }}>
            Welcome back, {admin?.name?.split(' ')[0] ?? 'Admin'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>
            Here's what's happening with solitaire job portal today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/admin/jobs/new" className="btn btn-primary btn-lg" style={{ borderRadius: 12, boxShadow: '0 10px 25px rgba(30,73,106,0.2)' }}>
            + Post New Job
          </Link>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="bento-grid" style={{ marginBottom: 48 }}>
        {STATS.map((stat, idx) => (
          <div key={stat.label} className="bento-col-3" style={{
            background: 'white',
            borderRadius: 24,
            padding: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--color-border)',
            transition: 'transform 0.2s',
            cursor: 'default',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: 6 }}>{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <p style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text)', lineHeight: 1 }}>
                  {stat.value}
                </p>
              </div>
              <p style={{ fontSize: 12, fontWeight: 500, color: stat.color, marginTop: 8, background: `${stat.color}15`, display: 'inline-block', padding: '4px 8px', borderRadius: 12 }}>
                {stat.sub}
              </p>
            </div>
            <div style={{
              width: 48, height: 48,
              borderRadius: 14,
              background: `${stat.color}10`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color
            }}>
              <stat.icon size={24} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications Bento Block */}
      <div className="bento-grid">
        <div className="bento-col-12" style={{
          background: 'white',
          borderRadius: 24,
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, color: 'var(--color-primary)' }}>Recent Applications</h2>
            <Link href="/admin/applications" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {applications.slice(0, 5).length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Inbox size={48} opacity={0.2} />
              <p>No applications yet</p>
            </div>
          ) : (
            <div>
              {applications.slice(0, 5).map((app, i) => (
                <Link href={`/admin/applications?id=${app.id}`} key={app.id} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 2fr 1fr 1fr', 
                  alignItems: 'center',
                  padding: '20px 32px', 
                  borderBottom: i === applications.slice(0,5).length - 1 ? 'none' : '1px solid var(--color-border)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-surface-2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>{app.firstName} {app.lastName}</p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>{app.email}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{app.job?.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>{app.job?.location}</p>
                  </div>
                  <div>
                    <span className={`badge ${app.status === 'PENDING' ? 'badge-warning' : (app.status as string) === 'SHORTLISTED' || app.status === 'ACCEPTED' ? 'badge-success' : app.status === 'REJECTED' ? 'badge-error' : 'badge-neutral'}`} style={{ padding: '6px 12px' }}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--color-text-subtle)', fontWeight: 500 }}>
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
