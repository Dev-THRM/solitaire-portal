"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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
  ShieldCheck 
} from 'lucide-react';

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const wordAnimation = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { ease: [0.33, 1, 0.68, 1], duration: 0.8 } 
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// A simple component to split text into words for animation
const AnimatedText = ({ text, style }: { text: string, style?: any }) => {
  const words = text.split(" ");
  return (
    <motion.div style={{ ...style, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {words.map((word, index) => (
        <motion.span variants={wordAnimation} key={index} style={{ display: 'inline-block' }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function HomeClient() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 0',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Parallax Background */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          background: 'url(/images/hero.png) no-repeat center center',
          backgroundSize: 'cover',
          scale: bgScale,
          y: heroY,
          opacity: heroOpacity,
          zIndex: 0
        }} />
        
        {/* Animated Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0) 100%)',
          zIndex: 1
        }} />

        {/* Floating Shapes */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(30,73,106,0.1), rgba(255,255,255,0))',
            filter: 'blur(40px)',
            zIndex: 1
          }}
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            style={{ maxWidth: '700px' }}
          >
            <motion.div variants={fadeUp} style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.3em',
              color: 'var(--color-primary)',
              marginBottom: '32px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ height: '1px', width: '40px', background: 'var(--color-primary)' }} />
              Exceptional People
            </motion.div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 500,
              color: 'var(--color-primary)',
              lineHeight: 1.1,
              marginBottom: '32px',
            }}>
              <AnimatedText text="Your Home." />
              <AnimatedText text="Your Standards." />
              <div style={{ overflow: 'hidden' }}>
                <motion.span variants={wordAnimation} style={{ display: 'inline-block', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                  Our People.
                </motion.span>
              </div>
            </h1>
            
            <motion.p variants={fadeUp} style={{
              fontSize: '20px',
              color: 'var(--color-text)',
              marginBottom: '48px',
              lineHeight: 1.6,
              maxWidth: '520px',
              fontWeight: 300
            }}>
              Premium staffing solutions for private households and businesses in Dubai. Discreet. Reliable. Personal.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="#services" className="btn" style={{
                position: 'relative',
                background: 'var(--color-primary)',
                color: 'white',
                padding: '18px 40px',
                borderRadius: '4px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                display: 'inline-flex',
                overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(30,73,106,0.5)',
              }}>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'inline-block', width: '100%' }}
                >
                  DISCOVER SERVICES &rarr;
                </motion.span>
              </Link>
            </motion.div>

            <motion.div variants={staggerContainer} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '64px' }}>
              {[
                { icon: <Gem size={20} strokeWidth={1.5} color="var(--color-primary)" />, text: 'TRUSTED & DISCREET' },
                { icon: <Users size={20} strokeWidth={1.5} color="var(--color-primary)" />, text: 'PRE-SCREENED' },
                { icon: <ShieldCheck size={20} strokeWidth={1.5} color="var(--color-primary)" />, text: 'TAILORED NEEDS' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -5 }} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '48px', height: '48px', 
                    borderRadius: '50%', background: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
                    {item.text.split(' ').map((w,j)=><div key={j}>{w}</div>)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: '120px 0', background: 'var(--color-surface-2)', position: 'relative' }}>
        <div className="container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <motion.div variants={scaleUp} style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(30,73,106,0.1)', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px' }}>
              OUR SERVICES
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--color-primary)', marginBottom: '24px', fontWeight: 500 }}>
              Professionals for Every Chapter
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', fontWeight: 300 }}>
              From everyday support to specialised roles, we provide skilled and trustworthy professionals to match your lifestyle and requirements.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}
          >
            {SERVICES.map((srv, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                whileHover="hover"
                initial="initial"
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <motion.div 
                  variants={{
                    initial: { height: '120px' },
                    hover: { height: '140px' }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', position: 'relative' }}
                >
                  <motion.div 
                    variants={{
                      initial: { opacity: 0, scale: 0.8 },
                      hover: { opacity: 1, scale: 1 }
                    }}
                    style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,73,106,0.1) 0%, rgba(30,73,106,0.05) 100%)' }}
                  />
                </motion.div>
                
                <motion.div 
                  variants={{
                    initial: { y: 0, scale: 1 },
                    hover: { y: -10, scale: 1.1 }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    width: '64px', height: '64px',
                    background: 'white',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'absolute',
                    top: '88px',
                    left: '32px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    rotate: '-5deg'
                  }}
                >
                  {srv.icon}
                </motion.div>
                
                <div style={{ padding: '48px 32px 40px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '16px' }}>{srv.title}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.6, fontWeight: 300 }}>{srv.desc}</p>
                </div>
                
                <motion.div 
                  variants={{
                    initial: { scaleX: 0 },
                    hover: { scaleX: 1 }
                  }}
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
                    background: 'var(--color-primary)', transformOrigin: 'left'
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Solitaire ─────────────────────────────────────────────────── */}
      <section id="why-us" style={{ background: 'white', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            style={{ flex: '1 1 50%', background: 'var(--color-primary)', color: 'white', padding: '120px 10%', position: 'relative' }}
          >
            {/* Abstract Decorative Circles */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />

            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '32px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '16px' }}>
                WHY SOLITAIRE <span style={{ height: '1px', width: '30px', background: 'rgba(255,255,255,0.3)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 400, marginBottom: '32px', lineHeight: 1.1 }}>
                A Higher<br/>Standard of Staffing
              </h2>
              <p style={{ fontSize: '18px', lineHeight: 1.8, opacity: 0.8, marginBottom: '56px', maxWidth: '420px', fontWeight: 300 }}>
                We go beyond placements — we build long-term relationships based on trust, quality and understanding. Every candidate is meticulously matched to your unique lifestyle.
              </p>
              
              <Link href="#contact" className="btn" style={{
                background: 'white',
                color: 'var(--color-primary)',
                padding: '16px 40px',
                borderRadius: '4px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                display: 'inline-block'
              }}>
                <motion.span whileHover={{ x: 5 }} style={{ display: 'inline-block' }}>
                  LEARN MORE ABOUT US &rarr;
                </motion.span>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ flex: '1 1 50%', padding: '120px 10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '48px', background: 'var(--color-surface-2)' }}
          >
            {FEATURES.map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                whileHover={{ x: 10 }}
                style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
              >
                <div style={{ padding: '12px', background: 'rgba(30,73,106,0.05)', borderRadius: '12px' }}>{feat.icon}</div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>{feat.title}</h4>
                  <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.6, fontWeight: 300 }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────────── */}
      <section style={{ padding: '140px 0', background: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(30,73,106,0.03) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} 
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 10 }}
        >
          <div style={{ fontSize: '80px', color: 'var(--color-primary)', marginBottom: '0', fontFamily: 'var(--font-display)', fontStyle: 'italic', opacity: 0.1, lineHeight: 0.5 }}>"</div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontStyle: 'italic',
            color: 'var(--color-primary)',
            lineHeight: 1.5,
            marginBottom: '40px',
            fontWeight: 400
          }}>
            Solitaire understood exactly what we were looking for. The process was seamless and the professionalism outstanding. We couldn't be happier.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span style={{ width: '40px', height: '1px', background: 'var(--color-text-muted)' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-text-muted)' }}>PRIVATE CLIENT, DUBAI</span>
            <span style={{ width: '40px', height: '1px', background: 'var(--color-text-muted)' }} />
          </div>
        </motion.div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section id="contact" style={{
        position: 'relative',
        padding: '120px 0',
        textAlign: 'center',
        overflow: 'hidden',
        background: '#1a365d' // fallback
      }}>
        {/* Animated Gradient Background */}
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(270deg, #1e496a, #2a5a8a, #163654, #1e496a)',
            backgroundSize: '400% 400%',
            zIndex: 0
          }} 
        />
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'url(/images/hero.png) no-repeat center center',
          backgroundSize: 'cover',
          opacity: 0.15,
          zIndex: 1,
          mixBlendMode: 'overlay'
        }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container" style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.05)', padding: '80px 40px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
            LET'S CREATE A BETTER TOMORROW
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', marginBottom: '48px', fontWeight: 400 }}>
            Find the Right People<br/>for Your Home or Business
          </h2>
          <Link href="#contact" className="btn" style={{
            background: 'white',
            color: 'var(--color-primary-dark)',
            padding: '20px 48px',
            borderRadius: '4px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <motion.span whileHover={{ scale: 1.05 }} style={{ display: 'inline-block' }}>
              GET IN TOUCH &rarr;
            </motion.span>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
