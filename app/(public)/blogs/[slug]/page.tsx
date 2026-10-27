import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogBySlug, type BlogPost } from '../../../_lib/api';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Share2,
  Briefcase,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await getBlogBySlug(slug);
    const blog = res.data;

    if (!blog) {
      return { title: 'Article Not Found — Solitaire HR' };
    }

    const title = blog.metaTitle || `${blog.title} — Solitaire Insights`;
    const description = blog.metaDescription || blog.excerpt || blog.title;
    const url = blog.canonicalUrl || `https://solitairehr.com/blogs/${blog.slug}`;
    const images = blog.coverImage ? [blog.coverImage] : [];

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime: blog.publishedAt || blog.createdAt,
        authors: [blog.author || 'Solitaire Team'],
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images,
      },
    };
  } catch {
    return { title: 'Article Not Found — Solitaire HR' };
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let blog: BlogPost;
  try {
    const res = await getBlogBySlug(slug);
    if (!res.data) notFound();
    blog = res.data;
  } catch {
    notFound();
  }

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  // Schema.org BlogPosting Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author || 'Solitaire Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Solitaire Human Resources Consultancy L.L.C.',
      logo: {
        '@type': 'ImageObject',
        url: 'https://solitairehr.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://solitairehr.com/blogs/${blog.slug}`,
    },
  };

  return (
    <div style={{ background: 'var(--color-surface-2)', minHeight: '100vh', paddingTop: '110px', paddingBottom: '100px' }}>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container" style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        {/* Breadcrumb Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: 'var(--color-text-muted)',
          marginBottom: 32,
          flexWrap: 'wrap',
        }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} opacity={0.5} />
          <Link href="/blogs" style={{ color: 'inherit', textDecoration: 'none' }}>Insights</Link>
          <ChevronRight size={14} opacity={0.5} />
          <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{blog.category || 'Article'}</span>
        </nav>

        {/* Back Link */}
        <Link
          href="/blogs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} /> Back to all articles
        </Link>

        {/* Header Section */}
        <header style={{ marginBottom: 36 }}>
          {blog.category && (
            <span style={{
              display: 'inline-block',
              background: 'rgba(30, 73, 106, 0.08)',
              color: 'var(--color-primary)',
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 9999,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              {blog.category}
            </span>
          )}

          <h1 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            color: 'var(--color-text)',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            {blog.title}
          </h1>

          {/* Author & Meta Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            paddingBottom: 24,
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1E496A 0%, #0F2A3F 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
              }}>
                {blog.author ? blog.author.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <span style={{ display: 'block', fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>
                  {blog.author}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} /> {formattedDate}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {blog.readTime || '4 min read'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {blog.coverImage && (
          <div style={{
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 44,
            boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
            background: 'white',
          }}>
            <img
              src={blog.coverImage}
              alt={blog.title}
              style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Article Body */}
        <div
          style={{
            background: 'white',
            borderRadius: 24,
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            fontSize: '17px',
            lineHeight: 1.85,
            color: '#334155',
            marginBottom: 48,
          }}
          className="blog-article-content p-6 sm:p-9 md:p-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Internal Linking & Conversion Callout */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E496A 0%, #0F2A3F 100%)',
            color: 'white',
            borderRadius: 24,
            boxShadow: '0 10px 30px rgba(30,73,106,0.25)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 48,
          }}
          className="p-6 md:p-10"
        >
          <div style={{ maxWidth: 480 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 8 }}>
              EXPLORE OPPORTUNITIES
            </span>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>
              Looking for Your Next Luxury Career Role?
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Browse our currently active private estate, butler, chef, and luxury hospitality positions in Dubai and internationally.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/jobs"
              style={{
                background: 'white',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 24px',
                borderRadius: 9999,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Briefcase size={16} /> View Open Roles <ArrowRight size={16} />
            </Link>
            <Link
              href="/#contact"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                padding: '12px 20px',
                borderRadius: 9999,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              Contact Staffing Team
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
