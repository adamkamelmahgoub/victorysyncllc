var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import { fileURLToPath } from "url";
import { dirname } from "path";
import express2 from "express";
import fs2 from "fs";

// server/routes.ts
import { createServer } from "http";
import Stripe from "stripe";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactSubmissions: () => contactSubmissions,
  entitlements: () => entitlements,
  features: () => features,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  integrations: () => integrations,
  loginSchema: () => loginSchema,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  organizations: () => organizations,
  packages: () => packages,
  packagesRelations: () => packagesRelations,
  publicUsers: () => publicUsers,
  registerUserSchema: () => registerUserSchema,
  sessions: () => sessions
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var publicUsers = pgTable("public_users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  provider: varchar("provider").default("local"),
  // local, google, facebook, apple
  providerId: varchar("provider_id"),
  socialAccounts: jsonb("social_accounts").default([]),
  // Array of connected providers
  createdAt: timestamp("created_at").defaultNow()
});
var packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  features: jsonb("features").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  status: varchar("status").default("pending"),
  // pending, processing, completed, cancelled
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  packageId: integer("package_id").references(() => packages.id),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  company: varchar("company"),
  message: text("message").notNull(),
  status: varchar("status").default("new"),
  // new, contacted, resolved
  createdAt: timestamp("created_at").defaultNow()
});
var ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  package: one(packages, {
    fields: [orderItems.packageId],
    references: [packages.id]
  })
}));
var packagesRelations = relations(packages, ({ many }) => ({
  orderItems: many(orderItems)
}));
var organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  planId: varchar("plan_id").default("scale"),
  timezone: varchar("timezone").default("America/New_York"),
  createdAt: timestamp("created_at").defaultNow()
});
var features = pgTable("features", {
  id: varchar("id").primaryKey(),
  code: varchar("code").unique().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  enabled: boolean("enabled").default(true)
});
var entitlements = pgTable("entitlements", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  featureId: varchar("feature_id").notNull(),
  enabled: boolean("enabled").default(true),
  value: text("value")
});
var integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  customer_id: text("customer_id").notNull(),
  type: text("type").notNull(),
  // 'hubspot', 'salesforce', 'five9', etc.
  access_token: text("access_token").notNull(),
  refresh_token: text("refresh_token"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true
});
var registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/\d/, "Password must contain at least one number")
});
var loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
console.log(`\u{1F517} Connecting to database...`);
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 1e4
});
pool.on("connect", () => {
  console.log("\u2705 Database connection established");
});
pool.on("error", (err) => {
  console.error("\u274C Database connection error:", err);
});
var db = drizzle({ client: pool, schema: schema_exports });
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("\u2705 Database connection test successful");
    return true;
  } catch (error) {
    console.error("\u274C Database connection test failed:", error);
    return false;
  }
}

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  // Public user operations
  async createPublicUser(user) {
    const [newUser] = await db.insert(publicUsers).values(user).returning();
    return newUser;
  }
  async getPublicUserByEmail(email) {
    const [user] = await db.select().from(publicUsers).where(eq(publicUsers.email, email));
    return user;
  }
  async getPublicUserById(id) {
    const [user] = await db.select().from(publicUsers).where(eq(publicUsers.id, id));
    return user;
  }
  async updatePublicUserSocialAccounts(id, socialAccounts) {
    const [user] = await db.update(publicUsers).set({ socialAccounts }).where(eq(publicUsers.id, id)).returning();
    return user;
  }
  // Package operations
  async getPackages() {
    return await db.select().from(packages).where(eq(packages.isActive, true));
  }
  async getPackage(id) {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }
  async createPackage(pkg) {
    const [newPackage] = await db.insert(packages).values(pkg).returning();
    return newPackage;
  }
  // Order operations
  async createOrder(order) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async getUserOrders(userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
  async updateOrderStatus(id, status) {
    const [order] = await db.update(orders).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, id)).returning();
    return order;
  }
  // Order item operations
  async createOrderItem(item) {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }
  async getOrderItems(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  // Contact submissions
  async createContactSubmission(submission) {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }
  async getContactSubmissions() {
    return await db.select().from(contactSubmissions);
  }
};
var storage = new DatabaseStorage();

// server/publicAuth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// server/utils/sendEmail.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "victorysynccx@gmail.com",
    pass: "xclg yyts nmwo ogfa"
  }
});
var sendEmail = async ({ subject, text: text2 }) => {
  try {
    await transporter.sendMail({
      from: "victorysynccx@gmail.com",
      to: "victorysynccx@gmail.com",
      subject,
      text: text2
    });
    console.log(`\u2705 Email sent successfully: ${subject}`);
  } catch (error) {
    console.error(`\u274C Failed to send email: ${subject}`, error);
  }
};

// server/publicAuth.ts
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
var hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
var comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
var generateJWT = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
};
var verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
var authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    const decoded = verifyJWT(token);
    const user = await storage.getPublicUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid token - user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
var registerUser = async (req, res) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const existingUser = await storage.getPublicUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const passwordHash = await hashPassword(validatedData.password);
    const newUser = await storage.createPublicUser({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      provider: "local"
    });
    const token = generateJWT(newUser);
    await sendEmail({
      subject: "New User Signup",
      text: `A new user just signed up:

Name: ${newUser.name}
Email: ${newUser.email}`
    });
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};
var loginUser = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await storage.getPublicUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (!user.passwordHash) {
      return res.status(401).json({ error: "Please use social login for this account" });
    }
    const isValidPassword = await comparePassword(validatedData.password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateJWT(user);
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Login failed" });
  }
};
var getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { passwordHash: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
};

// server/initAdmin.ts
import bcrypt2 from "bcryptjs";
async function initializeAdminUser() {
  try {
    const existingAdmin = await storage.getPublicUserByEmail("kimo8723@victorysync.com");
    if (existingAdmin) {
      console.log("\u2705 Admin user already exists");
      return;
    }
    const hashedPassword = await bcrypt2.hash("Mshmsh7184365700!", 10);
    const adminUser = await storage.createPublicUser({
      name: "Victory Sync Admin",
      email: "kimo8723@victorysync.com",
      passwordHash: hashedPassword,
      provider: "local",
      isActive: true,
      privileges: {
        canManageUsers: true,
        canViewAllOrders: true,
        canManageIntegrations: true,
        canViewAnalytics: true,
        canImpersonate: true,
        canManageSettings: true,
        role: "super_admin"
      }
    });
    console.log("\u2705 Admin user created successfully:", adminUser.email);
    return adminUser;
  } catch (error) {
    console.error("\u274C Failed to create admin user:", error);
    throw error;
  }
}

// server/routes.ts
import { z as z2 } from "zod";

// shared/routes.ts
var PUBLIC_ROUTES = /* @__PURE__ */ new Set([
  "/",
  "/services",
  "/pricing",
  "/about",
  "/about-us",
  "/contact",
  "/book-call",
  "/platform",
  "/inbound-support",
  "/appointment-setting",
  "/cold-calling",
  "/ai-automation",
  "/blog",
  "/careers",
  "/help-center",
  "/docs",
  "/privacy-policy",
  "/terms",
  "/checkout",
  "/register",
  "/signup",
  "/login",
  "/dashboard"
]);
var BLOG_SLUGS = /* @__PURE__ */ new Set([
  "reduce-customer-service-costs",
  "ai-automation-vs-human-touch",
  "when-to-outsource-call-center",
  "building-customer-loyalty",
  "scaling-outsourced-support",
  "roi-of-customer-service"
]);
function isKnownRoute(pathname) {
  const clean = pathname.split("?")[0].replace(/\/$/, "") || "/";
  if (PUBLIC_ROUTES.has(clean)) return true;
  const blogMatch = clean.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return BLOG_SLUGS.has(blogMatch[1]);
  return false;
}
var SITEMAP_ENTRIES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/book-call", changefreq: "monthly", priority: "0.8" },
  { path: "/inbound-support", changefreq: "monthly", priority: "0.9" },
  { path: "/appointment-setting", changefreq: "monthly", priority: "0.9" },
  { path: "/cold-calling", changefreq: "monthly", priority: "0.9" },
  { path: "/ai-automation", changefreq: "monthly", priority: "0.8" },
  { path: "/platform", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/about-us", changefreq: "monthly", priority: "0.7" },
  { path: "/careers", changefreq: "monthly", priority: "0.5" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  ...Array.from(BLOG_SLUGS).map((slug) => ({
    path: `/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.6"
  })),
  { path: "/help-center", changefreq: "monthly", priority: "0.5" },
  { path: "/docs", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" }
];

// server/routes.ts
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil"
  });
}
async function registerRoutes(app2) {
  app2.get("/health", async (_req, res) => {
    try {
      const dbConnected = await testDatabaseConnection();
      const healthStatus = {
        status: dbConnected ? "healthy" : "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: process.env.NODE_ENV || "development",
        port: Number(process.env.PORT || 5e3),
        database: dbConnected ? "connected" : "disconnected",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      };
      const statusCode = dbConnected ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Health check failed",
        environment: process.env.NODE_ENV || "development"
      });
    }
  });
  const BASE_URL2 = "https://victorysync.com";
  app2.get("/sitemap.xml", (_req, res) => {
    const urls = SITEMAP_ENTRIES.map(
      ({ path: path3, changefreq, priority }) => `  <url>
    <loc>${BASE_URL2}${path3}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    ).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.set("Content-Type", "application/xml").send(xml);
  });
  await initializePackages();
  await initializeAdminUser();
  app2.post("/api/auth/register", registerUser);
  app2.post("/api/auth/login", loginUser);
  app2.get("/api/auth/me", authenticateJWT, getCurrentUser);
  app2.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
  app2.get("/api/packages", async (req, res) => {
    try {
      const packages2 = await storage.getPackages();
      res.json(packages2);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app2.get("/api/packages/:id", async (req, res) => {
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
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      await sendEmail({
        subject: "New Contact Form Submission",
        text: `Name: ${validatedData.firstName} ${validatedData.lastName}
Email: ${validatedData.email}
Message:
${validatedData.message}`
      });
      res.json(submission);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });
  app2.post("/api/create-payment-intent", authenticateJWT, async (req, res) => {
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
      let total = 0;
      for (const item of items) {
        const pkg = await storage.getPackage(item.packageId);
        if (!pkg) {
          return res.status(400).json({ message: `Package ${item.packageId} not found` });
        }
        total += parseFloat(pkg.price) * item.quantity;
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.id.toString(),
          items: JSON.stringify(items)
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/orders", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id.toString();
      const { items, total, stripePaymentIntentId } = req.body;
      const order = await storage.createOrder({
        userId,
        total: total.toString(),
        stripePaymentIntentId,
        status: "pending"
      });
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          packageId: item.packageId,
          quantity: item.quantity,
          price: item.price.toString()
        });
      }
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id.toString();
      const orders2 = await storage.getUserOrders(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", authenticateJWT, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.user.id.toString();
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
  app2.get("/api/user/orders", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id.toString();
      const orders2 = await storage.getUserOrders(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/user/profile", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app2.put("/api/user/profile", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app2.get("/api/user/kpis", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id.toString();
      const orders2 = await storage.getUserOrders(userId);
      const totalOrders = orders2.length;
      const totalSpent = orders2.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const kpis = {
        totalOrders,
        totalSpent,
        avgOrderValue,
        lastOrderDate: orders2.length > 0 ? orders2[0].createdAt : null,
        orderTrend: "+12%",
        // Mock data - would calculate from historical data
        spendingTrend: "+8%",
        // Mock data
        conversionRate: "3.2%",
        // Mock data
        satisfactionScore: 4.8
        // Mock data
      };
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching user KPIs:", error);
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });
  app2.get("/api/user/integrations", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const integrations2 = await storage.getUserIntegrations(userId);
      res.json(integrations2);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });
  app2.post("/api/user/integrations", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app2.delete("/api/user/integrations/:id", authenticateJWT, async (req, res) => {
    try {
      const integrationId = parseInt(req.params.id);
      const userId = req.user.id;
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
  app2.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function initializePackages() {
  try {
    console.log("\u{1F4E6} Initializing default packages...");
    const existingPackages = await storage.getPackages();
    console.log(`Found ${existingPackages.length} existing packages`);
    if (existingPackages.length === 0) {
      console.log("Creating default packages...");
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
        ]
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
        ]
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
        ]
      });
      console.log("\u2705 Default packages created successfully");
    } else {
      console.log("\u2705 Packages already exist, skipping initialization");
    }
  } catch (error) {
    console.error("\u274C Error initializing packages:", error);
    throw error;
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pathname = url.split("?")[0];
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      const status = isKnownRoute(pathname) ? 200 : 404;
      res.status(status).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (req, res) => {
    const status = isKnownRoute(req.path) ? 200 : 404;
    res.status(status).sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/auth/passport.ts
import passport from "passport";
var passport_default = passport;

// shared/blogPosts.ts
var blogPostsMeta = [
  {
    slug: "reduce-customer-service-costs",
    title: "How to Reduce Customer Service Costs by 60% Without Sacrificing Quality",
    excerpt: "Discover proven strategies that successful businesses use to dramatically cut customer service expenses while improving customer satisfaction scores.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    slug: "ai-automation-vs-human-touch",
    title: "The Future of Customer Service: AI Automation vs Human Touch",
    excerpt: "Exploring the perfect balance between artificial intelligence and human empathy in modern customer service operations.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    slug: "when-to-outsource-call-center",
    title: "5 Signs Your Business Needs Professional Call Center Services",
    excerpt: "Learn to identify the key indicators that suggest it's time to outsource your customer support operations to professionals.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
  },
  {
    slug: "building-customer-loyalty",
    title: "Building Customer Loyalty Through Exceptional Support Experiences",
    excerpt: "How to turn customer service interactions into relationship-building opportunities that drive long-term business growth.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    slug: "scaling-outsourced-support",
    title: "Scaling Your Business with Outsourced Customer Support",
    excerpt: "A comprehensive guide to successfully implementing outsourced support solutions that grow with your business needs.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80"
  },
  {
    slug: "roi-of-customer-service",
    title: "The ROI of Professional Customer Service: A Data-Driven Analysis",
    excerpt: "Real numbers and case studies showing the measurable impact of professional customer service on business performance.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  }
];

// server/meta.ts
var BASE_URL = "https://victorysync.com";
var DEFAULT_IMAGE = `${BASE_URL}/LOGO_VS.png`;
var STATIC_ROUTES = {
  "/": {
    title: "VictorySync | US-Managed Call Center & Appointment Setting",
    description: "VictorySync helps US businesses scale inbound support, outbound calling, appointment setting, lead follow-up, and customer engagement with US-managed operations.",
    ogType: "website"
  },
  "/about": {
    title: "About VictorySync | US-Managed Contact Center, Millstone NJ",
    description: "VictorySync is a US-managed contact center with trained agents in Cairo, Egypt. We help US businesses scale support and sales without in-house hiring overhead."
  },
  "/platform": {
    title: "Platform | VictorySync Contact Center Technology",
    description: "VictorySync platform capabilities: AI call summaries, CRM integrations, real-time dashboards, and workflow automation for US contact center operations."
  },
  "/pricing": {
    title: "Pricing | VictorySync Contact Center Services",
    description: "Transparent, flexible pricing for US contact center services. From starter inbound support to full-service AI-powered automation. Starting from $10/hr."
  },
  "/contact": {
    title: "Contact VictorySync | Get a Free Quote",
    description: "Contact VictorySync to discuss your contact center needs. Schedule a free strategy call or send us a message. Based in Millstone, NJ."
  },
  "/book-call": {
    title: "Book a Free Strategy Call | VictorySync Contact Center",
    description: "Schedule a free 30-minute strategy call with VictorySync. Discover how US-managed contact center services can reduce your customer service costs by up to 60%."
  },
  "/careers": {
    title: "Careers at VictorySync | Join Our Contact Center Team",
    description: "VictorySync is hiring customer service representatives, appointment setters, and operations staff. Remote and Millstone NJ positions available."
  },
  "/help-center": {
    title: "Help Center | VictorySync Support & Documentation",
    description: "Get help with VictorySync services. Browse guides, FAQs, and support articles on inbound support, appointment setting, and AI automation."
  },
  "/docs": {
    title: "Documentation | VictorySync Integration & API Guides",
    description: "Technical documentation for VictorySync integrations, webhooks, and reporting APIs. Connect your CRM, calendar, and communication tools."
  },
  "/privacy-policy": {
    title: "Privacy Policy | VictorySync",
    description: "VictorySync privacy policy \u2014 how we collect, use, and protect your personal information when you use our contact center services."
  },
  "/terms": {
    title: "Terms of Service | VictorySync",
    description: "VictorySync terms of service \u2014 the terms and conditions governing use of our contact center and AI automation services."
  },
  "/blog": {
    title: "Blog | Contact Center & Customer Service Insights | VictorySync",
    description: "Tips, guides, and insights on inbound support, appointment setting, cold calling, and AI automation for US businesses. From the VictorySync team.",
    ogType: "website"
  }
};
function getRouteMeta(pathname) {
  if (STATIC_ROUTES[pathname]) {
    return STATIC_ROUTES[pathname];
  }
  const blogSlugMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogSlugMatch) {
    const slug = blogSlugMatch[1];
    const post = blogPostsMeta.find((p) => p.slug === slug);
    if (post) {
      return {
        title: `${post.title} | VictorySync Blog`,
        description: post.excerpt,
        ogType: "article",
        ogImage: post.image,
        canonical: `${BASE_URL}/blog/${post.slug}`
      };
    }
    return {
      title: "Blog | VictorySync",
      description: "Read insights and guides from the VictorySync contact center team.",
      ogType: "article"
    };
  }
  return null;
}
function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function injectRouteMeta(html, pathname) {
  const meta = getRouteMeta(pathname);
  if (!meta) return html;
  const canonical = meta.canonical ?? `${BASE_URL}${pathname}`;
  const image = meta.ogImage ?? DEFAULT_IMAGE;
  const ogType = meta.ogType ?? "website";
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);
  const canonicalEsc = escapeAttr(canonical);
  const imageEsc = escapeAttr(image);
  let result = html;
  result = result.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  result = result.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${description}$2`
  );
  result = result.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  );
  result = result.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${description}$2`
  );
  result = result.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonicalEsc}$2`
  );
  result = result.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
    `$1${imageEsc}$2`
  );
  result = result.replace(
    /(<meta\s+property="og:type"\s+content=")[^"]*(")/,
    `$1${ogType}$2`
  );
  result = result.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  );
  result = result.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${description}$2`
  );
  result = result.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${imageEsc}$2`
  );
  result = result.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonicalEsc}$2`
  );
  return result;
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
globalThis.__dirname = dirname(fileURLToPath(import.meta.url));
function validateEnvironment() {
  const requiredEnvVars = ["DATABASE_URL"];
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missing.length > 0) {
    console.error(
      `\u274C Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }
  console.log(`\u2705 All required environment variables are set`);
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(passport_default.initialize());
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  const pathname = req.path;
  const originalEnd = res.end.bind(res);
  res.end = function(chunk, encoding, callback) {
    if (chunk) {
      const str = Buffer.isBuffer(chunk) ? chunk.toString("utf-8") : typeof chunk === "string" ? chunk : null;
      if (str && str.includes("<!DOCTYPE html>")) {
        const injected = injectRouteMeta(str, pathname);
        const buf = Buffer.from(injected, "utf-8");
        res.removeHeader("content-length");
        res.setHeader("content-length", buf.byteLength);
        return originalEnd(buf, encoding, callback);
      }
    }
    return originalEnd(chunk, encoding, callback);
  };
  const originalSendFile = res.sendFile.bind(res);
  res.sendFile = function(filePath, options, fn) {
    if (typeof filePath === "string" && filePath.endsWith("index.html")) {
      fs2.readFile(filePath, "utf-8", (err, data) => {
        if (err) return originalSendFile(filePath, options, fn);
        const injected = injectRouteMeta(data, pathname);
        res.set("Content-Type", "text/html; charset=utf-8");
        res.removeHeader("content-length");
        originalEnd(Buffer.from(injected, "utf-8"));
      });
    } else {
      return originalSendFile(filePath, options, fn);
    }
  };
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    console.log(`\u{1F680} Starting VictorySync application...`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    validateEnvironment();
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error("Database connection failed - cannot start server");
    }
    const server = await registerRoutes(app);
    console.log(`\u2705 Routes registered successfully`);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`\u274C Application error: ${message}`, err);
      res.status(status).json({ message });
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
      console.log(`\u2705 Vite development server setup complete`);
    } else {
      try {
        serveStatic(app);
        console.log(`\u2705 Static file serving setup complete`);
      } catch (error) {
        console.error(`\u274C Failed to setup static file serving:`, error);
        console.log(`This might happen if the build files are missing.`);
        console.log(
          `In production, ensure you run 'npm run build' before starting the server.`
        );
        throw error;
      }
    }
    const port = process.env.PORT || 5e3;
    server.listen(
      {
        port: Number(port),
        host: "0.0.0.0",
        reusePort: true
      },
      () => {
        console.log(`\u{1F389} VictorySync server is running successfully!`);
        log(`serving on port ${port}`);
        console.log(`Health check available at: http://0.0.0.0:5000/health`);
      }
    );
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(`\u274C Failed to start server:`, error);
    process.exit(1);
  }
})();
