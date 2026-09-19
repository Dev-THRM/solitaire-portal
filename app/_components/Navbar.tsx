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
    if (latest > previous && latest > 150) {
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
          background: 'var(--color-primary)', /* Deep navy blue as per logo */
          borderRadius: '9999px',
          padding: '8px 8px 8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 8px 32px rgba(30,73,106,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
        }}>
          <img 
            src="/images/logo.png" 
            alt="Solitaire" 
            style={{ height: '40px', objectFit: 'contain', borderRadius: '4px' }} 
          />
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="hidden md:flex">
          <Link href="/" style={{ color: 'white', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s' }}>Home</Link>
          <Link href="/jobs" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Jobs</Link>
          <Link href="/#about" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>About Us</Link>
          <Link href="/#services" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Our Services</Link>
          <Link href="/#why-us" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Why Us</Link>
          <Link href="/#contact" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Contact Us</Link>
        </div>

        {/* Phone Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="tel:+971506486332" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'white',
            color: 'var(--color-primary-dark)',
            padding: '6px 20px 6px 6px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--color-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Phone size={16} />
            </div>
            +971 50 648 6332
          </a>
        </div>
      </motion.nav>
    </div>
  );
}
