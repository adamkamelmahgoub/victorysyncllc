
import { Router } from 'express';
import { z } from 'zod';
import { sign } from '../lib/jwt.js';
import { generate, dispatch, verifyPair } from '../services/otp.js';
import { issueAccessCode, validateAccessCode, markConsumed } from '../services/accessCodes.js';
import { createOrgIfNeeded, createUser, findUserByEmail, verifyPassword, setVerificationFlags } from '../services/users.js';
import { requireAuth } from '../middleware/auth.js';

export const auth = Router();

// Admin: issue an access code
auth.post('/api/admin/access-codes', async (req:any,res) => {
  const adminId = req.user?.id; // protected in index via middleware
  const b = z.object({
    email:z.string().email(), phone:z.string().min(6), full_name:z.string().min(2), org_name:z.string().min(2),
    ttlMinutes:z.number().min(5).max(1440).optional()
  }).parse(req.body);
  const code = await issueAccessCode(adminId, b);
  res.json({code});
});

// Registration step 1
auth.post('/api/auth/register/start', async (req,res) => {
  const b = z.object({
    code:z.string().min(8),
    email:z.string().email(), phone:z.string().min(6), full_name:z.string().min(2), org_name:z.string().min(2),
    password:z.string().min(8)
  }).parse(req.body);
  await validateAccessCode(b.code, b);
  const { key, eCode, sCode } = generate(b.email, b.phone);
  await dispatch(b.email, b.phone, eCode, sCode);
  res.json({ token:key });
});

// Registration step 2
auth.post('/api/auth/register/verify', async (req,res) => {
  const b = z.object({
    token:z.string(), code:z.string(),
    email:z.string().email(), phone:z.string().min(6), full_name:z.string(), org_name:z.string(),
    password:z.string().min(8), email_code:z.string().length(6), sms_code:z.string().length(6)
  }).parse(req.body);
  if (!verifyPair(b.token, b.email_code, b.sms_code)) return res.status(400).json({message:'Invalid codes'});
  const orgId = await createOrgIfNeeded(b.org_name);
  const user = await createUser({ org_id:orgId, email:b.email, phone:b.phone, full_name:b.full_name, role:'customer', password:b.password });
  await setVerificationFlags(user.id, { email:true, phone:true });
  await markConsumed(b.code, user.id);
  const jwt = sign({ id:user.id, role:user.role, org_id:user.org_id });
  res.cookie('vs_token', jwt, { httpOnly:true, sameSite:'lax', maxAge:7*24*3600*1000 });
  res.json({ user });
});

// Login
auth.post('/api/auth/login', async (req,res) => {
  const b = z.object({ email:z.string().email(), password:z.string().min(8) }).parse(req.body);
  const u = await findUserByEmail(b.email);
  if (!u) return res.status(400).json({message:'Invalid credentials'});
  if (!await verifyPassword(u, b.password)) return res.status(400).json({message:'Invalid credentials'});
  const jwt = sign({ id:u.id, role:u.role, org_id:u.org_id });
  res.cookie('vs_token', jwt, { httpOnly:true, sameSite:'lax', maxAge:7*24*3600*1000 });
  res.json({ user: { id:u.id, email:u.email, role:u.role, org_id:u.org_id, full_name:u.full_name }});
});

// Get current user info (protected route)
auth.get('/api/auth/me', requireAuth, (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({ user: req.user });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
