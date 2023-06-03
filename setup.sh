#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Installing Node.js version 18..."
  brew install node@18
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "pnpm is not installed. Installing pnpm version 8..."
  npm install -g pnpm@8
fi

# Install project dependencies
echo "Installing project dependencies..."
pnpm i

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo "PostgreSQL is not installed."
  echo "Please install PostgreSQL and try running the script again."
  exit 1
fi

# Run database migrations
echo "Running database migrations..."
pnpm run migration:run

# Start the application
echo "Starting the application..."
pnpm run start

# Print message
echo "Let's do some banking. Do you want a loan?"
