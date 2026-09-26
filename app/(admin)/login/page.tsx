'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '../../_lib/api';
import { saveSession } from '../../_lib/auth';
import type { Metadata } from 'next';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      const { token, admin } = res.data as any;
      saveSession(token, admin);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-surface-2)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 26 }}>Admin Login</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 6 }}>
            Sign in to manage your job portal
          </p>
        </div>

        <div className="card" style={{ padding: 40, background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          {error && (
            <div style={{
              background: 'hsl(0,84%,95%)',
              color: 'hsl(0,84%,38%)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              marginBottom: 20,
              border: '1px solid hsl(0,84%,85%)',
            }}>
              {error}
            </div>
          )}

          <form id="admin-login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="login-email" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="login-password" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? <><Loader2 className="animate-spin" size={20} style={{ display: 'inline', marginRight: 8 }} /> Signing in...</> : <><LogIn size={20} style={{ display: 'inline', marginRight: 8 }} /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
