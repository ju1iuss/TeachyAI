# iOS Build Troubleshooting Guide

This guide helps resolve common issues when building the TeachyAI app for iOS.

## Common Build Errors

### 'double-conversion/double-conversion.h' file not found

This error occurs when the Pod installation doesn't properly configure header search paths.

**Fix:**
```bash
# Run our automated fix script
npm run fix:pods
```

What this script does:
1. Cleans build artifacts and Pods
2. Updates the Podfile with proper header search paths
3. Reinstalls Pods with the correct configuration

### Expo Managed Workflow Issues

If you encounter issues with the managed workflow:

**Fix:**
```bash
# Clean everything
npm run clean

# Prebuild from scratch
npx expo prebuild --clean

# Fix pods
npm run fix:pods

# Try building again
npm run build:ios
```

### EAS Build Failures

If EAS builds fail:

1. Check if the issue is in the logs under "Xcode Logs"
2. Look for specific errors like missing headers or framework issues
3. Try building locally first to verify the fix works

## Manual Fixes for Advanced Issues

### Double Conversion Header Issue

If the automated fix doesn't work, manually add to your Podfile:

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Other settings...
      
      # Add header search path for double-conversion
      config.build_settings['HEADER_SEARCH_PATHS'] = '$(inherited) ${PODS_ROOT}/Headers/Public ${PODS_ROOT}/Headers/Public/DoubleConversion ${PODS_CONFIGURATION_BUILD_DIR}/DoubleConversion/DoubleConversion.framework/Headers'
    end
  end
end
```

### Other Framework Issues

For issues with other frameworks:

1. Identify the framework from the error message
2. Add it to FRAMEWORK_SEARCH_PATHS in Podfile:

```ruby
config.build_settings['FRAMEWORK_SEARCH_PATHS'] = '$(inherited) ${PODS_CONFIGURATION_BUILD_DIR}/FrameworkName'
```

## Getting Help

If you continue experiencing issues:

1. Check EAS build logs
2. Look for specific error messages
3. Search for the error message on React Native's GitHub issues
4. Check Expo's documentation for similar issues