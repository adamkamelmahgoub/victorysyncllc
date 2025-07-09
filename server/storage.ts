import {
  publicUsers,
  adminUsers,
  packages,
  orders,
  orderItems,
  contactSubmissions,
  crmIntegrations, 
  supportTickets, auditLogs, kpiMetrics,
  type PublicUser,
  type InsertPublicUser,
  type AdminUser,
  type InsertAdminUser,
  type Package,
  type InsertPackage,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ContactSubmission,
  type InsertContactSubmission,
  type CrmIntegration, type SupportTicket, type AuditLog, type KpiMetric,
  type InsertCrmIntegration, type InsertSupportTicket,
  type InsertAuditLog, type InsertKpiMetric
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Public user operations (JWT auth system)
  createPublicUser(user: InsertPublicUser): Promise<PublicUser>;
  getPublicUserByEmail(email: string): Promise<PublicUser | undefined>;
  getPublicUserById(id: number): Promise<PublicUser | undefined>;
  updatePublicUserSocialAccounts(id: number, socialAccounts: any[]): Promise<PublicUser>;

  // Admin user operations
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  updateAdminLastLogin(id: number): Promise<AdminUser>;

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

  // CRM Integrations
  getCrmIntegrations(userId: string): Promise<CrmIntegration[]>;
  createCrmIntegration(integration: InsertCrmIntegration): Promise<CrmIntegration>;
  updateCrmIntegration(id: number, updates: Partial<InsertCrmIntegration>): Promise<CrmIntegration>;
  deleteCrmIntegration(id: number, userId: string): Promise<boolean>;
  getAllCrmIntegrations(): Promise<CrmIntegration[]>;

  // Support Tickets
  getSupportTickets(userId: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, updates: Partial<InsertSupportTicket>): Promise<SupportTicket>;
  getAllSupportTickets(): Promise<SupportTicket[]>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  getUserAuditLogs(userId: string, limit?: number): Promise<AuditLog[]>;

  // KPI Metrics
  createKpiMetric(metric: InsertKpiMetric): Promise<KpiMetric>;
  getKpiMetrics(userId: string, startDate?: Date, endDate?: Date): Promise<KpiMetric[]>;
  getAllKpiMetrics(startDate?: Date, endDate?: Date): Promise<KpiMetric[]>;

  // User management for admins
  updateUserRole(userId: number, role: string): Promise<any>;
  updateUserPermissions(userId: number, permissions: any): Promise<any>;
  updateLastLogin(userId: number): Promise<any>;

  // Contact submission management
  updateContactSubmission(id: number, updates: Partial<InsertContactSubmission>): Promise<any>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  // Public user operations
  async createPublicUser(user: InsertPublicUser): Promise<PublicUser> {
    const [newUser] = await db.insert(publicUsers).values(user).returning();
    return newUser;
  }

  // Admin user operations
  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db.insert(adminUsers).values(user).returning();
    return newUser;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async updateAdminLastLogin(id: number): Promise<AdminUser> {
    const [updated] = await db.update(adminUsers)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return updated;
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
    return await db.select().from(packages);
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

  // CRM Integrations
  async getCrmIntegrations(userId: string) {
    return await db.select().from(crmIntegrations).where(eq(crmIntegrations.userId, userId));
  }

  async createCrmIntegration(integration: InsertCrmIntegration) {
    const [created] = await db.insert(crmIntegrations).values(integration).returning();
    return created;
  }

  async updateCrmIntegration(id: number, updates: Partial<InsertCrmIntegration>) {
    const [updated] = await db.update(crmIntegrations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(crmIntegrations.id, id))
      .returning();
    return updated;
  }

  async deleteCrmIntegration(id: number, userId: string) {
    const result = await db.delete(crmIntegrations)
      .where(and(eq(crmIntegrations.id, id), eq(crmIntegrations.userId, userId)));
    return result.rowCount > 0;
  }

  async getAllCrmIntegrations() {
    return await db.select().from(crmIntegrations).orderBy(desc(crmIntegrations.createdAt));
  }

  // Support Tickets
  async getSupportTickets(userId: string) {
    return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId));
  }

  async createSupportTicket(ticket: InsertSupportTicket) {
    const [created] = await db.insert(supportTickets).values(ticket).returning();
    return created;
  }

  async updateSupportTicket(id: number, updates: Partial<InsertSupportTicket>) {
    const [updated] = await db.update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updated;
  }

  async getAllSupportTickets() {
    return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  // Audit Logs
  async createAuditLog(log: InsertAuditLog) {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getAuditLogs(limit: number = 100) {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  async getUserAuditLogs(userId: string, limit: number = 50) {
    return await db.select().from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // KPI Metrics
  async createKpiMetric(metric: InsertKpiMetric) {
    const [created] = await db.insert(kpiMetrics).values(metric).returning();
    return created;
  }

  async getKpiMetrics(userId: string, startDate?: Date, endDate?: Date) {
    let query = db.select().from(kpiMetrics).where(eq(kpiMetrics.userId, userId));

    if (startDate) {
      query = query.where(gte(kpiMetrics.timestamp, startDate));
    }
    if (endDate) {
      query = query.where(lte(kpiMetrics.timestamp, endDate));
    }

    return await query.orderBy(desc(kpiMetrics.timestamp));
  }

  async getAllKpiMetrics(startDate?: Date, endDate?: Date) {
    let query = db.select().from(kpiMetrics);

    if (startDate) {
      query = query.where(gte(kpiMetrics.timestamp, startDate));
    }
    if (endDate) {
      query = query.where(lte(kpiMetrics.timestamp, endDate));
    }

    return await query.orderBy(desc(kpiMetrics.timestamp));
  }

  // User management for admins
  async updateUserRole(userId: number, role: string) {
    const [updated] = await db.update(publicUsers)
      .set({ role, updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    return updated;
  }

  async updateUserPermissions(userId: number, permissions: any) {
    const [updated] = await db.update(publicUsers)
      .set({ permissions, updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    return updated;
  }

  async updateLastLogin(userId: number) {
    const [updated] = await db.update(publicUsers)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    return updated;
  }

  // Contact submission management
  async updateContactSubmission(id: number, updates: Partial<InsertContactSubmission>) {
    const [updated] = await db.update(contactSubmissions)
      .set(updates)
      .where(eq(contactSubmissions.id, id))
      .returning();
    return updated;
  }

  async getAllContactSubmissions() {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  // Legacy compatibility for integrations
  async getUserIntegrations(userId: number) {
    return await this.getCrmIntegrations(userId.toString());
  }

  async createUserIntegration(integration: any) {
    return await this.createCrmIntegration(integration);
  }

  async deleteUserIntegration(id: number, userId: number) {
    return await this.deleteCrmIntegration(id, userId.toString());
  }
}

export const storage = new DatabaseStorage();