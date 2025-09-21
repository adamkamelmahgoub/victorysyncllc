// Optional .env loader: works locally if installed, no-op on Replit
try {
  await import('dotenv/config');
} catch {
  // dotenv not installed (expected on Replit) — environment comes from Replit Secrets
}
import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import passport from "./auth/passport";
import { auth } from "./middleware/auth";
import { authRouter } from "./routes/auth";
import { logMessage, openaiChatCompletion, getEmbeddings } from "./lib";
import { z } from "zod";
import { db } from "./db";
import {
  users,
  contactSubmissions,
  packages,
  orders,
  orderItems,
  organizations,
  entitlements,
} from "../shared/schema";
import ivrRouter from "./routes/ivr";
import inboundEmailRouter from "./routes/inbound-email";
import hubspotWebhook from "./webhooks/hubspot";
import { startReportJobs } from "./jobs/reports";
import { createServer } from "http";
import { billingRouter } from "./routes/billing";
import routes from "./routes/index";

// Validate required environment variables at startup
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Add JWT_SECRET in Replit → Secrets (use a long random string).');
    process.exit(1);
  }

  // Fail-fast JWT secret guard
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET. Add it in Replit → Secrets (use a long random string).");
  }

  console.log(`✅ All required environment variables are set`);
}

// Function to initialize the Express app
async function initializeApp() {
  const app = express();

  // Trust proxy for Replit environment (enables secure cookies behind proxy)
  app.set('trust proxy', 1);

  // CORS configuration for Replit iframe and local dev
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (same-origin requests)
      if (!origin) return callback(null, true);

      // Allowed origins for Replit iframe and local dev
      const allowedOrigins = [
        'https://replit.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      ];

      // Check exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check regex patterns for Replit domains
      const replitPatterns = [
        /^https:\/\/.*\.replit\.dev$/,
        /^https:\/\/.*\.repl\.co$/
      ];

      for (const pattern of replitPatterns) {
        if (pattern.test(origin)) {
          return callback(null, true);
        }
      }

      // Reject unknown origins
      callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    },
    credentials: true, // Enable cookies/credentials in CORS requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Initialize Passport
  app.use(passport.initialize());

  // Auth routes (no global auth middleware here)
  app.use("/api/auth", authRouter);

  // Apply auth middleware only to protected routes
  app.use("/api", auth);

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

    // Initialize default packages if none exist
    console.log(`📦 Initializing default packages...`);
    const existingPackages = await db.query.packages?.findMany() || [];

    if (!existingPackages || existingPackages.length === 0) {
      const defaultPackages = [
        {
          name: 'Basic',
          price: '499.00',
          description: 'Perfect for small businesses getting started',
          features: [
            'Up to 500 calls/month',
            'Email support',
            'Basic reporting',
            'Standard business hours',
            'CRM integration'
          ]
        },
        {
          name: 'Growth',
          price: '1299.00',
          description: 'Ideal for growing companies with higher volumes',
          features: [
            'Up to 2,000 calls/month',
            'Priority support',
            'Advanced reporting',
            'Extended hours (8AM-10PM)',
            'Custom workflows',
            'API access',
            'Dedicated account manager'
          ]
        },
        {
          name: 'Scale',
          price: '2499.00',
          description: 'Enterprise solution for high-volume operations',
          features: [
            'Unlimited calls',
            '24/7 premium support',
            'Real-time analytics',
            '24/7 availability',
            'White-label branding',
            'Custom integrations',
            'Dedicated team',
            'SLA guarantees'
          ]
        }
      ];

      for (const pkg of defaultPackages) {
        await db.insert(packages).values(pkg);
      }
      console.log(`✅ Created ${defaultPackages.length} default packages`);
    } else {
      console.log(`Found ${existingPackages.length} existing packages`);
      console.log(`✅ Packages already exist, skipping initialization`);
    }

    const server = await registerRoutes(app);
    console.log(`✅ Routes registered successfully`);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`❌ Application error: ${message}`, err);
      res.status(status).json({ message });
    });

    // Wire up production routes
    app.use("/ivr", ivrRouter);
    app.use("/webhooks", hubspotWebhook);
    app.use("/webhooks", inboundEmailRouter);
    app.use("/api", routes);

    // Start report generation jobs
    startReportJobs();

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
    return server;

  } catch (error) {
    console.error(`❌ Failed to initialize app:`, error);
    throw error; // Re-throw to be caught by the main server start logic
  }
}

(async () => {
  try {
    const server = await initializeApp();

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const PORT = Number(process.env.PORT) || 5000;
    const BIND = () => {
      server.listen(PORT, '0.0.0.0', () => {
        console.log(`(express) serving on port ${PORT} (pid ${process.pid})`);
      });
    };

    // Guard against double start in the same Node process
    if (!(globalThis as any).__vs_server_started__) {
      (globalThis as any).__vs_server_started__ = true;
      BIND();
    } else {
      console.warn(`[boot] server already started in this process (pid ${process.pid}), skip second listen.`);
    }

    // Helpful diagnostics
    server.on('error', (err: any) => {
      if (err?.code === 'EADDRINUSE') {
        console.error(`[boot] Port ${PORT} is in use. Another process or double-start is binding 5000.`);
        console.error('[hint] Run: pkill -f node || true   then npm run dev');
      }
      throw err;
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

  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
})();