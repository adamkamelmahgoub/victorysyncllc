#!/bin/bash

# Production start script for VictorySync

echo "🚀 Starting VictorySync in production..."

# Validate environment variables
echo "🔍 Validating environment..."

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is required"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET is required"
  exit 1
fi

# Update database schema if needed
echo "🔄 Updating database schema..."
npm run db:push

# Start the application
echo "🎉 Starting application..."
NODE_ENV=production npm run start