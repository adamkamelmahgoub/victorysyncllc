
import { Router } from 'express';
import { z } from 'zod';
import { sign } from '../lib/jwt';
import { generate, dispatch, verifyPair } from '../services/otp';
import { issueAccessCode, validateAccessCode, markConsumed } from '../services/accessCodes';
import { createOrgIfNeeded, createUser, findUserByEmail, verifyPassword, setVerificationFlags } from '../services/users';
import { requireAuth } from '../middleware/auth';

export const auth = Router();

// Admin-only access code generation
auth.post('/api/admin/access-codes', async (req: any, res) => {
  const adminId = req.user?.id;
  const body = z.object({
    email: z.string().email(),
    phone: z.string().min(6),
    full_name: z.string().min(2),
    org_name: z.string().min(2),
    ttlMinutes: z.number().min(5).max(1440).optional()
  }).parse(req.body);
  
  const code = await issueAccessCode(adminId, body);
  res.json({ code });
});

// Registration step 1
auth.post('/api/auth/register/start', async (req, res) => {
  const body = z.object({
    code: z.string().min(8),
    email: z.string().email(),
    phone: z.string().min(6),
    full_name: z.string().min(2),
    org_name: z.string().min(2),
    password: z.string().min(8)
  }).parse(req.body);
  
  await validateAccessCode(body.code, body);
  
  const { key, eCode, sCode } = generate(body.email, body.phone);
  await dispatch(body.email, body.phone, eCode, sCode);
  
  res.json({ token: key });
});

// Registration step 2
auth.post('/api/auth/register/verify', async (req, res) => {
  const body = z.object({
    token: z.string(),
    code: z.string(),
    email: z.string().email(),
    phone: z.string().min(6),
    full_name: z.string(),
    org_name: z.string(),
    password: z.string().min(8),
    email_code: z.string().length(6),
    sms_code: z.string().length(6)
  }).parse(req.body);
  
  if (!verifyPair(body.token, body.email_code, body.sms_code)) {
    return res.status(400).json({ message: 'Invalid codes' });
  }
  
  const orgId = await createOrgIfNeeded(body.org_name);
  const user = await createUser({
    org_id: orgId,
    email: body.email,
    phone: body.phone,
    full_name: body.full_name,
    role: 'customer',
    password: body.password
  });
  
  await setVerificationFlags(user.id, { email: true, phone: true });
  await markConsumed(body.code, user.id);
  
  const jwt = sign({ id: user.id, role: user.role, org_id: user.org_id });
  res.json({ token: jwt, user });
});

// Login
auth.post('/api/auth/login', async (req, res) => {
  const body = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }).parse(req.body);
  
  const user = await findUserByEmail(body.email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  if (!await verifyPassword(user, body.password)) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  const jwt = sign({ id: user.id, role: user.role, org_id: user.org_id });
  res.json({
    token: jwt,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      full_name: user.full_name
    }
  });
});

// Get current user
auth.get('/api/auth/whoami', requireAuth, async (req: any, res) => {
  res.json({ user: req.user });
});
