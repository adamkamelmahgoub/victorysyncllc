
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

// Optional .env loader: works locally if installed, no-op on Replit
try {
  const { config } = await import('dotenv');
  config();
} catch {
  // dotenv not installed (expected on Replit) — environment comes from Replit Secrets
}

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.log('💡 Please set your DATABASE_URL in Replit Secrets');
  process.exit(1);
}

console.log('🔗 Using DATABASE_URL:', process.env.DATABASE_URL.substring(0, 20) + '...');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function createDemoAccount() {
  let client;
  try {
    console.log('🔌 Attempting to connect to database...');
    client = await pool.connect();
    console.log('✅ Database connection successful');
    
    console.log('🚀 Creating demo customer account...');
    
    // Hash password for demo account
    const demoPassword = 'demo123!';
    const passwordHash = await bcrypt.hash(demoPassword, 10);
    
    // Create demo user
    const userResult = await client.query(`
      INSERT INTO public_users (name, email, password_hash, provider)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        provider = EXCLUDED.provider
      RETURNING id, name, email, created_at
    `, ['Demo Customer', 'demo@victorysync.com', passwordHash, 'local']);
    
    const demoUser = userResult.rows[0];
    console.log(`✅ Demo user created:`, demoUser);
    
    // Create demo organization with scale plan
    const orgResult = await client.query(`
      INSERT INTO organizations (id, name, plan_id, timezone)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        plan_id = EXCLUDED.plan_id,
        timezone = EXCLUDED.timezone
      RETURNING *
    `, ['demo-org-001', 'Demo Organization', 'scale', 'America/New_York']);
    
    const demoOrg = orgResult.rows[0];
    console.log(`✅ Demo organization created:`, demoOrg);
    
    // Create demo entitlements for scale plan features
    const scaleFeatures = [
      'priority_support',
      'dedicated_manager', 
      'custom_integrations',
      'advanced_analytics',
      'white_label_branding',
      '24_7_availability',
      'custom_workflows',
      'api_access'
    ];
    
    for (const feature of scaleFeatures) {
      await client.query(`
        INSERT INTO entitlements (org_id, feature_id, enabled)
        VALUES ($1, $2, $3)
        ON CONFLICT (org_id, feature_id) DO UPDATE SET
          enabled = EXCLUDED.enabled
      `, [demoOrg.id, feature, true]);
    }
    
    console.log(`✅ Scale plan entitlements created for ${scaleFeatures.length} features`);
    
    // Create some demo orders to show order history
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, status, total, created_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
      RETURNING id, total, status, created_at
    `, [demoUser.email, 'completed', '2499.00', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)]);
    
    if (orderResult.rows.length > 0) {
      console.log(`✅ Demo order created:`, orderResult.rows[0]);
    }
    
    console.log('\n🎉 Demo account setup complete!');
    console.log('📧 Email: demo@victorysync.com');
    console.log('🔑 Password: demo123!');
    console.log('📋 Plan: Scale (Premium)');
    console.log('🏢 Organization: demo-org-001');
    console.log('\n🔗 You can now log in at: http://0.0.0.0:5000/login');
    
  } catch (error) {
    console.error('❌ Error creating demo account:', error.message);
    if (error.message.includes('WebSocket')) {
      console.log('💡 This might be a database connection issue.');
      console.log('💡 Please check that your DATABASE_URL is correctly set in Replit Secrets');
      console.log('💡 Format should be: postgresql://user:pass@host/database');
    }
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

createDemoAccount();
