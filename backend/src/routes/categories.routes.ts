import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  listCategories,
  createCategory,
  updateCategory,
  deactivateCategory,
} from '../controllers/categories.controller';

const router = Router();

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().min(1),
});

const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

router.use(authenticate);

router.get('/', listCategories);
router.post('/', validate(CreateCategorySchema), createCategory);
router.put('/:id', validate(UpdateCategorySchema), updateCategory);
router.delete('/:id', deactivateCategory);

export default router;
