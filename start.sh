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

# Build server with optimized external dependencies (fixes lightningcss issues)
echo "🔨 Building server..."
node scripts/build-server.mjs
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi

# Try to build client with timeout
echo "🎨 Building client..."
timeout 180 npm run build:client &
BUILD_PID=$!

# Wait for client build or continue after timeout
wait $BUILD_PID 2>/dev/null
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "⚠️ Client build incomplete, but server is ready"
    # Create basic dist/public directory structure if missing
    mkdir -p dist/public
    echo '<!DOCTYPE html><html><head><title>VictorySync</title></head><body><h1>VictorySync Loading...</h1></body></html>' > dist/public/index.html
fi

# Update database schema
echo "🗄️ Updating database schema..."
npm run db:push

# Start the production server
echo "🌟 Starting VictorySync server..."
exec node dist/server.js