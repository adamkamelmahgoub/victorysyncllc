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
  type PublicUser,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";

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
    return newUser;
  }

  async getPublicUserByEmail(email: string): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(publicUsers).where(eq(publicUsers.email, email));
    return user;
  }

  async getPublicUserById(id: number): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(publicUsers).where(eq(publicUsers.id, id));
    return user;
  }

  async updatePublicUserSocialAccounts(id: number, socialAccounts: any[]): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ socialAccounts })
      .where(eq(publicUsers.id, id))
      .returning();
    return user;
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
    return await db.select().from(publicUsers);
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
    return user || null;
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
    return user || null;
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
    return user || null;
  }

  async updateUserPermissions(userId: number, permissions: string[]): Promise<PublicUser | null> {
    const [user] = await db
      .update(publicUsers)
      .set({ permissions })
      .where(eq(publicUsers.id, userId))
      .returning();
    return user || null;
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
    }).from(publicUsers);

    // Add search filter
    if (search) {
      query = query.where(
        sql`${publicUsers.name} ILIKE ${'%' + search + '%'} OR ${publicUsers.email} ILIKE ${'%' + search + '%'}`
      );
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
      }).from(orders).where(eq(orders.userId, user.email));

      return {
        ...user,
        role: 'customer', // Default role
        status: 'active', // Default status
        orgId: null,
        orderCount: userOrders[0]?.orderCount || 0,
        totalSpent: Number(userOrders[0]?.totalSpent || 0),
        lastLoginAt: null,
        isMfaEnabled: false,
        permissions: [],
      };
    }));

    return { users: enhancedUsers, total };
  }

  async lockUserAccount(userId: number, reason: string): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ 
        // Note: These fields would need to be added to the actual schema
        // For now, we'll simulate the update
      })
      .where(eq(publicUsers.id, userId))
      .returning();
    return user;
  }

  async unlockUserAccount(userId: number): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ 
        // Unlock account logic
      })
      .where(eq(publicUsers.id, userId))
      .returning();
    return user;
  }

  async forcePasswordReset(userId: number): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ 
        // Force password reset logic
      })
      .where(eq(publicUsers.id, userId))
      .returning();
    return user;
  }

  async requireMfaNextLogin(userId: number): Promise<PublicUser> {
    const [user] = await db
      .update(publicUsers)
      .set({ 
        // Require MFA next login logic
      })
      .where(eq(publicUsers.id, userId))
      .returning();
    return user;
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
    await db.delete(accessControlRoles).where(eq(accessControlRoles.id, roleId));
  }

  async assignUserAccessControlRole(userId: number, roleId: number, orgId?: string): Promise<AccessControlUserRole> {
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