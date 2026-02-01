import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { list, getById, create, update, remove } from '../controllers/categoryController.js';

const router = Router();

router.get('/', list);
router.get('/:id', param('id').isMongoId(), getById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/),
    body('description').optional().trim(),
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
    body('slug').optional().trim().notEmpty(),
    body('description').optional().trim(),
  ],
  update
);

router.delete('/:id', authenticate, requireAdmin, param('id').isMongoId(), remove);

export default router;
