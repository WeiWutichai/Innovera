#!/bin/bash

echo "🚀 Starting deployment..."

# Pull the latest changes from git
echo "📥 Pulling latest changes..."
git pull

# Rebuild and restart containers
echo "🔄 Rebuilding and restarting containers..."
docker compose up -d --build

# Clean up unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
