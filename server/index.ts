import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from './routes/auth';
import { admin } from './routes/admin';
import { requireAuth, requireRole } from './middleware/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req,res)=>res.json({ok:true}));

// Auth + registration
app.use('/api', auth);

// Admin-protected routes
app.use('/api', requireAuth, requireRole('admin'), admin);

// Serve static files in development and production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get(/^\/(?!api).*/, (_req,res)=>res.sendFile(path.join(clientDist,'index.html')));

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', ()=>console.log(`[express] serving on port ${PORT}`));