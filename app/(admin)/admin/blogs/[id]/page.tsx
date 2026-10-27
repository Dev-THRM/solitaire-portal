'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getToken } from '../../../../_lib/auth';
import { adminGetBlog, type BlogPost } from '../../../../_lib/api';
import BlogForm from '../../../../_components/BlogForm';
import { AlertCircle } from 'lucide-react';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!id) return;

    adminGetBlog(token, id)
      .then((res) => {
        if (res.data) {
          setBlog(res.data);
        } else {
          setError('Article not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load article');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, router]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--color-text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        Loading article details...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{
        maxWidth: 600,
        margin: '60px auto',
        padding: 32,
        background: 'white',
        borderRadius: 20,
        textAlign: 'center',
        border: '1px solid var(--color-border)',
      }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{error || 'Article not found'}</h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: '8px 0 24px' }}>
          The requested article could not be loaded or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
          className="btn btn-primary"
          style={{ borderRadius: 10, padding: '10px 20px' }}
        >
          Back to Blog Management
        </button>
      </div>
    );
  }

  return <BlogForm initialData={blog} isEdit={true} />;
}
