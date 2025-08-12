import {
  publicUsers,
  packages,
  orders,
  orderItems,
  contactSubmissions,
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
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

  getAllPublicUsers(): Promise<PublicUser[]>;
  getAllOrders(): Promise<Order[]>;
  updateUserStatus(userId: number, isActive: boolean): Promise<PublicUser | null>;
  deleteUser(userId: number): Promise<boolean>;
  updateUserPrivileges(userId: number, privileges: any): Promise<PublicUser | null>;
  updateUserProfile(userId: number, updates: { name?: string; email?: string }): Promise<any>;
  getUserIntegrations(userId: number): Promise<any[]>;
  createUserIntegration(integration: any): Promise<any>;
  deleteUserIntegration(integrationId: number, userId: number): Promise<boolean>;
  updatePackage(packageId: number, updates: any): Promise<any>;
  deletePackage(packageId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // Public user operations
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
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

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
      .set({ 
        socialAccounts: [
          ...(await this.getPublicUserById(userId))?.socialAccounts || [],
          { type: 'privileges', data: privileges }
        ]
      })
      .where(eq(publicUsers.id, userId))
      .returning();

    return user || null;
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

  async updateUserProfile(userId: number, updates: { name?: string; email?: string }): Promise<any> {
    try {
      const result = await db.update(publicUsers)
        .set(updates)
        .where(eq(publicUsers.id, userId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  }

  async getUserIntegrations(userId: number): Promise<any[]> {
    try {
      // Mock integrations data - in production would be a real table
      return [
        {
          id: 1,
          type: 'crm',
          name: 'Salesforce',
          isActive: true,
          lastSync: new Date().toISOString(),
          status: 'connected'
        },
        {
          id: 2,
          type: 'dialer',
          name: 'VoIP System',
          isActive: false,
          lastSync: null,
          status: 'disconnected'
        }
      ];
    } catch (error) {
      console.error("Error fetching user integrations:", error);
      return [];
    }
  }

  async createUserIntegration(integration: any): Promise<any> {
    try {
      // Mock creation - in production would save to database
      return {
        id: Date.now(),
        ...integration,
        createdAt: new Date().toISOString(),
        status: 'connected'
      };
    } catch (error) {
      console.error("Error creating user integration:", error);
      throw error;
    }
  }

  async deleteUserIntegration(integrationId: number, userId: number): Promise<boolean> {
    try {
      // Mock deletion - in production would delete from database
      return true;
    } catch (error) {
      console.error("Error deleting user integration:", error);
      return false;
    }
  }

  async updatePackage(packageId: number, updates: any): Promise<any> {
    try {
      const result = await db.update(packages)
        .set(updates)
        .where(eq(packages.id, packageId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating package:", error);
      return null;
    }
  }

  async deletePackage(packageId: number): Promise<boolean> {
    try {
      const result = await db.delete(packages).where(eq(packages.id, packageId)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting package:", error);
      return false;
    }
  }

  async updateUserPrivileges(userId: number, privileges: any): Promise<any> {
    try {
      // Store privileges in the user record or a separate table
      // For now, we'll store as JSON in a privileges column (would need migration)
      const result = await db.update(publicUsers)
        .set({ 
          socialAccounts: [
            ...(await this.getPublicUserById(userId))?.socialAccounts || [],
            { type: 'privileges', data: privileges }
          ]
         })
        .where(eq(publicUsers.id, userId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating user privileges:", error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();

  // Access Control Methods
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

      return user.permissions || rolePermissions[user.role || 'customer'] || [];
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      return [];
    }
  }

  async getUserFeatureFlags(userId: number): Promise<string[]> {
    try {
      const [flags] = await db.select({ flagKey: userFeatureFlags.flagKey })
        .from(userFeatureFlags)
        .where(eq(userFeatureFlags.userId, userId));
      
      return flags?.map(f => f.flagKey) || [];
    } catch (error) {
      console.error("Error fetching user feature flags:", error);
      return [];
    }
  }

  async updateLastLogin(userId: number): Promise<void> {
    try {
      await db.update(publicUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(publicUsers.id, userId));
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  }

  async getAllowedPaymentMethods(userId: number, orgId?: string): Promise<string[]> {
    try {
      // Check user-specific policy first
      const [userPolicy] = await db.select()
        .from(userPaymentPolicies)
        .where(eq(userPaymentPolicies.userId, userId));
      
      if (userPolicy?.allowedMethods) {
        return userPolicy.allowedMethods;
      }

      // Fall back to org policy
      if (orgId) {
        const [orgPolicy] = await db.select()
          .from(orgPaymentPolicies)
          .where(eq(orgPaymentPolicies.orgId, orgId));
        
        if (orgPolicy?.allowedMethods) {
          return orgPolicy.allowedMethods;
        }
      }

      // Default to card only
      return ['card'];
    } catch (error) {
      console.error("Error fetching allowed payment methods:", error);
      return ['card'];
    }
  }

  async getAllowedIntegrationScopes(userId: number, orgId: string | undefined, provider: string): Promise<string[]> {
    try {
      // Check user-specific policy first
      const [userPolicy] = await db.select()
        .from(userIntegrationPolicies)
        .where(eq(userIntegrationPolicies.userId, userId))
        .where(eq(userIntegrationPolicies.provider, provider));
      
      if (userPolicy?.allowedScopes) {
        return userPolicy.allowedScopes;
      }

      // Fall back to org policy
      if (orgId) {
        const [orgPolicy] = await db.select()
          .from(orgIntegrationPolicies)
          .where(eq(orgIntegrationPolicies.orgId, orgId))
          .where(eq(orgIntegrationPolicies.provider, provider));
        
        if (orgPolicy?.allowedScopes) {
          return orgPolicy.allowedScopes;
        }
      }

      // Default to read-only
      return ['read'];
    } catch (error) {
      console.error("Error fetching allowed integration scopes:", error);
      return ['read'];
    }
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash));
    return apiKey;
  }

  async getApiKeyUsage(keyId: number, periodMinutes: number): Promise<number> {
    // Mock implementation - would track actual usage in practice
    return Math.floor(Math.random() * 10);
  }

  async updateApiKeyLastUsed(keyId: number): Promise<void> {
    await db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, keyId));
  }

  async getAllDialerMappings(): Promise<UserDialerMap[]> {
    return await db.select().from(userDialerMap);
  }

  async getDialerMapping(userId: number): Promise<UserDialerMap | undefined> {
    const [mapping] = await db.select().from(userDialerMap)
      .where(eq(userDialerMap.userId, userId));
    return mapping;
  }

  async updateCallsCache(userId: number, period: string, data: { callsCount: number; avgHandleTime: number; occupancy: number }): Promise<void> {
    await db.insert(callsCache)
      .values({
        userId,
        period,
        ...data,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [callsCache.userId, callsCache.period],
        set: {
          ...data,
          updatedAt: new Date()
        }
      });
  }

  async getCallsCache(userId: number): Promise<CallsCache[]> {
    return await db.select().from(callsCache)
      .where(eq(callsCache.userId, userId));
  }

  // Admin Access Control Methods
  async getAllUsersWithDetails(): Promise<any[]> {
    try {
      const users = await db.select().from(publicUsers);
      
      // Get additional details for each user
      const usersWithDetails = await Promise.all(users.map(async (user) => {
        const [permissions, featureFlags, dialerMapping, orderCount, totalSpent] = await Promise.all([
          this.getUserPermissions(user.id),
          this.getUserFeatureFlags(user.id),
          this.getDialerMapping(user.id),
          this.getUserOrderCount(user.id),
          this.getUserTotalSpent(user.id)
        ]);

        return {
          ...user,
          permissions,
          featureFlags,
          isLinkedToDialer: !!dialerMapping,
          orderCount,
          totalSpent
        };
      }));

      return usersWithDetails;
    } catch (error) {
      console.error("Error fetching users with details:", error);
      throw error;
    }
  }

  async updateUserStatus(userId: number, status: string): Promise<PublicUser | null> {
    try {
      const [user] = await db.update(publicUsers)
        .set({ status })
        .where(eq(publicUsers.id, userId))
        .returning();
      return user || null;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }

  async updateUserRole(userId: number, role: string): Promise<PublicUser | null> {
    try {
      const [user] = await db.update(publicUsers)
        .set({ role })
        .where(eq(publicUsers.id, userId))
        .returning();
      return user || null;
    } catch (error) {
      console.error("Error updating user role:", error);
      return null;
    }
  }

  async updateUserPermissions(userId: number, permissions: string[]): Promise<PublicUser | null> {
    try {
      const [user] = await db.update(publicUsers)
        .set({ permissions })
        .where(eq(publicUsers.id, userId))
        .returning();
      return user || null;
    } catch (error) {
      console.error("Error updating user permissions:", error);
      return null;
    }
  }

  async setUserFeatureFlag(userId: number, flagKey: string, value: boolean): Promise<void> {
    await db.insert(userFeatureFlags)
      .values({ userId, flagKey, value })
      .onConflictDoUpdate({
        target: [userFeatureFlags.userId, userFeatureFlags.flagKey],
        set: { value, updatedAt: new Date() }
      });
  }

  async createApiKey(data: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db.insert(apiKeys).values(data).returning();
    return apiKey;
  }

  async revokeApiKey(keyId: number): Promise<void> {
    await db.update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(eq(apiKeys.id, keyId));
  }

  async getUserOrderCount(userId: number): Promise<number> {
    try {
      const result = await db.select({ count: count() })
        .from(orders)
        .where(eq(orders.userId, userId.toString()));
      return result[0]?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  async getUserTotalSpent(userId: number): Promise<number> {
    try {
      const userOrders = await db.select({ total: orders.total })
        .from(orders)
        .where(eq(orders.userId, userId.toString()));
      
      return userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    } catch (error) {
      return 0;
    }
  }

  async createDialerMapping(data: InsertUserDialerMap): Promise<UserDialerMap> {
    const [mapping] = await db.insert(userDialerMap).values(data).returning();
    return mapping;
  }

  async deleteDialerMapping(userId: number): Promise<void> {
    await db.delete(userDialerMap).where(eq(userDialerMap.userId, userId));
  }

  async setUserPaymentPolicy(userId: number, allowedMethods: string[]): Promise<void> {
    await db.insert(userPaymentPolicies)
      .values({ userId, allowedMethods })
      .onConflictDoUpdate({
        target: userPaymentPolicies.userId,
        set: { allowedMethods, updatedAt: new Date() }
      });
  }

  async setUserIntegrationPolicy(userId: number, provider: string, allowedScopes: string[]): Promise<void> {
    await db.insert(userIntegrationPolicies)
      .values({ userId, provider, allowedScopes })
      .onConflictDoUpdate({
        target: [userIntegrationPolicies.userId, userIntegrationPolicies.provider],
        set: { allowedScopes, updatedAt: new Date() }
      });
  }

  async getAuditLogs(targetUserId?: number, limit = 100): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
    
    if (targetUserId) {
      query = query.where(eq(auditLogs.targetUserId, targetUserId));
    }

    return await query;
  }

  async getUserApiKeys(userId: number): Promise<ApiKey[]> {
    return await db.select().from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .where(isNull(apiKeys.revokedAt));
  }

  async getOrgApiKeys(orgId: string): Promise<ApiKey[]> {
    return await db.select().from(apiKeys)
      .where(eq(apiKeys.orgId, orgId))
      .where(isNull(apiKeys.revokedAt));
  }

  async bulkUpdateUsers(userIds: number[], updates: any): Promise<void> {
    if (userIds.length === 0) return;
    
    await db.update(publicUsers)
      .set(updates)
      .where(inArray(publicUsers.id, userIds));
  }

  async createCoupon(data: InsertCoupon): Promise<Coupon> {
    const [coupon] = await db.insert(coupons).values(data).returning();
    return coupon;
  }

  async getCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons)
      .where(eq(coupons.code, code))
      .where(eq(coupons.isActive, true));
    return coupon;
  }

  async redeemCoupon(couponId: number, userId: number, orderId: number, discountAmount: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Create redemption record
      await tx.insert(couponRedemptions).values({
        couponId,
        userId,
        orderId,
        discountAmount
      });

      // Increment usage count
      await tx.update(coupons)
        .set({ 
          currentUses: sql`${coupons.currentUses} + 1`
        })
        .where(eq(coupons.id, couponId));
    });
  }
