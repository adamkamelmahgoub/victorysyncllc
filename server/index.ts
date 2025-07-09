import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import { initializeAdminUser } from "./initAdmin";
import { initializeTestCustomer } from "./initCustomer";

function validateEnvironment() {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
}

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0';
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

    // Initialize admin user
    console.log('🔐 Initializing admin user...');
    await initializeAdminUser();

    // Initialize test customer
    console.log('👤 Initializing test customer...');
    await initializeTestCustomer();

    const server = await registerRoutes(app);
    console.log(`✅ Routes registered successfully`);

    // Graceful shutdown
    const shutdown = () => {
      console.log('\n🛑 Received shutdown signal, gracefully shutting down...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    console.log(`🎉 VictorySync server is running successfully!`);

    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 Local server: http://localhost:${process.env.PORT || 5000}`);
      console.log(`🔐 Admin login: username=kimo8723, password=Mshmsh7184365700!`);
      console.log(`👤 Test customer: email=test@customer.com, password=testpass123`);
    }

  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
})();

// Start server
app.listen(port, host, () => {
  console.log(`🎉 VictorySync server is running successfully!`);
  console.log(`🌐 Server running on: http://${host}:${port}`);
  console.log(`🔐 Admin login: username=kimo8723, password=Mshmsh7184365700!`);
  console.log(`👤 Test customer: email=test@customer.com, password=testpass123`);
});