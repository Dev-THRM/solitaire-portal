'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminUpdateJob, type Job } from '../../../../_lib/api';
import { getToken } from '../../../../_lib/auth';
import { Briefcase, ArrowLeft, Building2, MapPin, DollarSign, FileText, Settings, Rocket, Clock, Save, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'] as const;

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<any>(null);
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
    setForm((prev: any) => prev ? { ...prev, [field]: value } : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    const token = getToken()!;
    try {
      const payload = {
        title: form.title,
        location: form.location,
        type: form.type,
        description: form.description,
        requirements: form.requirements,
        isActive: form.isActive,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin, 10) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax, 10) : undefined,
        experienceMin: form.experienceMin ? parseInt(form.experienceMin, 10) : undefined,
        experienceMax: form.experienceMax ? parseInt(form.experienceMax, 10) : undefined,
      };
      await adminUpdateJob(token, id, payload as any);
      setSuccess(true);
      setTimeout(() => router.push('/admin/jobs'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally { setSaving(false); }
  }

  if (!form) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 1200 }}>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 250, borderRadius: 24 }} />)}
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: 1200 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/admin/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none', marginBottom: 12 }}>
          <ArrowLeft size={16} /> Back to Jobs
        </Link>
        <h1 style={{ fontSize: 32, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
          Edit Job Listing
        </h1>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '16px 20px', borderRadius: 16, fontSize: 14, marginBottom: 24, border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: 12 }}><Settings size={20} /> {error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '16px 20px', borderRadius: 16, fontSize: 14, marginBottom: 24, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle2 size={20} /> Saved successfully! Redirecting...</div>}

      <form id="edit-job-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Basic Info */}
        <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 18, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--color-surface-3)', paddingBottom: 16 }}>
            <Briefcase size={20} color="var(--color-primary)" /> Basic Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
              <label htmlFor="edit-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Job Title *</label>
              <input id="edit-title" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="edit-location" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} color="var(--color-text-muted)" /> Location *</label>
              <input id="edit-location" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="edit-type" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={16} color="var(--color-text-muted)" /> Job Type *</label>
              <select id="edit-type" value={form.type ?? 'FULL_TIME'} onChange={(e) => set('type', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15, background: 'white' }}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Range Requirements */}
        <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 18, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--color-surface-3)', paddingBottom: 16 }}>
            <DollarSign size={20} color="var(--color-primary)" /> Requirements & Compensation
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} color="var(--color-text-muted)" /> Experience (Years)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="number" value={form.experienceMin ?? ''} onChange={(e) => set('experienceMin', e.target.value)} placeholder="Min" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
                <span style={{ color: 'var(--color-text-muted)' }}>to</span>
                <input type="number" value={form.experienceMax ?? ''} onChange={(e) => set('experienceMax', e.target.value)} placeholder="Max" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={16} color="var(--color-text-muted)" /> Salary Range (₹ LPA)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="number" value={form.salaryMin ?? ''} onChange={(e) => set('salaryMin', e.target.value)} placeholder="Min" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
                <span style={{ color: 'var(--color-text-muted)' }}>to</span>
                <input type="number" value={form.salaryMax ?? ''} onChange={(e) => set('salaryMax', e.target.value)} placeholder="Max" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 18, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--color-surface-3)', paddingBottom: 16 }}>
            <FileText size={20} color="var(--color-primary)" /> Job Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="edit-description" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Job Description *</label>
              <textarea id="edit-description" value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} required style={{ width: '100%', minHeight: 160, padding: '16px', borderRadius: 16, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="edit-requirements" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Requirements *</label>
              <textarea id="edit-requirements" value={form.requirements ?? ''} onChange={(e) => set('requirements', e.target.value)} required style={{ width: '100%', minHeight: 140, padding: '16px', borderRadius: 16, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: 'white', borderRadius: 24, padding: '24px 32px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: form.isActive ? 'var(--color-primary-light)' : 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: form.isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              <Rocket size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>Active Listing</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Uncheck to pause and hide from candidates</div>
            </div>
            <input
              id="edit-is-active"
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => set('isActive', e.target.checked)}
              style={{ width: 24, height: 24, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button id="save-job-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ padding: '16px 32px', borderRadius: 16, fontSize: 16, flex: 1, justifyContent: 'center' }}>
            {saving ? <><Loader2 className="animate-spin" size={20} style={{ display: 'inline', marginRight: 8 }} /> Saving...</> : <><Save size={20} style={{ display: 'inline', marginRight: 8 }} /> Save Changes</>}
          </button>
          <Link href="/admin/jobs" className="btn btn-outline btn-lg" style={{ padding: '16px 32px', borderRadius: 16, fontSize: 16 }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
