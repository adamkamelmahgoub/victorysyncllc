import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { auth } from './routes/auth.js';
import { admin } from './routes/admin.js';
import { requireAuth, requireRole } from './middleware/auth.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req,res)=>res.json({ok:true}));

// Debug endpoint to list available routes
app.get('/api/debug/routes', (_req, res) => {
  const routes = {
    public: [
      'GET /api/health',
      'GET /api/debug/routes',
      'POST /api/auth/login',
      'POST /api/auth/register/start', 
      'POST /api/auth/register/verify',
      'GET /api/auth/me (requires auth)'
    ],
    protected: [
      'POST /api/admin/access-codes (admin only)',
      '/api/admin/* (admin only)'
    ]
  };
  res.json(routes);
});

// Public auth routes
app.use(auth);

// Protected admin routes
app.use('/api/admin', requireAuth, requireRole('admin'), admin);

// Serve built client files
const clientDist = path.join(__dirname, '../dist/public');
app.use(express.static(clientDist));

// Handle React routing - serve index.html for all non-API routes
app.get(/^\/(?!api).*/, (_req, res) => {
  try {
    res.sendFile(path.join(clientDist, 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(404).send('Page not found');
  }
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', ()=>console.log(`[express] serving on port ${PORT}`));