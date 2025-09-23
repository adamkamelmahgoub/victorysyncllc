
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CRITICAL for Secure cookies behind Replit's HTTPS proxy
app.set('trust proxy', 1);

// Core middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // same-origin, curl, etc.
      // Allow Replit preview hosts in dev
      if (/^https:\/\/.*\.repl\.co$/.test(origin) || /^https:\/\/.*\.replit\.dev$/.test(origin)) {
        return cb(null, true);
      }
      // Allow an explicit front-end URL if provided
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Health check early
app.get('/health', (_req, res) => res.status(200).send('ok'));

// ---- API ROUTES (mount first) ----
app.use('/api', routes);

// ---- SPA STATIC (prod) + FALLBACK ----
const clientDist = path.resolve(__dirname, '../client/dist');

// Serve built assets if present
app.use(express.static(clientDist));

// Important: for any non-API route, send index.html so the SPA router can handle it
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).end();
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VictorySync API running on :${PORT}`);
});
