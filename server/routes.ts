import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerUser, loginUser, getCurrentUser, authenticateJWT, generateJWT, requireAdmin, requireSuperAdmin, logAudit, type AuthenticatedRequest } from "./publicAuth";
import { initializeAdminUser } from "./initAdmin";
import { insertContactSubmissionSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { testDatabaseConnection } from "./db";
import { sendEmail } from "./utils/sendEmail";
import { 
  usersTable, 
  organizationsTable, 
  servicesTable, 
  servicePackagesTable, 
  ordersTable, 
  contactSubmissionsTable, 
  announcementsTable 
} from "./db/schema";
import { eq, desc, and, or, isNull } from "drizzle-orm";
import { createOrderSchema, createContactSubmissionSchema, createAnnouncementSchema } from "@shared/schema";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

// Remove duplicate admin middleware - using the one from publicAuth.ts

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

  // Initialize admin user
  await initializeAdminUser();

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

  // Admin routes - protected by JWT authentication
  app.post("/api/admin/users", authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, email, password, role, isActive, permissions } = req.body;

      // Check if user already exists
      const existingUser = await storage.getPublicUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createPublicUser({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        isActive: isActive !== false,
        permissions: permissions || {}
      });

      // Log audit event
      await logAudit(req.user!.id.toString(), 'create', 'user', user.id.toString(), {
        createdUser: { name, email, role },
        createdBy: req.user!.email
      }, req);

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/admin/users", authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await storage.getAllPublicUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/orders", authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/packages", authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
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
      const user = await storage.getPublicUserById(userId);
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

  // CRM Integration routes
  app.get('/api/crm/integrations', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id.toString();
      const integrations = await storage.getCrmIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching CRM integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post('/api/crm/integrations', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id.toString();
      const { type, name, apiKey, accessToken, refreshToken, webhookUrl, config } = req.body;

      const integration = await storage.createCrmIntegration({
        userId,
        type,
        name,
        apiKey,
        accessToken,
        refreshToken,
        webhookUrl,
        config: config || {},
        isActive: true
      });

      await logAudit(userId, 'create', 'crm_integration', integration.id.toString(), {
        type, name
      }, req);

      res.json(integration);
    } catch (error) {
      console.error("Error creating CRM integration:", error);
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.put('/api/crm/integrations/:id', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const integrationId = parseInt(req.params.id);
      const updates = req.body;

      const integration = await storage.updateCrmIntegration(integrationId, updates);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }

      await logAudit(req.user!.id.toString(), 'update', 'crm_integration', integrationId.toString(), {
        updates
      }, req);

      res.json(integration);
    } catch (error) {
      console.error("Error updating CRM integration:", error);
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  app.delete('/api/crm/integrations/:id', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const integrationId = parseInt(req.params.id);
      const userId = req.user!.id.toString();

      const success = await storage.deleteCrmIntegration(integrationId, userId);
      if (!success) {
        return res.status(404).json({ message: "Integration not found" });
      }

      await logAudit(userId, 'delete', 'crm_integration', integrationId.toString(), {}, req);

      res.json({ message: "Integration deleted successfully" });
    } catch (error) {
      console.error("Error deleting CRM integration:", error);
      res.status(500).json({ message: "Failed to delete integration" });
    }
  });

  // Support Tickets
  app.get('/api/support/tickets', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id.toString();
      const tickets = await storage.getSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post('/api/support/tickets', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id.toString();
      const { title, description, priority } = req.body;

      const ticket = await storage.createSupportTicket({
        userId,
        title,
        description,
        priority: priority || 'medium',
        status: 'open'
      });

      await logAudit(userId, 'create', 'support_ticket', ticket.id.toString(), {
        title, priority
      }, req);

      res.json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  // KPI Metrics
  app.get('/api/kpi/metrics', authenticateJWT as any, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id.toString();
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const metrics = await storage.getKpiMetrics(userId, start, end);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching KPI metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Admin-only routes
  app.get('/api/admin/crm/integrations', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const integrations = await storage.getAllCrmIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching all CRM integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.get('/api/admin/support/tickets', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching all support tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.put('/api/admin/support/tickets/:id', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      const updates = req.body;

      const ticket = await storage.updateSupportTicket(ticketId, {
        ...updates,
        assignedTo: req.user!.id.toString()
      });

      await logAudit(req.user!.id.toString(), 'update', 'support_ticket', ticketId.toString(), {
        updates
      }, req);

      res.json(ticket);
    } catch (error) {
      console.error("Error updating support ticket:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  app.get('/api/admin/kpi/metrics', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const metrics = await storage.getAllKpiMetrics(start, end);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching all KPI metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get('/api/admin/audit-logs', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.post('/api/admin/users/:id/impersonate', authenticateJWT as any, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const userToImpersonate = await storage.getPublicUserById(userId);

      if (!userToImpersonate) {
        return res.status(404).json({ message: "User not found" });
      }

      await logAudit(req.user!.id.toString(), 'impersonate', 'user', userId.toString(), {
        impersonatedUser: userToImpersonate.email,
        impersonatedBy: req.user!.email
      }, req);

      // Generate JWT token for impersonation
      const token = generateJWT(userToImpersonate);
      const { password: _, ...userWithoutPassword } = userToImpersonate;
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error("Error impersonating user:", error);
      res.status(500).json({ message: "Failed to impersonate user" });
    }
  });

  app.get('/api/admin/contact-submissions', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.put('/api/admin/contact-submissions/:id', authenticateJWT as any, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const submissionId = parseInt(req.params.id);
      const updates = req.body;

      const submission = await storage.updateContactSubmission(submissionId, {
        ...updates,
        assignedTo: req.user!.id.toString()
      });

      await logAudit(req.user!.id.toString(), 'update', 'contact_submission', submissionId.toString(), {
        updates
      }, req);

      res.json(submission);
    } catch (error) {
      console.error("Error updating contact submission:", error);
      res.status(500).json({ message: "Failed to update contact submission" });
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
        features: JSON.stringify([
          "1 Dedicated Agent",
          "Business Hours Support",
          "Basic CRM Integration",
          "Email Support",
          "Monthly Reports"
        ]),
      });

      await storage.createPackage({
        name: "Growth",
        price: "2500.00",
        description: "For growing companies",
        features: JSON.stringify([
          "2 Dedicated Agents",
          "Extended Hours Support",
          "Appointment Setting",
          "Advanced CRM Integration",
          "Live Chat Support",
          "Weekly Reports"
        ]),
      });

      await storage.createPackage({
        name: "Scale",
        price: "4500.00",
        description: "For enterprise needs",
        features: JSON.stringify([
          "24/7 Blended Team",
          "AI Automation Suite",
          "Dedicated Success Manager",
          "Custom Integrations",
          "Priority Support",
          "Real-time Analytics"
        ]),
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