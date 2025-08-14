
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// ESM dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 5000);

// CORS for Replit Preview
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => res.status(200).send('ok'));

// Import routes
import { auth } from './routes/auth.js';
import { admin } from './routes/admin.js';
import { requireAuth, requireRole } from './middleware/auth.js';

// API routes
app.use('/api', auth);
app.use('/api', requireAuth, requireRole('admin'), admin);

// Vite dev server setup
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

    // SPA fallback for non-API routes
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VictorySync</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
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
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] serving on port ${PORT}`);
  });
});
