#!/bin/bash

# VictorySync Production Build Script
# Fixes deployment issues with missing dependencies and build failures

echo "🚀 Starting VictorySync production build..."
set -e

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
mkdir -p dist

# Install/verify dependencies
echo "📦 Verifying dependencies..."
npm install

# Update browserslist data
echo "🔄 Updating browserslist data..."
npx update-browserslist-db@latest || echo "Browserslist update skipped"

# Build client with retry logic
echo "📱 Building client application..."
if ! npm run build:client; then
  echo "❌ Client build failed, retrying..."
  npm run build:client
fi

# Build server with custom esbuild config
echo "⚙️ Building server application..."
node esbuild.config.mjs

# Copy package.json and create production structure
echo "📋 Setting up production files..."
cp package.json dist/
cp -r node_modules dist/ 2>/dev/null || echo "Skipping node_modules copy for lighter build"

echo "✅ Production build completed successfully!"
echo "📂 Files ready for deployment in dist/ directory"

# Test the build
echo "🧪 Testing production build..."
if [ -f "dist/server.js" ] && [ -d "dist/client" ]; then
  echo "✅ Build verification successful"
else
  echo "❌ Build verification failed"
  exit 1
fi