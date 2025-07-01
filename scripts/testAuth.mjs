#!/usr/bin/env node

/**
 * Automated smoke tests for VictorySync authentication system
 * Tests both email/password and OAuth route availability
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';
const TIMEOUT = 10000; // 10 second timeout

console.log('🧪 VictorySync Authentication Smoke Tests');
console.log(`Testing against: ${BASE_URL}`);
console.log('=' .repeat(50));

// Test utilities
async function testRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      timeout: TIMEOUT,
      ...options
    });
    return {
      status: response.status,
      data: await response.text(),
      headers: response.headers
    };
  } catch (error) {
    throw new Error(`Request failed for ${endpoint}: ${error.message}`);
  }
}

async function testJsonRequest(endpoint, options = {}) {
  const response = await testRequest(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  try {
    response.data = JSON.parse(response.data);
  } catch (e) {
    // If response is not JSON, keep as text
  }
  
  return response;
}

// Test suites
async function testHealthCheck() {
  console.log('📊 Testing health check...');
  const response = await testJsonRequest('/health');
  
  if (response.status !== 200) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  
  const health = response.data;
  if (health.status !== 'healthy') {
    throw new Error(`Service unhealthy: ${health.status}`);
  }
  
  console.log('✅ Health check passed');
  return true;
}

async function testFrontendRoutes() {
  console.log('🌐 Testing frontend routes...');
  
  const routes = ['/login', '/register', '/signup'];
  
  for (const route of routes) {
    const response = await testRequest(route);
    
    if (response.status === 404) {
      throw new Error(`Route ${route} returns 404`);
    }
    
    if (!response.data.includes('<title>')) {
      throw new Error(`Route ${route} doesn't return valid HTML`);
    }
    
    console.log(`✅ Route ${route} accessible`);
  }
  
  return true;
}

async function testEmailPasswordAuth() {
  console.log('🔐 Testing email/password authentication...');
  
  // Generate unique test user
  const timestamp = Date.now();
  const testUser = {
    name: 'Test User',
    email: `test${timestamp}@victorysync.test`,
    password: 'TestPass123!'
  };
  
  // Test registration
  console.log('📝 Testing registration...');
  const registerResponse = await testJsonRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (registerResponse.status !== 201) {
    throw new Error(`Registration failed: ${registerResponse.status} - ${JSON.stringify(registerResponse.data)}`);
  }
  
  if (!registerResponse.data.token || !registerResponse.data.user) {
    throw new Error('Registration response missing token or user');
  }
  
  console.log('✅ Registration successful');
  
  // Test login
  console.log('🔑 Testing login...');
  const loginResponse = await testJsonRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  
  if (loginResponse.status !== 200) {
    throw new Error(`Login failed: ${loginResponse.status} - ${JSON.stringify(loginResponse.data)}`);
  }
  
  if (!loginResponse.data.token || !loginResponse.data.user) {
    throw new Error('Login response missing token or user');
  }
  
  console.log('✅ Login successful');
  
  // Test protected route
  console.log('🛡️ Testing protected route with JWT...');
  const token = loginResponse.data.token;
  const meResponse = await testJsonRequest('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (meResponse.status !== 200) {
    throw new Error(`Protected route failed: ${meResponse.status} - ${JSON.stringify(meResponse.data)}`);
  }
  
  if (!meResponse.data.user || meResponse.data.user.email !== testUser.email) {
    throw new Error('Protected route returned invalid user data');
  }
  
  console.log('✅ Protected route with JWT working');
  
  return true;
}

async function testOAuthRoutes() {
  console.log('🔗 Testing OAuth route availability...');
  
  const oauthProviders = [
    { name: 'Google', path: '/api/auth/google' },
    { name: 'Facebook', path: '/api/auth/facebook' },
    { name: 'Apple', path: '/api/auth/apple' }
  ];
  
  for (const provider of oauthProviders) {
    const response = await testJsonRequest(provider.path);
    
    // Should return either OAuth redirect or configuration error (not 404)
    if (response.status === 404) {
      throw new Error(`${provider.name} OAuth route not found: ${provider.path}`);
    }
    
    // If not configured, should return proper error message
    if (response.status === 400 && response.data.error?.includes('not configured')) {
      console.log(`✅ ${provider.name} OAuth route accessible (not configured)`);
    } else if (response.status === 302 || response.status === 200) {
      console.log(`✅ ${provider.name} OAuth route accessible (configured)`);
    } else {
      throw new Error(`${provider.name} OAuth unexpected response: ${response.status}`);
    }
  }
  
  return true;
}

async function testPackagesAPI() {
  console.log('📦 Testing packages API...');
  
  const response = await testJsonRequest('/api/packages');
  
  if (response.status !== 200) {
    throw new Error(`Packages API failed: ${response.status}`);
  }
  
  if (!Array.isArray(response.data) || response.data.length === 0) {
    throw new Error('Packages API returned invalid data');
  }
  
  console.log(`✅ Packages API working (${response.data.length} packages)`);
  return true;
}

// Main test runner
async function runTests() {
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Frontend Routes', fn: testFrontendRoutes },
    { name: 'Email/Password Auth', fn: testEmailPasswordAuth },
    { name: 'OAuth Routes', fn: testOAuthRoutes },
    { name: 'Packages API', fn: testPackagesAPI }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`\n🔄 Running: ${test.name}`);
      await test.fn();
      passed++;
      console.log(`✅ ${test.name} PASSED`);
    } catch (error) {
      failed++;
      console.error(`❌ ${test.name} FAILED: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('❌ Some tests failed. Check the output above for details.');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed! Authentication system is working correctly.');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error.message);
  process.exit(1);
});