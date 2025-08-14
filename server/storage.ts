import {
  publicUsers,
  packages,
  orders,
  orderItems,
  contactSubmissions,
  userFeatureFlags,
  userIntegrationPolicies,
  orgIntegrationPolicies,
  userPaymentPolicies,
  orgPaymentPolicies,
  userDialerMap,
  auditLogs,
  apiKeys,
  callsCache,
  coupons,
  couponRedemptions,
  accessControlRoles,
  accessControlUserRoles,
  accessControlSessions,
  accessControlIntegrations,
  accessControlPaymentMethods,
  accessControlCallMetrics,
  type PublicUser as SchemaPublicUser, // Alias to avoid naming conflict
  type InsertPublicUser,
  type Package,
  type InsertPackage,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ContactSubmission,
  type InsertContactSubmission,
  type UserFeatureFlag,
  type InsertUserFeatureFlag,
  type UserIntegrationPolicy,
  type InsertUserIntegrationPolicy,
  type OrgIntegrationPolicy,
  type InsertOrgIntegrationPolicy,
  type UserPaymentPolicy,
  type InsertUserPaymentPolicy,
  type OrgPaymentPolicy,
  type InsertOrgPaymentPolicy,
  type UserDialerMap,
  type InsertUserDialerMap,
  type AuditLog,
  type InsertAuditLog,
  type ApiKey,
  type InsertApiKey,
  type CallsCache,
  type InsertCallsCache,
  type Coupon,
  type InsertCoupon,
  type CouponRedemption,
  type InsertCouponRedemption,
  type AccessControlRole,
  type InsertAccessControlRole,
  type AccessControlUserRole,
  type InsertAccessControlUserRole,
  type AccessControlSession,
  type InsertAccessControlSession,
  type AccessControlIntegration,
  type InsertAccessControlIntegration,
  type AccessControlPaymentMethod,
  type InsertAccessControlPaymentMethod,
  type AccessControlCallMetric,
  type InsertAccessControlCallMetric,
} from "../shared/schema.js";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";
import type postgres from "postgres"; // Import type for postgres client

// Define a type for the public user, potentially more specific than the schema type
export type PublicUser = {
  id: number; // Assuming ID is a number as per original code's usage
  name: string | null;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  status: string | null;
  statusReason: string | null;
  role: string;
  permissions: string[];
  featureFlags: string[];
  socialAccounts: any[] | null;
  stripeCustomerId: string | null;
  forcePasswordReset: boolean;
  requireMfa: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Add any other fields that are commonly used or mapped
};


// Function to get all public users with enhanced details
// This function is intended to replace the getAllPublicUsers in the original class,
// but the original `getAllPublicUsers` in `IStorage` and `DatabaseStorage` uses `PublicUser` type from schema.
// We will adjust the DatabaseStorage.getAllPublicUsers to use the new helper if that's the intent,
// or keep the original if the helper is supplementary.
// Given the prompt, it seems the intention is to replace the original implementation.
// However, the prompt also provides a `getAllPublicUsers` function signature in the changes.
// Let's assume the helper function `getAllPublicUsers` from the changes is meant to be used.

// The original `db` import is from `./db` and likely initializes the Drizzle client.
// The change snippet also imports `drizzle` and `sql` from `drizzle-orm/postgres-js`.
// This implies a potential change in how the DB client is managed or accessed.
// For now, we'll assume `db` from `./db` is the initialized Drizzle client.

// If the intent was to *replace* the `db` import and usage with a new helper setup,
// that would be a significant change. Based on the provided snippet, it seems like adding
// a new helper function that might use a different underlying `sql` instance,
// but the class methods still expect to use `dbClient`.

// Let's proceed by integrating the provided `getAllPublicUsers` function definition
// and ensuring the class uses the `db` client consistently.

// NOTE: The provided `getAllPublicUsers` helper function in the changes snippet
// uses `sql` directly and queries `users` table. The original code uses Drizzle ORM
// with `publicUsers` schema. There's a mismatch here.
// For consistency and to make the changes work with the existing structure,
// we should adapt the helper function to use Drizzle ORM and the `publicUsers` schema.

// Helper function to get all public users using Drizzle ORM and schema
async function getPublicUsersFromDb(): Promise<PublicUser[]> {
  // Using the existing `db` client from ./db
  const users = await db.select().from(publicUsers).orderBy(desc(publicUsers.createdAt));

  // Map Drizzle schema types to the expected PublicUser type if necessary,
  // or directly return the Drizzle result if types align.
  // For now, let's assume Drizzle's `publicUsers` schema aligns well enough with the `PublicUser` type
  // expected by the `IStorage` interface, or can be mapped.
  // The original `getAllPublicUsers` in `DatabaseStorage` did some mapping/defaulting.
  // Let's replicate that behavior here.

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified ?? false, // Defaulting if not present
    isActive: user.isActive ?? true, // Defaulting if not present
    status: user.status || 'active', // Default status
    statusReason: user.statusReason || null,
    role: user.role || 'customer', // Default role
    permissions: user.permissions || [], // Default permissions
    featureFlags: user.featureFlags || [], // Default featureFlags
    socialAccounts: user.socialAccounts || null,
    stripeCustomerId: user.stripeCustomerId || null,
    forcePasswordReset: user.forcePasswordReset || false,
    requireMfa: user.requireMfa || false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}


export interface IStorage {
  // Public user operations (JWT auth system)
  createPublicUser(user: InsertPublicUser): Promise<PublicUser>;
  getPublicUserByEmail(email: string): Promise<PublicUser | undefined>;
  getPublicUserById(id: number): Promise<PublicUser | undefined>;
  updatePublicUserSocialAccounts(id: number, socialAccounts: any[]): Promise<PublicUser>;

  // Package operations
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order>;

  // Order item operations
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;

  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Admin operations
  getAllPublicUsers(): Promise<PublicUser[]>;
  getAllOrders(): Promise<Order[]>;
  updateUserStatus(userId: number, isActive: boolean): Promise<PublicUser | null>;
  deleteUser(userId: number): Promise<boolean>;
  updateUserPrivileges(userId: number, privileges: any): Promise<PublicUser | null>;

  // Access Control operations
  getUserPermissions(userId: number): Promise<string[]>;
  getUserFeatureFlags(userId: number): Promise<string[]>;
  updateUserRole(userId: number, role: string): Promise<PublicUser | null>;
  updateUserPermissions(userId: number, permissions: string[]): Promise<PublicUser | null>;
  updateUserFeatureFlags(userId: number, flags: Record<string, boolean>): Promise<void>;
  getUserIntegrationPolicies(userId: number): Promise<UserIntegrationPolicy[]>;
  getOrgIntegrationPolicies(orgId: number): Promise<OrgIntegrationPolicy[]>;
  updateUserIntegrationPolicy(userId: number, provider: string, allowedScopes: string[], deniedScopes: string[]): Promise<UserIntegrationPolicy>;
  getUserPaymentPolicies(userId: number): Promise<UserPaymentPolicy | null>;
  updateUserPaymentPolicy(userId: number, allowedMethods: string[], defaultMethod: string): Promise<UserPaymentPolicy>;
  getUserDialerMapping(userId: number): Promise<UserDialerMap | null>;
  setUserDialerMapping(userId: number, provider: string, externalAgentId: string, meta: any): Promise<UserDialerMap>;
  getCallsCache(userId: number): Promise<CallsCache[]>;
  updateCallsCache(userId: number, period: string, callsCount: number, avgHandleTime: number, occupancy: number): Promise<CallsCache>;
  getApiKeys(userId?: number, orgId?: number): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  revokeApiKey(keyId: number): Promise<boolean>;
  auditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(userId?: number, orgId?: number): Promise<AuditLog[]>;
  getCoupons(): Promise<Coupon[]>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  redeemCoupon(redemption: InsertCouponRedemption): Promise<CouponRedemption>;

  // Enhanced Access Control Center operations
  getAllUsersWithDetails(page?: number, limit?: number, search?: string, filters?: any): Promise<{ users: any[], total: number }>;
  lockUserAccount(userId: number, reason: string): Promise<PublicUser>;
  unlockUserAccount(userId: number): Promise<PublicUser>;
  forcePasswordReset(userId: number): Promise<PublicUser>;
  requireMfaNextLogin(userId: number): Promise<PublicUser>;
  bulkUpdateUsers(userIds: number[], updates: any): Promise<void>;

  // Enhanced Role management
  createAccessControlRole(role: InsertAccessControlRole): Promise<AccessControlRole>;
  getAccessControlRoles(): Promise<AccessControlRole[]>;
  updateAccessControlRole(roleId: number, updates: Partial<AccessControlRole>): Promise<AccessControlRole>;
  deleteAccessControlRole(roleId: number): Promise<void>;
  assignUserAccessControlRole(userId: number, roleId: number, orgId?: string): Promise<AccessControlUserRole>;
  removeUserAccessControlRole(userId: number, roleId: number, orgId?: string): Promise<void>;

  // Enhanced Sessions
  createAccessControlSession(session: InsertAccessControlSession): Promise<AccessControlSession>;
  getAccessControlSessions(userId: number): Promise<AccessControlSession[]>;
  revokeAccessControlSession(sessionId: string): Promise<void>;
  revokeAllAccessControlSessions(userId: number): Promise<void>;

  // Enhanced Integrations
  createAccessControlIntegration(integration: InsertAccessControlIntegration): Promise<AccessControlIntegration>;
  getAccessControlIntegrations(userId: number): Promise<AccessControlIntegration[]>;
  updateAccessControlIntegrationStatus(integrationId: number, status: string): Promise<AccessControlIntegration>;

  // Enhanced Payment methods
  setAccessControlPaymentPolicy(userId: number, allowedMethods: string[]): Promise<AccessControlPaymentMethod>;
  getAccessControlPaymentPolicy(userId: number): Promise<AccessControlPaymentMethod | undefined>;

  // Enhanced Call metrics
  getAccessControlCallMetrics(userId: number): Promise<AccessControlCallMetric[]>;
  updateAccessControlCallMetrics(userId: number, metrics: InsertAccessControlCallMetric): Promise<AccessControlCallMetric>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async createPublicUser(user: InsertPublicUser): Promise<PublicUser> {
    const [newUser] = await db.insert(publicUsers).values(user).returning();
    // Map to PublicUser type if necessary, ensuring all fields are present
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      emailVerified: newUser.emailVerified ?? false,
      isActive: newUser.isActive ?? true,
      status: newUser.status || 'active',
      statusReason: newUser.statusReason || null,
      role: newUser.role || 'customer',
      permissions: newUser.permissions || [],
      featureFlags: newUser.featureFlags || [],
      socialAccounts: newUser.socialAccounts || null,
      stripeCustomerId: newUser.stripeCustomerId || null,
      forcePasswordReset: newUser.forcePasswordReset || false,
      requireMfa: newUser.requireMfa || false,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  async getPublicUserByEmail(email: string): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(publicUsers).where(eq(publicUsers.email, email));
    if (!user) return undefined;
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getPublicUserById(id: number): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(publicUsers).where(eq(publicUsers.id, id));
    if (!user) return undefined;
     // Map to PublicUser type
     return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updatePublicUserSocialAccounts(id: number, socialAccounts: any[]): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ socialAccounts })
      .where(eq(publicUsers.id, id))
      .returning();
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages).where(eq(packages.isActive, true));
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPackage] = await db.insert(packages).values(pkg).returning();
    return newPackage;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Order item operations
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  // Admin operations
  async getAllPublicUsers(): Promise<PublicUser[]> {
    // Using the Drizzle ORM client to fetch users with their associated roles and permissions
    const usersWithRolesAndPermissions = await db.select({
      id: publicUsers.id,
      name: publicUsers.name,
      email: publicUsers.email,
      emailVerified: publicUsers.emailVerified,
      isActive: publicUsers.isActive,
      status: publicUsers.status,
      statusReason: publicUsers.statusReason,
      role: publicUsers.role, // This is the base role, we will merge specific role names
      permissions: publicUsers.permissions, // This is the base permissions, we will merge specific permissions
      featureFlags: publicUsers.featureFlags,
      socialAccounts: publicUsers.socialAccounts,
      stripeCustomerId: publicUsers.stripeCustomerId,
      forcePasswordReset: publicUsers.forcePasswordReset,
      requireMfa: publicUsers.requireMfa,
      createdAt: publicUsers.createdAt,
      updatedAt: publicUsers.updatedAt,
      // Aggregating roles and permissions from the join
      roles: sql<string[]>`COALESCE(json_agg(DISTINCT ${accessControlRoles.key}) FILTER (WHERE ${accessControlRoles.key} IS NOT NULL), '[]'::json)`,
      permissionsFromRoles: sql<string[]>`COALESCE(json_agg(DISTINCT ${accessControlPermissions.key}) FILTER (WHERE ${accessControlPermissions.key} IS NOT NULL), '[]'::json)`
    })
      .from(publicUsers)
      .leftJoin(accessControlUserRoles, eq(publicUsers.id, accessControlUserRoles.userId))
      .leftJoin(accessControlRoles, eq(accessControlUserRoles.roleId, accessControlRoles.id))
      .leftJoin(accessControlRolePermissions, eq(accessControlRoles.id, accessControlRolePermissions.roleId))
      .leftJoin(accessControlPermissions, eq(accessControlRolePermissions.permissionId, accessControlPermissions.id))
      .groupBy(
        publicUsers.id,
        publicUsers.name,
        publicUsers.email,
        publicUsers.emailVerified,
        publicUsers.isActive,
        publicUsers.status,
        publicUsers.statusReason,
        publicUsers.role,
        publicUsers.permissions,
        publicUsers.featureFlags,
        publicUsers.socialAccounts,
        publicUsers.stripeCustomerId,
        publicUsers.forcePasswordReset,
        publicUsers.requireMfa,
        publicUsers.createdAt,
        publicUsers.updatedAt
      )
      .orderBy(desc(publicUsers.createdAt));

    // Map the database results to the PublicUser type, merging roles and permissions
    return usersWithRolesAndPermissions.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      // Use the base role from the user table, but the aggregated roles from joins can be used for more granular logic if needed
      role: user.role || 'customer',
      // Combine base permissions with permissions from roles
      permissions: Array.from(new Set([...(user.permissions || []), ...(user.permissionsFromRoles || [])])),
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<PublicUser | null> {
    const [user] = await db
      .update(publicUsers)
      .set({ isActive })
      .where(eq(publicUsers.id, userId))
      .returning();
    if (!user) return null;
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUser(userId: number): Promise<boolean> {
    const results = await db
      .delete(publicUsers)
      .where(eq(publicUsers.id, userId))
      .returning();
    return results.length > 0;
  }

  async updateUserPrivileges(userId: number, privileges: any): Promise<PublicUser | null> {
    const [user] = await db
      .update(publicUsers)
      .set({ privileges })
      .where(eq(publicUsers.id, userId))
      .returning();
    if (!user) return null;
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Access Control operations
  async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const user = await this.getPublicUserById(userId);
      if (!user) return [];

      // Base permissions by role
      const rolePermissions: Record<string, string[]> = {
        superAdmin: ['*'],
        admin: ['users:read', 'users:write', 'orders:read', 'orders:write', 'exports:run'],
        manager: ['users:read', 'orders:read', 'exports:run'],
        agent: ['orders:read'],
        customer: ['profile:read', 'profile:write', 'orders:read']
      };

      const userPermissions = user.permissions as string[] || [];
      const rolePerms = rolePermissions[user.role || 'customer'] || [];

      return [...new Set([...userPermissions, ...rolePerms])];
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      return [];
    }
  }

  async getUserFeatureFlags(userId: number): Promise<string[]> {
    try {
      const flags = await db.select({ flagKey: userFeatureFlags.flagKey })
        .from(userFeatureFlags)
        .where(and(eq(userFeatureFlags.userId, userId), eq(userFeatureFlags.value, true)));

      return flags.map(f => f.flagKey);
    } catch (error) {
      console.error("Error fetching user feature flags:", error);
      return [];
    }
  }

  async updateUserRole(userId: number, role: string): Promise<PublicUser | null> {
    const [user] = await db
      .update(publicUsers)
      .set({ role })
      .where(eq(publicUsers.id, userId))
      .returning();
    if (!user) return null;
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserPermissions(userId: number, permissions: string[]): Promise<PublicUser | null> {
    const [user] = await db
      .update(publicUsers)
      .set({ permissions })
      .where(eq(publicUsers.id, userId))
      .returning();
    if (!user) return null;
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserFeatureFlags(userId: number, flags: Record<string, boolean>): Promise<void> {
    // Remove all existing flags for user
    await db.delete(userFeatureFlags).where(eq(userFeatureFlags.userId, userId));

    // Insert new flags
    const flagInserts = Object.entries(flags)
      .filter(([_, value]) => value)
      .map(([flagKey, value]) => ({
        userId,
        flagKey,
        value
      }));

    if (flagInserts.length > 0) {
      await db.insert(userFeatureFlags).values(flagInserts);
    }
  }

  async getUserIntegrationPolicies(userId: number): Promise<UserIntegrationPolicy[]> {
    return await db.select().from(userIntegrationPolicies).where(eq(userIntegrationPolicies.userId, userId));
  }

  async getOrgIntegrationPolicies(orgId: number): Promise<OrgIntegrationPolicy[]> {
    return await db.select().from(orgIntegrationPolicies).where(eq(orgIntegrationPolicies.orgId, orgId));
  }

  async updateUserIntegrationPolicy(
    userId: number,
    provider: string,
    allowedScopes: string[],
    deniedScopes: string[]
  ): Promise<UserIntegrationPolicy> {
    const existing = await db.select().from(userIntegrationPolicies)
      .where(and(eq(userIntegrationPolicies.userId, userId), eq(userIntegrationPolicies.provider, provider)));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userIntegrationPolicies)
        .set({ allowedScopes, deniedScopes, updatedAt: new Date() })
        .where(and(eq(userIntegrationPolicies.userId, userId), eq(userIntegrationPolicies.provider, provider)))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userIntegrationPolicies).values({
        userId,
        provider,
        allowedScopes,
        deniedScopes,
      }).returning();
      return created;
    }
  }

  async getUserPaymentPolicies(userId: number): Promise<UserPaymentPolicy | null> {
    const [policy] = await db.select().from(userPaymentPolicies).where(eq(userPaymentPolicies.userId, userId));
    return policy || null;
  }

  async updateUserPaymentPolicy(userId: number, allowedMethods: string[], defaultMethod: string): Promise<UserPaymentPolicy> {
    const existing = await this.getUserPaymentPolicies(userId);

    if (existing) {
      const [updated] = await db
        .update(userPaymentPolicies)
        .set({ allowedMethods, defaultMethod, updatedAt: new Date() })
        .where(eq(userPaymentPolicies.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userPaymentPolicies).values({
        userId,
        allowedMethods,
        defaultMethod,
      }).returning();
      return created;
    }
  }

  async getUserDialerMapping(userId: number): Promise<UserDialerMap | null> {
    const [mapping] = await db.select().from(userDialerMap)
      .where(and(eq(userDialerMap.userId, userId), eq(userDialerMap.isActive, true)));
    return mapping || null;
  }

  async setUserDialerMapping(userId: number, provider: string, externalAgentId: string, meta: any): Promise<UserDialerMap> {
    // Deactivate existing mappings
    await db.update(userDialerMap)
      .set({ isActive: false })
      .where(eq(userDialerMap.userId, userId));

    // Create new mapping
    const [mapping] = await db.insert(userDialerMap).values({
      userId,
      provider,
      externalAgentId,
      meta,
      isActive: true,
    }).returning();
    return mapping;
  }

  async getCallsCache(userId: number): Promise<CallsCache[]> {
    return await db.select().from(callsCache).where(eq(callsCache.userId, userId));
  }

  async updateCallsCache(userId: number, period: string, callsCount: number, avgHandleTime: number, occupancy: number): Promise<CallsCache> {
    const existing = await db.select().from(callsCache)
      .where(and(eq(callsCache.userId, userId), eq(callsCache.period, period)));

    if (existing.length > 0) {
      const [updated] = await db
        .update(callsCache)
        .set({
          callsCount,
          avgHandleTime: avgHandleTime.toString(),
          occupancy: occupancy.toString(),
          updatedAt: new Date()
        })
        .where(and(eq(callsCache.userId, userId), eq(callsCache.period, period)))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(callsCache).values({
        userId,
        period,
        callsCount,
        avgHandleTime: avgHandleTime.toString(),
        occupancy: occupancy.toString(),
      }).returning();
      return created;
    }
  }

  async getApiKeys(userId?: number, orgId?: number): Promise<ApiKey[]> {
    let query = db.select().from(apiKeys).where(eq(apiKeys.revokedAt, null));

    if (userId) {
      query = query.where(eq(apiKeys.userId, userId));
    }
    if (orgId) {
      query = query.where(eq(apiKeys.orgId, orgId));
    }

    return await query;
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const [created] = await db.insert(apiKeys).values(apiKey).returning();
    return created;
  }

  async revokeApiKey(keyId: number): Promise<boolean> {
    const result = await db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(eq(apiKeys.id, keyId))
      .returning();
    return result.length > 0;
  }

  async auditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getAuditLogs(userId?: number, orgId?: number): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));

    if (userId) {
      query = query.where(eq(auditLogs.targetUserId, userId));
    }
    if (orgId) {
      query = query.where(eq(auditLogs.targetOrgId, orgId));
    }

    return await query;
  }

  async getCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons);
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [created] = await db.insert(coupons).values(coupon).returning();
    return created;
  }

  async redeemCoupon(redemption: InsertCouponRedemption): Promise<CouponRedemption> {
    const [created] = await db.insert(couponRedemptions).values(redemption).returning();

    // Update coupon usage count
    await db.update(coupons)
      .set({ usesCount: sql`${coupons.usesCount} + 1` })
      .where(eq(coupons.id, redemption.couponId));

    return created;
  }

  // Enhanced Access Control Center implementations
  async getAllUsersWithDetails(page: number = 1, limit: number = 50, search?: string, filters?: any): Promise<{ users: any[], total: number }> {
    const offset = (page - 1) * limit;

    // Build base query
    let query = db.select({
      id: publicUsers.id,
      name: publicUsers.name,
      email: publicUsers.email,
      createdAt: publicUsers.createdAt,
      stripeCustomerId: publicUsers.stripeCustomerId,
      socialAccounts: publicUsers.socialAccounts,
      isActive: publicUsers.isActive,
      status: publicUsers.status,
      role: publicUsers.role,
      permissions: publicUsers.permissions,
      featureFlags: publicUsers.featureFlags,
    }).from(publicUsers);

    // Add search filter
    if (search) {
      query = query.where(
        sql`${publicUsers.name} ILIKE ${'%' + search + '%'} OR ${publicUsers.email} ILIKE ${'%' + search + '%'}`
      );
    }

    // Add other filters
    if (filters) {
      if (filters.isActive !== undefined) {
        query = query.where(eq(publicUsers.isActive, filters.isActive));
      }
      if (filters.role) {
        query = query.where(eq(publicUsers.role, filters.role));
      }
      if (filters.status) {
        query = query.where(eq(publicUsers.status, filters.status));
      }
    }

    // Get total count
    const totalQuery = db.select({ count: count() }).from(publicUsers);
    const [{ count: total }] = await totalQuery;

    // Get paginated results
    const users = await query.limit(limit).offset(offset).orderBy(desc(publicUsers.createdAt));

    // Enhance each user with additional details
    const enhancedUsers = await Promise.all(users.map(async (user) => {
      // Get order statistics
      const userOrders = await db.select({
        orderCount: count(),
        totalSpent: sql<number>`COALESCE(SUM(${orders.total}), 0)`.as('totalSpent')
      }).from(orders).where(eq(orders.userId, user.email)); // Assuming email is used as userId in orders table

      const featureFlags = await db.select({ flagKey: userFeatureFlags.flagKey })
        .from(userFeatureFlags)
        .where(and(eq(userFeatureFlags.userId, user.id), eq(userFeatureFlags.value, true)));

      // Fetching actual user roles
      const userRoles = await db.select({
        roleName: accessControlRoles.name,
        roleId: accessControlRoles.id
      })
      .from(accessControlUserRoles)
      .innerJoin(accessControlRoles, eq(accessControlUserRoles.roleId, accessControlRoles.id))
      .where(eq(accessControlUserRoles.userId, user.id));

      // Map to PublicUser type
      const mappedUser: PublicUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        isActive: user.isActive ?? true,
        status: user.status || 'active',
        statusReason: user.statusReason || null,
        role: user.role || 'customer',
        permissions: user.permissions || [],
        featureFlags: featureFlags.map(f => f.flagKey),
        socialAccounts: user.socialAccounts || null,
        stripeCustomerId: user.stripeCustomerId || null,
        forcePasswordReset: user.forcePasswordReset || false,
        requireMfa: user.requireMfa || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        ...mappedUser,
        orderCount: userOrders[0]?.orderCount || 0,
        totalSpent: Number(userOrders[0]?.totalSpent || 0),
        userRoles: userRoles.map(ur => ({ name: ur.roleName, id: ur.roleId })),
        lastLoginAt: null, // Placeholder, needs to be fetched
        isMfaEnabled: false, // Placeholder, needs to be fetched
      };
    }));

    return { users: enhancedUsers, total };
  }

  async lockUserAccount(userId: number, reason: string): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ status: 'locked', statusReason: reason, updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async unlockUserAccount(userId: number): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ status: 'active', statusReason: null, updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async forcePasswordReset(userId: number): Promise<PublicUser> {
    // In a real implementation, you'd generate a reset token and send an email.
    // For this example, we'll just update a flag or timestamp.
    const [user] = await db
      .update(publicUsers)
      .set({ forcePasswordReset: true, updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    // Map to PublicUser type
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async requireMfaNextLogin(userId: number): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ requireMfa: true, updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
     // Map to PublicUser type
     return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      status: user.status || 'active',
      statusReason: user.statusReason || null,
      role: user.role || 'customer',
      permissions: user.permissions || [],
      featureFlags: user.featureFlags || [],
      socialAccounts: user.socialAccounts || null,
      stripeCustomerId: user.stripeCustomerId || null,
      forcePasswordReset: user.forcePasswordReset || false,
      requireMfa: user.requireMfa || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async bulkUpdateUsers(userIds: number[], updates: any): Promise<void> {
    await db
      .update(publicUsers)
      .set(updates)
      .where(sql`${publicUsers.id} = ANY(${userIds})`);
  }

  // Enhanced Role management
  async createAccessControlRole(role: InsertAccessControlRole): Promise<AccessControlRole> {
    const [created] = await db.insert(accessControlRoles).values(role).returning();
    return created;
  }

  async getAccessControlRoles(): Promise<AccessControlRole[]> {
    return await db.select().from(accessControlRoles).orderBy(accessControlRoles.name);
  }

  async updateAccessControlRole(roleId: number, updates: Partial<AccessControlRole>): Promise<AccessControlRole> {
    const [updated] = await db
      .update(accessControlRoles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(accessControlRoles.id, roleId))
      .returning();
    return updated;
  }

  async deleteAccessControlRole(roleId: number): Promise<void> {
    // Before deleting a role, ensure no users are assigned to it, or handle cascading deletes.
    // For simplicity, we'll just delete the role here.
    await db.delete(accessControlRoles).where(eq(accessControlRoles.id, roleId));
    // Also remove assignments for this role
    await db.delete(accessControlUserRoles).where(eq(accessControlUserRoles.roleId, roleId));
  }

  async assignUserAccessControlRole(userId: number, roleId: number, orgId?: string): Promise<AccessControlUserRole> {
    // Check if assignment already exists to prevent duplicates
    const existingAssignment = await db.select()
      .from(accessControlUserRoles)
      .where(and(
        eq(accessControlUserRoles.userId, userId),
        eq(accessControlUserRoles.roleId, roleId),
        orgId ? eq(accessControlUserRoles.orgId, orgId) : sql`true`
      ));

    if (existingAssignment.length > 0) {
      return existingAssignment[0];
    }

    const [assigned] = await db.insert(accessControlUserRoles).values({
      userId,
      roleId,
      orgId,
    }).returning();
    return assigned;
  }

  async removeUserAccessControlRole(userId: number, roleId: number, orgId?: string): Promise<void> {
    let deleteQuery = db.delete(accessControlUserRoles)
      .where(and(
        eq(accessControlUserRoles.userId, userId),
        eq(accessControlUserRoles.roleId, roleId)
      ));

    if (orgId) {
      deleteQuery = deleteQuery.where(eq(accessControlUserRoles.orgId, orgId));
    }

    await deleteQuery;
  }

  // Enhanced Sessions
  async createAccessControlSession(session: InsertAccessControlSession): Promise<AccessControlSession> {
    const [created] = await db.insert(accessControlSessions).values(session).returning();
    return created;
  }

  async getAccessControlSessions(userId: number): Promise<AccessControlSession[]> {
    return await db
      .select()
      .from(accessControlSessions)
      .where(eq(accessControlSessions.userId, userId))
      .orderBy(desc(accessControlSessions.lastActive));
  }

  async revokeAccessControlSession(sessionId: string): Promise<void> {
    await db.delete(accessControlSessions).where(eq(accessControlSessions.sessionId, sessionId));
  }

  async revokeAllAccessControlSessions(userId: number): Promise<void> {
    await db.delete(accessControlSessions).where(eq(accessControlSessions.userId, userId));
  }

  // Enhanced Integrations
  async createAccessControlIntegration(integration: InsertAccessControlIntegration): Promise<AccessControlIntegration> {
    const [created] = await db.insert(accessControlIntegrations).values(integration).returning();
    return created;
  }

  async getAccessControlIntegrations(userId: number): Promise<AccessControlIntegration[]> {
    return await db
      .select()
      .from(accessControlIntegrations)
      .where(eq(accessControlIntegrations.userId, userId))
      .orderBy(desc(accessControlIntegrations.createdAt));
  }

  async updateAccessControlIntegrationStatus(integrationId: number, status: string): Promise<AccessControlIntegration> {
    const [updated] = await db
      .update(accessControlIntegrations)
      .set({ status, updatedAt: new Date() })
      .where(eq(accessControlIntegrations.id, integrationId))
      .returning();
    return updated;
  }

  // Enhanced Payment methods
  async setAccessControlPaymentPolicy(userId: number, allowedMethods: string[]): Promise<AccessControlPaymentMethod> {
    // First try to update existing policy
    const existing = await db
      .select()
      .from(accessControlPaymentMethods)
      .where(eq(accessControlPaymentMethods.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(accessControlPaymentMethods)
        .set({ allowedMethods, updatedAt: new Date() })
        .where(eq(accessControlPaymentMethods.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(accessControlPaymentMethods)
        .values({ userId, allowedMethods })
        .returning();
      return created;
    }
  }

  async getAccessControlPaymentPolicy(userId: number): Promise<AccessControlPaymentMethod | undefined> {
    const [policy] = await db
      .select()
      .from(accessControlPaymentMethods)
      .where(eq(accessControlPaymentMethods.userId, userId))
      .limit(1);
    return policy;
  }

  // Enhanced Call metrics
  async getAccessControlCallMetrics(userId: number): Promise<AccessControlCallMetric[]> {
    return await db
      .select()
      .from(accessControlCallMetrics)
      .where(eq(accessControlCallMetrics.userId, userId))
      .orderBy(desc(accessControlCallMetrics.updatedAt));
  }

  async updateAccessControlCallMetrics(userId: number, metrics: InsertAccessControlCallMetric): Promise<AccessControlCallMetric> {
    // First try to update existing metrics for the same period
    const existing = await db
      .select()
      .from(accessControlCallMetrics)
      .where(and(
        eq(accessControlCallMetrics.userId, userId),
        eq(accessControlCallMetrics.period, metrics.period)
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(accessControlCallMetrics)
        .set({ ...metrics, updatedAt: new Date() })
        .where(and(
          eq(accessControlCallMetrics.userId, userId),
          eq(accessControlCallMetrics.period, metrics.period)
        ))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(accessControlCallMetrics)
        .values(metrics)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();