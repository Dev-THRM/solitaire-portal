import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award,
  ChevronRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { SERVICES_DATA } from '@/lib/servicesData';
import ServiceIcon from '@/app/_components/ServiceIcon';

export const metadata: Metadata = {
  title: 'Our Services | Luxury Household & Corporate Staffing Dubai',
  description:
    'Explore our bespoke domestic and private estate staffing services across Dubai & the UAE: House Managers, Butlers, Personal Chefs, Executive Assistants, Chauffeurs, and Nannies.',
  keywords:
    'luxury staffing dubai, house manager dubai, personal chef dubai, private butler uae, executive assistant dubai, private chauffeur dubai, nanny dubai',
};

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Consultation & Lifestyle Audit',
    desc: 'We assess your household dynamics, cultural expectations, and exact operational needs in complete confidence.',
  },
  {
    step: '02',
    title: 'Multi-Tier Screening & Vetting',
    desc: 'Every candidate is vetted through background checks, medical clearances, skill verification, and deep reference audits.',
  },
  {
    step: '03',
    title: 'Interviews & In-Home Trials',
    desc: 'We arrange private interviews and paid household trials so you experience firsthand their etiquette and capability.',
  },
  {
    step: '04',
    title: 'Placement & Ongoing Care',
    desc: 'We assist with seamless onboarding, visa compliance, contracts, and provide 24/7 ongoing placement support.',
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--color-surface-2)', minHeight: '100vh', color: 'var(--color-text)' }}>
      {/* ── Responsive CSS ── */}
      <style>{`
        .services-hero-section {
          padding-top: 150px;
          padding-bottom: 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .services-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .services-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(30,73,106,0.12);
        }
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1080px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .process-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 680px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
          .process-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── Hero Section ── */}
      <section className="services-hero-section">
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumbs */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginBottom: '20px',
            background: 'white',
            padding: '6px 16px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Services</span>
          </div>

          <div style={{
            display: 'inline-block',
            padding: '4px 16px',
            background: 'rgba(30,73,106,0.1)',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}>
            Bespoke Domestic & Estate Staffing
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 58px)',
            color: 'var(--color-text)',
            marginBottom: '20px',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}>
            Elite Professionals Tailored to Your Home & Lifestyle
          </h1>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: 'clamp(16px, 2vw, 19px)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 36px',
          }}>
            From private chefs and butlers to estate managers and certified nannies, we connect Dubai’s most distinguished households with vetted, discreet, and world-class personnel.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/971506486332?text=Hello%20Solitaire%20Consultancy,%20I%20am%20inquiring%20about%20your%20staffing%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              <MessageCircle size={18} /> Inquire via WhatsApp
            </a>
            <Link
              href="/jobs"
              className="btn btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                background: 'white',
              }}
            >
              Browse Open Vacancies <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services Directory Grid ── */}
      <section style={{ padding: '40px 0 100px' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="services-grid">
            {SERVICES_DATA.map((service) => (
              <div key={service.slug} className="services-card">
                {/* Image Header with Badge */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#e2e8f0' }}>
                  <img
                    src={service.image}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                  }} />
                  {/* Icon floating badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    color: 'var(--color-primary)',
                  }}>
                    <ServiceIcon name={service.iconName} size={26} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-primary)',
                    marginBottom: '6px',
                  }}>
                    {service.subtitle}
                  </div>

                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}>
                    {service.title}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    flex: 1,
                  }}>
                    {service.summary}
                  </p>

                  {/* Key Highlights list */}
                  <div style={{
                    background: 'var(--color-surface-2)',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}>
                    {service.keyHighlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: 'var(--color-text)',
                        fontWeight: 500,
                      }}>
                        <CheckCircle2 size={14} color="#047857" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      View Details <ChevronRight size={15} />
                    </Link>
                    <a
                      href={`https://wa.me/971506486332?text=Hello,%20I%20am%20interested%20in%20hiring%20a%20${encodeURIComponent(service.title)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`Inquire about hiring a ${service.title}`}
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our 4-Step Placement Process ── */}
      <section style={{ padding: '100px 0', background: 'white', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 16px',
              background: 'rgba(30,73,106,0.1)',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'var(--color-primary)',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              How We Work
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Our 4-Step Placement Process
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '17px', maxWidth: '640px', margin: '0 auto' }}>
              Precision matching, absolute confidentiality, and in-home trials to ensure seamless integration into your private residence.
            </p>
          </div>

          <div className="process-grid">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                style={{
                  background: 'var(--color-surface-2)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                }}
              >
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  opacity: 0.25,
                  marginBottom: '16px',
                  letterSpacing: '-0.03em',
                }}>
                  {step.step}
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Solitaire Guarantee ── */}
      <section style={{ padding: '80px 0', background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #153752 100%)',
            borderRadius: '28px',
            padding: '56px 40px',
            color: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
          }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '12px',
              }}>
                <Sparkles size={14} color="#f59e0b" /> The Solitaire Standard
              </div>
              <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Need a Custom or Multi-Role Household Placement?
              </h3>
              <p style={{ fontSize: '16px', opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
                Whether you require a complete estate team for a newly acquired property or specialized private staff on short notice, our senior consultants provide bespoke solutions with total discretion.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/971506486332"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'white',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MessageCircle size={16} /> Contact a Consultant
              </a>
              <a
                href="tel:+971506486332"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '14px 24px',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Phone size={16} /> +971 50 648 6332
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

