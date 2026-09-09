// ── Client-side session helpers (localStorage-based JWT) ──────────────────

const TOKEN_KEY = 'jp_admin_token';
const ADMIN_KEY = 'jp_admin_info';

export type AdminInfo = { id: string; name: string; email: string };

export function saveSession(token: string, admin: AdminInfo) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminInfo(): AdminInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminInfo;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
