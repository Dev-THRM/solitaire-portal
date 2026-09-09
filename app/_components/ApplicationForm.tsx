'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitApplication } from '../_lib/api';

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '',
    phone: '', coverLetter: '', resumeUrl: '',
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
    if (form.coverLetter.trim().length < 50) e.coverLetter = 'Cover letter must be at least 50 characters';
    if (form.resumeUrl && !/^https?:\/\//.test(form.resumeUrl)) e.resumeUrl = 'Must be a valid URL (https://...)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      await submitApplication({
        jobId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        coverLetter: form.coverLetter,
        resumeUrl: form.resumeUrl || undefined,
      });
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
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '2px solid var(--color-success)',
        padding: 48,
        textAlign: 'center',
      }} className="animate-fade-in-up">
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Application Submitted!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
          We've received your application for <strong>{jobTitle}</strong>. Check your email for a confirmation.
        </p>
        <button className="btn btn-outline" onClick={() => router.push('/jobs')}>
          Browse More Jobs
        </button>
      </div>
    );
  }

  return (
    <form id="application-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {serverError && (
        <div style={{
          background: 'hsl(0,84%,95%)',
          color: 'hsl(0,84%,38%)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: 14,
          border: '1px solid hsl(0,84%,85%)',
        }}>
          {serverError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label htmlFor="app-firstName" className="form-label">First Name *</label>
          <input
            id="app-firstName"
            className="input"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder="Jane"
          />
          {errors.firstName && <span className="form-error">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="app-lastName" className="form-label">Last Name *</label>
          <input
            id="app-lastName"
            className="input"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder="Doe"
          />
          {errors.lastName && <span className="form-error">{errors.lastName}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label htmlFor="app-email" className="form-label">Email Address *</label>
          <input
            id="app-email"
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="app-phone" className="form-label">Phone Number</label>
          <input
            id="app-phone"
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="app-resumeUrl" className="form-label">Resume Link</label>
        <input
          id="app-resumeUrl"
          type="url"
          className="input"
          value={form.resumeUrl}
          onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
          placeholder="https://drive.google.com/your-resume"
        />
        {errors.resumeUrl && <span className="form-error">{errors.resumeUrl}</span>}
        <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
          Upload to Google Drive or Dropbox and paste the link
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="app-coverLetter" className="form-label">Cover Letter *</label>
        <textarea
          id="app-coverLetter"
          className="input"
          style={{ minHeight: 180 }}
          value={form.coverLetter}
          onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
          placeholder="Tell us why you're the perfect fit for this role. Minimum 50 characters."
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {errors.coverLetter && <span className="form-error">{errors.coverLetter}</span>}
          <span style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginLeft: 'auto' }}>
            {form.coverLetter.length} chars
          </span>
        </div>
      </div>

      <button
        id="app-submit-btn"
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={submitting}
        style={{ width: '100%' }}
      >
        {submitting ? '⏳ Submitting...' : '🚀 Submit Application'}
      </button>
    </form>
  );
}
