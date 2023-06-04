#!/bin/bash

# Print prerequisites
echo "Prerequisites:"
echo "- Node.js v18 or higher"
echo "- npm v8 or higher"
echo "- pnpm v8 or higher"
echo "- PostgreSQL"

# Function to check if a command is installed
check_dependency() {
  local dependency_name=$1
  local install_url=$2

  if command -v "$dependency_name" >/dev/null 2>&1; then
    echo "$dependency_name found."
  else
    echo "$dependency_name not found. Please install $dependency_name."
    echo "You can download and install $dependency_name from the following URL:"
    echo "$install_url"
    exit 1
  fi
}

# Check if Node is installed
check_dependency "node" "https://nodejs.org/"

# Check if npm is installed
check_dependency "npm" "https://www.npmjs.com/"

# Check if pnpm is installed
check_dependency "pnpm" "https://pnpm.io/"

# Check if PostgreSQL is installed
check_dependency "psql" "https://www.postgresql.org/"

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
