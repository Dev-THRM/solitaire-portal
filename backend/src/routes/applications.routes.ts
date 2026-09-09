import { Router } from 'express';
import {
  applyForJob,
  listApplications,
  getApplication,
  updateStatus,
} from '../controllers/applications.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const ApplicationSchema = z.object({
  jobId: z.string().cuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resumeUrl: z.string().url().optional().or(z.literal('')),
});

const StatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED']),
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/', validate(ApplicationSchema), applyForJob);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin', authenticate, listApplications);
router.get('/admin/:id', authenticate, getApplication);
router.patch('/admin/:id/status', authenticate, validate(StatusSchema), updateStatus);

export default router;
