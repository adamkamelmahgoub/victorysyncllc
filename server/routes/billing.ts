
import express from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import { db } from '../db';
import { subscriptions, invoices } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, requirePermissions, AuthService, type AuthenticatedRequest } from '../lib/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-12-18.acacia' });

router.use(authenticateToken);

// Get billing portal URL
router.post('/portal', requirePermissions('billing:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    // Get or create Stripe customer
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.orgId, orgId),
    });

    if (!subscription?.stripeCustomerId) {
      return res.status(404).json({ 
        ok: false, 
        error: 'no_customer', 
        message: 'No billing account found' 
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${req.protocol}://${req.get('host')}/dashboard?tab=billing`,
    });

    // Log audit
    await AuthService.logAudit(
      'billing_portal_opened',
      'subscription',
      subscription.id.toString(),
      {},
      req.user!.id,
      orgId,
      req
    );

    res.json({ ok: true, data: { url: session.url } });
  } catch (error) {
    console.error('Billing portal error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to create billing portal session' 
    });
  }
});

// Get current subscription and invoices
router.get('/', requirePermissions('billing:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    const [subscription, recentInvoices] = await Promise.all([
      db.query.subscriptions.findFirst({
        where: eq(subscriptions.orgId, orgId),
      }),
      db.query.invoices.findMany({
        where: eq(invoices.orgId, orgId),
        limit: 10,
      }),
    ]);

    res.json({
      ok: true,
      data: {
        subscription,
        recentInvoices,
      },
    });
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch billing information' 
    });
  }
});

export default router;
