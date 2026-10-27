'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getAdminInfo } from '../_lib/auth';
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  LogOut,
  ArrowLeft,
  Tag,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', id: 'sidebar-dashboard', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Manage Jobs', id: 'sidebar-jobs', icon: Briefcase },
  { href: '/admin/applications', label: 'Applications', id: 'sidebar-applications', icon: Inbox },
  { href: '/admin/categories', label: 'Categories', id: 'sidebar-categories', icon: Tag },
  { href: '/admin/blogs', label: 'Manage Blogs', id: 'sidebar-blogs', icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<{ id: string; name: string; email: string } | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setAdmin(getAdminInfo());
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  const navContent = (
    <>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/images/logo.png" alt="Solitaire Admin" style={{ height: 56, objectFit: 'contain' }} />
        </div>
        {admin && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 10, wordBreak: 'break-all' }}>
            {admin.email}
          </p>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              id={link.id}
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 14,
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

      {/* Logout & View Site */}
      <div style={{ padding: '20px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          href="/"
          id="sidebar-view-site"
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            color: 'rgba(255,255,255,0.5)', fontSize: 13,
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={16} /> View Portal
        </Link>
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          style={{ 
            width: '100%', 
            padding: '10px 14px', 
            color: 'rgba(255,255,255,0.5)', 
            background: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: 13,
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Top Header (Hidden on md+) ────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-primary)] text-white sticky top-0 z-40 shadow-sm border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Solitaire" className="h-[36px] object-contain" />
          <span className="text-xs uppercase tracking-wider font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded">
            Admin
          </span>
        </Link>

        <button
          type="button"
          aria-label={mobileDrawerOpen ? 'Close Menu' : 'Open Admin Menu'}
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
        >
          {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Slide-in Drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              style={{
                width: 280,
                maxWidth: '80vw',
                height: '100%',
                background: 'var(--color-primary)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 60,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Close Button Inside Drawer */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close Admin Menu"
                  className="p-1.5 rounded-full bg-white/10 text-white/80 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {navContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Desktop Permanent Sidebar (Hidden on mobile) ──────────────────── */}
      <aside className="hidden md:flex flex-col w-[240px] min-h-screen bg-[var(--color-primary)] sticky top-0 flex-shrink-0 z-30">
        {navContent}
      </aside>
    </>
  );
}
