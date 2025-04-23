#!/bin/bash

echo "🔧 Fixing Pod installation issues..."

# Clean build directories
echo "Cleaning previous build artifacts..."
npm run clean

# Remove Podfile.lock
echo "Removing Podfile.lock..."
rm -f ios/Podfile.lock

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Run Expo prebuild
echo "Running expo prebuild..."
npm run prebuild

# Navigate to ios folder
cd ios

# Add header search paths to Podfile before installing pods
echo "Updating Podfile with header search paths..."
cat > temp_podfile << 'EOL'
require File.join(File.dirname(`node --print "require.resolve('expo/package.json')")`), "scripts/autolinking")
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')")`), "scripts/react_native_pods")

# Set platform and deployment target
platform :ios, '16.0'
prepare_react_native_project!

# Force pods to be static
use_frameworks! :linkage => :static

target 'TeachyAI' do
  use_expo_modules!
  pod 'ExpoModulesCore', :path => '../node_modules/expo-modules-core'
  
  # React Native configuration
  use_react_native!(
    :path => "../node_modules/react-native",
    :hermes_enabled => false,
    :fabric_enabled => false
  )

  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Enable module support and set build settings
        config.build_settings['DEFINES_MODULE'] = 'YES'
        config.build_settings['SWIFT_VERSION'] = '5.0'
        config.build_settings['ENABLE_BITCODE'] = 'NO'
        config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
        config.build_settings['ONLY_ACTIVE_ARCH'] = 'NO'
        
        # Enable C++20
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'
        config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
        
        # Additional compiler flags for C++
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -std=c++20'
        
        # Add the -ObjC flag and other necessary linker flags
        if config.build_settings['OTHER_LDFLAGS'] == nil
          config.build_settings['OTHER_LDFLAGS'] = '$(inherited) -ObjC -lc++'
        end

        # Fix module definition issues
        if target.name.start_with?("React-")
          config.build_settings['DEFINES_MODULE'] = 'NO'
        end
        
        # Add header search path for double-conversion
        config.build_settings['HEADER_SEARCH_PATHS'] = '$(inherited) ${PODS_ROOT}/Headers/Public ${PODS_ROOT}/Headers/Public/DoubleConversion ${PODS_CONFIGURATION_BUILD_DIR}/DoubleConversion/DoubleConversion.framework/Headers'
      end
    end
  end
end
EOL

mv temp_podfile Podfile

# Clean Pods directory
echo "Cleaning Pods directory..."
rm -rf Pods

# Install Pods
echo "Installing Pods (this may take a while)..."
pod deintegrate
pod install --repo-update

# Return to project root
cd ..

echo "✅ Fixed pod installation. You can now try building again."
