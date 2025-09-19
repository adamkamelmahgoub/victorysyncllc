import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import passport from "./auth/passport";
import { publicProcedure, router } from "./trpc";
import { logMessage, openaiChatCompletion, getEmbeddings } from "./lib";
import { z } from "zod";
import type { Request, Response } from "express";
import { db } from "./db";
import {
  users,
  contactSubmissions,
  servicePlans,
  purchaseOrders,
  orderItems,
  organizations,
  entitlements,
} from "@shared/schema";
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

    // Create a tRPC router
    const appRouter = router({
      // Add your tRPC procedures here
      logMessage: publicProcedure.input(z.string()).mutation(logMessage),
      openaiChatCompletion: publicProcedure
        .input(
          z.object({
            model: z.string(),
            messages: z.array(
              z.object({ role: z.enum(["user", "system", "assistant"]), content: z.string() })
            ),
          })
        )
        .mutation(openaiChatCompletion),
      getEmbeddings: publicProcedure
        .input(z.string())
        .mutation(getEmbeddings),
      // Example of adding a tRPC route to interact with the database
      getUsers: publicProcedure.query(async () => {
        return await db.select().from(users);
      }),
      createContactSubmission: publicProcedure
        .input(
          z.object({
            name: z.string(),
            email: z.string().email(),
            message: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          await db.insert(contactSubmissions).values(input);
          return { success: true };
        }),
      getServicePlans: publicProcedure.query(async () => {
        return await db.select().from(servicePlans);
      }),
      getPurchaseOrders: publicProcedure.query(async () => {
        return await db.select().from(purchaseOrders);
      }),
      getOrderItems: publicProcedure.query(async () => {
        return await db.select().from(orderItems);
      }),
      getOrganizations: publicProcedure.query(async () => {
        return await db.select().from(organizations);
      }),
      getEntitlements: publicProcedure.query(async () => {
        return await db.select().from(entitlements);
      }),
    });

    // Use the tRPC Express middleware to handle requests
    app.use("/api", createExpressMiddleware({ router: appRouter, req, res }));

    // Wire up production routes
    app.use("/ivr", ivrRouter);
    app.use("/webhooks", hubspotWebhook);
    app.use("/webhooks", inboundEmailRouter);

    // Start report generation jobs
    startReportJobs();

    if (NODE_ENV === "development") {
      setupVite(app, server);
    } else {
      app.use(express.static("client/dist"));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(path.join(__dirname, "../client/dist", "index.html")));
      });
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

  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
})();