import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index';

const app = express();

// CRITICAL for Secure cookies behind Replit's HTTPS proxy
app.set('trust proxy', 1);

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

// Mount all API routes under /api
app.use('/api', routes);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`VictorySync API running on :${PORT}`);
});