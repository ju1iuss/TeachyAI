#!/bin/bash
# Script to prepare iOS build environment to fix header location issues
# Run this before EAS build

set -e
echo "🔧 Preparing iOS build environment..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
IOS_DIR="$PROJECT_ROOT/ios"
NODE_MODULES="$PROJECT_ROOT/node_modules"

# Clean previous build artifacts
echo "🧹 Cleaning iOS build artifacts..."
rm -rf "$IOS_DIR/build" 
rm -rf "$IOS_DIR/Pods"
rm -f "$IOS_DIR/Podfile.lock"

# Make sure we're using the latest expo modules
echo "🔄 Updating dependencies..."
npm install

# Run prebuild to ensure iOS files are up to date
echo "🏗️ Running prebuild for iOS..."
npx expo prebuild -p ios --clean

# Create symlinks for double-conversion headers to ensure they are found during build
echo "🔗 Creating header symlinks..."
DC_SOURCE="$NODE_MODULES/react-native/third-party/double-conversion-1.1.6/double-conversion"
DC_DEST="$IOS_DIR/TeachyAI/double-conversion"

# Create directory if it doesn't exist
mkdir -p "$DC_DEST"

# Copy headers directly into the app target folder
if [ -d "$DC_SOURCE" ]; then
  echo "Copying double-conversion headers from $DC_SOURCE to $DC_DEST"
  cp -R "$DC_SOURCE"/*.h "$DC_DEST/"
else
  echo "⚠️ Warning: Could not find double-conversion headers at $DC_SOURCE"
fi

# Install pods
echo "📦 Installing pods..."
cd "$IOS_DIR" && pod install

echo "✅ iOS build environment is ready!"
echo "Now you can run: eas build --platform ios"