
import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

export default router;
