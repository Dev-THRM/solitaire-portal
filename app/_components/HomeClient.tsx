"use client";

import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Briefcase, 
  Building2, 
  ConciergeBell, 
  ChefHat, 
  Car, 
  Baby, 
  UtensilsCrossed, 
  Users, 
  Lock, 
  Star, 
  Target, 
  Gem, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowUpRight,
} from 'lucide-react';

// ── Service Standards Data ────────────────────────────────────────────────────
const STANDARDS_COL1 = [
  'Background Verified', 'Police Cleared', 'Reference Checked',
  'Professionally Trained', 'Multilingual Available', 'Live-in or Live-out', 'Trial Placement Option',
];
const STANDARDS_COL2 = [
  'Immediate Start Available', 'Discretion Guaranteed', 'Cultural Sensitivity',
  'UAE Experienced', 'NDA-Ready Staff', 'Long-term Placements', 'Short-term Cover',
];
const STANDARDS_COL3 = [
  '24/7 Agency Support', 'Insurance Support', 'Emergency Replacement', 'Luxury Specialists',
];

// ── Testimonials Data ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { initial: 'E', name: 'E.R.', role: 'Private Household, Emirates Hills', text: 'Solitaire understood exactly what we were looking for. The professionalism was outstanding — our house manager has been a perfect match from day one.' },
  { initial: 'J', name: 'J.M.', role: 'Family Residence, Palm Jumeirah', text: 'A seamless experience from start to finish. Highly recommended for premium households. The nanny they placed is exceptional and our children adore her.' },
  { initial: 'S', name: 'S.T.', role: 'Executive Household, Downtown Dubai', text: 'The house manager they found for us has completely transformed our daily routine. Truly discreet, professional, and perfectly aligned with our lifestyle.' },
  { initial: 'A', name: 'A.L.', role: 'Private Residence, Jumeirah Bay', text: 'Discreet, reliable, and perfectly tailored to our high standards. Our personal chef creates extraordinary meals every evening. Exceptional service throughout.' },
];

const VIDEOS = [
  { src: '/images/15137293_2160_3840_30fps.mp4', label: 'Atlantis, The Palm', credit: 'Solitaire' },
  { src: '/images/4253148-uhd_4096_2160_25fps.mp4', label: 'Personal Chef', credit: 'Solitaire' },
  { src: '/images/11110914-hd_1920_1080_30fps.mp4', label: 'Burj Khalifa', credit: 'Solitaire' },
  { src: '/images/6949138-hd_1920_1080_25fps.mp4', label: 'Nanny', credit: 'Solitaire' },
  { src: '/images/19376557-hd_1920_1080_25fps.mp4', label: 'Sahara Desert', credit: 'Solitaire' },
  { src: '/images/7608903-uhd_3840_2160_25fps.mp4', label: 'Butler', credit: 'Solitaire' },
  { src: '/images/3864917-uhd_2560_1440_30fps.mp4', label: 'Dubai Frame', credit: 'Solitaire' },
  { src: '/images/8344927-uhd_3840_2160_25fps.mp4', label: 'Chauffeur', credit: 'Solitaire' },
  { src: '/images/7848927-uhd_3840_2160_25fps.mp4', label: 'Jumeirah Burj Al Arab', credit: 'Solitaire' },
];  

const SERVICES = [
  { icon: <Home size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'House Manager', desc: 'Seamless household management for a stress-free lifestyle.' },
  { icon: <Briefcase size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Executive Assistant', desc: 'Professional support for your personal and business needs.' },
  { icon: <Building2 size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Facility Manager', desc: 'Efficient property and facility management solutions.' },
  { icon: <ConciergeBell size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Butler', desc: 'Discreet and professional service at your command.' },
  { icon: <ChefHat size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Personal Chef', desc: 'Nutritious, customised meals for your lifestyle.' },
  { icon: <Car size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Chauffeur/Driver', desc: 'Safe, reliable and professional drivers.' },
  { icon: <Baby size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Nanny', desc: "Caring professionals for your child's bright future." },
  { icon: <UtensilsCrossed size={32} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Multicuisine Chef', desc: 'A world of flavours tailored to your taste.' },
];

const FEATURES = [
  { icon: <Users size={36} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Rigorous Screening', desc: 'Background checks & verified professionals' },
  { icon: <Lock size={36} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Complete Discretion', desc: 'Your privacy is our priority' },
  { icon: <Star size={36} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Experienced Team', desc: 'Years of expertise in UAE staffing' },
  { icon: <Target size={36} strokeWidth={1.5} color="var(--color-primary)" />, title: 'Tailored Solutions', desc: 'We match the right people to your unique needs.' },
];

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const scaleUp: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const wordAnimation: any = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.33, 1, 0.68, 1], duration: 0.8 } }
};

const AnimatedText = ({ text, style }: { text: string, style?: React.CSSProperties }) => {
  const words = text.split(" ");
  return (
    <motion.div style={{ ...style, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
      {words.map((word, index) => (
        <div key={index} style={{ overflow: 'hidden' }}>
          <motion.span variants={wordAnimation} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
};

function VideoHero() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(VIDEOS.map(() => false));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Autoplay: switch every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % VIDEOS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // When current changes, play the new video
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (i === current) {
          v.currentTime = 0;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    });
  }, [current]);

  const handlePrev = () => setCurrent(prev => (prev - 1 + VIDEOS.length) % VIDEOS.length);
  const handleNext = () => setCurrent(prev => (prev + 1) % VIDEOS.length);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--color-primary-dark)',
    }}>
      
      {/* ── Video Layer ─────────────────────────────────────────────────── */}
      {VIDEOS.map((vid, i) => (
        <AnimatePresence key={i}>
          {i === current && (
            <motion.video
              key={`video-${i}`}
              ref={el => { videoRefs.current[i] = el; }}
              src={vid.src}
              autoPlay
              muted
              loop={false}
              playsInline
              onCanPlay={() => {
                const newLoaded = [...loaded];
                newLoaded[i] = true;
                setLoaded(newLoaded);
              }}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>
      ))}

      {/* ── Gradient Overlay (brand navy) ───────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(17,49,74,0.65) 0%, rgba(17,49,74,0.45) 50%, rgba(17,49,74,0.75) 100%)',
        zIndex: 1,
      }} />

      {/* ── Side vignette for depth ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(17,49,74,0.6) 100%)',
        zIndex: 1,
      }} />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '120px 24px 80px' }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Top Badge */}
          <motion.div variants={fadeUp} style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '6px 20px',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
              borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{
                background: 'white', color: 'var(--color-primary-dark)',
                padding: '2px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase'
              }}>
                Dubai, UAE
              </span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em' }}>
                Exceptional People
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(44px, 5.5vw, 80px)',
            color: 'white',
            marginBottom: '32px',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            <AnimatedText text="Your Home." />
            <AnimatedText text="Your Standards." />
            <div style={{ overflow: 'hidden' }}>
              <motion.span variants={wordAnimation} style={{ display: 'inline-block', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                Our People.
              </motion.span>
            </div>
          </h1>

          {/* Subheadline */}
          <motion.p variants={fadeUp} style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.8)',
            maxWidth: '560px', lineHeight: 1.6, marginBottom: '56px', fontWeight: 400
          }}>
            Premium staffing solutions for private households and businesses in Dubai. Discreet. Reliable. Personal.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="#services" className="btn" style={{
              background: 'white', color: 'var(--color-primary-dark)',
              padding: '16px 36px', fontSize: '15px', fontWeight: 600
            }}>
              Discover Services <ChevronRight size={18} style={{ marginLeft: '4px' }} />
            </Link>
            <a href="https://wa.me/971506486332" target="_blank" rel="noopener noreferrer" className="btn" style={{
              background: 'rgba(255,255,255,0.12)', color: 'white',
              border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
              padding: '16px 36px', fontSize: '15px', fontWeight: 500, textDecoration: 'none'
            }}>
              Contact Us
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={staggerContainer} style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '64px' }}>
            {[
              { icon: <Gem size={18} strokeWidth={1.5} />, text: 'TRUSTED & DISCREET' },
              { icon: <Users size={18} strokeWidth={1.5} />, text: 'PRE-SCREENED' },
              { icon: <ShieldCheck size={18} strokeWidth={1.5} />, text: 'TAILORED TO YOUR NEEDS' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.75)' }}>
                <div style={{ color: 'rgba(255,255,255,0.9)' }}>{item.icon}</div>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em' }}>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Video Controls ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '40px', left: 0, right: 0,
        zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'
      }}>
        {/* Prev Button */}
        <button onClick={handlePrev} aria-label="Previous video" style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'background 0.2s',
        }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dot indicators with progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: 'calc(100vw - 120px)', overflowX: 'auto', padding: '4px' }}>
          {VIDEOS.map((vid, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to ${vid.label}`} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0
            }}>
              {i === current && (
                <span className="hidden sm:inline" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>{vid.label}</span>
              )}
              <span style={{
                display: 'block',
                width: i === current ? '28px' : '8px',
                height: '4px',
                borderRadius: '9999px',
                background: i === current ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.4s ease',
              }} />
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button onClick={handleNext} aria-label="Next video" style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'background 0.2s',
        }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.15em'
        }}
      >
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))' }} />
        SCROLL
      </motion.div>
    </section>
  );
}
// Helper Components for animations

function ServiceCard({ icon, title, desc, delay = 0 }: { icon: React.ReactNode, title: string, desc: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: delay, type: "spring", bounce: 0.4 }}
      style={{ perspective: 1200, height: '240px', cursor: 'pointer' }}
    >
      <motion.div
        whileHover={{ rotateY: 180, scale: 1.05, y: -10 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'white', borderRadius: '24px', padding: '32px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            width: '64px', height: '64px', background: 'var(--color-surface-2)', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto'
          }}>
            {React.cloneElement(icon as any, { size: 32, color: 'var(--color-primary)' })}
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '0' }}>{title}</h3>
          </div>
        </div>

        {/* BACK FACE */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', 
          borderRadius: '24px', padding: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transform: 'rotateY(180deg)'
        }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            {React.cloneElement(icon as any, { size: 24, color: 'white' })}
          </div>
          <h3 style={{ fontSize: '22px', color: 'white', letterSpacing: '-0.02em', marginBottom: '16px' }}>{title}</h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GridUnfoldStack() {
  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      {/* Mobile view (< md): natural responsive grid without overflow */}
      <div className="features-mobile-grid">
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #183c58 0%, #0a1f30 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 1px 1px 0 rgba(255,255,255,0.1)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                width: '40px', height: '40px', background: 'rgba(255,255,255,0.06)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {React.cloneElement(feat.icon as any, { size: 20, color: 'rgba(255,255,255,0.85)' })}
              </div>
              <h3 style={{ fontSize: '17px', letterSpacing: '-0.02em', fontWeight: 600, color: 'white', margin: 0 }}>{feat.title}</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Desktop view (md+): smooth 2x2 unfolding card animation */}
      <div className="features-desktop-stack">
        {FEATURES.map((feat, idx) => {
          const isLeft = idx % 2 === 0;
          const isTop = idx < 2;
          const targetX = isLeft ? -150 : 150;
          const targetY = isTop ? -100 : 100;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 0, y: 100, scale: 0.8 }}
              whileInView={{ opacity: 1, x: targetX, y: targetY, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", bounce: 0.3, duration: 1.2, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, zIndex: 50, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              style={{
                position: 'absolute',
                width: '280px',
                height: '180px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #183c58 0%, #0a1f30 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 1px 1px 0 rgba(255,255,255,0.1)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
                cursor: 'pointer',
                zIndex: 10 - idx,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {React.cloneElement(feat.icon as any, { size: 20, color: 'rgba(255,255,255,0.8)' })}
                </div>
                <h3 style={{ fontSize: '18px', letterSpacing: '-0.02em', fontWeight: 500, color: 'white', margin: 0 }}>{feat.title}</h3>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function MagneticButton({ children, href, target, rel }: { children: React.ReactNode, href?: string, target?: string, rel?: string }) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.4);
    y.set(middleY * 0.4);
  };
  const reset = () => { x.set(0); y.set(0); };

  const style = {
    position: 'relative' as const,
    display: 'inline-flex',
    padding: '18px 48px',
    background: 'white',
    color: 'var(--color-primary-dark)',
    fontSize: '16px',
    fontWeight: 600,
    borderRadius: '99px',
    textDecoration: 'none',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  };

  const Component = motion(href ? (href.startsWith('http') || href.startsWith('//') ? 'a' : Link) : 'button');

  return (
    <Component
      href={href as any}
      target={target}
      rel={rel}
      ref={ref as any}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ ...style, x: mouseX, y: mouseY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </Component>
  );
}

// ── Counter Hook ──────────────────────────────────────────────────────────────
function useCounter(target: number, duration: number = 1800) {
  const [count, setCount] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) { setCount(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

// ── About Reveal ──────────────────────────────────────────────────────────────
function AboutReveal() {
  const LINE_1 = ['We', 'place', 'exceptional'];
  const LINE_2 = ['people', 'in', 'the'];
  return (
    <section id="about" className="about-reveal-section" style={{ background: 'white', overflow: 'hidden', padding: '120px 0' }}>
      <div className="container" style={{ maxWidth: '1000px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <span style={{ color: '#c9603e', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Who We Are
          </span>
        </motion.div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerContainer}
          style={{ marginBottom: '44px' }}
        >
          <div style={{ fontSize: 'clamp(32px, 6.5vw, 84px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#1a1d20' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.22em', overflow: 'hidden', marginBottom: '0.04em' }}>
              {LINE_1.map((word, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <motion.span variants={wordAnimation} style={{ display: 'inline-block' }}>{word}</motion.span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.22em', overflow: 'hidden', alignItems: 'baseline' }}>
              {LINE_2.map((word, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <motion.span variants={wordAnimation} style={{ display: 'inline-block' }}>{word}</motion.span>
                </div>
              ))}
              <div style={{ overflow: 'hidden' }}>
                <motion.span variants={wordAnimation} style={{ display: 'inline-block', fontStyle: 'italic', color: '#9ca3af' }}>
                  right homes.
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}
        >
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: 1.75, maxWidth: '540px', margin: 0 }}>
            Solitaire is Dubai’s premier staffing partner for private households and businesses.
            We connect discerning clients with pre-screened, trained professionals who elevate everyday living.
          </p>
          <Link
            href="/about" id="about-cta"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#1a1d20', color: 'white', padding: '16px 32px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s ease', flexShrink: 0 }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#333'; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#1a1d20'; }}
          >
            About Us & Leadership <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatCounter({ target, suffix, label, delay }: { target: number; suffix: string; label: string; delay: number }) {
  const { count, ref } = useCounter(target);
  return (
    <motion.div
      ref={ref} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', flex: 1, minWidth: '160px' }}
    >
      <div style={{ fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 700, color: 'white', letterSpacing: '-0.05em', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '14px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </motion.div>
  );
}
function StatsBar() {
  const stats = [
    { target: 200, suffix: '+', label: 'Satisfied Clients', delay: 0 },
    { target: 8,   suffix: '',  label: 'Service Categories', delay: 0.08 },
    { target: 100, suffix: '%', label: 'Background Verified', delay: 0.16 },
    { target: 98,  suffix: '%', label: 'Placement Success', delay: 0.24 },
  ];
  return (
    <section style={{ background: '#111827', padding: '90px 0' }}>
      <div className="container">
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-8 md:gap-0">
          {stats.map((s, i) => (
            <React.Fragment key={i}>
              <StatCounter {...s} />
              {i < stats.length - 1 && (
                <motion.div
                  className="hidden md:block"
                  initial={{ scaleY: 0, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ width: '1px', height: '64px', background: 'rgba(255,255,255,0.1)', flexShrink: 0, margin: '0 28px' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Checklist Item ────────────────────────────────────────────────────────────
function ChecklistItem({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(0,0,0,0.055)' }}
    >
      <span style={{ fontSize: '14px', color: '#2a2a2a', fontWeight: 450 }}>{label}</span>
      <motion.div
        initial={{ scale: 0, rotate: -45 }} whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }} transition={{ delay: delay + 0.2, type: 'spring', stiffness: 400, damping: 20 }}
      >
        <Check size={14} strokeWidth={2.5} color="var(--color-primary)" />
      </motion.div>
    </motion.div>
  );
}

// ── Service Standards ─────────────────────────────────────────────────────────
function ServiceStandards() {
  return (
    <section style={{ background: '#f8f7f5', padding: '120px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '64px', flexWrap: 'wrap', gap: '24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', background: 'rgba(30,73,106,0.09)', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '20px', textTransform: 'uppercase' }}>
              Our Standards
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', letterSpacing: '-0.035em', color: '#1a1d20', maxWidth: '520px', lineHeight: 1.1 }}>
              Every hire meets our<br />rigorous criteria
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ fontSize: '16px', color: '#6b7280', maxWidth: '340px', lineHeight: 1.7, margin: 0 }}
          >
            We hold every candidate to the highest standard before they are ever presented to a client.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 items-stretch">
          {/* Left: Staff image with floating stats card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '420px' }}
          >
            <img src="/images/luxury_staff_team.jpg" alt="Solitaire professional staff" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(10,20,35,0.7) 0%, transparent 100%)' }} />
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderRadius: '18px', padding: '18px 22px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
            >
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Placement Success Rate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#1a1d20', letterSpacing: '-0.04em', lineHeight: 1 }}>98%</span>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '7px', background: '#ede9e4', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: '98%' }} viewport={{ once: true }}
                      transition={{ delay: 1, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '99px' }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Verified by client feedback</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: 3-col checklist panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: 'white', borderRadius: '24px', padding: '32px 28px', boxShadow: '0 4px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0"
          >
            <div className="md:pr-6 md:border-r border-black/10">
              {STANDARDS_COL1.map((item, i) => <ChecklistItem key={item} label={item} delay={i * 0.055} />)}
            </div>
            <div className="md:px-6 md:border-r border-black/10">
              {STANDARDS_COL2.map((item, i) => <ChecklistItem key={item} label={item} delay={0.1 + i * 0.055} />)}
            </div>
            <div className="md:pl-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}
                style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '8px', aspectRatio: '4/3' }}
              >
                <img src="/images/luxury_chef_cooking.jpg" alt="Personal chef" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </motion.div>
              {STANDARDS_COL3.map((item, i) => <ChecklistItem key={item} label={item} delay={0.2 + i * 0.06} />)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [paused, setPaused] = React.useState(false);

  const handlePrev = () => { setDirection(-1); setActive(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); };
  const handleNext = () => { setDirection(1);  setActive(prev => (prev + 1) % TESTIMONIALS.length); };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(handleNext, 5500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active]);

  const slideVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  };
  const t = TESTIMONIALS[active];

  return (
    <section style={{ background: 'white', padding: '140px 0', overflow: 'hidden' }}>
      <div className="container">
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '72px', flexWrap: 'wrap', gap: '32px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', letterSpacing: '-0.035em', color: '#1a1d20', marginBottom: '28px', lineHeight: 1.1 }}>
              What Our Clients Say
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {TESTIMONIALS.map((t2, i) => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, marginLeft: i > 0 ? '-10px' : '0', border: '2px solid white', position: 'relative', zIndex: TESTIMONIALS.length - i }}>
                    {t2.initial}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1d20' }}>73+ Reviews</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>from verified clients</div>
              </div>
              {/* <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#c9603e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(201,96,62,0.35)' }}>
                <span style={{ color: 'white', fontSize: '22px', fontWeight: 800, lineHeight: 1, marginTop: '-4px' }}>&ldquo;</span>
              </div> */}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '8px' }}
          >
            <button id="testimonial-prev-btn" onClick={handlePrev} aria-label="Previous testimonial"
              style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', color: '#1a1d20', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}
              onMouseOver={e => { const el = e.currentTarget; el.style.background = '#1a1d20'; el.style.borderColor = '#1a1d20'; el.style.color = 'white'; }}
              onMouseOut={e =>  { const el = e.currentTarget; el.style.background = 'transparent'; el.style.borderColor = 'rgba(0,0,0,0.12)'; el.style.color = '#1a1d20'; }}
            ><ChevronLeft size={20} /></button>
            <button id="testimonial-next-btn" onClick={handleNext} aria-label="Next testimonial"
              style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#1a1d20', border: '1.5px solid #1a1d20', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}
              onMouseOver={e => { e.currentTarget.style.background = '#333'; }}
              onMouseOut={e =>  { e.currentTarget.style.background = '#1a1d20'; }}
            ><ChevronRight size={20} /></button>
          </motion.div>
        </div>

        {/* Testimonial cards */}
        <div style={{ position: 'relative', minHeight: '300px' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active} custom={direction} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Featured large card */}
              <div style={{ background: '#f8f7f5', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                className="p-6 md:p-12"
              >
                <div style={{ fontSize: '48px', color: '#e2ded9', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: '16px' }}>&ldquo;</div>
                <p style={{ fontSize: '18px', color: '#2a2a2a', lineHeight: 1.65, fontStyle: 'italic', flex: 1, margin: '0 0 32px' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 700 }}>{t.initial}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1d20' }}>{t.name}</div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#c9603e" color="#c9603e" />)}
                  </div>
                </div>
              </div>
              {/* Two smaller side cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[1, 2].map(offset => {
                  const card = TESTIMONIALS[(active + offset) % TESTIMONIALS.length];
                  return (
                    <div key={offset}
                      onClick={() => { setDirection(offset); setActive((active + offset) % TESTIMONIALS.length); }}
                      style={{ background: '#f8f7f5', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,0,0,0.04)', flex: 1, cursor: 'pointer', transition: 'all 0.3s ease', opacity: 0.85 }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                    >
                      <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>
                        &ldquo;{card.text.slice(0, 80)}&hellip;&rdquo;
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>{card.initial}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1d20' }}>{card.name}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{card.role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '40px', justifyContent: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{ width: i === active ? '32px' : '8px', height: '8px', borderRadius: '99px', background: i === active ? '#1a1d20' : '#e2ded9', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyScrollWhyUs() {
  return (
    <section id="why-us" className="why-us-section" style={{ background: 'var(--color-primary-dark)', color: 'white', position: 'relative', padding: '120px 0' }}>
      <div className="container why-us-container">
        {/* Left Side */}
        <div className="why-us-left">
          <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'white', marginBottom: '24px', textTransform: 'uppercase' }}>
            Why Solitaire
          </div>
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 64px)', marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#ffffff' }}>
            A Higher Standard<br/>of Staffing
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', marginBottom: '36px', lineHeight: 1.7, maxWidth: '480px' }}>
            We go beyond placements — we build long-term relationships based on trust, quality and understanding. Every candidate is meticulously matched to your unique lifestyle.
          </p>
          <div style={{ marginTop: '16px', marginBottom: '32px' }}>
            <MagneticButton href="#contact">LEARN MORE</MagneticButton>
          </div>
        </div>
        
        {/* Right Side Cards */}
        <div className="why-us-right">
          <GridUnfoldStack />
        </div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <div style={{ background: 'var(--color-surface-2)', overflow: 'hidden' }}>
      <VideoHero />

      <AboutReveal />

      <StatsBar />

      <ServiceStandards />

      {/* ── Services (3D Flip Cards) ───────────────────────────────────── */}
      <section id="services" style={{ padding: '140px 0', background: 'linear-gradient(to bottom, var(--color-surface-2) 0%, white 100%)', position: 'relative' }}>
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <motion.div variants={scaleUp} style={{ display: 'inline-block', padding: '4px 16px', background: 'rgba(30,73,106,0.1)', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px', textTransform: 'uppercase' }}>
              Our Services
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--color-text)', marginBottom: '24px', letterSpacing: '-0.03em' }}>
              Professionals for Every Chapter
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              From everyday support to specialised roles, we provide skilled and trustworthy professionals to match your lifestyle and requirements.
            </motion.p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {SERVICES.map((srv, idx) => (
              <ServiceCard key={idx} icon={srv.icon} title={srv.title} desc={srv.desc} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Solitaire ─────────────────────────────────────────────── */}
      <StickyScrollWhyUs />

      {/* ── Testimonials (Dribbble-style) ─────────────────────────────── */}
      <Testimonials />

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '160px 0', textAlign: 'center', background: 'var(--color-primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ repeat: Infinity, repeatType: 'mirror', duration: 10, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--color-primary) 0%, #1a4a6b 50%, var(--color-primary-dark) 100%)', backgroundSize: '200% 200%', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 1 }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 10 }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', opacity: 0.7, marginBottom: '24px', textTransform: 'uppercase' }}>
            Let’s Create a Better Tomorrow
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'white', marginBottom: '56px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Find the Right People<br />for Your Home or Business
         </h2>
          <MagneticButton href="https://wa.me/971506486332" target="_blank" rel="noopener noreferrer">
            GET IN TOUCH
          </MagneticButton>
        </motion.div>
      </section>
    </div>
  );
}
