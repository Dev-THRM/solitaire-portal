import type { Metadata } from 'next';
import { listPublishedBlogs } from '@/lib/blogs';
import type { BlogPost } from '../../_lib/api';
import BlogCard from '../../_components/BlogCard';
import Link from 'next/link';
import { Search, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights & Career Guides | Solitaire HR Consultancy Dubai',
  description:
    'Authoritative insights, recruitment perspectives, and career advice for luxury hospitality and private household staffing in Dubai, the UAE, and worldwide.',
  openGraph: {
    title: 'Insights & Career Guides | Solitaire HR',
    description:
      'Authoritative insights, recruitment perspectives, and career advice for luxury hospitality and private household staffing.',
    type: 'website',
  },
};

interface BlogsPageProps {
  searchParams: Promise<Record<string, string>>;
}

const CATEGORIES = [
  'All',
  'Career Advice',
  'Hospitality Trends',
  'Private Household Staffing',
  'Executive Search',
  'Dubai & UAE Market',
];

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || 'All';
  const currentSearch = params.search || '';
  const currentPage = parseInt(params.page || '1', 10);

  let blogs: BlogPost[] = [];
  let pagination = { page: 1, limit: 9, total: 0, totalPages: 1 };
  let error = false;

  try {
    const apiParams: Record<string, string> = {
      page: String(currentPage),
      limit: '9',
    };
    if (currentCategory && currentCategory !== 'All') {
      apiParams.category = currentCategory;
    }
    if (currentSearch.trim()) {
      apiParams.search = currentSearch.trim();
    }

    const res = await listPublishedBlogs(apiParams);
    blogs = (res.blogs as any) || [];
    pagination = res.pagination || pagination;
  } catch (err) {
    error = true;
  }

  const featuredBlog = blogs.length > 0 && !currentSearch && currentCategory === 'All' && currentPage === 1
    ? blogs[0]
    : null;
  const gridBlogs = featuredBlog ? blogs.slice(1) : blogs;

  return (
    <div style={{ background: 'var(--color-surface-2)', minHeight: '100vh', paddingTop: '140px', paddingBottom: '96px' }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            background: 'white',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: 20,
          }}>
            <Sparkles size={14} color="var(--color-primary)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
              SOLITAIRE INSIGHTS & PERSPECTIVES
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            color: 'var(--color-text)',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            Industry Insights & Elite Career Advice
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            Discover expert commentary on luxury hospitality trends, private estate management, and guidance for accelerating your career in Dubai and beyond.
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 40,
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {CATEGORIES.map((cat) => {
              const active = currentCategory === cat;
              const href = cat === 'All'
                ? (currentSearch ? `/blogs?search=${encodeURIComponent(currentSearch)}` : '/blogs')
                : `/blogs?category=${encodeURIComponent(cat)}${currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ''}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 9999,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: active ? 'var(--color-primary)' : 'white',
                    color: active ? 'white' : 'var(--color-text-muted)',
                    border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    boxShadow: active ? '0 4px 12px rgba(30,73,106,0.2)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Search Input */}
          <form method="GET" action="/blogs" style={{ flex: '1 1 260px', maxWidth: 360, position: 'relative' }}>
            {currentCategory !== 'All' && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search topics, roles, or tips..."
              className="input"
              style={{
                width: '100%',
                paddingLeft: 40,
                borderRadius: 9999,
                fontSize: 13,
                background: 'white',
                border: '1px solid var(--color-border)',
              }}
            />
          </form>
        </div>

        {/* Error State */}
        {error ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'white',
            borderRadius: 24,
            border: '1px dashed var(--color-border)',
          }}>
            <AlertCircle size={48} color="var(--color-text-muted)" opacity={0.3} style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 20, color: 'var(--color-text)' }}>Could not load articles</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
              Our servers are currently unavailable. Please check back shortly.
            </p>
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'white',
            borderRadius: 24,
            border: '1px dashed var(--color-border)',
          }}>
            <BookOpen size={48} color="var(--color-text-muted)" opacity={0.3} style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>No articles found</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 8, maxWidth: 400, margin: '8px auto 20px' }}>
              {currentSearch
                ? `No articles match "${currentSearch}". Try a different keyword or filter.`
                : 'Check back soon for upcoming articles, hospitality guides, and career perspectives.'}
            </p>
            {(currentSearch || currentCategory !== 'All') && (
              <Link href="/blogs" className="btn btn-secondary" style={{ borderRadius: 9999, padding: '8px 20px', fontSize: 13 }}>
                View All Articles
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Featured Hero Card */}
            {featuredBlog && <BlogCard blog={featuredBlog} featured={true} />}

            {/* Grid of Articles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: 24,
            }}>
              {gridBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  const active = p === pagination.page;
                  const qs = new URLSearchParams();
                  if (currentCategory && currentCategory !== 'All') qs.set('category', currentCategory);
                  if (currentSearch) qs.set('search', currentSearch);
                  qs.set('page', String(p));

                  return (
                    <Link
                      key={p}
                      href={`/blogs?${qs.toString()}`}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: 'none',
                        background: active ? 'var(--color-primary)' : 'white',
                        color: active ? 'white' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
