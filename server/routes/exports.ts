
import { Router } from 'express';

const router = Router();

router.get('/data', (req, res) => {
  // Export data functionality
  res.json({ exports: [] });
});

export default router;
