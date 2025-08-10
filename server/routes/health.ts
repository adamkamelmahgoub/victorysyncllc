import express from 'express';
import { healthCheck } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const health = await healthCheck();
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      ...health
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      ok: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

export { router };