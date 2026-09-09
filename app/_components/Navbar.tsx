'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: '0 1px 12px rgba(30,73,106,0.05)',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/images/logo.jpg" 
            alt="Solitaire Human Resources Consultancy L.L.C" 
            style={{ height: '48px', objectFit: 'contain' }} 
          />
        </Link>

        {/* Desktop Nav */}
        <div style={{ alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '4px' }}>Home</Link>
          <Link href="#about" style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '14px' }}>About Us</Link>
          <Link href="#services" style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '14px' }}>Our Services</Link>
          <Link href="#why-us" style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '14px' }}>Why Us</Link>
          <Link href="#contact" style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '14px' }}>Contact Us</Link>
        </div>

        {/* Phone Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="tel:+971506486332" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--color-border)',
            borderRadius: '9999px',
            padding: '6px 16px 6px 6px',
            textDecoration: 'none',
            color: 'var(--color-text)',
            fontWeight: 600,
            fontSize: '15px'
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
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            +971 50 648 6332
          </a>
        </div>

        {/* Mobile toggle (visual only — full mobile menu below) */}
        <button
          id="nav-mobile-toggle"
          className="btn btn-ghost btn-sm md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none' }}
          aria-label="Toggle menu"
        >☰</button>
      </div>
    </nav>
  );
}
