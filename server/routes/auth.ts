
import { Router } from 'express';
import { z } from 'zod';
import { sign } from '../lib/jwt';
import { generateOtps, sendOtps, verifyOtps } from '../services/otp';
import { issueAccessCode, consumeAccessCode, markAccessCodeConsumed } from '../services/accessCodes';
import { createOrgIfNeeded, createUser, findUserByEmail, verifyPassword, setVerificationFlags } from '../services/users';

export const auth = Router();

/** Admin issues an access code for a specific person/org */
auth.post('/admin/access-codes', async (req, res) => {
  try {
    const adminId = (req as any).user?.id; // requireAuth+requireRole('admin') in index.ts
    const body = z.object({
      email:z.string().email(),
      phone:z.string().min(6),
      full_name:z.string().min(2),
      org_name:z.string().min(2),
      ttlMinutes:z.number().min(5).max(1440).optional()
    }).parse(req.body);
    const code = await issueAccessCode(adminId, body);
    res.json({code});
  } catch (e:any) { 
    res.status(400).json({message:e.message}); 
  }
});

/** Step 1 of signup: validate code + identity, send OTPs */
auth.post('/auth/register/start', async (req, res) => {
  try {
    const b = z.object({
      code:z.string().min(8),
      email:z.string().email(),
      phone:z.string().min(6),
      full_name:z.string().min(2),
      org_name:z.string().min(2),
      password:z.string().min(8)
    }).parse(req.body);
    await consumeAccessCode(b.code, b);
    const key = `${b.email}:${b.phone}`;
    const { codeEmail, codeSms } = generateOtps(key, b.email, b.phone);
    await sendOtps(b.email, b.phone, codeEmail, codeSms);
    res.json({ token:key }); // temp token to verify step 2
  } catch (e:any) { 
    res.status(400).json({message:e.message}); 
  }
});

/** Step 2: submit OTPs, create account, consume code */
auth.post('/auth/register/verify', async (req,res) => {
  try {
    const b = z.object({
      token:z.string(),
      code:z.string(),
      email:z.string().email(),
      phone:z.string().min(6),
      full_name:z.string(),
      org_name:z.string(),
      password:z.string().min(8),
      email_code:z.string().length(6),
      sms_code:z.string().length(6)
    }).parse(req.body);
    if (!verifyOtps(`${b.email}:${b.phone}`, b.email_code, b.sms_code))
      return res.status(400).json({message:'Invalid codes'});
    const orgId = await createOrgIfNeeded(b.org_name);
    const user = await createUser({
      org_id: orgId, email: b.email, phone:b.phone, full_name:b.full_name,
      role: 'customer', password: b.password
    });
    await setVerificationFlags(user.id, {email:true, phone:true});
    await markAccessCodeConsumed(b.code, user.id);
    const jwt = sign({ id:user.id, role:user.role, org_id:user.org_id });
    res.cookie('vs_token', jwt, { httpOnly:true, sameSite:'lax', maxAge:7*24*3600*1000 });
    res.json({ user });
  } catch (e:any) { 
    res.status(400).json({message:e.message}); 
  }
});

/** Login */
auth.post('/auth/login', async (req,res) => {
  const b = z.object({ email:z.string().email(), password:z.string().min(8) }).parse(req.body);
  const user = await findUserByEmail(b.email);
  if (!user) return res.status(400).json({message:'Invalid credentials'});
  const ok = await verifyPassword(user, b.password);
  if (!ok) return res.status(400).json({message:'Invalid credentials'});
  const jwt = sign({ id:user.id, role:user.role, org_id:user.org_id });
  res.cookie('vs_token', jwt, { httpOnly:true, sameSite:'lax', maxAge:7*24*3600*1000 });
  res.json({ user: { id:user.id, email:user.email, role:user.role, org_id:user.org_id, full_name:user.full_name }});
});
