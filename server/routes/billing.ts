
import { Router } from 'express';
import type { PlanId } from '../billing/plans';
import { createCheckoutSessionOrFallback, handleStripeWebhook } from '../billing/stripe';
import { getOrgById } from '../db/compat';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Require auth middleware expected to populate req.auth with { userId, orgId, role }
function requireAuth(req: AuthRequest, res: any, next: any) {
  if (!req.auth?.orgId) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// POST /api/billing/checkout  { planId }
router.post('/checkout', requireAuth, async (req: AuthRequest, res: any) => {
  const { planId } = req.body as { planId: PlanId };
  if (!planId) return res.status(400).json({ error: 'Missing planId' });

  const orgId = String(req.auth!.orgId);
  const successUrl = `${req.protocol}://${req.get('host')}/customer-dashboard?upgraded=${planId}`;
  const cancelUrl = `${req.protocol}://${req.get('host')}/pricing?cancelled=true`;

  try {
    // Make sure org exists
    const org = await getOrgById(orgId);
    if (!org) return res.status(400).json({ error: 'Org not found' });

    const { url, mode } = await createCheckoutSessionOrFallback({ orgId, planId, successUrl, cancelUrl });
    res.json({ url, mode });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? 'Failed to start checkout' });
  }
});

// Stripe webhook (raw body)
router.post('/webhook', expressRawBody, async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  try {
    const result = await handleStripeWebhook(req.rawBody, sig);
    if (!result.ok) return res.status(400).send(result.error);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? 'Webhook error' });
  }
});

// Helper to get raw body
function expressRawBody(req: any, res: any, next: any) {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk: string) => (data += chunk));
  req.on('end', () => {
    req.rawBody = data;
    next();
  });
}

export const billingRouter = router;
