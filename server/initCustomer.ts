
import bcrypt from 'bcryptjs';
import { storage } from './storage';

export async function initializeTestCustomer() {
  try {
    // Check if test customer already exists
    const existingCustomer = await storage.getPublicUserByEmail('test@example.com');
    if (existingCustomer) {
      console.log('✅ Test customer already exists');
      return existingCustomer;
    }

    // Create test customer
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const customer = await storage.createPublicUser({
      name: 'Test Customer',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      role: 'customer',
      isActive: true,
      socialAccounts: []
    });

    console.log('✅ Test customer created successfully:', customer.email);
    return customer;
  } catch (error) {
    console.error('❌ Failed to create test customer:', error);
    throw error;
  }
}
