import 'dotenv/config';
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { log } from "./vite.js";
import { setupVite } from "./vite.js";
import routes from './routes/index.js';
import { ENV } from "./lib/env.js";
import { getQueue, startWorker } from "./lib/queue.js";
import { seedOnce } from "./db/seed.js";

// ESM-safe __dirname shim for Node 20
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------- ENV ----------
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isProd = NODE_ENV === 'production';

// ---------- CORE MIDDLEWARE (NO UNDEFINED PASSED) ----------
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (adjust origins as needed; leaving permissive for now)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Helmet (safe defaults)
app.use(
  helmet({
    crossOriginResourcePolicy: false, // allows static assets if needed
  })
);

// Compression
app.use(compression());

// Logging — guard explicitly so we never pass undefined
if (isProd) {
  app.use(morgan('tiny'));
} else {
  app.use(morgan('dev'));
}

// ---------- API ROUTES ----------
app.use('/api', routes);

// ---------- STATIC + SPA FALLBACK ----------
const distDir = path.resolve(__dirname, '../client/dist');
app.use(express.static(distDir));

// Health checks
app.get('/healthz', (_req, res) => res.json({ ok: true, env: NODE_ENV }));

// Send index.html for any non-API route (SPA fallback)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distDir, 'index.html'));
});

const isProduction = NODE_ENV === "production";

// Initialize database and worker
(async () => {
  try {
    log('🔗 Connecting to database...');

    if (!isProduction) {
      await seedOnce();
    }

    // Initialize BullMQ worker
    const queue = getQueue('sync');
    startWorker('sync');

    // Set up Vite in development
    if (!isProduction) {
      await setupVite(app);
    }

    const PORT = ENV.PORT;
    const server = app.listen(PORT, '0.0.0.0', () => {
      const env = isProduction ? 'production' : 'development';
      log(`Server running on port ${PORT} in ${env} mode`);
    });

    process.on('SIGINT', () => {
      log('Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

export default app;