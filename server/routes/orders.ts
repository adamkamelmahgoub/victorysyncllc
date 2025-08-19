
import { Router } from 'express';
import { requireAuth } from '../services/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  // Get orders
  res.json({ orders: [] });
});

router.post('/', (req, res) => {
  // Create order
  res.json({ message: 'Create order endpoint' });
});

router.get('/:id', (req, res) => {
  // Get specific order
  res.json({ order: null });
});

export default router;
