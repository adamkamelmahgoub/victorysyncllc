
import { Router } from 'express';

import { authRouter } from './auth';
import { billingRouter } from './billing';
import { plansRouter } from './plans';
import { sessionRouter } from './session';

const routes = Router();

// Mount sub-routers
routes.use('/auth', authRouter);
routes.use('/billing', billingRouter);
routes.use('/plans', plansRouter);
routes.use('/session', sessionRouter);

// Add future mounts here (keep this file the single place that aggregates API routes)

export default routes; // <-- default export required by server/index.ts
