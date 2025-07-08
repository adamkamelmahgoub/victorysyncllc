#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Run the esbuild configuration
echo "Building server with esbuild..."
node esbuild.config.mjs

if [ $? -eq 0 ]; then
  echo "✅ Server build successful"
else
  echo "❌ Server build failed"
  exit 1
fi