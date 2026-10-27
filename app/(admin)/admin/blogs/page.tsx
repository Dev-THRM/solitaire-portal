'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getToken } from '../../../_lib/auth';
import {
  adminGetBlogs,
  adminDeleteBlog,
  adminUpdateBlog,
  type BlogPost,
} from '../../../_lib/api';
import {
  Plus,
  Search,
  BookOpen,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [counts, setCounts] = useState({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter]);

  async function fetchBlogs(querySearch?: string) {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const s = querySearch !== undefined ? querySearch : search;
      if (s.trim()) params.search = s.trim();

      const res = await adminGetBlogs(token, params);
      setBlogs(res.blogs || []);
      setCounts(res.counts || { total: 0, published: 0, draft: 0 });
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchBlogs(search);
  }

  async function handleTogglePublish(blog: BlogPost) {
    const token = getToken();
    if (!token) return;

    try {
      const nextStatus = !blog.isPublished;
      await adminUpdateBlog(token, blog.id, { isPublished: nextStatus });
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, isPublished: nextStatus } : b)),
      );
      setCounts((prev) => ({
        ...prev,
        published: nextStatus ? prev.published + 1 : prev.published - 1,
        draft: nextStatus ? prev.draft - 1 : prev.draft + 1,
      }));
    } catch (err) {
      alert('Failed to update status');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      setDeletingId(id);
      await adminDeleteBlog(token, id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setCounts((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (err) {
      alert('Failed to delete blog post');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #1E496A 0%, #0F2A3F 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <BookOpen size={20} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-primary)' }}>
              Blog Management
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Create, edit, and optimize SEO-rich articles, industry insights, and career advice.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            borderRadius: 12,
            boxShadow: '0 4px 14px rgba(30, 73, 106, 0.25)',
          }}
        >
          <Plus size={18} /> Create New Blog
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '16px 20px',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
      }}>
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'published', 'draft'] as const).map((tab) => {
            const count = tab === 'all' ? counts.total : tab === 'published' ? counts.published : counts.draft;
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: active ? 'var(--color-primary)' : 'var(--color-surface-2)',
                  color: active ? 'white' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span style={{
                  fontSize: 11,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flex: '1 1 280px', maxWidth: 400 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ width: '100%', paddingLeft: 40, borderRadius: 10, fontSize: 13 }}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ borderRadius: 10, padding: '0 16px', fontSize: 13 }}>
            Search
          </button>
        </form>
      </div>

      {/* Blogs Table / List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          Loading articles...
        </div>
      ) : blogs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: 'white',
          borderRadius: 20,
          border: '1px dashed var(--color-border)',
        }}>
          <FileText size={48} color="var(--color-text-muted)" opacity={0.3} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>No blog posts found</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, maxWidth: 420, margin: '8px auto 24px' }}>
            {search ? 'No articles match your search criteria.' : 'Start sharing hospitality insights and SEO-friendly articles to drive organic search traffic.'}
          </p>
          <Link href="/admin/blogs/new" className="btn btn-primary" style={{ borderRadius: 12, padding: '10px 20px' }}>
            <Plus size={16} style={{ marginRight: 6 }} /> Create First Article
          </Link>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: 18,
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569' }}>Article</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569' }}>Category</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569' }}>Status</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569' }}>SEO Score</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569' }}>Published Date</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => {
                  const hasSeo = Boolean(blog.metaTitle && blog.metaDescription);
                  return (
                    <tr
                      key={blog.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
                    >
                      {/* Title & Cover */}
                      <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          {blog.coverImage ? (
                            <img
                              src={blog.coverImage}
                              alt=""
                              style={{ width: 60, height: 44, borderRadius: 8, objectFit: 'cover', background: '#e2e8f0', flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{
                              width: 60, height: 44, borderRadius: 8,
                              background: '#f1f5f9', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', color: '#94a3b8', flexShrink: 0,
                            }}>
                              <FileText size={20} />
                            </div>
                          )}
                          <div>
                            <Link
                              href={`/admin/blogs/${blog.id}`}
                              style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', display: 'block', marginBottom: 2 }}
                            >
                              {blog.title}
                            </Link>
                            <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
                              /blogs/{blog.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: 12,
                          fontWeight: 500,
                        }}>
                          {blog.category || 'General'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(blog)}
                          title="Click to toggle Published / Draft"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            background: blog.isPublished ? '#dcfce7' : '#fef3c7',
                            color: blog.isPublished ? '#15803d' : '#b45309',
                          }}
                        >
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: blog.isPublished ? '#22c55e' : '#f59e0b',
                          }} />
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* SEO Score Badge */}
                      <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Sparkles size={14} color={hasSeo ? '#16a34a' : '#d97706'} />
                          <span style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: hasSeo ? '#16a34a' : '#d97706',
                          }}>
                            {hasSeo ? 'Optimized' : 'Needs SEO'}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 20px', verticalAlign: 'middle', color: 'var(--color-text-muted)', fontSize: 13 }}>
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Not published'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          {blog.isPublished && (
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              title="View on site"
                              style={{
                                padding: 6,
                                borderRadius: 6,
                                color: 'var(--color-text-muted)',
                                display: 'flex',
                                transition: 'color 0.15s',
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                            >
                              <ExternalLink size={16} />
                            </Link>
                          )}
                          <Link
                            href={`/admin/blogs/${blog.id}`}
                            title="Edit Article"
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              color: 'var(--color-text-muted)',
                              display: 'flex',
                              transition: 'color 0.15s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog.id)}
                            disabled={deletingId === blog.id}
                            title="Delete Article"
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              color: '#ef4444',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              opacity: deletingId === blog.id ? 0.4 : 1,
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
