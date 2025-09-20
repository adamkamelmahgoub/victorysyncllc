import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerUser, loginUser, getCurrentUser, authenticateJWT, type AuthenticatedRequest } from "./publicAuth";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "../shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";
import { sendEmail } from "./utils/sendEmail";
import { Router } from "express";
import { createCheckout, applyPlanToOrg, stripe } from "./billing/stripe";
import { requireFeature } from "./middleware/entitlements";
import { db } from "./db/client";
import { organizations, entitlements } from "./db/schema";
import { eq } from "drizzle-orm";

export const router = Router();

let stripeInstance: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

const billingRouter = Router();

// Billing → create checkout
billingRouter.post("/checkout/:planId", async (req, res, next) => {
  try {
    const planId = req.params.planId as "starter"|"growth"|"scale";
    const orgId = (req as any).auth?.orgId;
    if (!orgId) throw new Error("Unauthorized");
    const url = await createCheckout(orgId, planId);
    res.json({ url });
  } catch (e) { next(e); }
});

// Webhook (Stripe)
billingRouter.post("/webhooks/stripe", async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    const evt = stripeInstance!.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (evt.type === "checkout.session.completed") {
      const s = evt.data.object as any;
      // Resolve org from your metadata or customer mapping
      const org = await db.query.organizations.findFirst({ where: eq(organizations.stripeCustomerId, s.customer as string) });
      if (org) {
        // Map price → planId (store this mapping in DB or env)
        const price = (s.line_items?.data?.[0]?.price?.id) || s.display_items?.[0]?.price?.id;
        let planId: "starter"|"growth"|"scale" | null = null;
        if (price === process.env.STRIPE_PRICE_STARTER) planId = "starter";
        if (price === process.env.STRIPE_PRICE_GROWTH) planId = "growth";
        if (planId) await applyPlanToOrg(org.id, planId);
      }
    }
    res.json({ received: true });
  } catch (e) { next(e); }
});

// Feature-gated endpoints (examples)
billingRouter.post("/appointments/book", async (req, res, next) => {
  try {
    const orgId = (req as any).auth?.orgId!;
    await requireFeature(orgId, "appointments");
    // Call Cal.com or your scheduling API here
    res.json({ ok: true });
  } catch (e) { next(e); }
});

billingRouter.get("/me/entitlements", async (req, res, next) => {
  try {
    const orgId = (req as any).auth?.orgId!;
    const list = await db.select().from(entitlements).where(eq(entitlements.orgId, orgId));
    res.json({ features: list.map(r => r.featureId) });
  } catch (e) { next(e); }
});



export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint - must be first to avoid being caught by other routes
  app.get('/health', async (_req, res) => {
    try {
      // Test database connection
      const dbConnected = await testDatabaseConnection();
      
      const healthStatus = {
        status: dbConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: Number(process.env.PORT || 5000),
        database: dbConnected ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      };
      
      const statusCode = dbConnected ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        environment: process.env.NODE_ENV || 'development'
      });
    }
  });


  // Initialize default packages
  await initializePackages();

  // Public authentication routes (new system)
  app.post('/api/auth/register', registerUser);
  app.post('/api/auth/login', loginUser);
  app.get('/api/auth/me', authenticateJWT as any, getCurrentUser as any);
  app.post('/api/auth/logout', (req, res) => {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token from storage
    res.json({ message: 'Logged out successfully' });
  });


  // Package routes
  app.get('/api/packages', async (req, res) => {
    try {
      const packages = await storage.getPackages();
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

  // Mount the billing router
  router.use('/billing', billingRouter);

  // Add 404 handler for API routes that don't exist
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializePackages() {
  try {
    console.log('📦 Initializing default packages...');
    const existingPackages = await storage.getPackages();
    console.log(`Found ${existingPackages.length} existing packages`);
    
    if (existingPackages.length === 0) {
      console.log('Creating default packages...');
      // Create default packages
      await storage.createPackage({
        name: "Starter",
        price: "1200.00",
        description: "Perfect for small businesses",
        features: [
          "1 Dedicated Agent",
          "Business Hours Support",
          "Basic CRM Integration",
          "Email Support",
          "Monthly Reports"
        ],
      });

      await storage.createPackage({
        name: "Growth",
        price: "2500.00",
        description: "For growing companies",
        features: [
          "2 Dedicated Agents",
          "Extended Hours Support",
          "Appointment Setting",
          "Advanced CRM Integration",
          "Live Chat Support",
          "Weekly Reports"
        ],
      });

      await storage.createPackage({
        name: "Scale",
        price: "4500.00",
        description: "For enterprise needs",
        features: [
          "24/7 Blended Team",
          "AI Automation Suite",
          "Dedicated Success Manager",
          "Custom Integrations",
          "Priority Support",
          "Real-time Analytics"
        ],
      });
      console.log('✅ Default packages created successfully');
    } else {
      console.log('✅ Packages already exist, skipping initialization');
    }
  } catch (error) {
    console.error("❌ Error initializing packages:", error);
    throw error; // Re-throw to prevent server from starting with invalid state
  }
}