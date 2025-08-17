
import bcrypt from 'bcryptjs';
import { storage } from './storage';

export async function initializeAdminUser() {
  try {
    // Check if main admin user already exists
    const existingAdmin = await storage.getPublicUserByEmail('kimo8723@victorysync.com');
    if (!existingAdmin) {
      // Create main admin user
      const hashedPassword = await bcrypt.hash('Mshmsh7184365700!', 10);
      
      const adminUser = await storage.createPublicUser({
        name: 'Victory Sync Admin',
        email: 'kimo8723@victorysync.com',
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

      console.log('✅ Main admin user created successfully:', adminUser.email);
    } else {
      console.log('✅ Main admin user already exists');
    }

    // Check if demo admin user already exists
    const existingDemoAdmin = await storage.getPublicUserByEmail('admin@victorysync.com');
    if (!existingDemoAdmin) {
      // Create demo admin user
      const demoHashedPassword = await bcrypt.hash('AdminDemo123!', 10);
      
      const demoAdminUser = await storage.createPublicUser({
        name: 'Demo Admin',
        email: 'admin@victorysync.com',
        passwordHash: demoHashedPassword,
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

      console.log('✅ Demo admin user created successfully:', demoAdminUser.email);
    } else {
      console.log('✅ Demo admin user already exists');
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to create admin users:', error);
    throw error;
  }
}
