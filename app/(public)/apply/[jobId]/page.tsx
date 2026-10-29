import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJobById } from '@/lib/jobs';
import ApplicationForm from '../../../_components/ApplicationForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { jobId } = await params;
    const job = await getJobById(jobId);
    if (!job) return { title: 'Apply' };
    return { title: `Apply — ${job.title} at ${job.company}` };
  } catch {
    return { title: 'Apply' };
  }
}

export default async function ApplyPage({ params }: PageProps) {
  const { jobId } = await params;

  let job;
  try {
    job = await getJobById(jobId);
    if (!job || !job.isActive) notFound();
  } catch {
    notFound();
  }

  return (
    <div style={{ padding: '130px 0 80px', minHeight: '100vh', background: 'var(--color-surface-2)' }}>
      <div className="container" style={{ maxWidth: 680 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          <Link href="/jobs" style={{ color: 'var(--color-primary)' }}>Jobs</Link>
          {' '}/{' '}
          <Link href={`/jobs/${job.id}`} style={{ color: 'var(--color-primary)' }}>{job.title}</Link>
          {' '}/ Apply
        </nav>

        {/* Job summary */}
        <div style={{ marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: 8, marginTop: 12, letterSpacing: '-0.02em' }}>
            Apply for {job.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--color-text-muted)', fontSize: 15, fontWeight: 500 }}>
            <span>{job.company || 'Solitaire Human Resources'}</span>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <span>{job.location}</span>
            {job.salaryMin != null && job.salaryMax != null && (
              <>
                <span style={{ color: 'var(--color-border)' }}>|</span>
                <span>AED {job.salaryMin.toLocaleString('en-AE')} - AED {job.salaryMax.toLocaleString('en-AE')}</span>
              </>
            )}
          </div>
        </div>

        {/* Application form */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 24 }}>Your Application</h2>
          <ApplicationForm jobId={job.id} jobTitle={job.title} />
        </div>
      </div>
    </div>
  );
}
