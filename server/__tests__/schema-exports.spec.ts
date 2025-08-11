
import { describe, it, expect } from 'jest';
import {
  User, Role, Permission, Organization, PublicUser, Package, Order, OrderItem, ContactSubmission,
  loginSchema, registerUserSchema, insertContactSubmissionSchema
} from '../../shared/schema';

describe('Schema Exports', () => {
  it('should export all necessary schemas', () => {
    expect(loginSchema).toBeDefined();
    expect(registerUserSchema).toBeDefined();
    expect(insertContactSubmissionSchema).toBeDefined();
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
