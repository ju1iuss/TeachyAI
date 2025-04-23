#!/bin/bash
# Setup environment for development

# Define colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up environment variables for TeachyAI${NC}"

# Check if .env file exists
if [ -f .env ]; then
  echo -e "${YELLOW}An .env file already exists. Do you want to overwrite it? (y/n)${NC}"
  read -n 1 -r
  echo    # Move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Keeping existing .env file${NC}"
    exit 0
  fi
fi

# Copy example file if it exists
if [ -f .env.example ]; then
  cp .env.example .env
  echo -e "${GREEN}Created .env file from .env.example${NC}"
else
  # Create new .env file with default values
  cat > .env << 'EOF'
# Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=https://gffrwhbajzndpplxyyxi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZnJ3aGJhanpuZHBwbHh5eXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA0MTE1NTMsImV4cCI6MjAxNTk4NzU1M30.OoXqXGOI6uQVKDQ0ZEYxrRhHiBZhM5nDn7-9nIgNXCE

# DeepSeek API Key (if used)
EXPO_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Clerk keys (if used)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
EOF
  echo -e "${GREEN}Created new .env file with default values${NC}"
fi

echo -e "${GREEN}Environment variables setup complete!${NC}"
echo -e "${YELLOW}These variables will be used during development.${NC}"
echo -e "${YELLOW}For TestFlight builds, environment variables are defined in eas.json.${NC}"
echo -e "${YELLOW}For production builds, environment variables are hardcoded in app/utils/env.ts.${NC}"
echo

# Make script executable
chmod +x scripts/*.sh 2>/dev/null || :

echo -e "${GREEN}Done!${NC}"