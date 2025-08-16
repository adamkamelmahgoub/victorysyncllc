
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
  email: z.string().email(),
  password: z.string().min(8),
  totp: z.string().optional(),
  backupCode: z.string().optional(),
});

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
