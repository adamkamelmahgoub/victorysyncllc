
#!/usr/bin/env tsx

import { db } from '../db';
import { users, permissions, roles, rolePermissions } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

const CORE_PERMISSIONS = [
  { key: 'org:view', description: 'View organization details' },
  { key: 'org:update', description: 'Update organization' },
  { key: 'org:delete', description: 'Delete organization' },
  { key: 'user:invite', description: 'Invite users' },
  { key: 'user:update', description: 'Update users' },
  { key: 'user:delete', description: 'Delete users' },
  { key: 'role:manage', description: 'Manage roles and permissions' },
  { key: 'audit:view', description: 'View audit logs' },
  { key: 'kpi:view', description: 'View KPIs' },
  { key: 'kpi:export', description: 'Export KPIs' },
  { key: 'ticket:manage', description: 'Manage tickets' },
  { key: 'order:manage', description: 'Manage orders' },
  { key: 'billing:view', description: 'View billing information' },
  { key: 'billing:manage', description: 'Manage billing and subscriptions' },
  { key: 'integration:manage', description: 'Manage integrations' },
  { key: 'api:keys:manage', description: 'Manage API keys' },
  { key: 'feature:flags:manage', description: 'Manage feature flags' },
  { key: 'rate:limits:manage', description: 'Manage rate limits' },
  { key: 'super:admin:*', description: 'Super admin access (bypass all checks)' },
];

async function seedSuperAdmin() {
  console.log('🔄 Seeding super admin and permissions...');

  try {
    // Check required environment variables
    const { SUPERADMIN_EMAIL, SUPERADMIN_NAME, SUPERADMIN_PASSWORD } = process.env;
    
    if (!SUPERADMIN_EMAIL || !SUPERADMIN_NAME || !SUPERADMIN_PASSWORD) {
      console.error('❌ Missing required environment variables:');
      console.error('   SUPERADMIN_EMAIL - Email for the super admin user');
      console.error('   SUPERADMIN_NAME - Full name for the super admin user');
      console.error('   SUPERADMIN_PASSWORD - Password for the super admin user');
      console.error('');
      console.error('Please add these to your Replit Secrets or .env file.');
      process.exit(1);
    }

    // Seed permissions first
    console.log('📝 Seeding permissions...');
    
    for (const permission of CORE_PERMISSIONS) {
      const existing = await db
        .select()
        .from(permissions)
        .where(eq(permissions.key, permission.key))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(permissions).values(permission);
        console.log(`   ✅ Created permission: ${permission.key}`);
      }
    }

    // Check if super admin already exists
    const existingSuperAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, SUPERADMIN_EMAIL))
      .limit(1);

    if (existingSuperAdmin.length > 0) {
      console.log(`✅ Super admin already exists: ${SUPERADMIN_EMAIL}`);
      
      // Update password if needed
      const passwordHash = await argon2.hash(SUPERADMIN_PASSWORD);
      await db
        .update(users)
        .set({
          name: SUPERADMIN_NAME,
          passwordHash,
          isSuperAdmin: true,
          isActive: true,
          emailVerified: true,
        })
        .where(eq(users.id, existingSuperAdmin[0].id));
      
      console.log('✅ Super admin updated successfully');
      return;
    }

    // Create super admin user
    const passwordHash = await argon2.hash(SUPERADMIN_PASSWORD);
    
    const [superAdmin] = await db.insert(users).values({
      orgId: null, // Super admin doesn't belong to any org
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      passwordHash,
      isSuperAdmin: true,
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
    }).returning();

    console.log(`✅ Super admin created: ${superAdmin.email} (ID: ${superAdmin.id})`);
    console.log('✅ Seeding completed successfully');
    
  } catch (error) {
    console.error('❌ Failed to seed super admin:', error);
    throw error;
  }
}

async function seedDefaultRoles(orgId: number) {
  const orgOwnerPermissions = CORE_PERMISSIONS.filter(p => !p.key.startsWith('super:')).map(p => p.key);
  const managerPermissions = ['org:view', 'user:invite', 'user:update', 'role:manage', 'audit:view', 'kpi:view', 'kpi:export', 'ticket:manage', 'order:manage', 'billing:view', 'billing:manage', 'integration:manage'];
  const agentPermissions = ['kpi:view', 'ticket:manage', 'order:view'];

  const defaultRoles = [
    {
      name: 'Org Owner',
      description: 'Full organization management',
      permissions: orgOwnerPermissions,
    },
    {
      name: 'Manager',
      description: 'Manage users, integrations, and billing',
      permissions: managerPermissions,
    },
    {
      name: 'Agent',
      description: 'Limited access for agents',
      permissions: agentPermissions,
    }
  ];

  const createdRoles = [];
  
  for (const roleData of defaultRoles) {
    // Create role
    const [role] = await db.insert(roles).values({
      orgId,
      name: roleData.name,
      description: roleData.description,
      isSystem: true,
    }).returning();

    // Assign permissions
    const rolePermissions = await db
      .select()
      .from(permissions)
      .where(permissions.key.in(roleData.permissions));

    for (const permission of rolePermissions) {
      await db.insert(rolePermissions).values({
        roleId: role.id,
        permissionId: permission.id,
      });
    }

    createdRoles.push(role);
  }

  return createdRoles;
}

if (require.main === module) {
  seedSuperAdmin().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { seedSuperAdmin, seedDefaultRoles };
