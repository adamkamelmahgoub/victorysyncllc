
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import passport from "./auth/passport";
import { db } from "./db";
import { packages } from "../shared/schema";
import ivrRouter from "./routes/ivr";
import inboundEmailRouter from "./routes/inbound-email";
import hubspotWebhook from "./webhooks/hubspot";
import { startReportJobs } from "./jobs/reports";

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

// Initialize app async
export async function initializeApp() {
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

    // Start report generation jobs
    startReportJobs();

    // Setup Vite in development or static files in production
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

    // Add health check
    app.get("/health", (_req, res) => res.json({ ok: true }));

    return server;
  } catch (error) {
    console.error(`❌ Failed to initialize app:`, error);
    throw error;
  }
}

export default app;
