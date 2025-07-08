#!/bin/bash

echo "🚀 Starting VictorySync production deployment..."

# Environment validation
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

echo "✅ Environment variables validated"

# Create dist directory
mkdir -p dist

# Build both server and client with optimized configuration (fixes lightningcss issues)
echo "🔨 Building application with deployment-optimized script..."
node scripts/deploy-build.mjs
if [ $? -ne 0 ]; then
    echo "❌ Deployment build failed"
    exit 1
fi

# Update database schema
echo "🗄️ Updating database schema..."
npm run db:push

# Start the production server
echo "🌟 Starting VictorySync server..."
exec node dist/server.js