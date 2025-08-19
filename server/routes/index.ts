
import { Router } from 'express';

// Import route modules as default Router exports
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import accessRoutes from './access.js';
import billingRoutes from './billing.js';
import ordersRoutes from './orders.js';
import exportsRoutes from './exports.js';
import webhooksRoutes from './webhooks.js';

const router = Router();

/**
 * Assert the import is a valid Express Router (functions in Express are Routers).
 * This prevents "Router.use() requires a middleware function but got undefined".
 */
function asRouter(name: string, mod: any): Router {
  const candidate = (mod && (mod.default ?? mod)) as unknown;
  if (typeof candidate !== 'function') {
    throw new TypeError(
      `Route module "${name}" must export a default Express.Router(), got ${typeof candidate}`
    );
  }
  return candidate as Router;
}

// Mount all route modules with safety checks
router.use('/auth', asRouter('auth', authRoutes));
router.use('/admin', asRouter('admin', adminRoutes));
router.use('/access', asRouter('access', accessRoutes));
router.use('/billing', asRouter('billing', billingRoutes));
router.use('/orders', asRouter('orders', ordersRoutes));
router.use('/exports', asRouter('exports', exportsRoutes));
router.use('/webhooks', asRouter('webhooks', webhooksRoutes));

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
