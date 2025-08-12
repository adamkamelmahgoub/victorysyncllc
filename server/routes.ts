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

  // Access Control Center API Routes
  app.get("/api/admin/access/users", requireAdmin, async (req: any, res: any) => {
    try {
      const { page = 1, limit = 50, search = '', role, status } = req.query;
      const users = await storage.getAllPublicUsers();
      
      // Filter users based on search and filters
      let filteredUsers = users.filter((user: any) => {
        const matchesSearch = !search || 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !role || user.role === role;
        const matchesStatus = !status || user.status === status;
        
        return matchesSearch && matchesRole && matchesStatus;
      });
      
      // Add calculated fields
      filteredUsers = filteredUsers.map((user: any) => ({
        ...user,
        orderCount: user.orderCount || 0,
        totalSpent: user.totalSpent || 0,
        permissions: user.permissions || [],
        featureFlags: user.featureFlags || [],
        isLinkedToDialer: false, // TODO: Get from dialer mapping
        accountLocked: user.status === 'locked',
        mfaEnabled: user.mfaEnabled || false
      }));
      
      const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + parseInt(limit as string));
      
      res.json({ 
        users: paginatedUsers, 
        total: filteredUsers.length, 
        page: parseInt(page as string), 
        limit: parseInt(limit as string) 
      });
    } catch (error) {
      console.error("Error fetching access control users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/access/users/:id", requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getPublicUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get basic user details with mock data for features not yet implemented
      res.json({
        ...user,
        sessions: [],
        integrations: [],
        apiKeys: [],
        callMetrics: null,
        paymentPolicy: null,
        auditLogs: []
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });

  app.get("/api/admin/access/users/:id/call-metrics", requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Mock call metrics data
      res.json({
        callsToday: Math.floor(Math.random() * 50),
        calls7d: Math.floor(Math.random() * 200),
        calls30d: Math.floor(Math.random() * 800),
        avgHandleTime: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        occupancy: Math.floor(Math.random() * 80) + 20, // 20-100%
        liveStatus: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)],
        isLinked: Math.random() > 0.5,
        lastUpdated: new Date().toISOString(),
        isStale: Math.random() > 0.8
      });
    } catch (error) {
      console.error("Error fetching call metrics:", error);
      res.status(500).json({ message: "Failed to fetch call metrics" });
    }
  });

  app.post("/api/admin/access/users/:id/call-metrics/refresh", requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Mock refresh - in reality would fetch from dialer API
      res.json({ success: true, refreshedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Error refreshing call metrics:", error);
      res.status(500).json({ message: "Failed to refresh call metrics" });
    }
  });

  app.get("/api/admin/access/users/:id/audit", requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Mock audit log data
      const mockAuditLogs = [
        {
          id: 1,
          actorUserId: 1,
          targetUserId: userId,
          action: 'user.status.update',
          before: { status: 'suspended' },
          after: { status: 'active' },
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
        },
        {
          id: 2,
          actorUserId: 1,
          targetUserId: userId,
          action: 'user.permissions.update',
          after: { permissions: ['users:read', 'orders:read'] },
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
        }
      ];
      
      res.json(mockAuditLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.patch("/api/admin/access/users/:id", requireAdmin, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      // Handle status updates
      if (updates.status) {
        const user = await storage.updateUserStatus(userId, updates.status === 'active');
        return res.json(user);
      }

      // Handle role updates
      if (updates.role) {
        const user = await storage.updateUserRole(userId, updates.role);
        return res.json(user);
      }

      // Handle permission updates
      if (updates.permissions) {
        const user = await storage.updateUserPermissions(userId, updates.permissions);
        return res.json(user);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/admin/access/users/bulk", requireAdmin, async (req: any, res: any) => {
    try {
      const { userIds, action } = req.body;
      
      let results = [];
      for (const userId of userIds) {
        try {
          switch (action) {
            case 'activate':
              await storage.updateUserStatus(userId, true);
              break;
            case 'suspend':
              await storage.updateUserStatus(userId, false);
              break;
            case 'delete':
              await storage.deleteUser(userId);
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

  app.patch("/api/admin/access/users/:id/role", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      const actorId = req.user!.id;

      const user = await storage.updateUserRole(userId, role);
      
      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        targetUserId: userId,
        action: 'user.role.update',
        after: { role },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.patch("/api/admin/access/users/:id/permissions", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { permissions } = req.body;
      const actorId = req.user!.id;

      const user = await storage.updateUserPermissions(userId, permissions);
      
      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        targetUserId: userId,
        action: 'user.permissions.update',
        after: { permissions },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating user permissions:", error);
      res.status(500).json({ message: "Failed to update user permissions" });
    }
  });

  app.patch("/api/admin/access/users/:id/feature-flags", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { flags } = req.body;
      const actorId = req.user!.id;

      await storage.updateUserFeatureFlags(userId, flags);
      
      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        targetUserId: userId,
        action: 'user.feature_flags.update',
        after: { flags },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user feature flags:", error);
      res.status(500).json({ message: "Failed to update feature flags" });
    }
  });

  app.post("/api/admin/access/users/:id/sessions/revoke-all", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const actorId = req.user!.id;

      await storage.revokeAllAccessControlSessions(userId);
      
      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        targetUserId: userId,
        action: 'user.sessions.revoke_all',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error revoking user sessions:", error);
      res.status(500).json({ message: "Failed to revoke sessions" });
    }
  });

  app.patch("/api/admin/access/users/:id/payment-policy", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { allowedMethods } = req.body;
      const actorId = req.user!.id;

      const policy = await storage.setAccessControlPaymentPolicy(userId, allowedMethods);
      
      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        targetUserId: userId,
        action: 'user.payment_policy.update',
        after: { allowedMethods },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(policy);
    } catch (error) {
      console.error("Error updating payment policy:", error);
      res.status(500).json({ message: "Failed to update payment policy" });
    }
  });

  app.post("/api/admin/access/users/:id/api-keys", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const userId = parseInt(req.params.id);
      const { label, scopes } = req.body;
      const actorId = req.user!.id;

      // Generate API key
      const crypto = await import('crypto');
      const apiKey = crypto.randomBytes(32).toString('hex');
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const createdKey = await storage.createApiKey({
        userId,
        keyHash,
        label,
        scopes,
        createdBy: actorId
      });

      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        targetUserId: userId,
        action: 'user.api_key.create',
        after: { label, scopes },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ ...createdKey, apiKey }); // Return key only once
    } catch (error) {
      console.error("Error creating API key:", error);
      res.status(500).json({ message: "Failed to create API key" });
    }
  });

  app.delete("/api/admin/access/api-keys/:keyId", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const keyId = parseInt(req.params.keyId);
      const actorId = req.user!.id;

      const success = await storage.revokeApiKey(keyId);
      
      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        action: 'api_key.revoke',
        after: { keyId },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success });
    } catch (error) {
      console.error("Error revoking API key:", error);
      res.status(500).json({ message: "Failed to revoke API key" });
    }
  });

  // Roles management
  app.get("/api/admin/access/roles", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const roles = await storage.getAccessControlRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post("/api/admin/access/roles", authenticateJWT as any, async (req: any, res: any) => {
    try {
      const { name, description, permissions } = req.body;
      const actorId = req.user!.id;

      const role = await storage.createAccessControlRole({
        name,
        description,
        permissions,
        isSystem: false
      });

      // Audit log
      await storage.auditLog({
        actorUserId: actorId,
        action: 'role.create',
        after: { name, description, permissions },
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Failed to create role" });
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

  const httpServer = createServer(app);
  return httpServer;
}

async function initializePackages() {
  const existingPackages = await storage.getPackages();
  
  if (existingPackages.length === 0) {
    const defaultPackages = [
      {
        name: "Starter Package",
        price: "99.00",
        description: "Perfect for small businesses getting started with customer engagement",
        features: ["Basic CRM Integration", "Email Marketing", "Customer Support"]
      },
      {
        name: "Professional Package", 
        price: "299.00",
        description: "Comprehensive solution for growing businesses",
        features: ["Advanced CRM Integration", "Multi-channel Marketing", "Analytics Dashboard", "Priority Support"]
      },
      {
        name: "Enterprise Package",
        price: "599.00", 
        description: "Full-featured solution for large organizations",
        features: ["Custom CRM Integration", "AI-Powered Analytics", "White-label Solution", "Dedicated Account Manager"]
      }
    ];

    for (const pkg of defaultPackages) {
      await storage.createPackage(pkg);
    }
  }
}

