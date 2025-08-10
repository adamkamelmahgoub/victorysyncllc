
import { db } from '../db';
import { users, permissions, roles, rolePermissions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { AuthService } from '../lib/auth';

const REQUIRED_ENV_VARS = ['SUPERADMIN_EMAIL', 'SUPERADMIN_NAME', 'SUPERADMIN_PASSWORD'];

// Core permissions
const CORE_PERMISSIONS = [
  // Organization permissions
  { key: 'org:view', description: 'View organization details' },
  { key: 'org:update', description: 'Update organization settings' },
  { key: 'org:delete', description: 'Delete organization' },
  
  // User management
  { key: 'user:invite', description: 'Invite new users' },
  { key: 'user:update', description: 'Update user details' },
  { key: 'user:delete', description: 'Delete users' },
  { key: 'user:impersonate', description: 'Impersonate other users' },
  
  // Role management
  { key: 'role:manage', description: 'Manage roles and permissions' },
  
  // Audit logs
  { key: 'audit:view', description: 'View audit logs' },
  
  // KPIs and analytics
  { key: 'kpi:view', description: 'View KPI data' },
  { key: 'kpi:export', description: 'Export KPI data' },
  
  // Ticket management
  { key: 'ticket:manage', description: 'Manage support tickets' },
  { key: 'ticket:view', description: 'View support tickets' },
  
  // Order management
  { key: 'order:manage', description: 'Manage orders' },
  { key: 'order:view', description: 'View orders' },
  
  // Billing
  { key: 'billing:view', description: 'View billing information' },
  { key: 'billing:manage', description: 'Manage billing and subscriptions' },
  
  // Integrations
  { key: 'integration:manage', description: 'Manage integrations' },
  { key: 'integration:view', description: 'View integration status' },
  
  // API management
  { key: 'api:keys:manage', description: 'Manage API keys' },
  
  // Feature flags
  { key: 'feature:flags:manage', description: 'Manage feature flags' },
  
  // Rate limits
  { key: 'rate:limits:manage', description: 'Manage rate limits' },
  
  // Super admin only
  { key: 'super:admin:all', description: 'Super admin access to all resources' },
  { key: 'super:admin:orgs', description: 'Manage all organizations' },
  { key: 'super:admin:users', description: 'Manage all users' },
  { key: 'super:admin:impersonate', description: 'Impersonate any user' },
  { key: 'super:admin:access_codes', description: 'Manage access codes' },
  { key: 'super:admin:system', description: 'System administration' },
];

async function checkEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.log('\nPlease set these in your Replit Secrets:');
    console.log('- SUPERADMIN_EMAIL: The super admin email address');
    console.log('- SUPERADMIN_NAME: The super admin display name');
    console.log('- SUPERADMIN_PASSWORD: The super admin password (min 8 chars, 1 number)');
    process.exit(1);
  }
}

async function seedPermissions() {
  console.log('🔑 Seeding permissions...');
  
  for (const perm of CORE_PERMISSIONS) {
    await db.insert(permissions)
      .values(perm)
      .onConflictDoUpdate({
        target: permissions.key,
        set: {
          description: perm.description,
        },
      });
  }
  
  console.log(`✅ Seeded ${CORE_PERMISSIONS.length} permissions`);
}

async function seedSystemRoles() {
  console.log('👥 Seeding system roles...');
  
  // Create global system roles (orgId = null)
  const systemRoles = [
    {
      name: 'Super Admin',
      description: 'Full system access',
      permissions: CORE_PERMISSIONS.map(p => p.key), // All permissions
    },
  ];
  
  for (const roleData of systemRoles) {
    // Create role
    const [role] = await db.insert(roles)
      .values({
        orgId: null, // Global role
        name: roleData.name,
        description: roleData.description,
        isSystem: true,
      })
      .onConflictDoNothing()
      .returning();
    
    if (role) {
      // Add permissions to role
      for (const permKey of roleData.permissions) {
        const permission = await db.query.permissions.findFirst({
          where: eq(permissions.key, permKey),
        });
        
        if (permission) {
          await db.insert(rolePermissions)
            .values({
              roleId: role.id,
              permissionId: permission.id,
            })
            .onConflictDoNothing();
        }
      }
    }
  }
  
  console.log('✅ System roles seeded');
}

async function seedOrgRoles() {
  console.log('🏢 Creating default org role templates...');
  
  // These will be created per organization
  const orgRoleTemplates = [
    {
      name: 'Org Owner',
      description: 'Full organization access',
      permissions: [
        'org:view', 'org:update', 'org:delete',
        'user:invite', 'user:update', 'user:delete',
        'role:manage', 'audit:view',
        'kpi:view', 'kpi:export',
        'ticket:manage', 'order:manage',
        'billing:view', 'billing:manage',
        'integration:manage', 'api:keys:manage',
      ],
    },
    {
      name: 'Manager',
      description: 'Management access without org deletion',
      permissions: [
        'org:view', 'org:update',
        'user:invite', 'user:update',
        'audit:view', 'kpi:view', 'kpi:export',
        'ticket:manage', 'order:view',
        'billing:view', 'integration:view',
      ],
    },
    {
      name: 'Agent',
      description: 'Limited access for agents',
      permissions: [
        'org:view', 'kpi:view',
        'ticket:manage', 'order:view',
      ],
    },
  ];
  
  // Store templates for later use when creating orgs
  console.log(`✅ Prepared ${orgRoleTemplates.length} org role templates`);
}

async function seedSuperAdmin() {
  console.log('🔧 Seeding super admin user...');
  
  const email = process.env.SUPERADMIN_EMAIL!.toLowerCase();
  const name = process.env.SUPERADMIN_NAME!;
  const password = process.env.SUPERADMIN_PASSWORD!;
  
  // Validate password
  if (password.length < 8 || !/\d/.test(password)) {
    console.error('❌ Super admin password must be at least 8 characters with 1 number');
    process.exit(1);
  }
  
  // Check if super admin already exists
  const existingSuperAdmin = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  if (existingSuperAdmin) {
    console.log('✅ Super admin already exists, updating...');
    
    // Update existing super admin
    const passwordHash = await AuthService.hashPassword(password);
    
    await db.update(users)
      .set({
        name,
        passwordHash,
        isSuperAdmin: true,
        isActive: true,
        emailVerified: true,
      })
      .where(eq(users.id, existingSuperAdmin.id));
    
    console.log('✅ Super admin updated successfully');
    return;
  }
  
  // Create new super admin
  const passwordHash = await AuthService.hashPassword(password);
  
  const [superAdmin] = await db.insert(users)
    .values({
      orgId: null, // Super admin doesn't belong to any org
      name,
      email,
      passwordHash,
      isSuperAdmin: true,
      isActive: true,
      emailVerified: true,
    })
    .returning();
  
  console.log(`✅ Super admin created: ${superAdmin.email}`);
}

export async function createOrgRoles(orgId: number) {
  console.log(`🏢 Creating roles for organization ${orgId}...`);
  
  const orgRoleTemplates = [
    {
      name: 'Org Owner',
      description: 'Full organization access',
      permissions: [
        'org:view', 'org:update', 'org:delete',
        'user:invite', 'user:update', 'user:delete',
        'role:manage', 'audit:view',
        'kpi:view', 'kpi:export',
        'ticket:manage', 'order:manage',
        'billing:view', 'billing:manage',
        'integration:manage', 'api:keys:manage',
      ],
    },
    {
      name: 'Manager',
      description: 'Management access without org deletion',
      permissions: [
        'org:view', 'org:update',
        'user:invite', 'user:update',
        'audit:view', 'kpi:view', 'kpi:export',
        'ticket:manage', 'order:view',
        'billing:view', 'integration:view',
      ],
    },
    {
      name: 'Agent',
      description: 'Limited access for agents',
      permissions: [
        'org:view', 'kpi:view',
        'ticket:manage', 'order:view',
      ],
    },
  ];
  
  for (const roleData of orgRoleTemplates) {
    // Create role
    const [role] = await db.insert(roles)
      .values({
        orgId,
        name: roleData.name,
        description: roleData.description,
        isSystem: true,
      })
      .returning();
    
    // Add permissions to role
    for (const permKey of roleData.permissions) {
      const permission = await db.query.permissions.findFirst({
        where: eq(permissions.key, permKey),
      });
      
      if (permission) {
        await db.insert(rolePermissions)
          .values({
            roleId: role.id,
            permissionId: permission.id,
          })
          .onConflictDoNothing();
      }
    }
  }
  
  console.log(`✅ Created roles for organization ${orgId}`);
}

async function main() {
  try {
    console.log('🚀 Starting seed process...');
    
    checkEnvironment();
    
    await seedPermissions();
    await seedSystemRoles();
    await seedOrgRoles();
    await seedSuperAdmin();
    
    console.log('🎉 Seed completed successfully!');
    console.log('\nYou can now login as super admin with:');
    console.log(`Email: ${process.env.SUPERADMIN_EMAIL}`);
    console.log('Password: [REDACTED]');
    console.log('\nSuper admin can access the admin portal at /admin');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main as seedSuperAdmin, createOrgRoles };
