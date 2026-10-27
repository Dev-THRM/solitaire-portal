'use client';

import Link from 'next/link';
import { type BlogPost } from '../_lib/api';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  if (featured) {
    return (
      <div style={{
        background: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 0,
        marginBottom: 40,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}>
        {/* Cover */}
        <div style={{ position: 'relative', minHeight: 240, background: '#f1f5f9', overflow: 'hidden' }}>
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(135deg, #1E496A 0%, #0F2A3F 100%)', color: 'white',
            }}>
              <BookOpen size={48} opacity={0.6} />
            </div>
          )}
          <span style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            color: 'var(--color-primary)',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: 9999,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            Featured • {blog.category || 'Insights'}
          </span>
        </div>

        {/* Info */}
        <div className="p-6 md:p-9 flex flex-col justify-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
            <span>{formattedDate}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> {blog.readTime || '4 min read'}
            </span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, color: 'var(--color-text)', marginBottom: 14 }}>
            <Link
              href={`/blogs/${blog.slug}`}
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              {blog.title}
            </Link>
          </h2>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 24,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {blog.excerpt}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
              By {blog.author}
            </span>
            <Link
              href={`/blogs/${blog.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              Read Article <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {/* Cover Image */}
      <div style={{ position: 'relative', height: 200, background: '#f8fafc', overflow: 'hidden' }}>
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'linear-gradient(135deg, #1E496A 0%, #0F2A3F 100%)', color: 'white',
          }}>
            <BookOpen size={36} opacity={0.5} />
          </div>
        )}
        <span style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
          color: 'var(--color-primary)',
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 9999,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}>
          {blog.category || 'Article'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>
          <span>{formattedDate}</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> {blog.readTime || '4 min read'}
          </span>
        </div>

        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.4,
          color: 'var(--color-text)',
          marginBottom: 10,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          <Link
            href={`/blogs/${blog.slug}`}
            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
          >
            {blog.title}
          </Link>
        </h3>

        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 20,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {blog.excerpt}
        </p>

        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
            {blog.author}
          </span>
          <Link
            href={`/blogs/${blog.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            Read More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
