
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

// CORS for Replit preview (reflect origin & allow cookies)
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.status(200).send('ok'));

// ---- API routes under /api only ----
import apiRouter from './routes.js'; // keep your existing router export
app.use('/api', apiRouter);

// ---- Vite dev or static prod ----
async function setupVite(app: express.Express) {
  if (process.env.NODE_ENV === 'development') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, '../client'),
      server: {
        middlewareMode: true,
        hmr: { overlay: true },
        allowedHosts: true,
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // SPA fallback for any non-/api GET
    app.use(async (req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
      try {
        // Read + transform index.html through Vite
        const fs = await import('fs/promises');
        const url = req.originalUrl;
        const html = await fs.readFile(
          path.resolve(__dirname, '../client/index.html'),
          'utf8'
        );
        const transformed = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const dist = path.resolve(__dirname, '../client/dist');
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
