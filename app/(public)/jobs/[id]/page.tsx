import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJob, JOB_TYPE_LABELS } from '../../../_lib/api';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: job } = await getJob(id);
    return {
      title: `${job.title} — Careers at Solitaire`,
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

  const TYPE_COLORS: Record<string, string> = {
    FULL_TIME:   '#10b981',
    PART_TIME:   '#f59e0b',
    REMOTE:      '#3b82f6',
    CONTRACT:    '#6366f1',
    INTERNSHIP:  '#ec4899',
  };
  
  const TYPE_BG: Record<string, string> = {
    FULL_TIME:   '#d1fae5',
    PART_TIME:   '#fef3c7',
    REMOTE:      '#dbeafe',
    CONTRACT:    '#e0e7ff',
    INTERNSHIP:  '#fce7f3',
  };

  const typeColor = TYPE_COLORS[job.type] ?? 'var(--color-primary)';
  const typeBg = TYPE_BG[job.type] ?? 'var(--color-primary-light)';

  return (
    <div style={{ background: 'var(--color-surface-2)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Mini Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '100px 0 24px' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>
            <ArrowLeft size={16} /> Back to All Jobs
          </Link>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, marginTop: 24 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Main Content */}
          <div>
            {/* Job Header Card */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ background: typeBg, color: typeColor, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {JOB_TYPE_LABELS[job.type]}
                </span>
                <span style={{ color: 'var(--color-text-subtle)', fontSize: 13, fontWeight: 500 }}>
                  Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12, lineHeight: 1.2 }}>
                {job.title}
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-surface-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}><MapPin size={16} /></div>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Location</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{job.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}><Clock size={16} /></div>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Experience</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{job.experienceMin != null && job.experienceMax != null ? `${job.experienceMin} - ${job.experienceMax} Years` : 'Not specified'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}><DollarSign size={16} /></div>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Salary</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{job.salaryMin != null && job.salaryMax != null ? `AED ${job.salaryMin.toLocaleString()} - AED ${job.salaryMax.toLocaleString()}` : 'Competitive'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Briefcase color="var(--color-primary)" size={20} /> About the Role
                </h2>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 color="var(--color-primary)" size={20} /> Requirements
                </h2>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                  {job.requirements}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ 
              background: 'white', 
              borderRadius: 16, 
              padding: 24, 
              border: '1px solid var(--color-border)', 
              boxShadow: '0 12px 40px rgba(30,73,106,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative top border */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--color-primary)' }} />
              
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>Ready to apply?</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                Join our network of elite professionals. The application takes less than 3 minutes.
              </p>
              
              <Link
                href={`/apply/${job.id}`}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: 15, padding: '12px 20px', borderRadius: 12, display: 'flex', justifyContent: 'space-between' }}
              >
                Apply Now <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
