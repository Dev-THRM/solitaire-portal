import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  applyForJob,
  listApplications,
  getApplication,
  updateStatus,
} from '../controllers/applications.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 applications per IP per hour
  message: { success: false, error: 'Too many applications, please try again later' },
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC/DOCX are allowed.'));
    }
  }
});

const router = Router();

const ApplicationSchema = z.object({
  jobId: z.string().cuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      const clean = val.replace(/[\s\-\(\)]/g, '');
      if (clean.startsWith('+91')) {
        return /^\d{10}$/.test(clean.slice(3));
      }
      if (clean.startsWith('+971')) {
        return /^\d{9}$/.test(clean.slice(4));
      }
      const digits = clean.replace(/\D/g, '');
      return digits.length === 10 || digits.length === 9;
    },
    { message: 'Phone must be exactly 10 digits for India or 9 digits for Dubai' }
  ),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  noticePeriod: z.string().optional(),
  coverLetter: z.string().optional(),
  // resumeUrl is no longer in body; it comes from req.file
});

const StatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'CATEGORIZED', 'ACCEPTED', 'SWITCHED', 'ON_HOLD', 'REJECTED']),
  jobId: z.string().cuid().optional(),
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/', applyLimiter, upload.single('resumeFile'), validate(ApplicationSchema), applyForJob);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin', authenticate, listApplications);
router.get('/admin/:id', authenticate, getApplication);
router.patch('/admin/:id/status', authenticate, validate(StatusSchema), updateStatus);

export default router;
