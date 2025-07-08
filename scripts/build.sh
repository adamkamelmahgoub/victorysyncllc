#!/bin/bash

# Build script for VictorySync deployment

echo "🔧 Building VictorySync for deployment..."

# Build the client
echo "📦 Building client..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Client build successful"
else
  echo "❌ Client build failed"
  exit 1
fi

# Validate production environment
echo "🔍 Validating production environment..."

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL is not set"
fi

if [ -z "$JWT_SECRET" ]; then
  echo "⚠️  JWT_SECRET is not set"
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ dist directory not found"
  exit 1
fi

echo "🎉 Build completed successfully!"
echo "🚀 Ready for deployment"