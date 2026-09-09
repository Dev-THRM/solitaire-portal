'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminGetApplications, type Application } from '@/app/_lib/api';
import { getToken } from '@/app/_lib/auth';

const STATUS_CONFIG = {
  PENDING:    { label: 'Pending',    class: 'badge-warning', emoji: '⏳' },
  REVIEWED:   { label: 'Reviewed',   class: 'badge-neutral', emoji: '👁️' },
  SHORTLISTED:{ label: 'Shortlisted',class: 'badge-success', emoji: '⭐' },
  REJECTED:   { label: 'Rejected',   class: 'badge-error',   emoji: '✗' },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

import { Suspense } from 'react';

function ApplicationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') ?? undefined;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }

    adminGetApplications(token, jobId)
      .then((res) => setApplications(res.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [jobId, router]);

  async function updateStatus(appId: string, status: string) {
    const token = getToken()!;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${API_BASE}/api/apply/admin/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status: status as Application['status'] } : a));
        setSelected((prev) => prev?.id === appId ? { ...prev, status: status as Application['status'] } : prev);
      }
    } finally { setUpdatingStatus(false); }
  }

  const filtered = statusFilter === 'ALL' ? applications : applications.filter((a) => a.status === statusFilter);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Applications</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          {filtered.length} application{filtered.length !== 1 ? 's' : ''}
          {jobId ? ` for selected job` : ' total'}
        </p>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'].map((s) => (
          <button
            key={s}
            id={`filter-status-${s.toLowerCase()}`}
            onClick={() => setStatusFilter(s)}
            className="btn btn-sm"
            style={{
              background: statusFilter === s ? 'var(--gradient-hero)' : 'var(--color-surface-3)',
              color: statusFilter === s ? 'white' : 'var(--color-text-muted)',
            }}
          >
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s as Application['status']].label}
            <span style={{ opacity: 0.7 }}>
              ({s === 'ALL' ? applications.length : applications.filter((a) => a.status === s).length})
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>
        {/* Table */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No applications found
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)' }}>
                  {['Applicant', 'Job', 'Status', 'Date', ''].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const cfg = STATUS_CONFIG[app.status];
                  const isSelected = selected?.id === app.id;
                  return (
                    <tr
                      key={app.id}
                      id={`app-row-${app.id}`}
                      style={{
                        borderTop: '1px solid var(--color-border)',
                        background: isSelected ? 'var(--color-primary-light)' : (i % 2 === 0 ? 'transparent' : 'hsl(240,20%,99%)'),
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelected(isSelected ? null : app)}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{app.firstName} {app.lastName}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>{app.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-muted)' }}>{app.job?.title ?? '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${cfg.class}`}>{cfg.emoji} {cfg.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-subtle)' }}>
                        {new Date(app.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-primary)' }}>View →</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ padding: 24, position: 'sticky', top: 88 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17 }}>{selected.firstName} {selected.lastName}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--color-text-muted)' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Email: </span><a href={`mailto:${selected.email}`}>{selected.email}</a></div>
              {selected.phone && <div><span style={{ color: 'var(--color-text-muted)' }}>Phone: </span>{selected.phone}</div>}
              <div><span style={{ color: 'var(--color-text-muted)' }}>Job: </span>{selected.job?.title}</div>
              {selected.resumeUrl && (
                <a href={selected.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" id="view-resume-btn">
                  View Resume →
                </a>
              )}

              <div>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>Cover Letter</div>
                <div style={{ background: 'var(--color-surface-2)', padding: 12, borderRadius: 'var(--radius-md)', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto' }}>
                  {selected.coverLetter}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>Update Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                    <button
                      key={val}
                      id={`set-status-${val.toLowerCase()}`}
                      onClick={() => updateStatus(selected.id, val)}
                      disabled={updatingStatus || selected.status === val}
                      className={`btn btn-sm badge ${cfg.class}`}
                      style={{
                        opacity: selected.status === val ? 1 : 0.7,
                        border: selected.status === val ? '2px solid currentColor' : 'none',
                      }}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <ApplicationsPageContent />
    </Suspense>
  );
}
