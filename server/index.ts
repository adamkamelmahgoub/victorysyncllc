import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { dbHealthcheck } from "./db/index.ts";
import passport from "./auth/passport.js";
import { runMigrations } from './migrations.js';
import { runMigrations as runSQLMigrations } from './db/runMigrations.ts';
import { callMetricsService } from "./services/callMetricsService.js";

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

// Initialize call metrics service
// import { callMetricsService } from './services/callMetricsService';

(async () => {
  try {
    console.log(`🚀 Starting VictorySync application...`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Validate environment variables
    validateEnvironment();

    // Test database connection
    console.log('🔗 Connecting to database...');
    await dbHealthcheck();

    console.log('✅ Database connection test successful');

    // Run database migrations
    console.log('🔄 Running database migrations...');
    await runMigrations();
    console.log('✅ Database migrations completed');

    // Run SQL migrations
    console.log('🔄 Running SQL migrations...');
    await runSQLMigrations();
    console.log('✅ SQL migrations completed');

    const server = await registerRoutes(app);
    console.log(`✅ Routes registered successfully`);

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

      // Start call metrics periodic updates
      if (process.env.DIALER_PROVIDER) {
        callMetricsService.startPolling();
        console.log('📊 Call metrics service started');
      }

      return server;
    });

    // Start call metrics polling after server is ready
    // process.nextTick(() => {
    //   if (process.env.DIALER_PROVIDER) {
    //     callMetricsService.startPolling();
    //   }
    // });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      callMetricsService.stopPolling();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      callMetricsService.stopPolling();
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