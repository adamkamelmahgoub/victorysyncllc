
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
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { users } from '../db/schema';
import argon2 from 'argon2';

let seeded = false;

export async function seedOnce() {
  if (seeded) return;
  seeded = true;
  
  try {
    const [existing] = await db.select().from(users).where(eq(users.email, 'admin@victorysync.com'));
    
    if (!existing) {
      const hash = await argon2.hash('victorysync2025');
      await db.insert(users).values({
        email: 'admin@victorysync.com',
        passwordHash: hash,
        role: 'superAdmin',
        fullName: 'VictorySync Admin',
        permissions: ['*']
      });
      console.log('✅ Seeded super admin admin@victorysync.com');
    }
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}
