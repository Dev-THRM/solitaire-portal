import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: auth.admin.adminId },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (err) {
    console.error('[auth/me] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}
