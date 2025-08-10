
import express from 'express';
import { healthCheck } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const health = await healthCheck();
    const status = health.ok ? 200 : 503;
    
    res.status(status).json({
      ok: health.ok,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      ...health,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      ok: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
