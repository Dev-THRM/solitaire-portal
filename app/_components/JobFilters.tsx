'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export default function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = params.get('type') ?? '';
  const currentSearch = params.get('search') ?? '';
  const currentLocation = params.get('location') ?? '';

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page'); // reset pagination on filter change
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const search = fd.get('search') as string;
    const location = fd.get('location') as string;
    const next = new URLSearchParams(params.toString());
    if (search) next.set('search', search); else next.delete('search');
    if (location) next.set('location', location); else next.delete('location');
    next.delete('page');
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border)',
      padding: 24,
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Search bar */}
      <form id="job-search-form" onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          id="job-search-input"
          name="search"
          defaultValue={currentSearch}
          placeholder="Job title, company, keyword..."
          className="input"
          style={{ flex: 1 }}
        />
        <input
          id="job-location-input"
          name="location"
          defaultValue={currentLocation}
          placeholder="Location..."
          className="input"
          style={{ width: 160 }}
        />
        <button
          id="job-search-btn"
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
        >
          {isPending ? '...' : 'Search'}
        </button>
      </form>

      {/* Type filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {JOB_TYPES.map((t) => (
          <button
            key={t.value}
            id={`filter-type-${t.value || 'all'}`}
            onClick={() => updateParam('type', t.value)}
            className="btn btn-sm"
            style={{
              background: currentType === t.value
                ? 'var(--color-primary)'
                : 'var(--color-surface-3)',
              color: currentType === t.value ? 'white' : 'var(--color-text-muted)',
              boxShadow: currentType === t.value ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
