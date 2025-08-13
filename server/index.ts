// ESM-safe __dirname shim
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { auth } from './routes/auth';
import { admin } from './routes/admin';
import { requireAuth, requireRole } from './middleware/auth';
import { createOrgIfNeeded, createUser, findUserByEmail } from './services/users';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

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

// Auth routes (public)
app.use(auth);

// Admin routes (protected)
app.use(requireAuth, requireRole('admin'), admin);

// Bootstrap first admin if not present (idempotent)
async function bootstrapAdmin() {
  const {
    ADMIN_BOOTSTRAP_EMAIL,
    ADMIN_BOOTSTRAP_PASSWORD,
    ADMIN_BOOTSTRAP_ORG,
    ADMIN_BOOTSTRAP_PHONE,
    ADMIN_BOOTSTRAP_NAME
  } = process.env;

  if (!ADMIN_BOOTSTRAP_EMAIL || !ADMIN_BOOTSTRAP_PASSWORD) {
    return;
  }

  const existing = await findUserByEmail(ADMIN_BOOTSTRAP_EMAIL);
  if (existing) return;

  const orgId = await createOrgIfNeeded(ADMIN_BOOTSTRAP_ORG || 'VictorySync');
  await createUser({
    org_id: orgId,
    email: ADMIN_BOOTSTRAP_EMAIL,
    phone: ADMIN_BOOTSTRAP_PHONE || '+10000000000',
    full_name: ADMIN_BOOTSTRAP_NAME || 'Owner',
    role: 'admin',
    password: ADMIN_BOOTSTRAP_PASSWORD
  });

  console.log('[bootstrap] Admin created:', ADMIN_BOOTSTRAP_EMAIL);
}

bootstrapAdmin().catch(console.error);

// Serve built client files
const clientDist = join(__dirname, '../dist/public');
app.use(express.static(clientDist));

// Handle React routing - serve index.html for all non-API routes
app.get(/^\/(?!api).*/, (_req, res) => {
  try {
    res.sendFile(join(clientDist, 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(404).send('Page not found');
  }
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', () => console.log(`[express] serving on port ${PORT}`));