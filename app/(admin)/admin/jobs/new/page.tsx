'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminCreateJob } from '../../../../_lib/api';
import { getToken } from '../../../../_lib/auth';
import { Briefcase, ArrowLeft, Building2, MapPin, DollarSign, FileText, Settings, Rocket, Clock, Loader2 } from 'lucide-react';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'] as const;

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', location: '', type: 'FULL_TIME' as typeof JOB_TYPES[number],
    salaryMin: '', salaryMax: '', experienceMin: '', experienceMax: '',
    description: '', requirements: '', isActive: true,
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
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin, 10) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax, 10) : undefined,
        experienceMin: form.experienceMin ? parseInt(form.experienceMin, 10) : undefined,
        experienceMax: form.experienceMax ? parseInt(form.experienceMax, 10) : undefined,
      };
      await adminCreateJob(token, payload as any);
      router.push('/admin/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally { setSaving(false); }
  }

  return (
    <div style={{ width: '100%', maxWidth: 1200 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/admin/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none', marginBottom: 12 }}>
          <ArrowLeft size={16} /> Back to Jobs
        </Link>
        <h1 style={{ fontSize: 32, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
          Post a New Job
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Create a detailed listing to attract the best talent.</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '16px 20px', borderRadius: 16, fontSize: 14, marginBottom: 24, border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Settings size={20} /> {error}
        </div>
      )}

      <form id="new-job-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Basic Info */}
        <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 18, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--color-surface-3)', paddingBottom: 16 }}>
            <Briefcase size={20} color="var(--color-primary)" /> Basic Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: '1 / -1' }}>
              <label htmlFor="job-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Job Title *</label>
              <input 
                id="job-title" 
                value={form.title} 
                onChange={(e) => set('title', e.target.value)} 
                placeholder="e.g. Senior Frontend Developer" 
                required 
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="job-location" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} color="var(--color-text-muted)" /> Location *</label>
              <input id="job-location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Bengaluru / Remote" required style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="job-type" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={16} color="var(--color-text-muted)" /> Job Type *</label>
              <select id="job-type" value={form.type} onChange={(e) => set('type', e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15, background: 'white' }}>
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
                <input type="number" value={form.experienceMin} onChange={(e) => set('experienceMin', e.target.value)} placeholder="Min" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
                <span style={{ color: 'var(--color-text-muted)' }}>to</span>
                <input type="number" value={form.experienceMax} onChange={(e) => set('experienceMax', e.target.value)} placeholder="Max" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={16} color="var(--color-text-muted)" /> Salary Range (₹ LPA)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="number" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} placeholder="Min" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
                <span style={{ color: 'var(--color-text-muted)' }}>to</span>
                <input type="number" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} placeholder="Max" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15 }} />
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
              <label htmlFor="job-description" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Job Description *</label>
              <textarea id="job-description" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the role, team, and responsibilities..." required style={{ width: '100%', minHeight: 160, padding: '16px', borderRadius: 16, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="job-requirements" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Requirements *</label>
              <textarea id="job-requirements" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="List required skills, experience, qualifications..." required style={{ width: '100%', minHeight: 140, padding: '16px', borderRadius: 16, border: '1px solid var(--color-border)', outline: 'none', fontSize: 15, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: 'white', borderRadius: 24, padding: '24px 32px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Rocket size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>Publish Immediately</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Job will be visible to candidates right away on the portal</div>
            </div>
            <input
              id="job-is-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              style={{ width: 24, height: 24, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button id="submit-new-job-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ padding: '16px 32px', borderRadius: 16, fontSize: 16, flex: 1, justifyContent: 'center' }}>
            {saving ? <><Loader2 className="animate-spin" size={18} style={{ display: 'inline', marginRight: 8 }} /> Saving...</> : <><Rocket size={18} style={{ display: 'inline', marginRight: 8 }} /> Post Job Now</>}
          </button>
          <Link href="/admin/jobs" className="btn btn-outline btn-lg" style={{ padding: '16px 32px', borderRadius: 16, fontSize: 16 }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
