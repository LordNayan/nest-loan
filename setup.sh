#!/bin/bash

# Check if Node, npm, pnpm, and PostgreSQL are installed and configured
echo "Checking prerequisites..."
echo "Node.js version 18 or higher"
echo "npm version 8 or higher"
echo "pnpm version 8 or higher"
echo "PostgreSQL"

read -p "Are all the prerequisites installed and configured? (y/n): " prerequisitesChoice

if [ "$prerequisitesChoice" != "y" ]; then
  echo "Prerequisites not satisfied. Exiting..."
  exit 0
fi

# Check if .env file is updated with database details
echo ""
echo "Have you made changes to .env file and added your database details?"
read -p "If yes, enter 'y' to proceed or 'n' to quit: " envChoice

if [ "$envChoice" != "y" ]; then
  echo "Please update the .env file with your database details. Exiting..."
  exit 0
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm i

# Run database migrations
echo ""
echo "Running database migrations..."
pnpm migration:run

# Start the application
echo ""
echo "Do you want a loan?. Let's do some banking."
pnpm run start
