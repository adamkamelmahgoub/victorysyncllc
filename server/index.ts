import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import passport from "./auth/passport";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { setupAuth, authMiddleware } from "./auth/publicAuth";
import { db } from "./db";
import { kpiStore } from "./kpiStore";
import { promises as fs } from "fs";

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
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());

// Simplified request logging for development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        if (duration > 100) { // Only log slow requests
          console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
        }
      });
    }
    next();
  });
}

(async () => {
  try {
    console.log(`🚀 Starting VictorySync...`);

    // Validate environment variables first
    validateEnvironment();

    // Register routes without blocking on database test
    const server = await registerRoutes(app);

    // Test database in background
    setImmediate(async () => {
      try {
        await testDatabaseConnection();
      } catch (error) {
        console.error("Database connection test failed:", error);
      }
    });

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`❌ ${message}`);
      res.status(status).json({ message });
    });

    // Setup vite/static serving
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      try {
        serveStatic(app);
      } catch (error) {
        console.error(`❌ Static files missing - run 'npm run build'`);
        throw error;
      }
    }

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'development' ? "http://localhost:5173" : false,
        methods: ["GET", "POST"]
      }
    });

    // Setup Socket.IO with JWT authentication
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      // In a real app, you'd verify the JWT token here
      // For now, we'll just check if token exists
      next();
    });

    io.on('connection', (socket) => {
      console.log('📱 Client connected to KPI updates');
      
      socket.on('disconnect', () => {
        console.log('📱 Client disconnected from KPI updates');
      });
    });

    // Setup KPI store subscription for real-time updates
    kpiStore.subscribe((metrics) => {
      io.emit('kpi:update', metrics);
    });

    const port = process.env.PORT || 5000;
    httpServer.listen({
      port: Number(port),
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      console.log(`🎉 VictorySync ready on port ${port}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
})();