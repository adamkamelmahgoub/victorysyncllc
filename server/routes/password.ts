
import { Router } from 'express';
import { db } from '../db/client.js';
import { users, organizations } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../services/email.js';
import { hash } from '../services/auth.js';

const r = Router();
const customerTokens = new Map<string,{ uid:number, exp:number }>();
const adminTokens = new Map<string,{ uid:number, exp:number, orgIdCode:string }>();
const tok = ()=>Math.random().toString(36).slice(2,10).toUpperCase();

r.post('/request', async (req,res)=>{ const email=String(req.body.email||'').toLowerCase();
  const u=(await db.select().from(users).where(eq(users.email,email)))[0]; if(!u) return res.json({ ok:true });
  const t=tok(); customerTokens.set(t,{ uid:u.id, exp:Date.now()+15*60*1000 });
  await sendEmail(email,'Reset your VictorySync password',`Token: ${t}`); res.json({ ok:true });
});
r.post('/reset', async (req,res)=>{ const { token, newPassword }=req.body;
  const rec=customerTokens.get(token); if(!rec||rec.exp<Date.now()) return res.status(400).json({error:'Invalid token'});
  await db.update(users).set({ passwordHash: await hash(newPassword) }).where(eq(users.id, rec.uid)); customerTokens.delete(token);
  res.json({ ok:true });
});

r.post('/admin/request', async (req,res)=>{ const email=String(req.body.email||'').toLowerCase(), code=String(req.body.orgIdCode||'');
  const u=(await db.select().from(users).where(eq(users.email,email)))[0]; if(!u||!(u.role==='admin'||u.role==='superAdmin')) return res.json({ok:true});
  const org = (await db.select().from(organizations).where(eq(organizations.id, u.orgId!)))[0]; if(!org||org.idCode!==code) return res.json({ ok:true });
  const t=tok(); adminTokens.set(t,{ uid:u.id, exp:Date.now()+10*60*1000, orgIdCode: org.idCode });
  await sendEmail(email,'Admin password reset',`Token: ${t}, Org ID Code: ${org.idCode}`); res.json({ ok:true });
});
r.post('/admin/reset', async (req,res)=>{ const { token, newPassword, orgIdCode }=req.body;
  const rec=adminTokens.get(token); if(!rec||rec.exp<Date.now()) return res.status(400).json({error:'Invalid token'});
  if(rec.orgIdCode!==orgIdCode) return res.status(400).json({error:'Org ID Code mismatch'});
  await db.update(users).set({ passwordHash: await hash(newPassword) }).where(eq(users.id, rec.uid)); adminTokens.delete(token);
  res.json({ ok:true });
});
export default r;
