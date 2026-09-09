import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJob, JOB_TYPE_LABELS } from '../../../_lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: job } = await getJob(id);
    return {
      title: `${job.title} at ${job.company}`,
      description: job.description.slice(0, 155),
    };
  } catch {
    return { title: 'Job Not Found' };
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;

  let job;
  try {
    const res = await getJob(id);
    job = res.data;
  } catch {
    notFound();
  }

  const sections = [
    { title: '📋 About the Role', content: job.description },
    { title: '✅ Requirements', content: job.requirements },
    ...(job.benefits ? [{ title: '🎁 Benefits', content: job.benefits }] : []),
  ];

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          <Link href="/jobs" style={{ color: 'var(--color-primary)' }}>Jobs</Link>
          {' '}/{' '}
          <span>{job.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          {/* Main */}
          <div>
            {/* Header */}
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 28, marginBottom: 8 }}>{job.title}</h1>
                  <p style={{ fontSize: 17, color: 'var(--color-text-muted)', fontWeight: 500 }}>{job.company}</p>
                </div>
                <span className="badge badge-primary" style={{ fontSize: 13, padding: '6px 14px' }}>
                  {JOB_TYPE_LABELS[job.type]}
                </span>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 14, color: 'var(--color-text-muted)' }}>
                <span>📍 {job.location}</span>
                {job.salary && <span>💰 {job.salary}</span>}
                <span>📅 Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Content sections */}
            {sections.map((section) => (
              <div key={section.title} className="card" style={{ padding: 28, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, marginBottom: 16 }}>{section.title}</h2>
                <div style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Apply Card */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="card" style={{
              padding: 28,
              background: 'linear-gradient(145deg, var(--color-surface), hsl(245,100%,99%))',
            }}>
              <h2 style={{ fontSize: 20, marginBottom: 6 }}>Interested?</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                Apply for <strong>{job.title}</strong> at <strong>{job.company}</strong>. Takes less than 3 minutes.
              </p>
              <Link
                href={`/apply/${job.id}`}
                id="apply-now-btn"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', display: 'flex' }}
              >
                Apply Now 🚀
              </Link>

              <div style={{
                marginTop: 20,
                padding: '14px 16px',
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>Quick facts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--color-text-muted)' }}>
                  <span>🏢 {job.company}</span>
                  <span>📍 {job.location}</span>
                  <span>⏰ {JOB_TYPE_LABELS[job.type]}</span>
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
