
import argon2 from 'argon2';
import { db } from '../db.js';
import { users, permissions, roles, rolePermissions } from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function seedSuperAdmin() {
  try {
    console.log('🌱 Seeding super admin and permissions...');

    const requiredEnv = ['SUPERADMIN_EMAIL', 'SUPERADMIN_NAME', 'SUPERADMIN_PASSWORD'];
    const missingEnv = requiredEnv.filter(key => !process.env[key]);

    if (missingEnv.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
      console.log('💡 Set these in Replit Secrets:');
      missingEnv.forEach(env => console.log(`   - ${env}`));
      return;
    }

    // Check if super admin already exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, process.env.SUPERADMIN_EMAIL!));

    if (existingAdmin) {
      console.log('✅ Super admin already exists');
      return;
    }

    // Create permissions
    const permissionsList = [
      // Core permissions
      { key: 'org:view', description: 'View organization details' },
      { key: 'org:update', description: 'Update organization settings' },
      { key: 'org:delete', description: 'Delete organization' },
      { key: 'user:invite', description: 'Invite new users' },
      { key: 'user:update', description: 'Update user details' },
      { key: 'user:delete', description: 'Delete users' },
      { key: 'role:manage', description: 'Manage roles and permissions' },
      { key: 'audit:view', description: 'View audit logs' },
      { key: 'kpi:view', description: 'View KPI data' },
      { key: 'kpi:export', description: 'Export KPI data' },
      { key: 'ticket:manage', description: 'Manage support tickets' },
      { key: 'order:manage', description: 'Manage orders' },
      { key: 'billing:view', description: 'View billing information' },
      { key: 'billing:manage', description: 'Manage billing and subscriptions' },
      { key: 'integration:manage', description: 'Manage integrations' },
      { key: 'api:keys:manage', description: 'Manage API keys' },
      { key: 'feature:flags:manage', description: 'Manage feature flags' },
      { key: 'rate:limits:manage', description: 'Manage rate limits' },
      // Super admin permissions
      { key: 'super:admin:all', description: 'Full super admin access' },
      { key: 'super:admin:impersonate', description: 'Impersonate users' },
      { key: 'super:admin:access_codes', description: 'Manage access codes' },
    ];

    // Insert permissions (ignore duplicates)
    for (const perm of permissionsList) {
      try {
        await db.insert(permissions).values(perm).onConflictDoNothing();
      } catch (error) {
        // Permission might already exist, continue
      }
    }

    // Hash password and create super admin
    const passwordHash = await argon2.hash(process.env.SUPERADMIN_PASSWORD!);
    
    const [superAdmin] = await db
      .insert(users)
      .values({
        orgId: null, // Super admin has no org
        name: process.env.SUPERADMIN_NAME!,
        email: process.env.SUPERADMIN_EMAIL!,
        passwordHash,
        isSuperAdmin: true,
        emailVerified: true,
      })
      .returning();

    console.log('✅ Super admin created successfully');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   ID: ${superAdmin.id}`);

  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSuperAdmin()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedSuperAdmin;
