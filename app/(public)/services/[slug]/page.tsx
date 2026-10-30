import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  SERVICES_DATA,
  getServiceBySlug,
  getAllServiceSlugs,
} from '@/lib/servicesData';
import ServiceIcon from '@/app/_components/ServiceIcon';
import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Lock,
  Sparkles,
  Phone,
  MessageCircle,
  Briefcase,
  ArrowRight,
  HelpCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Solitaire Consultancy',
    };
  }

  return {
    title: `${service.title} Staffing Dubai | Solitaire Consultancy`,
    description: `Hire a qualified, vetted ${service.title} in Dubai. ${service.summary}`,
    keywords: `${service.title.toLowerCase()} dubai, hire ${service.title.toLowerCase()} uae, luxury private ${service.title.toLowerCase()}, private estate staffing`,
    openGraph: {
      title: `${service.title} Staffing Dubai | Solitaire Consultancy`,
      description: service.summary,
      images: [service.image],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const otherServices = SERVICES_DATA.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div style={{ background: 'var(--color-surface-2)', minHeight: '100vh', color: 'var(--color-text)' }}>
      {/* ── Scoped Styles ── */}
      <style>{`
        .service-hero {
          padding-top: 150px;
          padding-bottom: 70px;
          background: linear-gradient(to bottom, white 0%, var(--color-surface-2) 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .service-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 48px;
          align-items: start;
        }
        .responsibilities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .service-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .responsibilities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="service-hero">
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumbs */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginBottom: '24px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{service.title}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              color: 'var(--color-primary)',
            }}>
              <ServiceIcon name={service.iconName} size={24} strokeWidth={2} />
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--color-primary)',
            }}>
              {service.subtitle}
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 54px)',
            color: 'var(--color-text)',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}>
            {service.title} Placement in Dubai & UAE
          </h1>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: 'clamp(16px, 2vw, 19px)',
            lineHeight: 1.6,
            maxWidth: '780px',
            marginBottom: '32px',
          }}>
            {service.summary}
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/971506486332?text=Hello%20Solitaire,%20I%20would%20like%20to%20inquire%20about%20hiring%20a%20${encodeURIComponent(service.title)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 26px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <MessageCircle size={17} /> Hire a {service.title}
            </a>
            <a
              href="tel:+971506486332"
              className="btn btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 22px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                background: 'white',
              }}
            >
              <Phone size={15} /> Speak with a Consultant
            </a>
          </div>
        </div>
      </section>

      {/* ── Main Content & Sidebar ── */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="service-layout">
            
            {/* ── Left Column (Main Details) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              
              {/* Feature Image Banner */}
              <div style={{
                position: 'relative',
                height: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                border: '1px solid var(--color-border)',
              }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '4px' }}>
                    Solitaire Placement Standards
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>
                    Vetted, Experienced, and Culturally Aligned for Dubai Households
                  </div>
                </div>
              </div>

              {/* Service Overview */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                  Role Overview
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                  {service.overview.map((para, idx) => (
                    <p key={idx} style={{ margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Scope & Key Responsibilities */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Briefcase size={20} color="var(--color-primary)" />
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                    Key Responsibilities & Scope
                  </h2>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  A {service.title} placed by Solitaire is responsible for managing the following core domains:
                </p>

                <div className="responsibilities-grid">
                  {service.responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--color-surface-2)',
                        padding: '16px 18px',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text)', fontWeight: 500 }}>
                        {resp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Screening & Qualifications */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <UserCheck size={20} color="#047857" />
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                    Screening & Qualification Standards
                  </h2>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  We only recommend candidates who meet our uncompromising selection criteria:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {service.qualifications.map((qual, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: '#f0fdf4',
                        borderRadius: '12px',
                        border: '1px solid #bbf7d0',
                        fontSize: '13.5px',
                        color: '#166534',
                        fontWeight: 500,
                      }}
                    >
                      <ShieldCheck size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal For */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Sparkles size={20} color="#f59e0b" />
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                    Ideal Households & Environments
                  </h2>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  Our {service.title} candidates excel in settings such as:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {service.idealFor.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'var(--color-surface-2)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        color: 'var(--color-text)',
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {service.faqs.length > 0 && (
                <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <HelpCircle size={20} color="var(--color-primary)" />
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {service.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--color-surface-2)',
                          borderRadius: '16px',
                          padding: '20px 24px',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                          {faq.question}
                        </h4>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Column (Sticky Sidebar) ── */}
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Inquiry Action Box */}
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '28px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 12px',
                  background: 'rgba(30,73,106,0.08)',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  Direct Placement
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  Request a {service.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Tell us your household requirements, lifestyle schedule, and preferences. We will provide handpicked, vetted profiles within 48 hours.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={`https://wa.me/971506486332?text=Hello%20Solitaire,%20I%20am%20interested%20in%20hiring%20a%20${encodeURIComponent(service.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      gap: '8px',
                    }}
                  >
                    <MessageCircle size={17} /> Chat on WhatsApp
                  </a>

                  <a
                    href="tel:+971506486332"
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      border: '1px solid var(--color-border)',
                      gap: '8px',
                    }}
                  >
                    <Phone size={15} /> Call +971 50 648 6332
                  </a>
                </div>
              </div>

              {/* Guarantees Box */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #153752 100%)',
                borderRadius: '24px',
                padding: '24px',
                color: 'white',
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#f59e0b" /> The Solitaire Guarantee
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px', opacity: 0.9 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Lock size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>100% Discretion:</strong> Strict Non-Disclosure Agreements for all candidates</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Clock size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>In-Home Trials:</strong> Experience compatibility before finalizing placement</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Sparkles size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Free Replacement:</strong> Guaranteed candidate replacement policy</span>
                  </div>
                </div>
              </div>

              {/* Job Seekers link */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid var(--color-border)',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
                  Are you a {service.title}?
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                  We are continually seeking top-tier talent for private residences and corporate roles in Dubai.
                </p>
                <Link
                  href="/jobs"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                  }}
                >
                  View Open Job Vacancies <ArrowRight size={14} />
                </Link>
              </div>

              {/* Other Services Navigation */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--color-border)',
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
                  Explore Other Services
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {otherServices.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/services/${other.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'var(--color-surface-2)',
                        textDecoration: 'none',
                        color: 'var(--color-text)',
                        fontSize: '13px',
                        fontWeight: 600,
                        transition: 'background 0.2s',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ServiceIcon name={other.iconName} size={16} color="var(--color-primary)" />
                        {other.title}
                      </span>
                      <ChevronRight size={14} color="var(--color-text-muted)" />
                    </Link>
                  ))}
                </div>
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Link
                    href="/services"
                    style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
                  >
                    View All Services &rarr;
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

