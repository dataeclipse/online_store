import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  list,
  getById,
  create,
  updateStatus,
  remove,
} from '../controllers/orderController.js';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.get('/:id', param('id').isMongoId(), getById);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('shippingAddress').optional().isObject(),
  ],
  create
);

router.put(
  '/:id/status',
  requireAdmin,
  param('id').isMongoId(),
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  updateStatus
);

router.delete('/:id', requireAdmin, param('id').isMongoId(), remove);

export default router;
