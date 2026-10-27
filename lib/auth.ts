import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  adminId: string;
  email: string;
}

export function verifyAdminToken(token: string): AuthPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[auth] JWT_SECRET is not configured');
    return null;
  }
  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export function getAdminFromRequest(request: Request): AuthPayload | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  return verifyAdminToken(token);
}

export function requireAdmin(request: Request): { admin: AuthPayload; error: null } | { admin: null; error: NextResponse } {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      admin: null,
      error: NextResponse.json({ success: false, error: 'Missing or invalid Authorization header' }, { status: 401 }),
    };
  }

  const token = authHeader.slice(7);
  const payload = verifyAdminToken(token);
  if (!payload) {
    return {
      admin: null,
      error: NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 }),
    };
  }

  return { admin: payload, error: null };
}
