'use client';

import Link from 'next/link';
import type { Job } from '../_lib/api';
import { JOB_TYPE_LABELS } from '../_lib/api';
import { MapPin, DollarSign, Briefcase, Clock, Users } from 'lucide-react';

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

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const typeColor = TYPE_COLORS[job.type] ?? 'var(--color-primary)';
  const typeBg = TYPE_BG[job.type] ?? 'var(--color-primary-light)';

  return (
    <Link
      href={`/jobs/${job.id}`}
      id={`job-card-${job.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      className="animate-fade-in-up"
    >
      <article style={{ 
        background: 'white', 
        padding: 20, 
        borderRadius: 16, 
        border: '1px solid var(--color-border)', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,73,106,0.08)';
        e.currentTarget.style.borderColor = 'var(--color-primary-light)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
              <Briefcase size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                {job.title}
              </h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                  <MapPin size={14} /> {job.location}
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                  <Clock size={14} /> {job.experienceMin != null && job.experienceMax != null ? `${job.experienceMin}-${job.experienceMax} Yrs` : 'Experience Not Specified'}
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                  <DollarSign size={14} /> {job.salaryMin != null && job.salaryMax != null ? `AED ${job.salaryMin.toLocaleString('en-IN')} - AED ${job.salaryMax.toLocaleString('en-IN')}` : 'Competitive'}
                </span>
              </div>
            </div>
          </div>
          <span style={{ 
            background: typeBg, color: typeColor, 
            padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, flexShrink: 0 
          }}>
            {JOB_TYPE_LABELS[job.type]}
          </span>
        </div>

        {job.description && (
          <p style={{
            marginTop: 16,
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
        )}

        {/* Footer */}
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--color-surface-3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-subtle)', fontWeight: 500 }}>
              Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {job._count && job._count.applications > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-light)', padding: '4px 8px', borderRadius: 8 }}>
                <Users size={12} /> {job._count.applications} applied
              </span>
            )}
          </div>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'white',
            background: 'var(--color-primary)',
            padding: '6px 16px',
            borderRadius: 8,
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-dark)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            Apply Now
          </span>
        </div>
      </article>
    </Link>
  );
}
