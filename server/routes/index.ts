
// server/routes/index.ts
import { Router } from 'express';

// Import existing sub-routers
import { authRouter } from './auth';
import billingRouter from './billing';

const routes = Router();

// Mount all API routes here
routes.use('/auth', authRouter);
routes.use('/billing', billingRouter);

export default routes;
