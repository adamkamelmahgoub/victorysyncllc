
import bcrypt from 'bcryptjs';
import { storage } from './storage';

export async function initializeTestCustomer() {
  try {
    // Check if test customer already exists
    const existingCustomer = await storage.getPublicUserByEmail('test@customer.com');
    if (existingCustomer) {
      console.log('✅ Test customer already exists');
      return existingCustomer;
    }

    // Create test customer
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    
    const customerUser = await storage.createPublicUser({
      name: 'Test Customer',
      email: 'test@customer.com',
      passwordHash: hashedPassword,
      provider: 'local',
      socialAccounts: [],
      privileges: {
        role: 'customer',
        canAccessDashboard: true,
        canViewOrders: true,
        canManageIntegrations: true
      },
      isActive: true
    });

    console.log('✅ Test customer created successfully:', customerUser.email);
    return customerUser;
  } catch (error) {
    console.error('❌ Failed to create test customer:', error);
    throw error;
  }
}
