'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '../_lib/auth';
import {
  adminCreateBlog,
  adminUpdateBlog,
  adminUploadBlogImage,
  type BlogPost,
} from '../_lib/api';
import RichTextEditor from './RichTextEditor';
import {
  ArrowLeft,
  Save,
  Globe,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  X,
  Search,
  Sparkles,
} from 'lucide-react';

interface BlogFormProps {
  initialData?: BlogPost;
  isEdit?: boolean;
}

const CATEGORY_OPTIONS = [
  'Career Advice',
  'Hospitality Trends',
  'Private Household Staffing',
  'Executive Search',
  'Dubai & UAE Market',
  'Luxury Lifestyle',
  'Interviews & Insights',
];

export default function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManual, setSlugManual] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [category, setCategory] = useState(initialData?.category || 'Career Advice');
  const [customCategory, setCustomCategory] = useState('');
  const [author, setAuthor] = useState(initialData?.author || 'Solitaire Team');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || '');
  const [keywords, setKeywords] = useState(initialData?.keywords || '');

  // UI State
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) {
      setSlug(slugify(val));
    }
  }

  async function handleCoverImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getToken();
    if (!token) return;

    try {
      setUploadingCover(true);
      setError('');
      const res = await adminUploadBlogImage(token, file);
      setCoverImage(res.url);
    } catch (err) {
      setError('Failed to upload cover image. Please check file type and size.');
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleInlineImageUpload(file: File): Promise<string> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    const res = await adminUploadBlogImage(token, file);
    return res.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim()) {
      setError('Article title is required');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      setError('Article content cannot be empty');
      return;
    }

    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const payload: Partial<BlogPost> = {
      title: title.trim(),
      slug: slugify(slug.trim() || title),
      excerpt: excerpt.trim() || (content.replace(/<[^>]+>/g, ' ').slice(0, 160) + '...'),
      content,
      coverImage: coverImage.trim() || null,
      category: category === '__custom__' ? customCategory.trim() : category,
      author: author.trim() || 'Solitaire Team',
      isPublished,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      canonicalUrl: canonicalUrl.trim() || null,
      keywords: keywords.trim() || null,
    };

    try {
      setSaving(true);
      if (isEdit && initialData?.id) {
        await adminUpdateBlog(token, initialData.id, payload);
      } else {
        await adminCreateBlog(token, payload);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/blogs');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  }

  // SEO Counters & Previews
  const currentMetaTitle = metaTitle || title || 'Article Title Preview';
  const currentMetaDesc = metaDescription || excerpt || 'This is how your luxury article description will appear in Google search engine result snippets...';
  const effectiveSlug = slugify(slug || title || 'article-title');

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            href="/admin/blogs"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)' }}>
              {isEdit ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Publish high-ranking SEO content with internal linking and metadata
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/blogs" className="btn btn-secondary" style={{ borderRadius: 10, padding: '10px 18px', fontSize: 14 }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 10,
              fontSize: 14,
              boxShadow: '0 4px 14px rgba(30, 73, 106, 0.25)',
            }}
          >
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Article' : isPublished ? 'Publish Article' : 'Save as Draft'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 12,
          padding: '12px 16px',
          color: '#ef4444',
          fontSize: 14,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '12px 16px',
          color: '#16a34a',
          fontSize: 14,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <CheckCircle size={18} />
          {isEdit ? 'Article updated successfully!' : 'Article created successfully! Redirecting...'}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        {/* Left Column: Content Creation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title & Slug Box */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                Article Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5 Essential Qualities of an Elite Luxury Butler in Dubai"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="input"
                style={{ width: '100%', fontSize: 17, fontWeight: 600, padding: '12px 16px', borderRadius: 10 }}
                required
              />
            </div>

            {/* URL Slug Preview & Edit */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                  Permalink / URL Slug
                </label>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  https://solitairehr.com/blogs/<strong>{effectiveSlug}</strong>
                </span>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                placeholder="auto-generated-from-title"
                className="input"
                style={{ width: '100%', fontSize: 13, fontFamily: 'monospace', borderRadius: 8, padding: '8px 12px' }}
              />
            </div>
          </div>

          {/* Cover Image Uploader */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
              Featured Cover Image
            </label>

            {coverImage ? (
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(15,23,42,0.75)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <label style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 14,
                  padding: '36px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#f8fafc',
                  transition: 'border-color 0.2s',
                }}>
                  <UploadCloud size={36} color="#64748b" style={{ marginBottom: 10 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                    {uploadingCover ? 'Uploading Cover Image...' : 'Click or Drag & Drop Cover Image'}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    Supports PNG, JPG, JPEG, WEBP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingCover}
                  />
                </label>

                {/* Direct Image URL fallback */}
                <div style={{ marginTop: 12 }}>
                  <input
                    type="text"
                    placeholder="Or enter direct image URL (e.g. https://images.unsplash.com/...)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="input"
                    style={{ width: '100%', fontSize: 12, borderRadius: 8 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Short Excerpt */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                Summary / Excerpt
              </label>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {excerpt.length} / 250 characters
              </span>
            </div>
            <textarea
              placeholder="A captivating 1-2 sentence overview shown on blog cards and search engines..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="input"
              rows={3}
              style={{ width: '100%', borderRadius: 10, fontSize: 14, resize: 'vertical' }}
            />
          </div>

          {/* Trix-style Rich Text Editor */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                Article Content <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Highlight text to add links or headings
              </span>
            </div>

            <RichTextEditor
              value={content}
              onChange={setContent}
              onUploadImage={handleInlineImageUpload}
              placeholder="Start drafting your article... Use the toolbar above to insert headers, internal links for SEO, and quotes."
            />
          </div>
        </div>

        {/* Right Column: Publishing & SEO Suite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Publishing Settings */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 22,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
              Publishing Settings
            </h3>

            {/* Published Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 12,
              background: isPublished ? '#f0fdf4' : '#fef3c7',
              border: `1px solid ${isPublished ? '#bbf7d0' : '#fde68a'}`,
              marginBottom: 16,
            }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, color: isPublished ? '#15803d' : '#b45309', display: 'block' }}>
                  {isPublished ? 'Status: Published' : 'Status: Draft'}
                </span>
                <span style={{ fontSize: 12, color: isPublished ? '#166534' : '#92400e' }}>
                  {isPublished ? 'Visible to public & search engines' : 'Hidden from public'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
                style={{ width: '100%', borderRadius: 10, fontSize: 13 }}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Custom Category...</option>
              </select>

              {category === '__custom__' && (
                <input
                  type="text"
                  placeholder="Enter custom category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="input"
                  style={{ width: '100%', marginTop: 8, borderRadius: 8, fontSize: 13 }}
                />
              )}
            </div>

            {/* Author */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Author Byline
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Solitaire Editorial Team"
                className="input"
                style={{ width: '100%', borderRadius: 10, fontSize: 13 }}
              />
            </div>
          </div>

          {/* SEO & Metadata Suite */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 22,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles size={18} color="#2563eb" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                Search Engine Optimization
              </h3>
            </div>

            {/* Meta Title */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                  Meta Title
                </label>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: (metaTitle || title).length > 60 ? '#ef4444' : '#16a34a',
                }}>
                  {(metaTitle || title).length} / 60
                </span>
              </div>
              <input
                type="text"
                placeholder={title || 'Leave blank to use article title'}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="input"
                style={{ width: '100%', borderRadius: 10, fontSize: 13 }}
              />
            </div>

            {/* Meta Description */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                  Meta Description
                </label>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: (metaDescription || excerpt).length > 160 ? '#ef4444' : '#16a34a',
                }}>
                  {(metaDescription || excerpt).length} / 160
                </span>
              </div>
              <textarea
                rows={3}
                placeholder={excerpt || 'Leave blank to use excerpt'}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="input"
                style={{ width: '100%', borderRadius: 10, fontSize: 13, resize: 'vertical' }}
              />
            </div>

            {/* Keywords */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Keywords (Comma separated)
              </label>
              <input
                type="text"
                placeholder="luxury jobs, butler dubai, private staffing"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="input"
                style={{ width: '100%', borderRadius: 10, fontSize: 13 }}
              />
            </div>

            {/* Canonical URL */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Canonical URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://solitairehr.com/blogs/..."
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="input"
                style={{ width: '100%', borderRadius: 10, fontSize: 13 }}
              />
            </div>

            {/* Google SERP Preview Box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 14,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>
                Google Search Result Preview
              </span>

              <div style={{ fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9 }}>
                    S
                  </div>
                  <div style={{ fontSize: 12, color: '#202124', lineHeight: 1.2 }}>
                    <span>solitairehr.com</span>
                    <span style={{ color: '#5f6368' }}> › blogs › {effectiveSlug}</span>
                  </div>
                </div>

                <div style={{ fontSize: 16, color: '#1a0dab', fontWeight: 500, lineHeight: 1.3, marginBottom: 4, cursor: 'pointer' }}>
                  {currentMetaTitle}
                </div>

                <div style={{ fontSize: 13, color: '#4d5156', lineHeight: 1.4 }}>
                  {currentMetaDesc.length > 155 ? currentMetaDesc.slice(0, 155) + '...' : currentMetaDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
