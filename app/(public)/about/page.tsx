import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
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
    image: '/images/saji-thomas.jpeg',
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
    <div className="bg-[#fcfaf8] text-[#1a1d20] min-h-screen pt-24 md:pt-32 pb-20">
      
      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pb-28">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#1e496a]/10 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-[#c9603e]/10 blur-3xl" />
        </div>

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e496a]/10 text-[#1e496a] text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles size={14} />
            <span>The Solitaire Standard</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#11314a] leading-[1.15] mb-6">
            Redefining Luxury & Bespoke <br className="hidden sm:inline" />
            <span className="text-[#1e496a]">Household Staffing</span>
          </h1>

          <p className="text-lg md:text-xl text-[#556370] leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
            Solitaire Consultancy isn’t just filling positions — we deliver premium staffing and the perfect match. Founded on trust, discretion, and an unwavering commitment to quality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-[#1e496a] hover:bg-[#11314a] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-[#1e496a]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Get in Touch</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f4f0eb] text-[#1e496a] border border-[#1e496a]/20 px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-sm"
            >
              <Briefcase size={16} />
              <span>Explore Open Roles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Story Section ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-y border-[#e5e7eb]/70">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/images/luxury_staff_team.jpg" 
                  alt="Solitaire Staff Excellence" 
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11314a]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#a8b8c2] font-semibold block mb-1">
                    Bespoke Placements
                  </span>
                  <p className="text-xl font-bold leading-tight">
                    Every household is a reflection of your unique lifestyle.
                  </p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1e496a] text-white flex items-center justify-center font-bold text-lg">
                  10+
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Years of Dedicated</div>
                  <div className="text-sm font-bold text-[#11314a]">Excellence & Trust</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3.5 py-1 bg-[#1e496a]/10 text-[#1e496a] text-xs font-bold rounded-full tracking-wider uppercase">
                Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#11314a] tracking-tight">
                Crafting Perfect Matches, Not Just Filling Vacancies
              </h2>

              <div className="space-y-4 text-[#4b5563] text-base leading-relaxed">
                <p>
                  <strong className="text-[#11314a] font-semibold">
                    Solitaire Consultancy didn’t begin in a boardroom.
                  </strong>{' '}
                  Rather, it all started with a conversation, a spark between visionary minds. A request from a discerning client revealed a clear need: luxury domestic staffing defined by trust, rigorous vetting, and tailored precision.
                </p>
                <p>
                  As a result, our founders recognized a major gap in the premium staffing market. Fueled by a shared vision and an unwavering commitment to quality, they set out not only to fill this gap but to redefine the world of elite staffing.
                </p>
                <p>
                  At Solitaire Consultancy, every placement is much more than just a service — it’s a bespoke experience. We understand that your household is not merely a living space, but an intimate sanctuary and reflection of your lifestyle. Consequently, we ensure that every house manager, private chef, butler, and domestic professional is meticulously vetted to seamlessly integrate into your world.
                </p>
                <p>
                  What initially began as a simple request has evolved into a distinguished and respected agency in premium staffing. Solitaire Consultancy has firmly established itself as the trusted partner that refines and elevates your lifestyle — one perfect placement at a time.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Leadership Team Section ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#fcfaf8]">
        <div className="container max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9603e] block mb-2">
              The Faces Behind
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#11314a] tracking-tight mb-4">
              Our Leadership Team
            </h2>
            <div className="w-16 h-1 bg-[#1e496a] mx-auto rounded-full mb-5" />
            <p className="text-base text-[#6b7280]">
              Meet the passionate visionaries driving Solitaire’s dedication to discretion, operational excellence, and bespoke client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11314a]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1e496a] shadow-sm">
                    {member.badge}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold tracking-tight mb-0.5 drop-shadow-sm">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-white/90 drop-shadow-sm">
                      {member.designation}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7 flex flex-col flex-grow justify-between">
                  <p className="text-sm text-[#4b5563] leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1e496a] uppercase tracking-wider">
                      Solitaire Leadership
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[#1e496a]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── The Solitaire Standard / Core Values ─────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1e496a] block mb-2">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#11314a] tracking-tight mb-4">
              Why Discerning Clients Choose Solitaire
            </h2>
            <p className="text-base text-[#6b7280]">
              Every placement is governed by strict ethical standards and meticulous care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#fcfaf8] p-7 rounded-2xl border border-gray-100 hover:border-[#1e496a]/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1e496a]/10 text-[#1e496a] flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#11314a] mb-2 tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-[#11314a] via-[#1e496a] to-[#11314a] text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to Experience Bespoke Staffing?
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-8 font-light">
            Whether you require an executive house manager, a private chef, or discreet household staff, our leadership team is ready to assist you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+971506486332"
              className="inline-flex items-center gap-2 bg-white text-[#11314a] hover:bg-gray-100 px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-md"
            >
              <Phone size={16} />
              <span>Call +971 50 648 6332</span>
            </a>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/30 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
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
