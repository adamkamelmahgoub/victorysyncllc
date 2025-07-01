import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

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

  // Auth middleware
  await setupAuth(app);

  // Initialize default packages
  await initializePackages();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
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
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
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
          userId: req.user.claims.sub,
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
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
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
