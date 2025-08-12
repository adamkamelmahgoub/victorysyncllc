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

app.get('/health', (_req,res)=>res.json({ok:true}));

// Auth + registration
app.use('/api', auth);

// Admin-protected routes
app.use('/api', requireAuth, requireRole('admin'), admin);

// Serve static files in production
if (process.env.NODE_ENV==='production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (_req,res)=>res.sendFile(path.join(clientDist,'index.html')));
}

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, ()=>console.log(`[express] serving on port ${PORT}`));