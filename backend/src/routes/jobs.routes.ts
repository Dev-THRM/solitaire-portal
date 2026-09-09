import { Router } from 'express';
import { listJobs, getJob } from '../controllers/jobs.controller';
import { listAllJobs, createJob, updateJob, deleteJob } from '../controllers/jobs.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const JobSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']),
  salary: z.string().optional(),
  description: z.string().min(10),
  requirements: z.string().min(10),
  benefits: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', listJobs);
router.get('/:id', getJob);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin/all', authenticate, listAllJobs);
router.post('/admin', authenticate, validate(JobSchema), createJob);
router.put('/admin/:id', authenticate, validate(JobSchema.partial()), updateJob);
router.delete('/admin/:id', authenticate, deleteJob);

export default router;
