#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull the latest changes from git (Force sync with remote)
echo "📥 Fetching latest changes..."
git fetch origin
git reset --hard origin/main

# Rebuild and restart containers
echo "🔄 Rebuilding and restarting containers..."
docker compose up -d --build

# Clean up unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
