import { Express } from 'express';
import { Router } from 'express';
import http from 'http';
import { storage } from './storage';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import kpiRoutes from './routes/kpi';
import integrationsRoutes from './routes/integrations';
import billingRoutes from './routes/billing';

function registerRoutes(app: Express): http.Server {
  const router = Router();

  // Mount route modules
  router.use('/auth', authRoutes);
  router.use('/admin', adminRoutes);
  router.use('/kpi', kpiRoutes);
  router.use('/integrations', integrationsRoutes);
  router.use('/billing', billingRoutes);

  // Health check endpoint
  app.get("/health", async (req, res) => {
    try {
      // Test database connection
      await storage.getPackages();
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
        environment: process.env.NODE_ENV || "development",
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(503).json({
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Frontend routes - ensure all frontend paths serve the React app
  const frontendPaths = [
    '/', '/services', '/pricing', '/about', '/contact', '/checkout',
    '/dashboard', '/customer-dashboard', '/admin', '/login', '/register',
    '/about-us', '/careers', '/blog', '/help-center', '/docs',
    '/privacy-policy', '/terms', '/admin/login'
  ];

  frontendPaths.forEach(path => {
    app.get(path, (req, res, next) => {
      // Let Vite handle these routes in development
      next();
    });
  });

  app.use('/', router); // Mount the main router at the root

  // Create and return HTTP server
  return http.createServer(app);
}

export default registerRoutes;