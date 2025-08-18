
import express, { Router } from 'express';
import { requireAuth } from '../services/auth.js';
import { stripe } from '../services/stripe.js';
import { db } from '../db/client.js';
import { coupons, redemptions, orders } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const r = Router();
r.use(requireAuth);

r.get('/info', async (req:any,res)=>{ res.json({ plan:'starter', seats:3, invoices:[] }); }); // extend to read from DB

r.post('/seats', async (req,res)=>{ res.json({ ok:true, seatsDelta:req.body.delta||0 }); });

r.get('/invoice/:id', async (req,res)=>{ const inv=await stripe.invoices.retrieve(req.params.id); res.json(inv); });

r.post('/coupons', async (req:any,res)=>{ const code=String(req.body.code||'').toUpperCase();
  const c=(await db.select().from(coupons).where(eq(coupons.code, code)))[0];
  if(!c || !c.isActive) return res.status(404).json({ error:'Invalid coupon' });
  res.json({ valid:true, type:c.type, amount:c.amount });
});

// Stripe webhook
r.post('/stripe/webhook', express.raw({type:'application/json'}), async (req:any,res)=>{
  const sig=req.headers['stripe-signature']; try{
    const event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
    // handle events...
    res.json({ received:true });
  }catch(e:any){ res.status(400).send(`Webhook Error: ${e.message}`); }
});

export default r;
