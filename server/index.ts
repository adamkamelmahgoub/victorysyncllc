import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import passport from "./auth/passport";
import fs from "fs";

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



    // Mount API routes
    server.use("/api", apiRoutes);

    // ===== ACCESS-CODE SIGNUP API =====
    type AccessCode = { code: string; orgNumber: string; orgName?: string; emailDomain?: string };
    type OtpEntry = { key: string; otp: string; expiresAt: number }; // key = `${code}|${email}`

    const CODES_PATH = path.join(__dirname, "data", "access-codes.json");
    const OTPS_PATH  = path.join(__dirname, "data", "otps.json");

    function readJson<T>(p: string, fallback: T): T {
      try { return JSON.parse(fs.readFileSync(p, "utf8")) as T; }
      catch { return fallback; }
    }
    function writeJson<T>(p: string, data: T) {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, JSON.stringify(data, null, 2));
    }
    function genOtp(len = 6) {
      return Array.from({ length: len }, () => Math.floor(Math.random()*10)).join("");
    }

    // Verify access code + user/org details
    server.post("/api/access/verify", (req, res) => {
      const { accessCode, name, email, phone, orgNumber } = req.body ?? {};
      if (!accessCode || !name || !email || !phone || !orgNumber)
        return res.status(400).json({ ok:false, error:"Missing required fields" });

      const codes = readJson<AccessCode[]>(CODES_PATH, []);
      const found = codes.find(c => c.code === accessCode);
      if (!found) return res.status(404).json({ ok:false, error:"Invalid access code" });

      if (found.orgNumber && String(found.orgNumber) !== String(orgNumber))
        return res.status(400).json({ ok:false, error:"Organization number mismatch" });

      if (found.emailDomain && !String(email).toLowerCase().endsWith(`@${found.emailDomain.toLowerCase()}`))
        return res.status(400).json({ ok:false, error:`Email must end with @${found.emailDomain}` });

      return res.json({ ok:true, orgName: found.orgName ?? null });
    });

    // Send/request OTP
    server.post("/api/access/request-otp", (req, res) => {
      const { accessCode, email, phone } = req.body ?? {};
      if (!accessCode || !email) return res.status(400).json({ ok:false, error:"Missing accessCode or email" });

      const otps = readJson<OtpEntry[]>(OTPS_PATH, []);
      const key = `${accessCode}|${email.toLowerCase()}`;
      const otp = genOtp(6);
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      const idx = otps.findIndex(o => o.key === key);
      if (idx > -1) otps[idx] = { key, otp, expiresAt }; else otps.push({ key, otp, expiresAt });
      writeJson(OTPS_PATH, otps);

      // "Send" OTP — integrate real SMS/Email later. For now, expose in dev only.
      const devOtp = process.env.NODE_ENV !== "production" ? otp : undefined;
      console.log(`[OTP] Sent OTP ${otp} to ${email}${phone ? " / " + phone : ""} for ${accessCode}`);

      return res.json({ ok:true, devOtp });
    });

    // Confirm OTP
    server.post("/api/access/confirm-otp", (req, res) => {
      const { accessCode, email, otp } = req.body ?? {};
      if (!accessCode || !email || !otp) return res.status(400).json({ ok:false, error:"Missing fields" });

      const otps = readJson<OtpEntry[]>(OTPS_PATH, []);
      const key = `${accessCode}|${email.toLowerCase()}`;
      const entry = otps.find(o => o.key === key);
      if (!entry) return res.status(400).json({ ok:false, error:"No OTP pending" });
      if (Date.now() > entry.expiresAt) return res.status(400).json({ ok:false, error:"OTP expired" });
      if (String(entry.otp) !== String(otp)) return res.status(400).json({ ok:false, error:"Invalid OTP" });

      // Remove OTP after success
      writeJson(OTPS_PATH, otps.filter(o => o.key !== key));

      // TODO: Create user in your DB here.
      return res.json({ ok:true });
    });

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