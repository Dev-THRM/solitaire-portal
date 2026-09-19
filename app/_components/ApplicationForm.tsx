'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitApplication } from '../_lib/api';
import { CheckCircle, AlertCircle, ArrowRight, User, Mail, Phone, Link as LinkIcon, FileText } from 'lucide-react';

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

type FormDataState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFile: File | null;
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

export default function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormDataState>({
    firstName: '', lastName: '', email: '',
    phone: '', coverLetter: '', resumeFile: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.resumeFile) e.resumeFile = 'Resume document is required';
    else if (form.resumeFile.size > 5 * 1024 * 1024) e.resumeFile = 'File must be under 5MB';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const fd = new FormData();
      fd.append('jobId', jobId);
      fd.append('firstName', form.firstName);
      fd.append('lastName', form.lastName);
      fd.append('email', form.email);
      if (form.phone) fd.append('phone', form.phone);
      fd.append('coverLetter', form.coverLetter);
      if (form.resumeFile) fd.append('resumeFile', form.resumeFile);

      await submitApplication(fd);
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div style={{
        background: 'white',
        borderRadius: 24,
        border: '1px solid var(--color-border)',
        padding: '64px 32px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(30,73,106,0.05)',
      }} className="animate-fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <CheckCircle size={64} color="#10b981" />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: 'var(--color-text)' }}>Application Submitted!</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 16, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          Thank you for applying to <strong>{jobTitle}</strong>. Our recruitment team will review your profile and get back to you soon.
        </p>
        <button className="btn btn-outline" style={{ borderRadius: 12, padding: '12px 24px' }} onClick={() => router.push('/jobs')}>
          Browse More Roles
        </button>
      </div>
    );
  }

  return (
    <form id="application-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {serverError && (
        <div style={{
          background: '#fef2f2',
          color: '#b91c1c',
          padding: '16px 20px',
          borderRadius: 16,
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '1px solid #fecaca'
        }}>
          <AlertCircle size={20} />
          {serverError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="form-group">
          <label htmlFor="app-firstName" className="form-label" style={{ fontWeight: 600 }}>First Name <span style={{color: '#ef4444'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><User size={18} /></div>
            <input
              id="app-firstName"
              className="input"
              style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.firstName ? '#ef4444' : undefined }}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Jane"
            />
          </div>
          {errors.firstName && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="app-lastName" className="form-label" style={{ fontWeight: 600 }}>Last Name <span style={{color: '#ef4444'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><User size={18} /></div>
            <input
              id="app-lastName"
              className="input"
              style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.lastName ? '#ef4444' : undefined }}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
          {errors.lastName && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.lastName}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="form-group">
          <label htmlFor="app-email" className="form-label" style={{ fontWeight: 600 }}>Email Address <span style={{color: '#ef4444'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><Mail size={18} /></div>
            <input
              id="app-email"
              type="email"
              className="input"
              style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.email ? '#ef4444' : undefined }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@example.com"
            />
          </div>
          {errors.email && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="app-phone" className="form-label" style={{ fontWeight: 600 }}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><Phone size={18} /></div>
            <input
              id="app-phone"
              type="tel"
              className="input"
              style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)' }}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+971 50 123 4567"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="app-resumeFile" className="form-label" style={{ fontWeight: 600 }}>Resume Document <span style={{color: '#ef4444'}}>*</span></label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><FileText size={18} /></div>
          <input
            id="app-resumeFile"
            type="file"
            accept=".pdf,.doc,.docx"
            className="input"
            style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.resumeFile ? '#ef4444' : undefined }}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setForm({ ...form, resumeFile: file });
            }}
          />
        </div>
        {errors.resumeFile && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.resumeFile}</span>}
        <span style={{ fontSize: 13, color: 'var(--color-text-subtle)', marginTop: 8, display: 'block' }}>
          Upload your CV (PDF or DOC/DOCX, max 5MB).
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="app-coverLetter" className="form-label" style={{ fontWeight: 600 }}>Cover Letter (Optional)</label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: 16, color: 'var(--color-text-muted)' }}><FileText size={18} /></div>
          <textarea
            id="app-coverLetter"
            className="input"
            style={{ paddingLeft: 44, paddingTop: 16, minHeight: 120, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.coverLetter ? '#ef4444' : undefined, resize: 'vertical' }}
            value={form.coverLetter}
            onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
            placeholder="Tell us why you are the perfect fit for this role."
          />
        </div>
      </div>

      <button
        id="app-submit-btn"
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
        style={{ width: '100%', padding: '16px 24px', fontSize: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}
      >
        {submitting ? 'Submitting Application...' : <>Submit Application <ArrowRight size={20} /></>}
      </button>
    </form>
  );
}
