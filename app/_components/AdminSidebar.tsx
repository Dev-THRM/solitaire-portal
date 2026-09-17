'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getAdminInfo } from '../_lib/auth';
import { LayoutDashboard, Briefcase, Inbox, LogOut, ArrowLeft, Tag } from 'lucide-react';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', id: 'sidebar-dashboard', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Manage Jobs', id: 'sidebar-jobs', icon: Briefcase },
  { href: '/admin/applications', label: 'Applications', id: 'sidebar-applications', icon: Inbox },
  { href: '/admin/categories', label: 'Categories', id: 'sidebar-categories', icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    setAdmin(getAdminInfo());
  }, []);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--color-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/images/logo%20short.png" alt="Solitaire Admin" style={{ height: 50, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>
        {admin && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>
            {admin.email}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                gap: 12,
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                color: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                background: active ? 'white' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <link.icon size={18} strokeWidth={active ? 2.5 : 2} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Link
          href="/"
          id="sidebar-view-site"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            color: 'rgba(255,255,255,0.45)', fontSize: 14,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> View Site
        </Link>
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            color: 'rgba(255,255,255,0.45)', 
            background: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: 14,
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', gap: 10
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
