
import { Router } from 'express';
import { authRouter } from './auth';
import { sessionRouter } from './session';
// If you have more routers, import & mount them here too.

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/session', sessionRouter);

// Example future mounts:
// routes.use('/billing', billingRouter);
// routes.use('/plans', plansRouter);

export default routes;
