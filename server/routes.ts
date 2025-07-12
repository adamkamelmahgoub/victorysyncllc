import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerUser, loginUser, getCurrentUser, authenticateJWT, type AuthenticatedRequest } from "./publicAuth";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";
import { sendEmail } from "./utils/sendEmail";
import { db } from "./db";
import { users, orders, integrations } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { requireAuth } from "./middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


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

  // Features management routes
  app.get("/api/features", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const customerId = req.query.customer_id || req.user?.id;

      const features = await db.execute(sql`
        SELECT feature_key 
        FROM features_enabled 
        WHERE customer_id = ${customerId} AND enabled = true
      `);

      const featureKeys = features.map((f: any) => f[0].feature_key);
      res.json({ features: featureKeys });
    } catch (error) {
      console.error('Error fetching features:', error);
      res.status(500).json({ error: 'Failed to fetch features' });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const results = await db.execute(sql`
        SELECT * FROM users WHERE email = ${email} AND role = 'admin'
      `);

       const users = results.rows;

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
       // Assuming the password in the database is stored in the 'password' column
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.get("/api/admin/auth/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const results = await db.execute(sql`
        SELECT id, name, email, role FROM users WHERE id = ${decoded.userId} AND role = 'admin'
      `);

      const users = results.rows;

      if (users.length === 0) {
        return res.status(404).json({ error: 'Admin user not found' });
      }

      res.json({ user: users[0] });
    } catch (error) {
      console.error('Admin auth check error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const [customerCountResult] = await db.execute(sql`
        SELECT COUNT(*) as count FROM users WHERE role = 'customer'
      `);
       const customerCount = customerCountResult.rows[0].count;

      const [integrationCountResult] = await db.execute(sql`
        SELECT COUNT(*) as count FROM integrations
      `);
      const integrationCount = integrationCountResult.rows[0].count;


      res.json({
        totalCustomers: customerCount,
        totalIntegrations: integrationCount,
        monthlyRevenue: '12,847'
      });
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Integration management routes
  app.get("/api/integrations", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id.toString();

      const userIntegrations = await db.query.integrations.findMany({
        where: eq(integrations.customer_id, userId)
      });

      res.json(userIntegrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.get("/api/integrations/available", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const { getAllConnectors } = await import('./integrations/registry');
      const availableConnectors = getAllConnectors().map(connector => ({
        type: connector.type,
        name: connector.name
      }));

      res.json(availableConnectors);
    } catch (error) {
      console.error("Error fetching available integrations:", error);
      res.status(500).json({ error: "Failed to fetch available integrations" });
    }
  });

  app.get("/api/integrations/:type/connect", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const { type } = req.params;
      const userId = req.user!.id.toString();

      const { getConnector } = await import('./integrations/registry');
      const connector = getConnector(type);

      if (!connector) {
        return res.status(404).json({ error: "Integration type not found" });
      }

      const oauthUrl = connector.getOAuthUrl(userId);
      res.json({ url: oauthUrl });
    } catch (error) {
      console.error("Error generating OAuth URL:", error);
      res.status(500).json({ error: "Failed to generate OAuth URL" });
    }
  });

  app.get("/api/integrations/:type/callback", async (req, res) => {
    try {
      const { type } = req.params;
      const { code, state: customerId } = req.query;

      if (!code || !customerId) {
        return res.status(400).json({ error: "Missing code or customer ID" });
      }

      const { getConnector } = await import('./integrations/registry');
      const connector = getConnector(type);

      if (!connector) {
        return res.status(404).json({ error: "Integration type not found" });
      }

      const tokens = await connector.handleOAuthCallback(code as string, customerId as string);

      // Store integration in database
      await db.insert(integrations).values({
        customer_id: customerId as string,
        type,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        is_active: true
      }).onConflictDoUpdate({
        target: [integrations.customer_id, integrations.type],
        set: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          is_active: true,
          updated_at: new Date()
        }
      });

      res.redirect('/dashboard?integration_added=true');
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      res.status(500).json({ error: "Failed to complete integration" });
    }
  });

  app.get("/api/dashboard/metrics", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id.toString();

      // Get user's active integrations
      const userIntegrations = await db.query.integrations.findMany({
        where: and(
          eq(integrations.customer_id, userId),
          eq(integrations.is_active, true)
        )
      });

      if (userIntegrations.length === 0) {
        return res.json({ 
          metrics: [], 
          message: "No integrations configured. Connect a CRM or dialer to see live KPIs." 
        });
      }

      const { getConnector } = await import('./integrations/registry');
      const allMetrics = [];

      // Fetch metrics from each configured integration
      for (const integration of userIntegrations) {
        try {
          const connector = getConnector(integration.type);
          if (connector) {
            const metrics = await connector.fetchKPIs(userId, integration.access_token);
            allMetrics.push(...metrics.map(metric => ({
              ...metric,
              source: connector.name
            })));
          }
        } catch (error) {
          console.error(`Error fetching metrics from ${integration.type}:`, error);
          // Continue with other integrations even if one fails
        }
      }

      res.json({ metrics: allMetrics });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  app.delete("/api/integrations/:type", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const { type } = req.params;
      const userId = req.user!.id.toString();

      await db.update(integrations)
        .set({ is_active: false })
        .where(and(
          eq(integrations.customer_id, userId),
          eq(integrations.type, type)
        ));

      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting integration:", error);
      res.status(500).json({ error: "Failed to disconnect integration" });
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