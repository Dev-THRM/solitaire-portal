'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronRight, Briefcase, BookOpen, Home, Info, Layers, Award, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // Don't hide navbar if mobile menu is actively open
    if (mobileMenuOpen) return;
    
    // Hide as soon as scrolling down (past a small 20px threshold)
    if (latest > previous && latest > 20) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/blogs', label: 'Blogs', icon: BookOpen },
    { href: '/#about', label: 'About Us', icon: Info },
    { href: '/#services', label: 'Our Services', icon: Layers },
    { href: '/#why-us', label: 'Why Us', icon: Award },
    { href: '/#contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 100,
      padding: '0 16px',
      pointerEvents: 'none',
    }}>
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
          hidden: { y: "-150%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
        }}
        initial="visible"
        animate={hidden && !mobileMenuOpen ? "hidden" : "visible"}
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '9999px',
          padding: '6px 8px 6px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          maxWidth: '1200px',
          width: '100%',
          pointerEvents: 'auto',
        }}
      >
        <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <img 
            src="/images/logo.png" 
            alt="Solitaire" 
            style={{ height: '46px', objectFit: 'contain' }} 
            className="h-[44px] md:h-[54px]"
          />
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: link.href === '/' ? 'var(--color-text)' : 'var(--color-text-muted)',
                fontWeight: link.href === '/' ? 600 : 500,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseOut={(e) => (e.currentTarget.style.color = link.href === '/' ? 'var(--color-text)' : 'var(--color-text-muted)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions (Phone & Hamburger Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <a
            href="tel:+971506486332"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-primary)',
              color: 'white',
              padding: '6px 14px 6px 6px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(30,73,106,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{
              width: '30px',
              height: '30px',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}>
              <Phone size={14} />
            </div>
            <span className="hidden sm:inline">+971 50 648 6332</span>
            <span className="inline sm:hidden">Call</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: mobileMenuOpen ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
              color: mobileMenuOpen ? 'white' : 'var(--color-text)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu Dropdown / Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              marginTop: '10px',
              width: '100%',
              maxWidth: '420px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '16px 12px 20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              pointerEvents: 'auto',
            }}
            className="md:hidden"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(30,73,106,0.08)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={16} />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight size={16} color="var(--color-text-subtle)" />
                  </Link>
                );
              })}
            </div>

            {/* Direct Phone CTA in Drawer */}
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-border)',
            }}>
              <a
                href="tel:+971506486332"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(30,73,106,0.25)',
                }}
              >
                <Phone size={16} />
                Call +971 50 648 6332
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
