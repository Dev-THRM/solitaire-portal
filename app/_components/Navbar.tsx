'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // Hide as soon as scrolling down (past a small 20px threshold)
    if (latest > previous && latest > 20) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 100,
      padding: '0 24px',
    }}>
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
          hidden: { y: "-150%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
        }}
        initial="visible"
        animate={hidden ? "hidden" : "visible"}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          padding: '6px 8px 6px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
        }}>
          <img 
            src="/images/logo.png" 
            alt="Solitaire" 
            style={{ height: '58px', objectFit: 'contain' }} 
          />
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="hidden md:flex">
          <Link href="/" style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
          <Link href="/jobs" style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>Jobs</Link>
          <Link href="/#about" style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>About Us</Link>
          <Link href="/#services" style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>Our Services</Link>
          <Link href="/#why-us" style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>Why Us</Link>
          <Link href="/#contact" style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>Contact Us</Link>
        </div>

        {/* Phone Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="tel:+971506486332" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-primary)',
            color: 'white',
            padding: '6px 18px 6px 6px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(30,73,106,0.25)',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Phone size={15} />
            </div>
            +971 50 648 6332
          </a>
        </div>
      </motion.nav>
    </div>
  );
}
