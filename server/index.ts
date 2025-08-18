import 'dotenv/config';
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import morgan from 'morgan';
import { log } from "./vite.js";
import { setupVite } from "./vite.js";
import routes from "./routes/index.js";
import { ENV } from "./lib/env.js";
import { getQueue, startWorker } from "./lib/queue.js";
import { seedOnce } from "./db/seed.js";
import { migrate } from "./db/migrate.js";
import "./storage.js";
import "./publicAuth.js";

// ESM-safe __dirname shim for Node 20
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";


const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
if (process.env.LOGGER_DISABLED !== '1') {
  app.use(morgan(process.env.LOG_FORMAT || 'tiny'));
}
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use('/api', routes);

const isProd = process.env.NODE_ENV === 'production' || process.env.DEV_STATIC === '1';
const clientDir = path.resolve(__dirname, '../client');
const distDir = path.resolve(clientDir, 'dist');

async function start() {
  // BullMQ worker only if Redis configured
  await startWorker(async (job) => {
    // Route all sync jobs through here
    console.log("[sync] received job:", job);
    // TODO: call your real sync handlers here
  });

  // Seed once on boot (idempotent)
  if (ENV.SEED_ON_BOOT) {
    await seedOnce();
  }

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      root: clientDir,
      server: { middlewareMode: true, hmr: { clientPort: 443 }, host: true, port: 5173, allowedHosts: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      try {
        const url = req.originalUrl;
        let template = await vite.transformIndexHtml(url, await vite.fs.readFile(path.join(clientDir, 'index.html'), 'utf-8'));
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) { vite.ssrFixStacktrace(e as Error); next(e); }
    });
  } else {
    app.use(express.static(distDir, { index: false, maxAge: '1h' }));
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.use((err:any,_req:any,res:any,_next:any)=>res.status(err.status||500).json({ error: err.message||'Internal Server Error' }));

  app.listen(ENV.PORT, () => console.log(`[express] serving on port ${ENV.PORT}`));
}
start();
export default app;