
import { Router } from 'express';

// Import route modules as default Router exports
import auth from './auth.js';
import billing from './billing.js';
import orders from './orders.js';
import webhooks from './webhooks.js';
import access from './access.js';
import exports from './exports.js';

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
router.use('/auth', asRouter('auth', auth));
router.use('/billing', asRouter('billing', billing));
router.use('/orders', asRouter('orders', orders));
router.use('/webhooks', asRouter('webhooks', webhooks));
router.use('/access', asRouter('access', access));
router.use('/exports', asRouter('exports', exports));

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
