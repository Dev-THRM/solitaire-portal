import { Request, Response } from 'express';
import prisma from '../config/db';

// ── GET /api/admin/categories ─────────────────────────────────────────────────
export async function listCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { candidateCategories: true } },
      },
    });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
}

// ── POST /api/admin/categories ────────────────────────────────────────────────
export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, description } = req.body as { name: string; description: string };
    const category = await prisma.category.create({ data: { name: name.trim(), description: description.trim() } });
    res.status(201).json({ success: true, data: category });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(409).json({ success: false, error: 'A category with that name already exists' });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
}

// ── PUT /api/admin/categories/:id ─────────────────────────────────────────────
export async function updateCategory(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  try {
    const { name, description, isActive } = req.body as {
      name?: string;
      description?: string;
      isActive?: boolean;
    };

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description.trim();
    if (isActive !== undefined) data.isActive = isActive;

    const category = await prisma.category.update({ where: { id }, data });
    res.json({ success: true, data: category });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }
    if (err?.code === 'P2002') {
      res.status(409).json({ success: false, error: 'A category with that name already exists' });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to update category' });
  }
}

// ── DELETE /api/admin/categories/:id ─────────────────────────────────────────
// Soft-delete (set isActive = false) to preserve historical assignments
export async function deactivateCategory(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
    res.json({ success: true, data: category, message: 'Category deactivated' });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to deactivate category' });
  }
}
