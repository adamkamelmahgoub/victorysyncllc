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