import type { Metadata } from 'next';
import { Suspense } from 'react';
import { listJobs } from '@/lib/jobs';
import JobCard from '../../_components/JobCard';
import JobFilters from '../../_components/JobFilters';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Solitaire team. Discover exciting opportunities in premium hospitality and household staffing.',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function JobList({ params }: { params: Record<string, string> }) {
  let result;
  try {
    result = await listJobs(params);
  } catch {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 24px',
        background: 'white',
        borderRadius: 24,
        border: '1px dashed var(--color-border)',
      }}>
        <AlertCircle size={48} color="var(--color-text-muted)" opacity={0.3} style={{ marginBottom: 16 }} />
        <h3 style={{ fontSize: 20, color: 'var(--color-text)' }}>Could not load jobs</h3>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
          Our servers are currently unavailable. Please check back later.
        </p>
      </div>
    );
  }

  const { jobs, pagination } = result;

  if (jobs.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 24px',
        background: 'white',
        borderRadius: 24,
        border: '1px dashed var(--color-border)',
      }}>
        <h3 style={{ fontSize: 20, color: 'var(--color-text)' }}>No roles found</h3>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
          We couldn't find any roles matching your criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const page = parseInt(params.page ?? '1');

  return (
    <>
      <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginBottom: 24, fontWeight: 500 }}>
        Showing <strong>{jobs.length}</strong> of <strong>{pagination.total}</strong> open roles
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 48 }}>
          {page > 1 && (
            <Link
              href={`/jobs?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
              className="btn btn-outline"
              id="pagination-prev"
            >
              ← Previous
            </Link>
          )}
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 600, color: 'var(--color-text)' }}>
            Page {page} of {pagination.totalPages}
          </span>
          {page < pagination.totalPages && (
            <Link
              href={`/jobs?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
              className="btn btn-outline"
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
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-2)' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'var(--color-primary)', 
        padding: '120px 0 80px',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, color: 'white' }}>
            Elevate Your Career
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            Join Solitaire and become part of a premier network delivering world-class hospitality and household management services.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1000, marginTop: -40, position: 'relative', zIndex: 10, paddingBottom: 100 }}>
        {/* Filters */}
        <div style={{ 
          marginBottom: 32, 
          background: 'white', 
          padding: 24, 
          borderRadius: 24, 
          boxShadow: '0 8px 32px rgba(30,73,106,0.08)',
          border: '1px solid var(--color-border)'
        }}>
          <Suspense>
            <JobFilters />
          </Suspense>
        </div>

        {/* Job list */}
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: 24 }} />
            ))}
          </div>
        }>
          <JobList params={params} />
        </Suspense>
      </div>
    </div>
  );
}
