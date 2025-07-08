import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerUser, loginUser, getCurrentUser, authenticateJWT, type AuthenticatedRequest } from "./publicAuth";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";
import { sendEmail } from "./utils/sendEmail";
import { kpiStore } from "./kpiStore";
import { hubspotIntegration } from "./integrations/hubspot";
import { pipedriveIntegration } from "./integrations/pipedrive";
import { aircallIntegration } from "./integrations/aircall";
import { twilioIntegration } from "./integrations/twilio";
import express from 'express';

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint - lightweight for fast response
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: Number(process.env.PORT || 5000),
      uptime: process.uptime()
    });
  });



  // Initialize default packages lazily (only when needed)
  // Package initialization moved to lazy loading

  // Public authentication routes (new system)
  app.post('/api/auth/register', registerUser);
  app.post('/api/auth/login', loginUser);
  app.get('/api/auth/me', authenticateJWT as any, getCurrentUser as any);
  app.post('/api/auth/logout', (req, res) => {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token from storage
    res.json({ message: 'Logged out successfully' });
  });

  // KPI routes
  app.get('/api/kpi/live', async (req, res) => {
    try {
      const metrics = await kpiStore.getMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      res.status(500).json({ message: "Failed to fetch KPI data" });
    }
  });





  // Package routes
  app.get('/api/packages', async (req, res) => {
    try {
      const packages = await ensurePackagesExist();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.get('/api/packages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);

      // Send email notification for new contact form submission
      await sendEmail({
        subject: "New Contact Form Submission",
        text: `Name: ${validatedData.firstName} ${validatedData.lastName}\nEmail: ${validatedData.email}\nMessage:\n${validatedData.message}`
      });

      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", authenticateJWT as any, async (req: any, res: any) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing is currently unavailable. Please contact support." 
        });
      }

      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
      }

      // Calculate total from items
      let total = 0;
      for (const item of items) {
        const pkg = await storage.getPackage(item.packageId);
        if (!pkg) {
          return res.status(400).json({ message: `Package ${item.packageId} not found` });
        }
        total += parseFloat(pkg.price) * item.quantity;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user!.id.toString(),
          items: JSON.stringify(items),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Order routes
  app.post('/api/orders', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id.toString();
      const { items, total, stripePaymentIntentId } = req.body;

      // Create order
      const order = await storage.createOrder({
        userId,
        total: total.toString(),
        stripePaymentIntentId,
        status: 'pending',
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          packageId: item.packageId,
          quantity: item.quantity,
          price: item.price.toString(),
        });
      }

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id.toString();
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.user!.id.toString();

      const order = await storage.getOrder(orderId);
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }

      const items = await storage.getOrderItems(orderId);
      res.json({ ...order, items });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

    

  // Webhook endpoints for integrations
  app.post("/api/integrations/hubspot/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const signature = req.headers['x-hubspot-signature'] as string;
      const payload = JSON.parse(req.body.toString());

      if (!hubspotIntegration.validateSignature(signature, req.body.toString())) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      await hubspotIntegration.pushEvent(payload);
      res.json({ success: true });
    } catch (error) {
      console.error('HubSpot webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  app.post("/api/integrations/pipedrive/webhook", express.json(), async (req, res) => {
    try {
      const signature = req.headers['x-pipedrive-signature'] as string;

      if (!pipedriveIntegration.validateSignature(signature, JSON.stringify(req.body))) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      await pipedriveIntegration.pushEvent(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Pipedrive webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  app.post("/api/integrations/aircall/webhook", express.json(), async (req, res) => {
    try {
      const signature = req.headers['x-aircall-signature'] as string;

      if (!aircallIntegration.validateSignature(signature, JSON.stringify(req.body))) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      await aircallIntegration.pushEvent(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Aircall webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  app.post("/api/integrations/twilio/webhook", express.urlencoded({ extended: false }), async (req, res) => {
    try {
      const signature = req.headers['x-twilio-signature'] as string;
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      if (!twilioIntegration.validateSignature(signature, JSON.stringify(req.body), url)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      await twilioIntegration.pushEvent(req.body);
      res.set('Content-Type', 'application/xml');
      res.send('<Response></Response>');
    } catch (error) {
      console.error('Twilio webhook error:', error);
      res.status(500).set('Content-Type', 'application/xml').send('<Response></Response>');
    }
  });

  // Add 404 handler for API routes that don't exist
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  const httpServer = createServer(app);
  return httpServer;
}

let packagesInitialized = false;
let packagesCache: any[] | null = null;

async function ensurePackagesExist() {
  if (packagesInitialized && packagesCache) {
    return packagesCache;
  }

  try {
    const existingPackages = await storage.getPackages();

    if (existingPackages.length === 0) {
      // Create packages in background, don't block startup
      setImmediate(async () => {
        try {
          await Promise.all([
            storage.createPackage({
              name: "Starter",
              price: "1200.00", 
              description: "Perfect for small businesses",
              features: ["1 Dedicated Agent", "Business Hours Support", "Basic CRM Integration", "Email Support", "Monthly Reports"],
            }),
            storage.createPackage({
              name: "Growth",
              price: "2500.00",
              description: "For growing companies", 
              features: ["2 Dedicated Agents", "Extended Hours Support", "Appointment Setting", "Advanced CRM Integration", "Live Chat Support", "Weekly Reports"],
            }),
            storage.createPackage({
              name: "Scale",
              price: "4500.00",
              description: "For enterprise needs",
              features: ["24/7 Blended Team", "AI Automation Suite", "Dedicated Success Manager", "Custom Integrations", "Priority Support", "Real-time Analytics"],
            })
          ]);
          packagesCache = await storage.getPackages();
        } catch (error) {
          console.error("Error creating packages:", error);
        }
      });

      // Return empty array for now
      packagesCache = [];
    } else {
      packagesCache = existingPackages;
    }

    packagesInitialized = true;
    return packagesCache;
  } catch (error) {
    console.error("Error ensuring packages:", error);
    return [];
  }
}