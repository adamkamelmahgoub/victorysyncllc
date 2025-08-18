
import { Router } from 'express';
import { requireAuth } from '../services/auth.js';
import { authorize } from '../services/rbac.js';
import { db } from '../db/client.js';
import { users, organizations, accessCodes } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const r = Router();
r.use(requireAuth);
r.use(authorize({ minRole: 'admin' }));

r.get('/users', async (req,res)=>{
  const userList = await db.select({
    id: users.id,
    email: users.email,
    fullName: users.fullName,
    role: users.role,
    orgId: users.orgId,
    createdAt: users.createdAt
  }).from(users);
  res.json({ users: userList });
});

r.patch('/users/:id', async (req,res)=>{
  const { role, permissions } = req.body;
  const userId = Number(req.params.id);
  const user = await db.select().from(users).where(eq(users.id, userId));
  if(!user.length) return res.status(404).json({ error: 'User not found' });
  
  const updates: any = {};
  if(role) updates.role = role;
  if(permissions) updates.permissions = permissions;
  
  await db.update(users).set(updates).where(eq(users.id, userId));
  res.json({ ok: true });
});

r.get('/organizations', async (req,res)=>{
  const orgs = await db.select().from(organizations);
  res.json({ organizations: orgs });
});

r.post('/access-codes', async (req:any,res)=>{
  const { orgId, code, role, maxUses, email, fullName, phone, orgName, orgIdCode } = req.body;
  const newCode = await db.insert(accessCodes).values({
    orgId, code, role: role || 'customer', maxUses: maxUses || 1, usedCount: 0,
    createdBy: req.user.id, email, fullName, phone, orgName, orgIdCode
  }).returning();
  res.json({ accessCode: newCode[0] });
});

r.get('/access-codes', async (req,res)=>{
  const codes = await db.select().from(accessCodes);
  res.json({ accessCodes: codes });
});

export default r;
