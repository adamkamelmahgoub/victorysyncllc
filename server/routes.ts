import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
// ESM-safe __filename/__dirname for tsx/ESM
import { fileURLToPath } from "url";
import path from "path";
import { storage } from "../storage";
import { registerUser, loginUser, getCurrentUser, authenticateJWT, generateJWT, type AuthenticatedRequest } from "./publicAuth";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";
import { sendEmail } from "./utils/sendEmail";
import { Router } from "express";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
}

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  // Simple admin check - in production this should be more robust
  if (req.headers['x-admin-auth'] !== 'admin123') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

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

  // Admin routes - protected by authentication
  app.get("/api/admin/users", requireAdmin, async (req: any, res: any) => {
    try {
      const users = await storage.getAllPublicUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req: any, res: any) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/packages", requireAdmin, async (req: any, res: any) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.patch('/api/admin/users/:id', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;

      const user = await storage.updateUserStatus(userId, isActive);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.delete('/api/admin/users/:id', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);

      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.put('/api/admin/users/:id/status', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;

      const user = await storage.updateUserStatus(userId, isActive);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.delete('/api/admin/users/:id', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);

      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.post('/api/admin/users/:id/orders', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.params.id;
      const { packageId, quantity } = req.body;

      const pkg = await storage.getPackage(packageId);
      if (!pkg) {
        return res.status(400).json({ message: "Package not found" });
      }

      const total = parseFloat(pkg.price) * quantity;

      const order = await storage.createOrder({
        userId,
        total: total.toString(),
        status: 'admin_created',
      });

      await storage.createOrderItem({
        orderId: order.id,
        packageId,
        quantity,
        price: pkg.price,
      });

      res.json(order);
    } catch (error) {
      console.error("Error creating order for user:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/admin/users/:id/privileges', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { privileges } = req.body;

      const user = await storage.updateUserPrivileges(userId, privileges);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user privileges:", error);
      res.status(500).json({ message: "Failed to update user privileges" });
    }
  });

  app.post('/api/admin/users/:id/impersonate', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const userToImpersonate = await storage.getPublicUserById(userId);

      if (!userToImpersonate) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate JWT token for impersonation
      const token = generateJWT(userToImpersonate);
      res.json({ token, user: userToImpersonate });
    } catch (error) {
      console.error("Error impersonating user:", error);
      res.status(500).json({ message: "Failed to impersonate user" });
    }
  });

  app.get('/api/admin/export/:type', requireAdmin, async (req: any, res: any) => {
    try {
      const { type } = req.params;
      let data = [];
      let filename = '';

      switch (type) {
        case 'users':
          data = await storage.getAllPublicUsers();
          filename = 'users-export.csv';
          break;
        case 'orders':
          data = await storage.getAllOrders();
          filename = 'orders-export.csv';
          break;
        default:
          return res.status(400).json({ message: 'Invalid export type' });
      }

      // Simple CSV generation
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${(row as any)[header] || ''}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Add 404 handler for API routes that don't exist
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // --- New routes for access code signup flow ---
  const api = Router();

  api.get("/health", (_req,res)=>res.json({ok:true, ts:Date.now()}));
  api.get("/auth/check", (_req,res)=>res.json({ ok:true, authenticated:false, user:null }));

  type AccessCode={ code:string; orgNumber:string; orgName?:string; emailDomain?:string };
  type OtpEntry={ key:string; otp:string; expiresAt:number };
  const CODES_PATH=path.join(__dirname,"data","access-codes.json");
  const OTPS_PATH=path.join(__dirname,"data","otps.json");
  function readJson<T>(p:string,f:T):T{ try{return JSON.parse(fs.readFileSync(p,"utf8")) as T;}catch{return f;} }
  function writeJson<T>(p:string,d:T){ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,JSON.stringify(d,null,2)); }
  const genOtp=(n=6)=>Array.from({length:n},()=>Math.floor(Math.random()*10)).join("");

  // Verify
  api.post("/access/verify",(req,res)=>{
    const { accessCode, name, email, phone, orgNumber } = req.body??{};
    if(!accessCode||!name||!email||!phone||!orgNumber) return res.status(400).json({ok:false,error:"Missing required fields"});
    const codes=readJson<AccessCode[]>(CODES_PATH,[]); const found=codes.find(c=>c.code===accessCode);
    if(!found) return res.status(404).json({ok:false,error:"Invalid access code"});
    if(found.orgNumber && String(found.orgNumber)!==String(orgNumber)) return res.status(400).json({ok:false,error:"Organization number mismatch"});
    if(found.emailDomain && !String(email).toLowerCase().endsWith(`@${found.emailDomain.toLowerCase()}`)) return res.status(400).json({ok:false,error:`Email must end with @${found.emailDomain}`});
    res.json({ok:true, orgName:found.orgName??null});
  });

  // Request OTP
  api.post("/access/request-otp",(req,res)=>{
    const { accessCode, email, phone } = req.body??{}; if(!accessCode||!email) return res.status(400).json({ok:false,error:"Missing accessCode or email"});
    const otps=readJson<OtpEntry[]>(OTPS_PATH,[]); const key=`${accessCode}|${String(email).toLowerCase()}`;
    const otp=genOtp(6); const expiresAt=Date.now()+5*60*1000;
    const i=otps.findIndex(o=>o.key===key); if(i>-1) otps[i]={key,otp,expiresAt}; else otps.push({key,otp,expiresAt}); writeJson(OTPS_PATH,otps);
    const devOtp=process.env.NODE_ENV!=="production"?otp: undefined; console.log(`[OTP] ${otp} -> ${email}${phone? " / "+phone: ""} for ${accessCode}`);
    res.json({ok:true, devOtp});
  });

  // Confirm OTP
  api.post("/access/confirm-otp",(req,res)=>{
    const { accessCode, email, otp } = req.body??{}; if(!accessCode||!email||!otp) return res.status(400).json({ok:false,error:"Missing fields"});
    const otps=readJson<OtpEntry[]>(OTPS_PATH,[]); const key=`${accessCode}|${String(email).toLowerCase()}`; const e=otps.find(o=>o.key===key);
    if(!e) return res.status(400).json({ok:false,error:"No OTP pending"}); if(Date.now()>e.expiresAt) return res.status(400).json({ok:false,error:"OTP expired"});
    if(String(e.otp)!==String(otp)) return res.status(400).json({ok:false,error:"Invalid OTP"}); writeJson(OTPS_PATH,otps.filter(o=>o.key!==key)); res.json({ok:true});
  });

  app.use('/api', api);

  const httpServer = createServer(app);
  return httpServer;
}

// Export the API router for external use if needed
export { api };
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