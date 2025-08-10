
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Integrations routes coming soon' });
});

export default router;
