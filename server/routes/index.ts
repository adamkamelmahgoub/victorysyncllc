
import type { Express } from 'express';
import auth from './auth';
import billing from './billing';
import integrations from './integrations';
import admin from './admin';
import orders from './orders';
import webhooks from './webhooks';
import apikeys from './apikeys';
import access from './access';
import kpi from './kpi';
import exports from './exports';

export function registerRoutes(app: Express) {
  app.use('/api/auth', auth);
  app.use('/api/billing', billing);
  app.use('/api/integrations', integrations);
  app.use('/api/admin', admin);
  app.use('/api/orders', orders);
  app.use('/api/webhooks', webhooks);
  app.use('/api/apikeys', apikeys);
  app.use('/api/access', access);
  app.use('/api/kpi', kpi);
  app.use('/api/exports', exports);

  // health check
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
}
