import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerUser, loginUser, getCurrentUser, authenticateJWT, generateJWT, type AuthenticatedRequest } from "./publicAuth";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";
import { sendEmail } from "./utils/sendEmail";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
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
  app.post("/api/admin/users", requireAdmin, async (req: any, res: any) => {
    try {
      const { name, email, password, role, isActive } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        isActive: isActive !== false
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

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
      const userToImpersonate = await storage.getUserById(userId);

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
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // User routes for customer dashboard
  app.get('/api/user/orders', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id.toString();
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/user/profile', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put('/api/user/profile', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id;
      const { name, email } = req.body;
      
      const updatedUser = await storage.updateUserProfile(userId, { name, email });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // KPI and analytics routes
  app.get('/api/user/kpis', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id.toString();
      const orders = await storage.getUserOrders(userId);
      
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      
      const kpis = {
        totalOrders,
        totalSpent,
        avgOrderValue,
        lastOrderDate: orders.length > 0 ? orders[0].createdAt : null,
        orderTrend: '+12%', // Mock data - would calculate from historical data
        spendingTrend: '+8%', // Mock data
        conversionRate: '3.2%', // Mock data
        satisfactionScore: 4.8 // Mock data
      };
      
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching user KPIs:", error);
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });

  // CRM Integration routes
  app.get('/api/user/integrations', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id;
      const integrations = await storage.getUserIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post('/api/user/integrations', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = req.user!.id;
      const { type, name, apiKey, webhookUrl } = req.body;
      
      const integration = await storage.createUserIntegration({
        userId,
        type,
        name,
        apiKey,
        webhookUrl,
        isActive: true
      });
      
      res.json(integration);
    } catch (error) {
      console.error("Error creating integration:", error);
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.delete('/api/user/integrations/:id', authenticateJWT as any, async (req: any, res: any) => {
    try {
      const integrationId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      const success = await storage.deleteUserIntegration(integrationId, userId);
      if (!success) {
        return res.status(404).json({ message: "Integration not found" });
      }
      
      res.json({ message: "Integration deleted successfully" });
    } catch (error) {
      console.error("Error deleting integration:", error);
      res.status(500).json({ message: "Failed to delete integration" });
    }
  });

  // Admin package management
  app.post('/api/admin/packages', requireAdmin, async (req: any, res: any) => {
    try {
      const { name, price, description, features } = req.body;
      
      const pkg = await storage.createPackage({
        name,
        price,
        description,
        features
      });
      
      res.json(pkg);
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(500).json({ message: "Failed to create package" });
    }
  });

  app.put('/api/admin/packages/:id', requireAdmin, async (req: any, res: any) => {
    try {
      const packageId = parseInt(req.params.id);
      const { name, price, description, features } = req.body;
      
      const pkg = await storage.updatePackage(packageId, {
        name,
        price,
        description,
        features
      });
      
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(pkg);
    } catch (error) {
      console.error("Error updating package:", error);
      res.status(500).json({ message: "Failed to update package" });
    }
  });

  app.delete('/api/admin/packages/:id', requireAdmin, async (req: any, res: any) => {
    try {
      const packageId = parseInt(req.params.id);
      
      const success = await storage.deletePackage(packageId);
      if (!success) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json({ message: "Package deleted successfully" });
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ message: "Failed to delete package" });
    }
  });

  // Admin bulk operations
  app.post('/api/admin/users/bulk', requireAdmin, async (req: any, res: any) => {
    try {
      const { userIds, action, value } = req.body;
      
      let results = [];
      for (const userId of userIds) {
        try {
          switch (action) {
            case 'activate':
              await storage.updateUserStatus(userId, true);
              break;
            case 'deactivate':
              await storage.updateUserStatus(userId, false);
              break;
            case 'delete':
              await storage.deleteUser(userId);
              break;
            case 'updateTier':
              await storage.updateUserPrivileges(userId, { subscriptionTier: value });
              break;
            default:
              throw new Error(`Unknown action: ${action}`);
          }
          results.push({ userId, success: true });
        } catch (error) {
          results.push({ userId, success: false, error: error.message });
        }
      }
      
      res.json({ results });
    } catch (error) {
      console.error("Error performing bulk action:", error);
      res.status(500).json({ message: "Failed to perform bulk action" });
    }
  });

  // Analytics and reporting
  app.get('/api/admin/analytics', requireAdmin, async (req: any, res: any) => {
    try {
      const users = await storage.getAllPublicUsers();
      const orders = await storage.getAllOrders();
      const packages = await storage.getPackages();
      
      const analytics = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive !== false).length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0),
        avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) / orders.length : 0,
        conversionRate: users.length > 0 ? (orders.length / users.length) * 100 : 0,
        topPackages: packages.map(pkg => ({
          ...pkg,
          orders: orders.filter(order => order.packageId === pkg.id).length
        })).sort((a, b) => b.orders - a.orders),
        monthlyGrowth: {
          users: '+12%',
          revenue: '+8%',
          orders: '+15%'
        }
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
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

  // Access Control Routes
  app.get('/api/admin/access/users', requireAdmin, async (req: any, res: any) => {
    try {
      const users = await storage.getAllUsersWithDetails();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users with details:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.patch('/api/admin/access/users/:userId', requireAdmin, auditLog('update_user'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;

      // Store before state for audit
      const beforeUser = await storage.getPublicUserById(userId);
      req.body._before = beforeUser;

      let updatedUser = beforeUser;

      // Handle different types of updates
      if (updates.status) {
        updatedUser = await storage.updateUserStatus(userId, updates.status);
      }
      if (updates.role) {
        updatedUser = await storage.updateUserRole(userId, updates.role);
      }
      if (updates.permissions) {
        updatedUser = await storage.updateUserPermissions(userId, updates.permissions);
      }

      req.body._after = updatedUser;
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

  app.post('/api/admin/access/users/bulk', requireAdmin, auditLog('bulk_update_users'), async (req: any, res: any) => {
    try {
      const { userIds, action, value } = req.body;

      const updates: any = {};
      switch (action) {
        case 'activate':
          updates.status = 'active';
          break;
        case 'suspend':
          updates.status = 'suspended';
          break;
        case 'lock':
          updates.status = 'locked';
          break;
        case 'unlock':
          updates.status = 'active';
          break;
        case 'delete':
          // Handle deletion separately
          for (const userId of userIds) {
            await storage.deleteUser(userId);
          }
          return res.json({ message: 'Users deleted successfully' });
        default:
          return res.status(400).json({ message: 'Invalid bulk action' });
      }

      await storage.bulkUpdateUsers(userIds, updates);
      res.json({ message: 'Bulk update completed' });
    } catch (error) {
      console.error('Error performing bulk update:', error);
      res.status(500).json({ message: 'Failed to perform bulk update' });
    }
  });

  app.get('/api/admin/access/users/:userId/call-metrics', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const metrics = await callMetricsService.getUserCallMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching call metrics:', error);
      res.status(500).json({ message: 'Failed to fetch call metrics' });
    }
  });

  app.post('/api/admin/access/users/:userId/call-metrics/refresh', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const metrics = await callMetricsService.refreshUserMetrics(userId, true);
      res.json(metrics);
    } catch (error) {
      console.error('Error refreshing call metrics:', error);
      res.status(500).json({ message: 'Failed to refresh call metrics' });
    }
  });

  app.get('/api/admin/access/users/:userId/audit', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const logs = await storage.getAuditLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ message: 'Failed to fetch audit logs' });
    }
  });

  app.post('/api/admin/access/users/:userId/dialer-mapping', requireAdmin, auditLog('create_dialer_mapping'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const { provider, externalAgentId, meta } = req.body;

      const mapping = await storage.createDialerMapping({
        userId,
        provider,
        externalAgentId,
        meta
      });

      res.json(mapping);
    } catch (error) {
      console.error('Error creating dialer mapping:', error);
      res.status(500).json({ message: 'Failed to create dialer mapping' });
    }
  });

  app.delete('/api/admin/access/users/:userId/dialer-mapping', requireAdmin, auditLog('delete_dialer_mapping'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.deleteDialerMapping(userId);
      res.json({ message: 'Dialer mapping deleted successfully' });
    } catch (error) {
      console.error('Error deleting dialer mapping:', error);
      res.status(500).json({ message: 'Failed to delete dialer mapping' });
    }
  });

  app.post('/api/admin/access/users/:userId/feature-flags', requireAdmin, auditLog('update_feature_flags'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const { flagKey, value } = req.body;

      await storage.setUserFeatureFlag(userId, flagKey, value);
      res.json({ message: 'Feature flag updated successfully' });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      res.status(500).json({ message: 'Failed to update feature flag' });
    }
  });

  app.post('/api/admin/access/users/:userId/payment-policy', requireAdmin, auditLog('update_payment_policy'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const { allowedMethods } = req.body;

      await storage.setUserPaymentPolicy(userId, allowedMethods);
      res.json({ message: 'Payment policy updated successfully' });
    } catch (error) {
      console.error('Error updating payment policy:', error);
      res.status(500).json({ message: 'Failed to update payment policy' });
    }
  });

  app.post('/api/admin/access/users/:userId/integration-policy', requireAdmin, auditLog('update_integration_policy'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const { provider, allowedScopes } = req.body;

      await storage.setUserIntegrationPolicy(userId, provider, allowedScopes);
      res.json({ message: 'Integration policy updated successfully' });
    } catch (error) {
      console.error('Error updating integration policy:', error);
      res.status(500).json({ message: 'Failed to update integration policy' });
    }
  });

  app.get('/api/admin/access/users/:userId/api-keys', requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const apiKeys = await storage.getUserApiKeys(userId);
      res.json(apiKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      res.status(500).json({ message: 'Failed to fetch API keys' });
    }
  });

  app.post('/api/admin/access/users/:userId/api-keys', requireAdmin, auditLog('create_api_key'), async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.userId);
      const { label, scopes, rateLimitPerMin, ipAllowlist } = req.body;

      // Generate API key
      const apiKey = require('crypto').randomBytes(32).toString('hex');
      const keyHash = require('crypto').createHash('sha256').update(apiKey).digest('hex');

      const createdKey = await storage.createApiKey({
        userId,
        keyHash,
        label,
        scopes: scopes || [],
        rateLimitPerMin,
        ipAllowlist,
        createdBy: req.user!.id
      });

      // Return the key only once
      res.json({ ...createdKey, key: apiKey });
    } catch (error) {
      console.error('Error creating API key:', error);
      res.status(500).json({ message: 'Failed to create API key' });
    }
  });

  app.delete('/api/admin/access/api-keys/:keyId', requireAdmin, auditLog('revoke_api_key'), async (req: any, res: any) => {
    try {
      const keyId = parseInt(req.params.keyId);
      await storage.revokeApiKey(keyId);
      res.json({ message: 'API key revoked successfully' });
    } catch (error) {
      console.error('Error revoking API key:', error);
      res.status(500).json({ message: 'Failed to revoke API key' });
    }
  });

  // Coupon management
  app.get('/api/admin/access/coupons', requireAdmin, async (req: any, res: any) => {
    try {
      const coupons = await storage.getCoupons();
      res.json(coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({ message: 'Failed to fetch coupons' });
    }
  });

  app.post('/api/admin/access/coupons', requireAdmin, auditLog('create_coupon'), async (req: any, res: any) => {
    try {
      const { code, description, discountType, discountValue, maxUses, validFrom, validUntil } = req.body;

      const coupon = await storage.createCoupon({
        code,
        description,
        discountType,
        discountValue,
        maxUses,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        createdBy: req.user!.id
      });

      res.json(coupon);
    } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(500).json({ message: 'Failed to create coupon' });
    }
  });

  // Export users with call metrics
  app.get('/api/admin/access/export/users-with-metrics', requireAdmin, async (req: any, res: any) => {
    try {
      const users = await storage.getAllUsersWithDetails();
      
      // Get call metrics for all users
      const usersWithMetrics = await Promise.all(users.map(async (user) => {
        try {
          const metrics = await callMetricsService.getUserCallMetrics(user.id);
          return { ...user, ...metrics };
        } catch {
          return { ...user, callsToday: 0, calls7d: 0, calls30d: 0, avgHandleTime: 0, occupancy: 0 };
        }
      }));

      const headers = [
        'ID', 'Name', 'Email', 'Role', 'Status', 'Organization', 'Orders', 'Total Spent',
        'Calls Today', 'Calls 7d', 'Calls 30d', 'Avg Handle Time', 'Occupancy', 'Last Login'
      ];

      const csvContent = [
        headers.join(','),
        ...usersWithMetrics.map(user => [
          user.id,
          `"${user.name}"`,
          user.email,
          user.role,
          user.status,
          user.orgId || '',
          user.orderCount,
          user.totalSpent.toFixed(2),
          user.callsToday || 0,
          user.calls7d || 0,
          user.calls30d || 0,
          user.avgHandleTime || 0,
          user.occupancy || 0,
          user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : ''
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="users-with-call-metrics.csv"');
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting users with metrics:', error);
      res.status(500).json({ message: 'Failed to export data' });
    }
  });

  // Import the new access control middleware and services
  const { authenticateJWT, authorize, enforceFeatureFlag, enforcePaymentMethodAllowed, enforceIntegrationPolicy, auditLog } = require('./middleware/accessControl');
  const { callMetricsService } = require('./services/callMetricsService');

  // Update existing routes to use new middleware
  app.use('/api/create-payment-intent', enforcePaymentMethodAllowed);
  app.use('/api/user/integrations', enforceIntegrationPolicy('crm', 'read'));
