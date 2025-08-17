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
import { seedDefaultPackages } from "./db/seed";

import { Router } from "express"
import auth from "./routes/auth"
import mfa from "./routes/auth.mfa"
import billing from "./routes/billing.full"
import apikeys from "./routes/apikeys"
import webhooks from "./routes/webhooks"
import integrations from "./routes/integrations.index"
import kpi from "./routes/kpi"
import orders from "./routes/orders"
import exportsCsv from "./routes/exports"

import adminUsers from "./routes/admin.users"
import adminOrgs from "./routes/admin.orgs"
import adminFlags from "./routes/admin.flags"
import adminAccess from "./routes/admin.access-codes"
import adminPaymentRules from "./routes/admin.payment-rules"


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
  await seedDefaultPackages();

  // Initialize admin user
  await initializeAdminUser();

  const r = Router()

  r.use("/auth", auth)
  r.use("/auth/mfa", mfa)

  r.use("/billing", billing)
  r.use("/apikeys", apikeys)
  r.use("/webhooks", webhooks)
  r.use("/integrations", integrations)
  r.use("/kpi", kpi)
  r.use("/orders", orders)
  r.use("/exports", exportsCsv)

  r.use("/admin/users", adminUsers)
  r.use("/admin/orgs", adminOrgs)
  r.use("/admin/flags", adminFlags)
  r.use("/admin/access-codes", adminAccess)
  r.use("/admin/payment-rules", adminPaymentRules)

  app.use('/api', r); // Mount the router at /api

  // Add 404 handler for API routes that don't exist
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });


  const httpServer = createServer(app);
  return httpServer;
}