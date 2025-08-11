import express, { type Request, type Response, type NextFunction } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { setupVite } from './vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Minimal hardening for dev preview (optional)
app.disable('x-powered-by');

// Health check so we can see the server is alive
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// IMPORTANT: mount your API routers here (if any)
// Example:
// app.use('/api', apiRouter);

// Self-diagnostic to know which branch is active
app.get('/__whoami', (_req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    mode: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  });
});

// Decide dev vs prod.
// Default to DEV unless NODE_ENV === 'production'.
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // DEV: use Vite middleware and transform index.html
  const vite = await setupVite(app);

  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = req.originalUrl;
      const indexPath = path.resolve(__dirname, '..', 'client', 'index.html');

      // Ensure index.html exists
      if (!fs.existsSync(indexPath)) {
        return res.status(500).send('client/index.html not found');
      }

      let html = fs.readFileSync(indexPath, 'utf-8');
      html = await vite.transformIndexHtml(url, html);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (err) {
      return next(err);
    }
  });
} else {
  // PROD: serve the built SPA from client/dist and use catch-all
  const distDir = path.resolve(__dirname, '..', 'client', 'dist');
  const indexHtml = path.resolve(distDir, 'index.html');

  app.use(express.static(distDir, { index: false, fallthrough: true }));
  app.get('*', (_req, res) => res.sendFile(indexHtml));
}

// Basic error handler so we see issues in preview instead of "Cannot GET /"
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).send(err?.stack || String(err));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP server listening on ${PORT}. NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);
});