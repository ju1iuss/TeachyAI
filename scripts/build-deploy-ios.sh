#!/bin/bash
# iOS Build and Deploy Script for TeachyAI

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}   TeachyAI iOS Production Build Script   ${NC}"
echo -e "${GREEN}===============================================${NC}"

# Check for environment variables
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ] || [ -z "$EXPO_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo -e "${YELLOW}Warning: Some environment variables are not set.${NC}"
  echo -e "${YELLOW}The app has fallbacks but real authentication might not work.${NC}"
  
  # Check if --dry-run flag is passed
  if [[ "$*" == *"--dry-run"* ]]; then
    echo -e "${YELLOW}Dry run detected, continuing without confirmation.${NC}"
  else
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${RED}Build canceled.${NC}"
      exit 1
    fi
  fi
fi

# Clean the project completely
echo -e "${GREEN}Cleaning project...${NC}"
npm run clean
rm -rf ios/build
rm -rf ios/Pods
rm -f ios/Podfile.lock

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Create double-conversion headers and symlinks
echo -e "${GREEN}Patching double-conversion headers...${NC}"
npm run patch:dc

# Run prebuild to ensure iOS files are up to date
echo -e "${GREEN}Running prebuild for iOS...${NC}"
npx expo prebuild -p ios --clean

# Run the comprehensive iOS preparation script
echo -e "${GREEN}Preparing iOS build environment...${NC}"
npm run prepare:ios

# Create directory structure for double-conversion headers
echo -e "${GREEN}Creating additional double-conversion header links...${NC}"
mkdir -p ios/TeachyAI/double-conversion/
cp -R node_modules/react-native/third-party/double-conversion-1.1.6/double-conversion/*.h ios/TeachyAI/double-conversion/

# Build for TestFlight using the special profile
echo -e "${GREEN}Building for TestFlight...${NC}"

# Check if --dry-run flag is passed
if [[ "$*" == *"--dry-run"* ]]; then
  echo -e "${YELLOW}DRY RUN: Would execute the following command:${NC}"
  echo -e "eas build --platform ios --profile testflight --no-wait --non-interactive"
else
  eas build --platform ios --profile testflight --no-wait --non-interactive
fi

echo -e "${GREEN}Build submitted to EAS!${NC}"
echo -e "${YELLOW}Important: After build completes, submit to TestFlight with:${NC}"
echo -e "${YELLOW}  npm run deploy:testflight${NC}"

exit 0