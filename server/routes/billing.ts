
import { Router } from 'express';
import { authenticateJWT, type AuthenticatedRequest } from '../publicAuth';
import type { Response } from 'express';
import Stripe from 'stripe';

const router = Router();

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

// Add seat purchase
router.post('/seats', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({ 
        error: "Payment processing is currently unavailable" 
      });
    }

    const { quantity = 1 } = req.body;
    const userId = req.user!.id;
    const seatPrice = 125; // $125 per seat per month

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'VictorySync Agent Seat',
              description: 'Professional contact center agent seat'
            },
            unit_amount: seatPrice * 100, // Convert to cents
            recurring: {
              interval: 'month'
            }
          },
          quantity
        }
      ],
      metadata: {
        userId: userId.toString(),
        type: 'seat_purchase',
        quantity: quantity.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/dashboard?seat_purchase=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?seat_purchase=cancelled`,
    });

    res.json({ 
      checkoutUrl: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Error creating seat purchase:', error);
    res.status(500).json({ error: 'Failed to create seat purchase' });
  }
});

// Get billing information
router.get('/info', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Mock billing data - in production this would come from database/Stripe
    const billingInfo = {
      plan: 'Professional',
      seats: 5,
      monthlyBilling: 625,
      nextBilling: '2025-01-15',
      invoices: [
        { date: 'Dec 15, 2024', amount: 625, status: 'paid', downloadUrl: '/api/billing/invoice/inv_123' },
        { date: 'Nov 15, 2024', amount: 500, status: 'paid', downloadUrl: '/api/billing/invoice/inv_122' },
        { date: 'Oct 15, 2024', amount: 500, status: 'paid', downloadUrl: '/api/billing/invoice/inv_121' }
      ]
    };

    res.json(billingInfo);
  } catch (error) {
    console.error('Error fetching billing info:', error);
    res.status(500).json({ error: 'Failed to fetch billing information' });
  }
});

// Download invoice
router.get('/invoice/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // In production, this would:
    // 1. Verify user owns the invoice
    // 2. Generate/retrieve PDF from Stripe
    // 3. Return the PDF file
    
    res.json({ 
      message: 'Invoice download would be implemented here',
      invoiceId: id 
    });
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ error: 'Failed to download invoice' });
  }
});

export default router;
