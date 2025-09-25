#!/bin/bash

echo "🚀 Starting VictorySync in production mode..."

# Set NODE_ENV to production if not already set
export NODE_ENV="${NODE_ENV:-production}"

# Validate required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is required"
    exit 1
fi

echo "✅ Environment variables validated"
echo "Environment: $NODE_ENV"
echo "Port: ${PORT:-5000}"

# Run database push to ensure schema is up to date
echo "📦 Ensuring database schema is up to date..."
npm run db:push

# Start the application
echo "🎉 Starting VictorySync server..."
exec npm start