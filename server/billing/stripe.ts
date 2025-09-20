
import type { PlanId } from './plans';
import { Plans } from './plans';
import { neon } from '@neondatabase/serverless';
import { sql as sharedSql, ensureEntitlementsValueColumn, setOrgPlan } from '../db/compat';

const SQL = sharedSql; // alias for clarity

// Apply plan + entitlements in a single transaction
export async function applyPlanToOrgTransactional(orgId: string, planId: PlanId) {
  await ensureEntitlementsValueColumn();

  await SQL/* sql */`BEGIN`;
  try {
    await setOrgPlan(orgId, planId);

    // Clear prior entitlements for idempotency
    await SQL/* sql */`
      DELETE FROM entitlements WHERE org_id = ${orgId}::text
    `;

    const features = Plans[planId].features;
    for (const feature of features) {
      await SQL/* sql */`
        INSERT INTO entitlements (org_id, feature_id, enabled, value)
        VALUES (${orgId}::text, ${feature}, true, 'enabled')
        ON CONFLICT (org_id, feature_id) DO UPDATE
          SET enabled = EXCLUDED.enabled, value = EXCLUDED.value
      `;
    }

    await SQL/* sql */`COMMIT`;
  } catch (e) {
    await SQL/* sql */`ROLLBACK`;
    throw e;
  }
}

// Stripe: only if keys exist; otherwise we use fallback
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
let stripe: any = null;
if (STRIPE_SECRET && STRIPE_SECRET.startsWith('sk_')) {
  try {
    // Dynamic import to avoid build issues
    const Stripe = (await import('stripe')).default;
    stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2022-11-15' });
  } catch (e) {
    console.warn('Stripe initialization failed:', e);
  }
}

export async function createCheckoutSessionOrFallback(params: {
  orgId: string;
  planId: PlanId;
  successUrl: string;
  cancelUrl: string;
}) {
  const { orgId, planId, successUrl, cancelUrl } = params;

  if (!stripe) {
    // Dev fallback: apply immediately
    await applyPlanToOrgTransactional(orgId, planId);
    return { url: successUrl, mode: 'fallback' as const };
  }

  // Real Stripe Checkout
  const price = Plans[planId].price;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orgId, planId },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: price * 100,
          product_data: { name: `${Plans[planId].name} Plan` }
        },
        quantity: 1
      }
    ]
  });

  return { url: session.url as string, mode: 'stripe' as const };
}

// Webhook handler: apply plan on completion
export async function handleStripeWebhook(rawBody: string, sig: string | undefined) {
  if (!stripe) return { ok: true }; // nothing to do in fallback mode

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) return { ok: true };

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    return { ok: false, error: 'Invalid signature' };
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orgId = session.metadata?.orgId as string;
    const planId = session.metadata?.planId as PlanId;
    if (orgId && planId) {
      await applyPlanToOrgTransactional(orgId, planId);
    }
  }
  return { ok: true };
}
