#!/bin/bash

# Check if Node is installed
node_installed=$(node --version)
if [[ -z "$node_installed" ]]; then
  echo "Node is not installed. Please install Node.js version 18 or later."
  echo "You can install Node.js using a package manager like Homebrew:"
  echo "brew install node"
  exit 1
fi

# Check if npm is installed
npm_installed=$(npm --version)
if [[ -z "$npm_installed" ]]; then
  echo "npm is not installed. Please install npm version 8 or later."
  echo "You can install npm using the following command:"
  echo "npm install -g npm@8"
  exit 1
fi

# Check if pnpm is installed
pnpm_installed=$(pnpm --version)
if [[ -z "$pnpm_installed" ]]; then
  echo "pnpm is not installed. Please install pnpm version 8 or later."
  echo "You can install pnpm using the following command:"
  echo "npm install -g pnpm@8"
  exit 1
fi

# Check if PostgreSQL is installed
psql_installed=$(command -v psql)
if [[ -z "$psql_installed" ]]; then
  echo "PostgreSQL is not installed. Please install PostgreSQL."
  echo "You can download and install PostgreSQL from the official website:"
  echo "https://www.postgresql.org/download/"
  exit 1
fi

# Check if .env file is updated
read -p "Have you made changes to .env file and added your database details? (yes/no): " env_updated
if [[ "$env_updated" != "yes" ]]; then
  echo "Please update the .env file with your database details and run the script again."
  exit 1
fi

# Install dependencies
pnpm install

# Run database migrations
pnpm run migration:run

# Print final message
echo "Let's do some banking. Do you want a loan?"
exit 0

# Start the application
pnpm run start
