
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { auth } from './routes/auth';
import { admin } from './routes/admin';
import { requireAuth, requireRole } from './middleware/auth';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req,res)=>res.json({ok:true}));

// Public auth routes
app.use(auth);

// Admin protected
app.use(requireAuth, requireRole('admin'), admin);

// In production, serve built client
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (_req,res)=>res.sendFile(path.join(clientDist, 'index.html')));
}

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', ()=>console.log(`[express] serving on port ${PORT}`));
