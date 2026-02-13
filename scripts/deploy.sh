#!/bin/bash

# Configuration
# Force immediate exit on error
set -e

# Sanitize NODE_ENV (remove whitespace/newlines)
export NODE_ENV=${NODE_ENV:-production}
export NODE_ENV=$(echo "$NODE_ENV" | tr -d '[:space:]')
echo "Environment: '$NODE_ENV'"

echo "🚀 Starting Deployment..."

# 1. Pull Latest Code
echo "📥 Ensuring code is up to date..."
git fetch origin main
git reset --hard origin/main

# 2. Backend Setup
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "❌ Error: backend/.env file not found."
    exit 1
fi

echo "📦 Installing Backend Dependencies..."
npm install

echo "🗄️ Running Migrations..."
npm run migrate -- --env $NODE_ENV

# 3. Frontend Setup
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo "❌ Error: frontend/.env file not found."
    exit 1
fi

echo "📦 Installing Frontend Dependencies..."
npm install

echo "🧹 Clearing Previous Build..."
rm -rf .next

echo "🏗️ Building Frontend..."
npm run build

# 4. Restart Services with PM2
cd ..
if command -v pm2 &> /dev/null
then
    echo "🔄 Restarting Services with PM2..."
    # Using ecosystem.config.js to manage processes
    pm2 reload ecosystem.config.js --env production
    pm2 save
else
    echo "❌ Error: PM2 is not installed."
    exit 1
fi

echo "✅ Deployment Successful!"
