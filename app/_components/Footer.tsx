import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'white',
      color: 'var(--color-text)',
      padding: '48px 0 28px',
      marginTop: 'auto',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '32px',
          marginBottom: '36px',
        }}>
          {/* Brand & Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <img src="/images/logo.png" alt="Solitaire" style={{ height: '56px', objectFit: 'contain' }} />
            </Link>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Dubai, United Arab Emirates</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                <a
                  href="https://wa.me/971506486332"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.82 14.07c-.24.68-1.2 1.25-1.87 1.33-.49.06-1.12.09-3.26-.79-2.73-1.12-4.48-3.9-4.62-4.08-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.28.24-.22.53-.33.84-.33.1 0 .2.01.28.01.25.01.37.03.54.43.2.49.69 1.68.75 1.8.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.32-.36.43-.12.12-.24.25-.1.5.14.24.63 1.04 1.35 1.68.93.83 1.71 1.09 1.96 1.21.24.12.38.1.53-.06.14-.16.63-.73.8-1 .16-.27.33-.22.55-.14.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26z"/>
                  </svg>
                  <span>+971 50 648 6332</span>
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                <span>Follow Us:</span>
                <a href="#" style={{ color: '#0A66C2', display: 'flex' }} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/solitaire_hrconsultancy_dubai?obrf=MTIzOGNjcTQwNGpkdw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#E1306C', display: 'flex' }}
                  aria-label="Instagram"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div className="hidden md:block" style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '11px',
            lineHeight: 1.6,
            letterSpacing: '0.15em',
            color: 'var(--color-text-subtle)',
            textAlign: 'right',
            borderLeft: '1px solid var(--color-border)',
            paddingLeft: '24px'
          }}>
            PEOPLE.<br />
            BUILD.<br />
            BETTER.<br />
            LIVES.
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 28px',
          alignItems: 'center',
          paddingBottom: '24px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '20px',
        }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link>
          <Link href="/services" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Our Services</Link>
          <Link href="/jobs" style={{ color: 'inherit', textDecoration: 'none' }}>Jobs</Link>
          <Link href="/blogs" style={{ color: 'inherit', textDecoration: 'none' }}>Blogs</Link>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <Link href="/services/house-manager" style={{ color: 'inherit', textDecoration: 'none' }}>House Manager</Link>
          <Link href="/services/butler" style={{ color: 'inherit', textDecoration: 'none' }}>Butler</Link>
          <Link href="/services/personal-chef" style={{ color: 'inherit', textDecoration: 'none' }}>Personal Chef</Link>
          <Link href="/services/nanny" style={{ color: 'inherit', textDecoration: 'none' }}>Nanny</Link>
          <Link href="/services/chauffeur-driver" style={{ color: 'inherit', textDecoration: 'none' }}>Chauffeur</Link>
        </div>

        <div style={{
          fontSize: '12px',
          color: 'var(--color-text-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>© {new Date().getFullYear()} Solitaire Human Resources Consultancy L.L.C. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
