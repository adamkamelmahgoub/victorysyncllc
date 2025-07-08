import { build } from 'esbuild';

// Comprehensive list of external dependencies that should not be bundled
const externals = [
  // Node.js built-ins
  'fs', 'path', 'crypto', 'util', 'events', 'stream', 'http', 'https', 'url', 'querystring',
  'zlib', 'net', 'tls', 'os', 'child_process', 'worker_threads', 'cluster', 'dns', 'module',
  
  // Database and ORM
  'pg-native',
  '@neondatabase/serverless',
  'drizzle-orm',
  'drizzle-kit',
  
  // Express and middleware
  'express',
  'cors',
  'express-session',
  'connect-pg-simple',
  
  // Authentication and security
  'passport',
  'passport-local',
  'passport-google-oauth20',
  'passport-facebook',
  'passport-apple',
  'bcrypt',
  'jsonwebtoken',
  
  // External services
  'stripe',
  'nodemailer',
  'ws',
  
  // Utilities and core dependencies
  'zod',
  'zod-validation-error',
  'nanoid',
  'memoizee',
  'memorystore',
  'openid-client',
  
  // Build tools and CSS processors (should never be in server bundle)
  'lightningcss',
  '@tailwindcss/vite',
  'autoprefixer',
  'postcss',
  'tailwindcss',
  'vite',
  '@vitejs/plugin-react',
  '@babel/preset-typescript',
  'typescript',
  'esbuild'
];

try {
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/server.js',
    external: externals,
    format: 'esm',
    banner: {
      js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
    },
    minify: false,
    sourcemap: false,
    packages: 'external', // Treat all node_modules as external
    allowOverwrite: true,
    logLevel: 'info'
  });
  console.log('✅ Server build completed successfully');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}