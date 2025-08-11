
import { describe, it, expect } from '@jest/globals';
import { 
  users, 
  roles, 
  permissions, 
  organizations,
  publicUsers,
  packages,
  orders,
  orderItems,
  contactSubmissions,
  loginSchema,
  registerUserSchema,
  type User,
  type Role,
  type Permission,
  type Organization,
  type PublicUser,
  type Package,
  type Order,
  type OrderItem,
  type ContactSubmission
} from '../../shared/schema';

describe('Schema Exports', () => {
  it('should export all required table schemas', () => {
    expect(users).toBeDefined();
    expect(roles).toBeDefined();
    expect(permissions).toBeDefined();
    expect(organizations).toBeDefined();
    expect(publicUsers).toBeDefined();
    expect(packages).toBeDefined();
    expect(orders).toBeDefined();
    expect(orderItems).toBeDefined();
    expect(contactSubmissions).toBeDefined();
  });

  it('should export validation schemas', () => {
    expect(loginSchema).toBeDefined();
    expect(registerUserSchema).toBeDefined();
  });

  it('should have proper TypeScript types', () => {
    // Type assertions to ensure types are properly exported
    const user: User = {} as User;
    const role: Role = {} as Role;
    const permission: Permission = {} as Permission;
    const organization: Organization = {} as Organization;
    const publicUser: PublicUser = {} as PublicUser;
    const pkg: Package = {} as Package;
    const order: Order = {} as Order;
    const orderItem: OrderItem = {} as OrderItem;
    const contactSubmission: ContactSubmission = {} as ContactSubmission;

    expect(user).toBeDefined();
    expect(role).toBeDefined();
    expect(permission).toBeDefined();
    expect(organization).toBeDefined();
    expect(publicUser).toBeDefined();
    expect(pkg).toBeDefined();
    expect(order).toBeDefined();
    expect(orderItem).toBeDefined();
    expect(contactSubmission).toBeDefined();
  });
});
