import { z } from "zod";

/* Auth */
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  accessCode: z.string().optional(),
  inviteToken: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// VictorySync Business Schemas
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export const servicePackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  duration: z.number().nullable(),
  features: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export const orderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  packageId: z.number().nullable(),
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]),
  totalAmount: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const contactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string(),
  status: z.enum(["new", "contacted", "resolved"]),
  createdAt: z.date(),
});

export const announcementSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  type: z.enum(["info", "warning", "success", "error"]),
  isActive: z.boolean(),
  targetRole: z.any().nullable(), // Placeholder, assuming roleSchema will be defined or imported elsewhere
  createdBy: z.number(),
  createdAt: z.date(),
});

export const createOrderSchema = z.object({
  packageId: z.number().optional(),
  notes: z.string().optional(),
});

export const createContactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["info", "warning", "success", "error"]).default("info"),
  targetRole: z.any().optional(), // Placeholder, assuming roleSchema will be defined or imported elsewhere
});

export type Service = z.infer<typeof serviceSchema>;
export type ServicePackage = z.infer<typeof servicePackageSchema>;
export type Order = z.infer<typeof orderSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
export type Announcement = z.infer<typeof announcementSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type CreateContactSubmissionSchema = z.infer<typeof createContactSubmissionSchema>;
export type CreateAnnouncementSchema = z.infer<typeof createAnnouncementSchema>;

export type PublicUser = {
  id: number; 
  email: string; 
  firstName?: string; 
  lastName?: string;
  orgId?: number; 
  role: Role; 
  verified: boolean; 
  mfaEnabled: boolean;
};

/* Access/Invites */
export const accessCodeSchema = z.object({
  code: z.string().min(6),
  role: z.enum(["superAdmin","admin","manager","agent","customer"]),
  orgId: z.number(),
  maxUses: z.number().int().positive(),
  expiresAt: z.string().datetime(),
});

export const inviteTokenSchema = z.object({ 
  token: z.string().min(16) 
});

/* RBAC */
export type Role = "superAdmin"|"admin"|"manager"|"agent"|"customer";

// Assuming roleSchema is meant to be defined or imported. For now, using a placeholder type.
const roleSchema = z.enum(["superAdmin","admin","manager","agent","customer"]);

export const Permissions = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  ORG_READ: "org:read",
  ORG_WRITE: "org:write",
  BILLING_READ: "billing:read",
  BILLING_WRITE: "billing:write",
  INTEGRATION_WRITE: "integrations:write",
  KPI_READ: "kpi:read",
  ORDERS_READ: "orders:read",
  ORDERS_WRITE: "orders:write",
} as const;

/* Entities */
export type User = { 
  id: number; 
  email: string; 
  orgId?: number; 
  role: Role; 
  verified: boolean; 
  mfaEnabled: boolean; 
  createdAt: string; 
};

export type Organization = { 
  id: number; 
  name: string; 
  number?: string; 
  createdAt: string; 
};

export type OrderItem = { 
  id: number; 
  orderId: number; 
  sku?: string; 
  priceAtTime: string; 
  quantity: number; 
};

export type Order = { 
  id: number; 
  orgId: number; 
  userId?: number; 
  amount: string; 
  status: "pending"|"processing"|"completed"|"cancelled"|"refunded"; 
  items: OrderItem[]; 
  createdAt: string; 
};

export type Package = { 
  id: number; 
  key: string; 
  name: string; 
  price: string; 
  features: string[] 
};

export type Integration = { 
  id: number; 
  orgId: number; 
  provider: string; 
  status: "connected"|"error"|"disconnected"; 
  createdAt: string; 
};

export type ContactSubmission = { 
  id: number; 
  firstName: string; 
  lastName: string; 
  email: string; 
  message: string; 
  createdAt: string; 
};

/* KPI */
export type KPIData = {
  activeAgents: number;
  callsToday: number;
  callsThisWeek: number;
  callsThisMonth: number;
  avgResponseTime: number;
  avgHandleTime: number;
  occupancyRate: number;
  customerSatisfaction: number;
  resolutionRate: number;
  slaCompliance: number;
};

/* Validation */
export const insertContactSubmissionSchema = z.object({
  firstName: z.string().min(1), 
  lastName: z.string().min(1),
  email: z.string().email(), 
  message: z.string().min(1)
});

export const insertOrderItemSchema = z.object({
  sku: z.string().optional(),
  priceAtTime: z.string(),
  quantity: z.number().int().positive(),
});

export const insertOrderSchema = z.object({
  orgId: z.number().int().positive(),
  amount: z.string(),
  status: z.enum(["pending","processing","completed","cancelled","refunded"]),
  items: z.array(insertOrderItemSchema).nonempty(),
});