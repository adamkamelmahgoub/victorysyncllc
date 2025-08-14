
// server/index.ts
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Allow cookies from Replit preview
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Lightweight health
app.get('/health', (_req, res) => res.status(200).send('ok'));

// ---------- API ----------
import apiRouter from './routes.js';
app.use('/api', apiRouter);

// ---------- Vite / Static ----------
async function setupVite(app: express.Express) {
  const clientRoot = path.resolve(__dirname, '../client');

  if (process.env.NODE_ENV === 'development') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: clientRoot,
      appType: 'custom',
      server: {
        middlewareMode: true,
        host: true,
        allowedHosts: true,
        strictPort: false,
        hmr: {
          protocol: 'wss',
          clientPort: 443,
          overlay: false, // never block rendering with an overlay
        },
      },
    });

    // Vite middlewares first
    app.use(vite.middlewares);

    // SPA fallback for any non-/api GET
    app.use(async (req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
      try {
        const fs = await import('fs/promises');
        const htmlPath = path.join(clientRoot, 'index.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set('Content-Type', 'text/html').end(transformed);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const dist = path.resolve(clientRoot, 'dist');
    app.use(express.static(dist));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
      res.sendFile(path.join(dist, 'index.html'));
    });
  }
}

setupVite(app).then(() => {
  app.listen(PORT, () => console.log(`[express] serving on port ${PORT}`));
});
