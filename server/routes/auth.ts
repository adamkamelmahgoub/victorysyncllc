import { Router } from 'express';
import { db } from '../db/client.js';
import { users, accessCodes, organizations, socialAccounts } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { sendEmail } from '../services/email.js';
import { signSession, setAuthCookie, requireAuth, verifyPassword, hash } from '../services/auth.js';

const r = Router();

r.post('/register', async (req,res,next)=>{ try{
  const { fullName, email, phone, organizationName, orgIdCode, accessCode, password } = req.body;
  if(!fullName||!email||!phone||!organizationName||!orgIdCode||!accessCode||!password) throw new Error('Missing fields');
  const org = (await db.select().from(organizations).where(and(eq(organizations.name, organizationName), eq(organizations.idCode, orgIdCode))))[0];
  if(!org) throw new Error('Organization or Org ID Code mismatch');
  const code = (await db.select().from(accessCodes).where(eq(accessCodes.code, accessCode)))[0];
  if(!code) throw new Error('Invalid access code');
  if(code.expiresAt && Date.now()>new Date(code.expiresAt).getTime()) throw new Error('Access code expired');
  if(code.usedCount>=code.maxUses) throw new Error('Access code exhausted');
  if(code.email && code.email.toLowerCase()!==String(email).toLowerCase()) throw new Error('Access code not valid for this email');

  const exists = (await db.select().from(users).where(eq(users.email, String(email).toLowerCase())))[0];
  if(exists) throw new Error('Account already exists');

  const passwordHash = await hash(password);
  const inserted = await db.insert(users).values({
    email: String(email).toLowerCase(), passwordHash, fullName, phone, orgId: org.id, role: code.role||'customer', permissions: [], mfaEnabled:false
  }).returning({ id: users.id, email: users.email, orgId: users.orgId, role: users.role, permissions: users.permissions });

  await db.update(accessCodes).set({ usedCount: (code.usedCount||0)+1 }).where(eq(accessCodes.id, code.id));
  const token = signSession(inserted[0]); setAuthCookie(res, token);
  res.json(inserted[0]);
}catch(e){ next(e);} });

r.post('/login', async (req,res,next)=>{ try{
  const { email, password } = req.body;
  const u = (await db.select().from(users).where(eq(users.email, String(email).toLowerCase())))[0];
  if(!u) throw new Error('Invalid login');
  const ok = await verifyPassword(u.passwordHash, password);
  if(!ok) throw new Error('Invalid login');
  const token = signSession(u); setAuthCookie(res, token);
  res.json({ id:u.id, email:u.email, orgId:u.orgId, role:u.role, permissions:u.permissions, mfaEnabled:u.mfaEnabled });
}catch(e){ next(e);} });

r.post('/logout', requireAuth, async (_req,res)=>{ res.clearCookie('vsess'); res.json({ ok:true }); });

r.get('/me', requireAuth, async (req:any,res)=> res.json(req.user));
export default r;