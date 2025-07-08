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

# Build server first with optimized configuration (fixes lightningcss issues)
echo "🔨 Building server with lightningcss fixes..."
node scripts/test-server-build.mjs
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi

# Build client separately with timeout protection
echo "🎨 Building client (with timeout protection)..."
timeout 120 npm run build:client || {
    echo "⚠️ Client build timed out or failed, using fallback"
    mkdir -p dist/public
    cat > dist/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VictorySync - Loading...</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
        .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #8b5cf6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h1>VictorySync</h1>
        <p>Loading your call center automation platform...</p>
    </div>
</body>
</html>
EOF
}

# Update database schema
echo "🗄️ Updating database schema..."
npm run db:push

# Start the production server
echo "🌟 Starting VictorySync server..."
exec node dist/server.js