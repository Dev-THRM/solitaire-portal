import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  listBlogs,
  getBlogBySlug,
  listAllBlogsAdmin,
  getBlogByIdAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
} from '../controllers/blogs.controller';

const router = Router();

// ── Multer setup for blog images ──────────────────────────────────────────────
const blogUploadDir = path.join(__dirname, '../../uploads/blogs');
if (!fs.existsSync(blogUploadDir)) {
  fs.mkdirSync(blogUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, blogUploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `blog-${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Allowed: JPG, PNG, WEBP, GIF, SVG'));
    }
  },
});

// ── Zod Schemas ───────────────────────────────────────────────────────────────
const CreateBlogSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(5),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  readTime: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  keywords: z.string().optional(),
  isPublished: z.boolean().optional(),
});

const UpdateBlogSchema = CreateBlogSchema.partial();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', listBlogs);
router.get('/:slug', getBlogBySlug);

// ── Admin Routes (Protected) ──────────────────────────────────────────────────
router.get('/admin/all', authenticate, listAllBlogsAdmin);
router.get('/admin/:id', authenticate, getBlogByIdAdmin);
router.post('/admin', authenticate, validate(CreateBlogSchema), createBlog);
router.put('/admin/:id', authenticate, validate(UpdateBlogSchema), updateBlog);
router.delete('/admin/:id', authenticate, deleteBlog);
router.post('/admin/upload-image', authenticate, upload.single('image'), uploadBlogImage);

export default router;
