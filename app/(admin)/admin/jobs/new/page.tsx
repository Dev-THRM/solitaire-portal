'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminCreateJob } from '../../../../_lib/api';
import { getToken } from '../../../../_lib/auth';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'] as const;

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'FULL_TIME' as typeof JOB_TYPES[number],
    salary: '', description: '', requirements: '', benefits: '', isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    try {
      await adminCreateJob(token, form);
      router.push('/admin/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally { setSaving(false); }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/jobs" style={{ fontSize: 13, color: 'var(--color-primary)' }}>← Back to Jobs</Link>
        <h1 style={{ fontSize: 26, marginTop: 8 }}>Post New Job</h1>
      </div>

      {error && (
        <div style={{ background: 'hsl(0,84%,95%)', color: 'hsl(0,84%,38%)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 14, marginBottom: 20, border: '1px solid hsl(0,84%,85%)' }}>
          {error}
        </div>
      )}

      <form id="new-job-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Basic Info */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="job-title" className="form-label">Job Title *</label>
              <input id="job-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Senior Frontend Developer" required />
            </div>
            <div className="form-group">
              <label htmlFor="job-company" className="form-label">Company *</label>
              <input id="job-company" className="input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" required />
            </div>
            <div className="form-group">
              <label htmlFor="job-location" className="form-label">Location *</label>
              <input id="job-location" className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Bengaluru / Remote" required />
            </div>
            <div className="form-group">
              <label htmlFor="job-type" className="form-label">Job Type *</label>
              <select id="job-type" className="input" value={form.type} onChange={(e) => set('type', e.target.value)} required>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="job-salary" className="form-label">Salary Range</label>
              <input id="job-salary" className="input" value={form.salary} onChange={(e) => set('salary', e.target.value)} placeholder="e.g. ₹15L – ₹25L per annum" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>Job Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="job-description" className="form-label">Job Description *</label>
              <textarea id="job-description" className="input" style={{ minHeight: 160 }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the role, team, and responsibilities..." required />
            </div>
            <div className="form-group">
              <label htmlFor="job-requirements" className="form-label">Requirements *</label>
              <textarea id="job-requirements" className="input" style={{ minHeight: 140 }} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="List required skills, experience, qualifications..." required />
            </div>
            <div className="form-group">
              <label htmlFor="job-benefits" className="form-label">Benefits (optional)</label>
              <textarea id="job-benefits" className="input" style={{ minHeight: 100 }} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} placeholder="Health insurance, flexible hours, stock options..." />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card" style={{ padding: 28 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input
              id="job-is-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Publish immediately</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Job will be visible to candidates right away</div>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button id="submit-new-job-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? '⏳ Saving...' : '🚀 Post Job'}
          </button>
          <Link href="/admin/jobs" className="btn btn-ghost btn-lg">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
