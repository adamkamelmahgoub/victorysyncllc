import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import passport from "./auth/passport";
import { initializeAdminUser } from './initAdmin';
import { initializeTestCustomer } from './initCustomer';
import { loginAdmin, getCurrentAdmin, authenticateAdminJWT } from './adminAuth';
import { generateJWT } from './publicAuth';
import { storage } from './storage';

// Validate required environment variables at startup
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log(`✅ All required environment variables are set`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log(`🚀 Starting VictorySync application...`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Validate environment variables
    validateEnvironment();

    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed - cannot start server');
    }

    const server = await registerRoutes(app);
    console.log(`✅ Routes registered successfully`);

    // Admin routes
    app.post('/api/admin/auth/login', loginAdmin);
    app.get('/api/admin/auth/me', authenticateAdminJWT, getCurrentAdmin);

    // Admin API routes (all require admin authentication)
    app.get('/api/admin/users', authenticateAdminJWT, async (req, res) => {
      try {
        const users = await storage.getAllPublicUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    });

    app.get('/api/admin/orders', authenticateAdminJWT, async (req, res) => {
      try {
        const orders = await storage.getAllOrders();
        res.json(orders);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
      }
    });

    app.get('/api/admin/crm/integrations', authenticateAdminJWT, async (req, res) => {
      try {
        const integrations = await storage.getAllCrmIntegrations();
        res.json(integrations);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch integrations' });
      }
    });

    app.get('/api/admin/support/tickets', authenticateAdminJWT, async (req, res) => {
      try {
        const tickets = await storage.getAllSupportTickets();
        res.json(tickets);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch support tickets' });
      }
    });

    app.get('/api/admin/audit-logs', authenticateAdminJWT, async (req, res) => {
      try {
        const logs = await storage.getAuditLogs();
        res.json(logs);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
      }
    });

    app.patch('/api/admin/users/:id', authenticateAdminJWT, async (req, res) => {
      try {
        const userId = parseInt(req.params.id);
        const updates = req.body;

        if (updates.isActive !== undefined) {
          const user = await storage.updateUserStatus(userId, updates.isActive);
          res.json(user);
        } else {
          res.status(400).json({ error: 'Invalid update parameters' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
      }
    });

    app.post('/api/admin/users/:id/impersonate', authenticateAdminJWT, async (req, res) => {
      try {
        const userId = parseInt(req.params.id);
        const user = await storage.getPublicUserById(userId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const token = generateJWT(user);
        res.json({ token });
      } catch (error) {
        res.status(500).json({ error: 'Failed to impersonate user' });
      }
    });

    // Customer API endpoints
    app.get('/api/user/orders', async (req, res) => {
      try {
        const orders = await storage.getUserOrders(1); // For demo purposes
        res.json(orders);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
      }
    });

    app.get('/api/crm/integrations', async (req, res) => {
      try {
        const integrations = await storage.getUserCrmIntegrations(1); // For demo purposes
        res.json(integrations);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch integrations' });
      }
    });

    app.get('/api/support/tickets', async (req, res) => {
      try {
        const tickets = await storage.getUserSupportTickets(1); // For demo purposes
        res.json(tickets);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
      }
    });

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`❌ Application error: ${message}`, err);
      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
      console.log(`✅ Vite development server setup complete`);
    } else {
      try {
        serveStatic(app);
        console.log(`✅ Static file serving setup complete`);
      } catch (error) {
        console.error(`❌ Failed to setup static file serving:`, error);
        console.log(`This might happen if the build files are missing.`);
        console.log(`In production, ensure you run 'npm run build' before starting the server.`);
        throw error;
      }
    }

// ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = process.env.PORT || 5000;
    server.listen({
      port: Number(port),
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      console.log(`🎉 VictorySync server is running successfully!`);
      log(`serving on port ${port}`);
      console.log(`Health check available at: http://0.0.0.0:${port}/health`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    // Initialize admin user
    await initializeAdminUser();

    // Initialize test customer
    await initializeTestCustomer();

  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
})();