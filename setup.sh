#!/bin/bash

# Print prerequisites
echo "Prerequisites:"
echo "- Node.js v18 or higher"
echo "- npm v8 or higher"
echo "- pnpm v8 or higher"
echo "- PostgreSQL"

# Function to check if a command is installed
check_dependency() {
  local command_name=$1
  local dependency_name=$2

  if command -v "$command_name" >/dev/null 2>&1; then
    echo "$dependency_name found."
  else
    echo "$dependency_name not found. Please install $dependency_name."
    echo "You can install $dependency_name using the following command:"
    echo "For macOS: brew install $command_name"
    echo "For Linux: sudo apt-get install $command_name"
    exit 1
  fi
}

# Check if Node is installed
check_dependency node "Node.js"

# Check if npm is installed
check_dependency npm "npm"

# Check if pnpm is installed
check_dependency pnpm "pnpm"

# Check if PostgreSQL is installed
check_dependency psql "PostgreSQL"

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

# Start the application
pnpm run start

# Print final message
echo "Let's do some banking. Do you want a loan?"
exit 0
