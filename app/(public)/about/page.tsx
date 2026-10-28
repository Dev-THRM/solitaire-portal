import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Phone,
  Briefcase,
  HeartHandshake
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Solitaire Consultancy Services',
  description: "Learn about Solitaire Consultancy, premier domestic and corporate staffing agency dedicated to providing elite household professionals, executive talent, and bespoke placement.",
  keywords: 'about Solitaire Consultancy, luxury domestic staff Dubai, elite household recruitment, leadership team, private staffing agency',
};

const TEAM_MEMBERS = [
  {
    name: 'David Eda',
    designation: 'Founder & Director',
    image: '/images/david-eda.jpeg',
    bio: 'David brings visionary leadership and years of expertise in the premium domestic staffing industry, ensuring impeccable service delivery, cultural alignment, and lasting satisfaction for all our discerning clients.',
    badge: 'Founder',
  },
  {
    name: 'Wilson Alphonso',
    designation: 'Director',
    image: '/images/wilson.jpeg',
    bio: "With a visionary approach to luxury domestic staffing, Wilson leads Solitaire Consultancy's strategic growth and client relations. Bringing years of expertise in the premium service industry, he ensures that every client receives impeccable, highly personalized service while maintaining our reputation as the most trusted elite staffing partner.",
    badge: 'Executive Director',
  },
  {
    name: 'Saji Thomas',
    designation: 'Chief Operating Officer',
    bio: "As the backbone of our day-to-day execution, Saji oversees the entire recruitment, screening, and placement lifecycle. With a keen eye for detail and a commitment to excellence, he ensures that our rigorous standards are met at every step, guaranteeing seamless integration of top-tier professionals into our clients' households.",
    badge: 'Operations',
  },
];

const CORE_VALUES = [
  {
    icon: Lock,
    title: 'Absolute Discretion & Trust',
    description: 'We protect the privacy of our distinguished clients and candidates alike. Strict confidentiality agreements and discreet handling govern every single interaction.',
  },
  {
    icon: ShieldCheck,
    title: 'Rigorous Multi-Tier Vetting',
    description: 'Every applicant undergoes stringent background checks, identity and police clearance, credential verification, and comprehensive reference audits.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Matching',
    description: 'We do not simply match resumes with job descriptions. We take the time to understand your household dynamics, lifestyle rhythm, and cultural nuances.',
  },
  {
    icon: HeartHandshake,
    title: 'Unwavering Commitment',
    description: 'Our relationship extends far beyond placement. With trial periods, ongoing support, and 24/7 client care, we guarantee sustained excellence.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--color-surface-2)', minHeight: '100vh', color: 'var(--color-text)' }}>
      
      {/* ── Scoped responsive styles to guarantee proper margins & layout ── */}
      <style>{`
        .about-hero-section {
          padding-top: 150px;
          padding-bottom: 90px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 60px;
          align-items: center;
        }
        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 36px;
        }
        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .about-team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .about-values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 860px) {
          .about-hero-section {
            padding-top: 130px;
            padding-bottom: 60px;
          }
          .about-story-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-team-grid {
            grid-template-columns: 1fr;
            max-width: 440px;
            margin: 0 auto;
          }
          .about-values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <section className="about-hero-section">
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(30, 73, 106, 0.08)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(201, 96, 62, 0.06)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '880px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 22px',
            borderRadius: '9999px',
            background: 'rgba(30, 73, 106, 0.08)',
            border: '1px solid rgba(30, 73, 106, 0.12)',
            color: 'var(--color-primary)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            <Sparkles size={15} />
            <span>The Solitaire Standard</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--color-primary-dark)',
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}>
            Redefining Luxury & Bespoke <br />
            <span style={{ color: 'var(--color-primary)' }}>Household Staffing</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.75,
            maxWidth: '720px',
            margin: '0 auto 40px',
            fontWeight: 400,
          }}>
            Solitaire Consultancy isn’t just filling positions — we deliver premium staffing and the perfect match. Founded on trust, discretion, and an unwavering commitment to quality.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <Link
              href="/#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--color-primary)',
                color: '#ffffff',
                padding: '14px 34px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(30, 73, 106, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Get in Touch</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                color: 'var(--color-primary)',
                border: '1px solid rgba(30, 73, 106, 0.2)',
                padding: '14px 30px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <Briefcase size={16} />
              <span>Explore Open Roles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Story Section ──────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 0',
        background: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          <div className="about-story-grid">
            
            {/* Left: Image with floating badge */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(17, 49, 74, 0.12)',
                border: '4px solid #ffffff',
                position: 'relative',
                height: '460px',
              }}>
                <img 
                  src="/images/luxury_staff_team.jpg" 
                  alt="Solitaire Staff Excellence" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(17, 49, 74, 0.85) 0%, transparent 60%)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  color: '#ffffff',
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    Bespoke Placements
                  </span>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: '#ffffff',
                    margin: 0,
                  }}>
                    Every household is a reflection of your unique lifestyle.
                  </p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div style={{
                position: 'absolute',
                bottom: '-24px',
                right: '-16px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(16px)',
                padding: '16px 22px',
                borderRadius: '20px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                zIndex: 3,
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  10+
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    Years of Dedicated
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Excellence & Trust
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Story Text */}
            <div style={{ padding: '10px 0' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(30, 73, 106, 0.08)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}>
                Our Story
              </div>

              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '26px',
              }}>
                Crafting Perfect Matches, Not Just Filling Vacancies
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '16px', color: '#4b5563', lineHeight: 1.8 }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    Solitaire Consultancy didn’t begin in a boardroom.
                  </strong>{' '}
                  Rather, it all started with a conversation, a spark between visionary minds. A request from a discerning client revealed a clear need: luxury domestic staffing defined by trust, rigorous vetting, and tailored precision.
                </p>
                <p style={{ margin: 0 }}>
                  As a result, our founders recognized a major gap in the premium staffing market. Fueled by a shared vision and an unwavering commitment to quality, they set out not only to fill this gap but to redefine the world of elite staffing.
                </p>
                <p style={{ margin: 0 }}>
                  At Solitaire Consultancy, every placement is much more than just a service — it’s a bespoke experience. We understand that your household is not merely a living space, but an intimate sanctuary and reflection of your lifestyle. Consequently, we ensure that every house manager, private chef, butler, and domestic professional is meticulously vetted to seamlessly integrate into your world.
                </p>
                <p style={{ margin: 0 }}>
                  What initially began as a simple request has evolved into a distinguished and respected agency in premium staffing. Solitaire Consultancy has firmly established itself as the trusted partner that refines and elevates your lifestyle — one perfect placement at a time.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Leadership Team Section ────────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: 'var(--color-surface-2)' }}>
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#c9603e',
              display: 'block',
              marginBottom: '10px',
            }}>
              The Faces Behind
            </span>
            <h2 style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '18px',
            }}>
              Our Leadership Team
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'var(--color-primary)',
              margin: '0 auto 20px',
              borderRadius: '9999px',
            }} />
            <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Meet the passionate visionaries driving Solitaire’s dedication to discretion, operational excellence, and bespoke client satisfaction.
            </p>
          </div>

          <div className="about-team-grid">
            {TEAM_MEMBERS.map((member, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Photo Container */}
                <div style={{
                  position: 'relative',
                  height: '340px',
                  overflow: 'hidden',
                  background: '#f3f4f6',
                }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(17, 49, 74, 0.85) 0%, transparent 55%)',
                  }} />
                  
                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}>
                    {member.badge}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '18px',
                    left: '20px',
                    right: '20px',
                    color: '#ffffff',
                  }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px',
                      lineHeight: 1.2,
                    }}>
                      {member.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.85)',
                      margin: 0,
                    }}>
                      {member.designation}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                }}>
                  <p style={{
                    fontSize: '14.5px',
                    color: '#4b5563',
                    lineHeight: 1.75,
                    marginBottom: '24px',
                    margin: '0 0 24px 0',
                  }}>
                    {member.bio}
                  </p>
                  
                  <div style={{
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>
                      Solitaire Leadership
                    </span>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── The Solitaire Standard / Core Values ─────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-primary)',
              display: 'block',
              marginBottom: '10px',
            }}>
              Our Principles
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: '16px',
            }}>
              Why Discerning Clients Choose Solitaire
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Every placement is governed by strict ethical standards and meticulous care.
            </p>
          </div>

          <div className="about-values-grid">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--color-surface-2)',
                    padding: '36px 28px',
                    borderRadius: '24px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: 'rgba(30, 73, 106, 0.1)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '22px',
                    flexShrink: 0,
                  }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}>
                    {val.title}
                  </h3>
                  <p style={{
                    fontSize: '14.5px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section style={{
        padding: '90px 24px',
        background: 'linear-gradient(135deg, #11314a 0%, #1e496a 50%, #11314a 100%)',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            marginBottom: '18px',
            color: '#ffffff',
          }}>
            Ready to Experience Bespoke Staffing?
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '620px',
            margin: '0 auto 38px',
            lineHeight: 1.65,
            fontWeight: 300,
          }}>
            Whether you require an executive house manager, a private chef, or discreet household staff, our leadership team is ready to assist you.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <a
              href="tel:+971506486332"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                color: 'var(--color-primary-dark)',
                padding: '14px 34px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <Phone size={16} />
              <span>Call +971 50 648 6332</span>
            </a>

            <Link
              href="/#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Send An Inquiry</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
