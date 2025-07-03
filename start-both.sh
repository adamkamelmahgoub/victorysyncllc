#!/bin/bash

echo "Starting VictorySync application..."

# Kill any existing processes
pkill -f "tsx.*server" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

# Start the backend server in production mode (to avoid Vite middleware issues)
echo "Starting backend server on port 5000..."
NODE_ENV=production npx tsx server/index.ts &
SERVER_PID=$!

# Start the Vite client
echo "Starting frontend development server on port 5173..."
npx vite --host 0.0.0.0 --port 5173 &
CLIENT_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Shutting down servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null || true
    exit 0
}

# Setup signal handlers
trap cleanup SIGINT SIGTERM

echo "✅ VictorySync application started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID