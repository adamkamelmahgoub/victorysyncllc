
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Billing routes coming soon' });
});

export { router };
