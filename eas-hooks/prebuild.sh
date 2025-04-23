#!/bin/bash
# This script runs before the EAS build starts

echo "Running custom prebuild script for EAS..."

# Copy double-conversion headers to various locations
DC_SOURCE="$PWD/node_modules/react-native/third-party/double-conversion-1.1.6/double-conversion"

# Create target directories
mkdir -p "$PWD/ios/TeachyAI/double-conversion"
mkdir -p "$PWD/ios/double-conversion"
mkdir -p "$PWD/ios/TeachyAI/include/double-conversion"

# Copy headers
cp -f "$DC_SOURCE"/*.h "$PWD/ios/TeachyAI/double-conversion/" 2>/dev/null || :
cp -f "$DC_SOURCE"/*.h "$PWD/ios/double-conversion/" 2>/dev/null || :
cp -f "$DC_SOURCE"/*.h "$PWD/ios/TeachyAI/include/double-conversion/" 2>/dev/null || :

# Create a symbolic link (might not work in EAS but worth trying)
ln -sf "$DC_SOURCE" "$PWD/ios/Pods/Headers/Public/double-conversion" 2>/dev/null || :

echo "Prebuild script completed successfully!"
