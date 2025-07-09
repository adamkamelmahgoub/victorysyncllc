import type { Express } from "express";
import { db } from "./db";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";
import { 
  loginAdmin, 
  getCurrentAdmin, 
  authenticateAdminJWT,
  type AdminAuthenticatedRequest 
} from "./adminAuth";
import {
  loginCustomer,
  registerCustomer,
  getCurrentCustomer,
  authenticateCustomerJWT,
  type CustomerAuthenticatedRequest
} from "./publicAuth";
import { initializeAdminUser } from "./initAdmin";
import { initializeTestCustomer } from "./initCustomer";

export function registerRoutes(app: Express) {
  // Initialize admin and test customer on startup
  initializeAdminUser().catch(console.error);
  initializeTestCustomer().catch(console.error);

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin Authentication Routes
  app.post("/api/admin/auth/login", loginAdmin);
  app.get("/api/admin/auth/me", authenticateAdminJWT, getCurrentAdmin);

  // Customer Authentication Routes
  app.post("/api/auth/login", loginCustomer);
  app.post("/api/auth/register", registerCustomer);
  app.get("/api/auth/me", authenticateCustomerJWT, getCurrentCustomer);

  // Admin Protected Routes
  app.get("/api/admin/users", authenticateAdminJWT, async (req: AdminAuthenticatedRequest, res) => {
    try {
      const users = await storage.getAllPublicUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/orders", authenticateAdminJWT, async (req: AdminAuthenticatedRequest, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/contacts", authenticateAdminJWT, async (req: AdminAuthenticatedRequest, res) => {
    try {
      const contacts = await storage.getAllContactSubmissions();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/integrations", authenticateAdminJWT, async (req: AdminAuthenticatedRequest, res) => {
    try {
      const integrations = await storage.getAllCrmIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.get("/api/admin/tickets", authenticateAdminJWT, async (req: AdminAuthenticatedRequest, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/admin/audit-logs", authenticateAdminJWT, async (req: AdminAuthenticatedRequest, res) => {
    try {
      const logs = await storage.getAuditLogs(100);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Customer Protected Routes
  app.get("/api/customer/dashboard", authenticateCustomerJWT, async (req: CustomerAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const [orders, integrations, tickets] = await Promise.all([
        storage.getUserOrders(userId),
        storage.getUserCrmIntegrations(userId),
        storage.getUserSupportTickets(userId)
      ]);

      res.json({
        user: req.user,
        orders,
        integrations,
        tickets
      });
    } catch (error) {
      console.error("Error fetching customer dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/customer/orders", authenticateCustomerJWT, async (req: CustomerAuthenticatedRequest, res) => {
    try {
      const orders = await storage.getUserOrders(req.user!.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/customer/integrations", authenticateCustomerJWT, async (req: CustomerAuthenticatedRequest, res) => {
    try {
      const integrations = await storage.getUserCrmIntegrations(req.user!.id);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching user integrations:", error);
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.get("/api/customer/tickets", authenticateCustomerJWT, async (req: CustomerAuthenticatedRequest, res) => {
    try {
      const tickets = await storage.getUserSupportTickets(req.user!.id);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  // Public routes
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const submission = await storage.createContactSubmission(req.body);
      res.json({ success: true, submission });
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  if (app.get("env") === "development") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }
}