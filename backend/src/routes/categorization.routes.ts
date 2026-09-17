import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  getResumeStatus,
  getApplicationCategories,
  triggerCategorization,
  addManualCategory,
  removeCategory,
  getAlternateSuggestions,
} from '../controllers/categorization.controller';

const router = Router();

const AddManualCategorySchema = z.object({
  categoryId: z.string().cuid(),
  confidence: z.number().min(0).max(1).optional(),
  evidence: z.string().min(1).optional(),
});

router.use(authenticate);

// Resume extraction + categorization status
router.get('/:id/resume', getResumeStatus);

// Category assignments
router.get('/:id/categories', getApplicationCategories);
router.post('/:id/categorize', triggerCategorization);
router.post('/:id/categories', validate(AddManualCategorySchema), addManualCategory);
router.delete('/:id/categories/:categoryId', removeCategory);

// Alternate suggestions (for rejected applicants)
router.get('/:id/alternate-suggestions', getAlternateSuggestions);

export default router;
