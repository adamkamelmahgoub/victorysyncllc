
import { Router } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import kpiRoutes from './routes/kpi';
import integrationsRoutes from './routes/integrations';
import billingRoutes from './routes/billing';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/kpi', kpiRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/billing', billingRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
