#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull the latest changes from git (Force sync with remote)
echo "📥 Fetching latest changes..."
git fetch origin
git reset --hard origin/main

# Build new image first (without stopping the running container)
echo "🔨 Building new image..."
docker compose build

# Replace containers with new image (minimal downtime)
echo "🔄 Restarting with new image..."
docker compose up -d

# Clean up unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
