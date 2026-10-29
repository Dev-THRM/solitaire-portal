'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitApplication } from '../_lib/api';
import { CheckCircle, AlertCircle, ArrowRight, User, Mail, Phone, Link as LinkIcon, FileText, Banknote, Clock } from 'lucide-react';

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

type FormDataState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  coverLetter: string;
  resumeFile: File | null;
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

export default function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<'+971' | '+91'>('+971');
  const [form, setForm] = useState<FormDataState>({
    firstName: '', lastName: '', email: '',
    phone: '', currentCtc: '', expectedCtc: '', noticePeriod: '',
    coverLetter: '', resumeFile: null,
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

    const digits = form.phone.replace(/\D/g, '');
    if (!digits) {
      e.phone = 'Phone number is required';
    } else if (countryCode === '+91') {
      if (digits.length !== 10) {
        e.phone = 'Phone number must be exactly 10 digits';
      }
    } else if (countryCode === '+971') {
      if (digits.length !== 9) {
        e.phone = 'Dubai / UAE phone number must be exactly 9 digits (e.g. 501234567)';
      }
    }

    if (!form.currentCtc.trim()) e.currentCtc = 'Current salary is required (or enter N/A)';
    if (!form.expectedCtc.trim()) e.expectedCtc = 'Expected salary is required';
    if (!form.noticePeriod.trim()) e.noticePeriod = 'Notice period is required';
    if (!form.resumeFile) {
      e.resumeFile = 'Resume document is required';
    } else if (form.resumeFile.size > 5 * 1024 * 1024) {
      e.resumeFile = 'File must be under 5MB';
    } else {
      const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExt = '.' + (form.resumeFile.name.split('.').pop() || '').toLowerCase();
      if (!allowedExts.includes(fileExt)) {
        e.resumeFile = 'Invalid file format. Allowed: PDF, DOC/DOCX, JPEG, PNG';
      }
    }
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
      const cleanDigits = form.phone.replace(/[\s\-\(\)]/g, '').replace(/^0/, '');
      fd.append('phone', `${countryCode} ${cleanDigits}`);
      if (form.currentCtc) fd.append('currentCtc', form.currentCtc);
      if (form.expectedCtc) fd.append('expectedCtc', form.expectedCtc);
      if (form.noticePeriod) fd.append('noticePeriod', form.noticePeriod);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
          <label htmlFor="app-phone" className="form-label" style={{ fontWeight: 600 }}>
            Phone Number <span style={{color: '#ef4444'}}>*</span>
          </label>
          <div style={{
            display: 'flex',
            borderRadius: 12,
            border: `1px solid ${errors.phone ? '#ef4444' : 'var(--color-border)'}`,
            background: 'var(--color-surface-2)',
            overflow: 'hidden',
          }}>
            {/* Country Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid var(--color-border)',
              background: '#f8fafc',
              padding: '0 8px',
              flexShrink: 0,
            }}>
              <select
                id="app-countryCode"
                value={countryCode}
                onChange={(e) => {
                  const code = e.target.value as '+971' | '+91';
                  setCountryCode(code);
                  if (code === '+971' && form.phone.length > 9) {
                    setForm(prev => ({ ...prev, phone: prev.phone.slice(0, 9) }));
                  }
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: '12px 2px',
                }}
                aria-label="Country Code"
              >
                <option value="+971">🇦🇪 +971</option>
                <option value="+91">🇮🇳 +91</option>
              </select>
            </div>

            {/* Phone Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <input
                id="app-phone"
                type="tel"
                className="input"
                style={{
                  border: 'none',
                  background: 'transparent',
                  paddingLeft: 12,
                  paddingRight: 12,
                  width: '100%',
                  minWidth: 0,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                  borderRadius: 0,
                  outline: 'none',
                  boxShadow: 'none',
                }}
                value={form.phone}
                maxLength={countryCode === '+91' ? 10 : 9}
                onChange={(e) => {
                  const max = countryCode === '+91' ? 10 : 9;
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, max);
                  setForm({ ...form, phone: digitsOnly });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder={countryCode === '+91' ? '9876543210' : '501234567'}
              />
            </div>
          </div>
          {errors.phone ? (
            <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>
              {errors.phone}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 4, display: 'block' }}>
              {countryCode === '+91' ? 'Must be exactly 10 digits (excluding +91)' : 'Must be exactly 9 digits (excluding +971)'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="form-group">
          <label htmlFor="app-currentCtc" className="form-label" style={{ fontWeight: 600 }}>
            Current Salary (AED) <span style={{color: '#ef4444'}}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><Banknote size={18} /></div>
            <input
              id="app-currentCtc"
              className="input"
              style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.currentCtc ? '#ef4444' : undefined }}
              value={form.currentCtc}
              onChange={(e) => setForm({ ...form, currentCtc: e.target.value })}
              placeholder="e.g. AED 12,000 / month (or N/A)"
            />
          </div>
          {errors.currentCtc && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.currentCtc}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="app-expectedCtc" className="form-label" style={{ fontWeight: 600 }}>
            Expected Salary (AED) <span style={{color: '#ef4444'}}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><Banknote size={18} /></div>
            <input
              id="app-expectedCtc"
              className="input"
              style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.expectedCtc ? '#ef4444' : undefined }}
              value={form.expectedCtc}
              onChange={(e) => setForm({ ...form, expectedCtc: e.target.value })}
              placeholder="e.g. AED 15,000 / month"
            />
          </div>
          {errors.expectedCtc && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.expectedCtc}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="app-noticePeriod" className="form-label" style={{ fontWeight: 600 }}>
          Notice Period <span style={{color: '#ef4444'}}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)', pointerEvents: 'none' }}><Clock size={18} /></div>
          <input
            id="app-noticePeriod"
            list="notice-period-options"
            className="input"
            style={{ paddingLeft: 44, borderRadius: 12, background: 'var(--color-surface-2)', borderColor: errors.noticePeriod ? '#ef4444' : undefined }}
            value={form.noticePeriod}
            onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
            placeholder="Select or enter notice period (e.g. Immediate, 30 Days)"
          />
          <datalist id="notice-period-options">
            <option value="Immediate" />
            <option value="15 Days" />
            <option value="30 Days / 1 Month" />
            <option value="45 Days" />
            <option value="60 Days / 2 Months" />
            <option value="90 Days / 3 Months" />
            <option value="Serving Notice Period" />
          </datalist>
        </div>
        {errors.noticePeriod && <span className="form-error" style={{ color: '#ef4444', fontSize: 13, marginTop: 6, display: 'block' }}>{errors.noticePeriod}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="app-resumeFile" className="form-label" style={{ fontWeight: 600 }}>Resume Document <span style={{color: '#ef4444'}}>*</span></label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: 12, color: 'var(--color-text-muted)' }}><FileText size={18} /></div>
          <input
            id="app-resumeFile"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/jpeg,image/png"
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
          Upload your CV (PDF, DOC/DOCX, JPEG, or PNG, max 5MB).
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
