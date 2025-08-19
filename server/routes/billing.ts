
import { Router } from 'express';
import { requireAuth } from '../services/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/subscription', (req, res) => {
  // Get subscription info
  res.json({ subscription: null });
});

router.post('/subscribe', (req, res) => {
  // Create subscription
  res.json({ message: 'Subscribe endpoint' });
});

router.get('/invoices', (req, res) => {
  // Get invoices
  res.json({ invoices: [] });
});

export default router;
