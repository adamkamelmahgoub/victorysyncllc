
import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/client.js';
import { webhooks, webhookFailures } from '../db/schema.js';
import { eq } from 'drizzle-orm';
const r = Router();

function sign(secret:string, payload:string){ return crypto.createHmac('sha256', secret).update(payload).digest('hex'); }

r.post('/send/:id', async (req,res)=>{
  const w=(await db.select().from(webhooks).where(eq(webhooks.id, Number(req.params.id))))[0];
  if(!w) return res.status(404).json({ error:'Not found' });
  const payload=JSON.stringify(req.body||{});
  const signature=sign(w.secret, payload);
  // Normally post to w.url; on fail insert into webhookFailures
  res.json({ ok:true, signature });
});
r.get('/failures', async (_req,res)=>{ const rows=await db.select().from(webhookFailures); res.json(rows); });

export default r;
