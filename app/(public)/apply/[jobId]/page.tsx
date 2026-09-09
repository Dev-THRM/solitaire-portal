import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJob } from '../../../_lib/api';
import ApplicationForm from '../../../_components/ApplicationForm';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { jobId } = await params;
    const { data: job } = await getJob(jobId);
    return { title: `Apply — ${job.title} at ${job.company}` };
  } catch {
    return { title: 'Apply' };
  }
}

export default async function ApplyPage({ params }: PageProps) {
  const { jobId } = await params;

  let job;
  try {
    const res = await getJob(jobId);
    job = res.data;
    if (!job.isActive) notFound();
  } catch {
    notFound();
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 680 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          <Link href="/jobs" style={{ color: 'var(--color-primary)' }}>Jobs</Link>
          {' '}/{' '}
          <Link href={`/jobs/${job.id}`} style={{ color: 'var(--color-primary)' }}>{job.title}</Link>
          {' '}/ Apply
        </nav>

        {/* Job summary */}
        <div style={{
          background: 'var(--gradient-hero)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          marginBottom: 32,
          color: 'white',
        }}>
          <h1 style={{ fontSize: 22, color: 'white', marginBottom: 6 }}>Apply for {job.title}</h1>
          <p style={{ opacity: 0.85, fontSize: 15 }}>
            {job.company} · {job.location}
            {job.salary && ` · ${job.salary}`}
          </p>
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
