'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getAdminInfo } from '../_lib/auth';

const NAV_LINKS = [
  { href: '/admin', label: '📊 Dashboard', id: 'sidebar-dashboard' },
  { href: '/admin/jobs', label: '💼 Manage Jobs', id: 'sidebar-jobs' },
  { href: '/admin/applications', label: '📨 Applications', id: 'sidebar-applications' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const admin = typeof window !== 'undefined' ? getAdminInfo() : null;

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--color-text)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 18,
          color: 'white',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 28, height: 28,
            background: 'var(--gradient-hero)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>💼</span>
          Admin Panel
        </div>
        {admin && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
            {admin.email}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              id={link.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                marginBottom: 4,
                color: active ? 'white' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(99,102,241,0.35)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          href="/"
          id="sidebar-view-site"
          style={{
            display: 'block', padding: '8px 12px',
            color: 'rgba(255,255,255,0.45)', fontSize: 13,
            textDecoration: 'none', marginBottom: 4,
          }}
        >
          ← View Site
        </Link>
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', color: 'rgba(255,255,255,0.45)' }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
