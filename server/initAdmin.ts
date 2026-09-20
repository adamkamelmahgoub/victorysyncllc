
import bcrypt from 'bcryptjs';
import { storage } from './storage';

export async function initializeAdminUser() {
  try {
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;
    if (!email && !password) return;
    if (!email || !password || password.length < 16) {
      throw new Error('Set INITIAL_ADMIN_EMAIL and an INITIAL_ADMIN_PASSWORD of at least 16 characters together.');
    }
    // Check if admin user already exists
    const existingAdmin = await storage.getPublicUserByEmail(email);
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUser = await storage.createPublicUser({
      name: 'Victory Sync Admin',
      email,
      passwordHash: hashedPassword,
      provider: 'local',
      isActive: true,
      privileges: {
        canManageUsers: true,
        canViewAllOrders: true,
        canManageIntegrations: true,
        canViewAnalytics: true,
        canImpersonate: true,
        canManageSettings: true,
        role: 'super_admin'
      }
    });

    console.log('✅ Admin user created successfully:', adminUser.email);
    return adminUser;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    throw error;
  }
}
