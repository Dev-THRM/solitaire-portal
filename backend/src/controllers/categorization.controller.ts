import { Request, Response } from 'express';
import prisma from '../config/db';
import { categorizeResume } from '../services/categorization.service';

const CONFIDENCE_THRESHOLD = parseFloat(
  process.env.CATEGORIZATION_CONFIDENCE_THRESHOLD ?? '0.65',
);

// ── GET /api/admin/applications/:id/resume ────────────────────────────────────
export async function getResumeStatus(req: Request, res: Response): Promise<void> {
  const applicationId = req.params['id'] as string;
  try {
    const resume = await prisma.resume.findUnique({
      where: { applicationId },
      select: {
        id: true,
        extractionStatus: true,
        extractionError: true,
        categorizationStatus: true,
        categorizationError: true,
        categorizedAt: true,
        parsedSections: true,
      },
    });
    res.json({ success: true, data: resume ?? null });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch resume status' });
  }
}

// ── GET /api/admin/applications/:id/categories ────────────────────────────────
export async function getApplicationCategories(req: Request, res: Response): Promise<void> {
  const applicationId = req.params['id'] as string;
  try {
    const resume = await prisma.resume.findUnique({
      where: { applicationId },
      select: { id: true },
    });

    if (!resume) {
      res.json({ success: true, data: [] });
      return;
    }

    const assignments = await prisma.candidateCategory.findMany({
      where: { resumeId: resume.id, isActive: true },
      include: { category: { select: { id: true, name: true, description: true } } },
      orderBy: { confidence: 'desc' },
    });

    res.json({ success: true, data: assignments });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
}

// ── POST /api/admin/applications/:id/categorize ───────────────────────────────
export async function triggerCategorization(req: Request, res: Response): Promise<void> {
  const applicationId = req.params['id'] as string;
  try {
    const resume = await prisma.resume.findUnique({
      where: { applicationId },
      select: { id: true, extractionStatus: true },
    });

    if (!resume) {
      res.status(404).json({ success: false, error: 'No resume found for this application. The resume may still be processing.' });
      return;
    }

    if (resume.extractionStatus !== 'DONE') {
      res.status(400).json({ success: false, error: 'Resume text extraction has not completed yet.' });
      return;
    }

    categorizeResume(resume.id).catch((err) =>
      console.error('[categorization] Triggered re-run error:', err),
    );

    res.json({ success: true, message: 'Categorization started. Check back in a few seconds.' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to trigger categorization' });
  }
}

// ── POST /api/admin/applications/:id/categories ───────────────────────────────
export async function addManualCategory(req: Request, res: Response): Promise<void> {
  const applicationId = req.params['id'] as string;
  try {
    const { categoryId, confidence, evidence } = req.body as {
      categoryId: string;
      confidence?: number;
      evidence?: string;
    };

    const resume = await prisma.resume.findUnique({
      where: { applicationId },
      select: { id: true },
    });

    if (!resume) {
      res.status(404).json({ success: false, error: 'No resume found for this application' });
      return;
    }

    const assignment = await prisma.candidateCategory.upsert({
      where: { resumeId_categoryId: { resumeId: resume.id, categoryId } },
      create: {
        resumeId: resume.id,
        categoryId,
        confidence: confidence ?? 1.0,
        evidence: evidence ?? 'Manually assigned by admin',
        source: 'MANUAL',
        isActive: true,
      },
      update: {
        confidence: confidence ?? 1.0,
        evidence: evidence ?? 'Manually assigned by admin',
        source: 'MANUAL',
        isActive: true,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (err: any) {
    if (err?.code === 'P2003') {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to add category' });
  }
}

// ── DELETE /api/admin/applications/:id/categories/:categoryId ─────────────────
export async function removeCategory(req: Request, res: Response): Promise<void> {
  const applicationId = req.params['id'] as string;
  const categoryId = req.params['categoryId'] as string;
  try {
    const resume = await prisma.resume.findUnique({
      where: { applicationId },
      select: { id: true },
    });

    if (!resume) {
      res.status(404).json({ success: false, error: 'No resume found for this application' });
      return;
    }

    await prisma.candidateCategory.updateMany({
      where: { resumeId: resume.id, categoryId },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Category removed' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to remove category' });
  }
}

// ── GET /api/admin/applications/:id/alternate-suggestions ────────────────────
export async function getAlternateSuggestions(req: Request, res: Response): Promise<void> {
  const applicationId = req.params['id'] as string;
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true } },
        resume: {
          select: {
            id: true,
            candidateCategories: {
              where: { isActive: true, confidence: { gte: CONFIDENCE_THRESHOLD } },
              include: { category: { select: { id: true, name: true, description: true } } },
              orderBy: { confidence: 'desc' },
            },
          },
        },
      },
    });

    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    const suggestions = application.resume?.candidateCategories ?? [];

    res.json({
      success: true,
      data: {
        appliedJobTitle: application.job.title,
        threshold: CONFIDENCE_THRESHOLD,
        suggestions,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch alternate suggestions' });
  }
}
