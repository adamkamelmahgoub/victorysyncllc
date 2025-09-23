
import { Router } from 'express';

export const plansRouter = Router();

// GET /api/plans - list available plans
plansRouter.get('/', async (req, res) => {
  res.json({
    plans: [
      { id: 'starter', name: 'Starter', price: 999 },
      { id: 'growth', name: 'Growth', price: 2999 },
      { id: 'scale', name: 'Scale', price: 4999 }
    ]
  });
});
