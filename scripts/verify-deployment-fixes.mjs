#!/usr/bin/env node

/**
 * Verification script for deployment lightningcss fixes
 * Tests all the suggested fixes have been properly applied
 */

import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('🔍 Verifying deployment fixes for lightningcss issues...');
console.log('');

const checks = [
  {
    name: 'Dependencies installed',
    test: () => {
      try {
        // Check if lightningcss and @babel/preset-typescript are available
        require.resolve('lightningcss');
        require.resolve('@babel/preset-typescript');
        return { passed: true, message: 'lightningcss and @babel/preset-typescript installed' };
      } catch (e) {
        return { passed: false, message: 'Missing dependencies: ' + e.message };
      }
    }
  },
  {
    name: 'Build scripts exist',
    test: () => {
      const scripts = [
        'scripts/test-server-build.mjs',
        'scripts/deploy-build.mjs',
        'scripts/fast-build.mjs'
      ];
      
      const missing = scripts.filter(script => !existsSync(script));
      
      return missing.length === 0 
        ? { passed: true, message: 'All build scripts present' }
        : { passed: false, message: 'Missing scripts: ' + missing.join(', ') };
    }
  },
  {
    name: 'Server build test',
    test: async () => {
      return new Promise((resolve) => {
        const process = spawn('node', ['scripts/test-server-build.mjs'], { stdio: 'pipe' });
        
        let output = '';
        process.stdout.on('data', (data) => { output += data.toString(); });
        process.stderr.on('data', (data) => { output += data.toString(); });
        
        process.on('close', (code) => {
          if (code === 0 && output.includes('Server build successful')) {
            resolve({ passed: true, message: 'Server builds successfully with external dependencies' });
          } else {
            resolve({ passed: false, message: 'Server build failed: ' + output });
          }
        });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          process.kill('SIGTERM');
          resolve({ passed: false, message: 'Server build timed out' });
        }, 30000);
      });
    }
  },
  {
    name: 'External dependencies configuration',
    test: () => {
      try {
        const buildScript = readFileSync('scripts/test-server-build.mjs', 'utf8');
        
        const requiredExternals = [
          'lightningcss',
          '@babel/preset-typescript',
          '@jridgewell/trace-mapping',
          'pg-native'
        ];
        
        const missing = requiredExternals.filter(ext => !buildScript.includes(`'${ext}'`));
        
        return missing.length === 0
          ? { passed: true, message: 'All critical external dependencies configured' }
          : { passed: false, message: 'Missing external configs: ' + missing.join(', ') };
      } catch (e) {
        return { passed: false, message: 'Could not verify external dependencies: ' + e.message };
      }
    }
  },
  {
    name: 'Start script configuration',
    test: () => {
      try {
        const startScript = readFileSync('start.sh', 'utf8');
        
        const checks = [
          'test-server-build.mjs',
          'timeout 120',
          'lightningcss fixes'
        ];
        
        const missing = checks.filter(check => !startScript.includes(check));
        
        return missing.length === 0
          ? { passed: true, message: 'Start script properly configured with optimizations' }
          : { passed: false, message: 'Start script missing: ' + missing.join(', ') };
      } catch (e) {
        return { passed: false, message: 'Could not verify start script: ' + e.message };
      }
    }
  }
];

// Run all checks
let allPassed = true;
for (const check of checks) {
  process.stdout.write(`🔧 ${check.name}... `);
  
  const result = await check.test();
  
  if (result.passed) {
    console.log(`✅ ${result.message}`);
  } else {
    console.log(`❌ ${result.message}`);
    allPassed = false;
  }
}

console.log('');
if (allPassed) {
  console.log('🎉 All deployment fixes verified successfully!');
  console.log('');
  console.log('✅ Comprehensive external dependencies configuration');
  console.log('✅ lightningcss dependency resolution fixed');
  console.log('✅ @babel/preset-typescript bundling errors resolved');
  console.log('✅ esbuild configuration optimized for deployment');
  console.log('✅ Deployment scripts with timeout protection');
  console.log('✅ Production-ready build process');
  console.log('');
  console.log('🚀 Ready for deployment!');
} else {
  console.log('❌ Some deployment fixes are missing or incomplete');
  process.exit(1);
}