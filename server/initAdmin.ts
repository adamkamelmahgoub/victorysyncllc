
import bcrypt from 'bcryptjs';
import { storage } from './storage';

export async function initializeAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getAdminUserByUsername('admin');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Mshmsh7184365700!', 10);
    
    const adminUser = await storage.createAdminUser({
      username: 'admin',
      name: 'Victory Sync Admin',
      passwordHash: hashedPassword,
      role: 'super_admin',
      isActive: true,
      permissions: {
        canManageUsers: true,
        canViewAllOrders: true,
        canManageIntegrations: true,
        canViewAnalytics: true,
        canImpersonate: true,
        canManageSettings: true
      }
    });

    console.log('✅ Admin user created successfully:', adminUser.username);
    return adminUser;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    throw error;
  }
}
