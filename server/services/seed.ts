
import { db } from '../db/client.js';
import { users, organizations, packages, accessCodes } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export async function seedOnce(){
  const orgName='VictorySync';
  const existingOrg = (await db.select().from(organizations).where(eq(organizations.name, orgName)))[0];
  const orgId = existingOrg?.id || (await db.insert(organizations).values({ name: orgName, idCode: 'VS-'+Math.random().toString(36).slice(2,8).toUpperCase() }).returning({ id: organizations.id, idCode: organizations.idCode }))[0].id;

  const email=(process.env.DEFAULT_ADMIN_EMAIL||'admin@victorysync.com').toLowerCase();
  const found = (await db.select().from(users).where(eq(users.email,email)))[0];
  if(!found){
    const passwordHash = await argon2.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'victorysync2025');
    await db.insert(users).values({
      email, passwordHash, fullName:'Admin', orgId, role:'superAdmin', permissions:[], mfaEnabled:false
    });
  }

  const pkgs = await db.select().from(packages);
  if(pkgs.length===0){
    await db.insert(packages).values([
      { slug:'starter', name:'Starter', price:'49.00', seats:3 },
      { slug:'growth', name:'Growth', price:'149.00', seats:10 },
      { slug:'scale',  name:'Scale',  price:'399.00', seats:30 }
    ]);
  }

  const codes = await db.select().from(accessCodes);
  if(codes.length===0){
    await db.insert(accessCodes).values({
      orgId, code:'VS-ACCESS-001', role:'customer', maxUses:100, usedCount:0, createdBy:1
    });
  }
}
