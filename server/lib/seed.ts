
import { seedOnce as seedOnceFromServices } from '../services/seed.js';

let inMemoryGuard = false;

/**
 * Run safe, idempotent bootstrap on server start.
 * Calls the existing seedOnce function from services/seed.ts
 */
export async function seedOnce(): Promise<void> {
  if (inMemoryGuard) return;
  inMemoryGuard = true;

  console.log('🔗 Starting database seeding...');
  
  try {
    await seedOnceFromServices();
    console.log('🎉 Bootstrap complete');
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
    throw error;
  }
}
