import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  list,
  getById,
  create,
  update,
  updateStock,
  addTag,
  removeTag,
  remove,
  stats,
} from '../controllers/productController.js';

const router = Router();

router.get('/', list);
router.get('/stats', authenticate, requireAdmin, stats);
router.get('/:id', param('id').isMongoId(), getById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('description').optional().trim(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
    body('category').isMongoId(),
    body('images').optional().isArray(),
    body('isActive').optional().isBoolean(),
  ],
  create
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').isMongoId(),
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('category').optional().isMongoId(),
    body('images').optional().isArray(),
    body('isActive').optional().isBoolean(),
  ],
  update
);

router.patch(
  '/:id/stock',
  authenticate,
  requireAdmin,
  param('id').isMongoId(),
  body('amount').isInt(),
  updateStock
);

router.patch(
  '/:id/tags/add',
  authenticate,
  requireAdmin,
  param('id').isMongoId(),
  body('tag').trim().notEmpty(),
  addTag
);

router.patch(
  '/:id/tags/remove',
  authenticate,
  requireAdmin,
  param('id').isMongoId(),
  body('tag').trim().notEmpty(),
  removeTag
);

router.delete('/:id', authenticate, requireAdmin, param('id').isMongoId(), remove);

export default router;
