import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/applications/with-categories
 *
 * Returns all applications with their active category assignments.
 * Used to build the category filter on the admin Applications page.
 */
export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId') || undefined;

    const applications = await prisma.application.findMany({
      where: jobId ? { jobId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        job: { select: { title: true, location: true } },
        resume: {
          select: {
            candidateCategories: {
              where: { isActive: true },
              select: {
                categoryId: true,
                confidence: true,
                source: true,
                category: { select: { id: true, name: true } },
              },
              orderBy: { confidence: 'desc' },
            },
          },
        },
      },
    });

    const data = applications.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      categories: a.resume?.candidateCategories ?? [],
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[admin/applications/with-categories/GET] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 },
    );
  }
}

