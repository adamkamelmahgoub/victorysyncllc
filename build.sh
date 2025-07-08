#!/bin/bash

echo "🔄 Starting VictorySync build process..."

# Exit on any error
set -e

# Clean up previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
mkdir -p dist

# Build client
echo "📦 Building client application..."
npm run build:client

if [ $? -ne 0 ]; then
  echo "❌ Client build failed"
  exit 1
fi

echo "✅ Client build successful"

# Build server with custom esbuild config
echo "⚙️ Building server application..."
node esbuild.config.mjs

if [ $? -ne 0 ]; then
  echo "❌ Server build failed"
  exit 1
fi

echo "✅ Server build successful"

# Copy package.json for production dependencies
echo "📋 Copying package.json for production dependencies..."
cp package.json dist/

echo "🎉 Build completed successfully!"
echo "📂 Built files are in the dist/ directory"