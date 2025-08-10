import express from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { subscriptions, invoices } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-12-18.acacia' });

// Stripe webhooks
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await db.insert(invoices).values({
            stripeInvoiceId: invoice.id,
            amount: (invoice.amount_paid / 100).toString(),
            currency: invoice.currency,
            status: invoice.status || 'paid',
            hostedInvoiceUrl: invoice.hosted_invoice_url,
            invoicePdf: invoice.invoice_pdf,
            orgId: 1, // TODO: Map from Stripe customer to org
          }).onConflictDoUpdate({
            target: invoices.stripeInvoiceId,
            set: {
              status: invoice.status || 'paid',
              hostedInvoiceUrl: invoice.hosted_invoice_url,
              invoicePdf: invoice.invoice_pdf,
            },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await db.update(subscriptions)
          .set({
            status: subscription.status as any,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          })
          .where(eq(subscriptions.stripeSubId, subscription.id));
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;