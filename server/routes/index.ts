
import { Router } from 'express';
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import accessRoutes from './access.js';
import billingRoutes from './billing.js';
import ordersRoutes from './orders.js';
import exportsRoutes from './exports.js';
import webhooksRoutes from './webhooks.js';

const router = Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/access', accessRoutes);
router.use('/billing', billingRoutes);
router.use('/orders', ordersRoutes);
router.use('/exports', exportsRoutes);
router.use('/webhooks', webhooksRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
