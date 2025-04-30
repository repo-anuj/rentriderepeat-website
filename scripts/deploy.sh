#!/bin/bash

# BikeRent Deployment Script
# This script automates the deployment process for the BikeRent application

# Exit on error
set -e

# Configuration
APP_NAME="bikerent"
DEPLOY_ENV=${1:-"production"}  # Default to production if no argument provided
TIMESTAMP=$(date +%Y%m%d%H%M%S)
DEPLOY_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
LOG_FILE="/var/log/$APP_NAME/deploy-$TIMESTAMP.log"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Start logging
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== Starting deployment of $APP_NAME to $DEPLOY_ENV environment ==="
echo "=== $(date) ==="

# Check if we're running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root or with sudo"
   exit 1
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p "$DEPLOY_DIR"
mkdir -p "$BACKUP_DIR"

# Backup current deployment
if [ -d "$DEPLOY_DIR/current" ]; then
    echo "Backing up current deployment..."
    BACKUP_NAME="$BACKUP_DIR/$APP_NAME-$TIMESTAMP.tar.gz"
    tar -czf "$BACKUP_NAME" -C "$DEPLOY_DIR" current
    echo "Backup created at $BACKUP_NAME"
fi

# Clone or pull the repository
REPO_URL="https://github.com/yourusername/$APP_NAME.git"
REPO_DIR="$DEPLOY_DIR/repo"

if [ -d "$REPO_DIR" ]; then
    echo "Updating repository..."
    cd "$REPO_DIR"
    git fetch --all
    git reset --hard origin/main
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$REPO_DIR"
    cd "$REPO_DIR"
fi

# Checkout the appropriate branch
if [ "$DEPLOY_ENV" == "production" ]; then
    echo "Checking out main branch..."
    git checkout main
else
    echo "Checking out $DEPLOY_ENV branch..."
    git checkout "$DEPLOY_ENV"
fi

git pull

# Create release directory
RELEASE_DIR="$DEPLOY_DIR/releases/$TIMESTAMP"
echo "Creating release directory: $RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

# Copy files to release directory
echo "Copying files to release directory..."
cp -R "$REPO_DIR/"* "$RELEASE_DIR/"

# Install backend dependencies
echo "Installing backend dependencies..."
cd "$RELEASE_DIR/backend"
npm ci --production

# Install frontend dependencies and build
echo "Installing frontend dependencies and building..."
cd "$RELEASE_DIR/frontend"
npm ci --production
npm run build

# Create .env file from template
echo "Creating environment file..."
if [ -f "$DEPLOY_DIR/shared/.env.$DEPLOY_ENV" ]; then
    cp "$DEPLOY_DIR/shared/.env.$DEPLOY_ENV" "$RELEASE_DIR/backend/.env"
else
    echo "Warning: Environment file not found at $DEPLOY_DIR/shared/.env.$DEPLOY_ENV"
    echo "Please create it manually before starting the application"
fi

# Create database indexes
echo "Creating database indexes..."
cd "$RELEASE_DIR/backend"
NODE_ENV="$DEPLOY_ENV" FORCE_INDEX_CREATION=true node ./utils/createIndexes.js

# Update symlink
echo "Updating symlink..."
ln -sfn "$RELEASE_DIR" "$DEPLOY_DIR/current"

# Restart services
echo "Restarting services..."
if [ -f "/etc/systemd/system/$APP_NAME.service" ]; then
    systemctl restart "$APP_NAME"
else
    echo "Warning: Systemd service not found. Please restart the application manually."
fi

# Clean up old releases (keep last 5)
echo "Cleaning up old releases..."
cd "$DEPLOY_DIR/releases"
ls -t | tail -n +6 | xargs -r rm -rf

echo "=== Deployment completed successfully ==="
echo "=== $(date) ==="
