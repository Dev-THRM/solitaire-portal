import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getJobs } from '../../_lib/api';
import JobCard from '../../_components/JobCard';
import JobFilters from '../../_components/JobFilters';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Browse Jobs',
  description: 'Search and filter through hundreds of job opportunities. Find full-time, part-time, remote, and contract roles.',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function JobList({ params }: { params: Record<string, string> }) {
  let result;
  try {
    result = await getJobs(params);
  } catch {
    return (
      <div style={{
        textAlign: 'center', padding: '64px 24px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3>Could not load jobs</h3>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
          The backend may be unavailable. Please try again later.
        </p>
      </div>
    );
  }

  const { jobs, pagination } = result;

  if (jobs.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '64px 24px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h3>No jobs found</h3>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
          Try different search terms or filters.
        </p>
      </div>
    );
  }

  const page = parseInt(params.page ?? '1');

  return (
    <>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>
        Showing <strong>{jobs.length}</strong> of <strong>{pagination.total}</strong> jobs
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
          {page > 1 && (
            <Link
              href={`/jobs?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
              className="btn btn-outline btn-sm"
              id="pagination-prev"
            >
              ← Previous
            </Link>
          )}
          <span className="btn btn-ghost btn-sm" style={{ cursor: 'default' }}>
            Page {page} of {pagination.totalPages}
          </span>
          {page < pagination.totalPages && (
            <Link
              href={`/jobs?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
              className="btn btn-outline btn-sm"
              id="pagination-next"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>Browse Jobs</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Discover your next opportunity from our curated listings
          </p>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 28 }}>
          <Suspense>
            <JobFilters />
          </Suspense>
        </div>

        {/* Job list */}
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: 160 }} />
            ))}
          </div>
        }>
          <JobList params={params} />
        </Suspense>
      </div>
    </div>
  );
}
