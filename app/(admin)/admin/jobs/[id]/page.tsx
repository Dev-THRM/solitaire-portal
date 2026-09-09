'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminUpdateJob, type Job } from '@/app/_lib/api';
import { getToken } from '@/app/_lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'] as const;

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Partial<Job> & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }

    fetch(`${API_BASE}/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((res) => setForm(res.data))
      .catch(() => router.push('/admin/jobs'));
  }, [id, router]);

  function set(field: string, value: unknown) {
    setForm((prev) => prev ? { ...prev, [field]: value } : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    const token = getToken()!;
    try {
      await adminUpdateJob(token, id, form);
      setSuccess(true);
      setTimeout(() => router.push('/admin/jobs'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally { setSaving(false); }
  }

  if (!form) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/jobs" style={{ fontSize: 13, color: 'var(--color-primary)' }}>← Back to Jobs</Link>
        <h1 style={{ fontSize: 26, marginTop: 8 }}>Edit Job</h1>
      </div>

      {error && <div style={{ background: 'hsl(0,84%,95%)', color: 'hsl(0,84%,38%)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20, border: '1px solid hsl(0,84%,85%)', fontSize: 14 }}>{error}</div>}
      {success && <div style={{ background: 'hsl(142,71%,92%)', color: 'hsl(142,71%,30%)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 14 }}>✅ Saved! Redirecting...</div>}

      <form id="edit-job-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="edit-title" className="form-label">Job Title *</label>
              <input id="edit-title" className="input" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-company" className="form-label">Company *</label>
              <input id="edit-company" className="input" value={form.company ?? ''} onChange={(e) => set('company', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-location" className="form-label">Location *</label>
              <input id="edit-location" className="input" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-type" className="form-label">Job Type *</label>
              <select id="edit-type" className="input" value={form.type ?? 'FULL_TIME'} onChange={(e) => set('type', e.target.value)}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-salary" className="form-label">Salary</label>
              <input id="edit-salary" className="input" value={form.salary ?? ''} onChange={(e) => set('salary', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>Job Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="edit-description" className="form-label">Description *</label>
              <textarea id="edit-description" className="input" style={{ minHeight: 160 }} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-requirements" className="form-label">Requirements *</label>
              <textarea id="edit-requirements" className="input" style={{ minHeight: 140 }} value={form.requirements ?? ''} onChange={(e) => set('requirements', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-benefits" className="form-label">Benefits</label>
              <textarea id="edit-benefits" className="input" style={{ minHeight: 100 }} value={form.benefits ?? ''} onChange={(e) => set('benefits', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input
              id="edit-is-active"
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => set('isActive', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Active listing</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Uncheck to hide from candidates</div>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button id="save-job-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
          <Link href="/admin/jobs" className="btn btn-ghost btn-lg">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
