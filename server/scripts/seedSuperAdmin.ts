
import { db } from '../db';
import { users, permissions, roles, rolePermissions, userRoles } from '../../shared/schema';
import { eq, inArray } from 'drizzle-orm';
import argon2 from 'argon2';

interface RoleDefinition {
  name: string;
  description: string;
  permissions: string[];
}

const ROLES: RoleDefinition[] = [
  {
    name: 'super_admin',
    description: 'Super Administrator with full system access',
    permissions: [
      'user_create', 'user_read', 'user_update', 'user_delete',
      'role_create', 'role_read', 'role_update', 'role_delete',
      'permission_create', 'permission_read', 'permission_update', 'permission_delete',
      'admin_dashboard', 'system_config', 'audit_logs',
      'billing_read', 'billing_update', 'subscription_manage',
      'organization_create', 'organization_read', 'organization_update', 'organization_delete'
    ]
  },
  {
    name: 'admin',
    description: 'Administrator with limited system access',
    permissions: [
      'user_read', 'user_update',
      'role_read', 'permission_read',
      'admin_dashboard', 'audit_logs',
      'billing_read', 'organization_read'
    ]
  },
  {
    name: 'manager',
    description: 'Manager with team oversight capabilities',
    permissions: [
      'user_read', 'admin_dashboard',
      'billing_read', 'organization_read'
    ]
  },
  {
    name: 'user',
    description: 'Standard user with basic access',
    permissions: ['user_read']
  }
];

const BASE_PERMISSIONS = [
  { key: 'user_create', description: 'Create users' },
  { key: 'user_read', description: 'Read user information' },
  { key: 'user_update', description: 'Update user information' },
  { key: 'user_delete', description: 'Delete users' },
  { key: 'role_create', description: 'Create roles' },
  { key: 'role_read', description: 'Read role information' },
  { key: 'role_update', description: 'Update role information' },
  { key: 'role_delete', description: 'Delete roles' },
  { key: 'permission_create', description: 'Create permissions' },
  { key: 'permission_read', description: 'Read permission information' },
  { key: 'permission_update', description: 'Update permission information' },
  { key: 'permission_delete', description: 'Delete permissions' },
  { key: 'admin_dashboard', description: 'Access admin dashboard' },
  { key: 'system_config', description: 'Configure system settings' },
  { key: 'audit_logs', description: 'View audit logs' },
  { key: 'billing_read', description: 'View billing information' },
  { key: 'billing_update', description: 'Update billing information' },
  { key: 'subscription_manage', description: 'Manage subscriptions' },
  { key: 'organization_create', description: 'Create organizations' },
  { key: 'organization_read', description: 'Read organization information' },
  { key: 'organization_update', description: 'Update organization information' },
  { key: 'organization_delete', description: 'Delete organizations' }
];

async function createPermissions() {
  console.log('Creating base permissions...');
  
  // Check which permissions already exist
  const existingPermissions = await db.select().from(permissions);
  const existingKeys = new Set(existingPermissions.map(p => p.key));
  
  // Filter out permissions that already exist
  const newPermissions = BASE_PERMISSIONS.filter(p => !existingKeys.has(p.key));
  
  if (newPermissions.length > 0) {
    await db.insert(permissions).values(newPermissions);
    console.log(`Created ${newPermissions.length} new permissions`);
  } else {
    console.log('All permissions already exist');
  }
  
  return await db.select().from(permissions);
}

async function createRoles(allPermissions: any[]) {
  console.log('Creating roles...');
  
  const createdRoles = [];
  
  for (const roleData of ROLES) {
    // Check if role already exists
    const existingRole = await db.select().from(roles).where(eq(roles.name, roleData.name));
    
    let roleId: number;
    if (existingRole.length === 0) {
      // Create new role
      const [newRole] = await db.insert(roles).values({
        name: roleData.name,
        description: roleData.description,
        orgId: 1 // Default organization
      }).returning();
      roleId = newRole.id;
      console.log(`Created role: ${roleData.name}`);
    } else {
      roleId = existingRole[0].id;
      console.log(`Role already exists: ${roleData.name}`);
    }
    
    // Get permissions for this role
    const rolePermissionsList = allPermissions.filter(p => 
      roleData.permissions.includes(p.key)
    );
    
    // Clear existing role permissions
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    
    // Add new role permissions
    if (rolePermissionsList.length > 0) {
      const rolePermissionValues = rolePermissionsList.map(p => ({
        roleId: roleId,
        permissionId: p.id
      }));
      await db.insert(rolePermissions).values(rolePermissionValues);
    }
    
    createdRoles.push({ id: roleId, name: roleData.name });
  }
  
  return createdRoles;
}

export async function seedSuperAdmin() {
  try {
    console.log('Starting super admin seeding process...');
    
    // Create permissions first
    const allPermissions = await createPermissions();
    
    // Create roles and assign permissions
    const createdRoles = await createRoles(allPermissions);
    
    // Create super admin user
    const superAdminEmail = 'admin@victorysync.com';
    const superAdminPassword = 'SuperAdmin123!';
    
    // Check if super admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, superAdminEmail));
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await argon2.hash(superAdminPassword);
      
      const [newUser] = await db.insert(users).values({
        name: 'Super Administrator',
        email: superAdminEmail,
        passwordHash: hashedPassword,
        isActive: true,
        orgId: 1 // Default organization
      }).returning();
      
      console.log(`Created super admin user: ${superAdminEmail}`);
      console.log(`Super admin password: ${superAdminPassword}`);
      
      // Assign super_admin role to the user
      const superAdminRole = createdRoles.find(r => r.name === 'super_admin');
      if (superAdminRole) {
        await db.insert(userRoles).values({
          userId: newUser.id,
          roleId: superAdminRole.id
        });
        console.log('Super admin role assigned to user');
      }
    } else {
      console.log('Super admin user already exists');
    }
    
    console.log('Super admin seeding completed successfully!');
    
    return createdRoles;
    
  } catch (error) {
    console.error('Error seeding super admin:', error);
    throw error;
  }
}

async function main() {
  await seedSuperAdmin();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
