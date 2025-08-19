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
import { db } from '../db/client';
import { users } from '../db/schema';
import argon2 from 'argon2';

export async function ensureSuperAdmin() {
  const email = 'admin@victorysync.com';
  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!existing) {
    await db.insert(users).values({
      email,
      password_hash: await argon2.hash('victorysync2025'),
      role: 'super_admin',
      full_name: 'VictorySync Admin',
      mfa_enabled: false,
    });
    console.log('[seed] super admin created');
  }
}