
import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/client.js';
import { webhooks, webhookFailures } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

function sign(secret: string, payload: string) { 
  return crypto.createHmac('sha256', secret).update(payload).digest('hex'); 
}

router.post('/send/:id', async (req: Request, res: Response) => {
  try {
    const w = (await db.select().from(webhooks).where(eq(webhooks.id, Number(req.params.id))))[0];
    if (!w) return res.status(404).json({ error: 'Not found' });
    
    const payload = JSON.stringify(req.body || {});
    const signature = sign(w.secret, payload);
    // Normally post to w.url; on fail insert into webhookFailures
    res.json({ ok: true, signature });
  } catch (error) {
    res.status(500).json({ error: 'Webhook send failed' });
  }
});

router.get('/failures', async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(webhookFailures);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch webhook failures' });
  }
});

export default router;
