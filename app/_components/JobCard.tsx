import Link from 'next/link';
import type { Job } from '../_lib/api';
import { JOB_TYPE_LABELS } from '../_lib/api';

const TYPE_COLORS: Record<string, string> = {
  FULL_TIME:   'badge-primary',
  PART_TIME:   'badge-warning',
  REMOTE:      'badge-success',
  CONTRACT:    'badge-neutral',
  INTERNSHIP:  'badge-neutral',
};

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      id={`job-card-${job.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      className="animate-fade-in-up"
    >
      <article className="card" style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              {job.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {job.company}
            </p>
          </div>

          <span className={`badge ${TYPE_COLORS[job.type] ?? 'badge-neutral'}`} style={{ flexShrink: 0 }}>
            {JOB_TYPE_LABELS[job.type]}
          </span>
        </div>

        {/* Meta */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 16,
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            📍 {job.location}
          </span>
          {job.salary && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              💰 {job.salary}
            </span>
          )}
          {job._count && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              👥 {job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Description preview */}
        <p style={{
          marginTop: 12,
          fontSize: 14,
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {job.description}
        </p>

        {/* Footer */}
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
            Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-primary)',
          }}>
            View & Apply →
          </span>
        </div>
      </article>
    </Link>
  );
}
