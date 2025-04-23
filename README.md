# TeachyAI

## Running & Building the App

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run iOS simulator
npm run ios
```

### TestFlight Builds

To build for TestFlight with our special fixes:

```bash
# Run comprehensive build script
npm run build:ios:prod

# Or run individual steps:
npm run clean             # Clean all build artifacts
npm run patch:dc          # Fix double-conversion headers
npm run prepare:ios       # Prepare iOS environment for build
npm run build:testflight  # Run the EAS build for TestFlight

# Submit to TestFlight
npm run deploy:testflight
```

#### TestFlight Error Fixes

The app includes multiple layers of fixes for the iOS "double-conversion" header issue that causes TestFlight crashes:

1. **Header Distribution**: 
   - The `fix-double-conversion.sh` script copies headers to multiple locations
   - Creates symbolic links as fallbacks
   - Executed automatically during pod installation

2. **Bridge Files**:
   - `double-conversion-bridge.m` provides fallback header locations
   - `TeachyAI-Bridging-Header.h` ensures Swift/Objective-C interoperability
   - `noop-file.swift` ensures bridging header inclusion

3. **Build Configuration**:
   - Modified Podfile with comprehensive header search paths
   - Added prebuild hooks for EAS
   - Custom Ruby script to modify Xcode project

4. **Runtime Protection**:
   - Error boundaries in React components
   - Try/catch in critical code paths
   - Environment variable fallbacks

## Known Issues & Fixes

### iOS Double Conversion Header Error

If you get `'double-conversion/double-conversion.h' file not found` errors:

1. Run `npm run fix:pods` to repair Podfile
2. If that doesn't work, run `npm run prepare:ios` for comprehensive fixes

### TestFlight Crashes

The app has been updated with crash protection:

- Error handling for missing environment variables
- Fallbacks for Supabase and other service initialization
- Try/catch blocks in AppDelegate.mm for native code
- Error boundaries throughout the React code

## Key Paths

- `/app` - Main application screens and components
- `/ios` - Native iOS code
- `/scripts` - Build and utility scripts
- `/eas-hooks` - Custom build hooks for EAS

## Environment Variables

The app has a multi-layered approach to environment variables:

1. **Development Environment**:
   ```bash
   # Set up local environment variables
   npm run setup:env
   
   # This creates a .env file with default values
   # Edit this file with your actual credentials if needed
   ```

2. **TestFlight Builds**:
   - Environment variables are directly set in `eas.json` in the "testflight" profile
   - You can modify these in the `eas.json` file before building

3. **Production Builds**:
   - For maximum reliability, environment variables have hardcoded fallbacks in:
     - `app/utils/env.ts` - Primary fallback values
     - `eas.json` - EAS build-specific values
     - `app.config.js` - Expo config values

4. **Required Variables**:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EXPO_PUBLIC_DEEPSEEK_API_KEY=your-deepseek-key (if using DeepSeek)
   CLERK_PUBLISHABLE_KEY=your-clerk-key (if using Clerk)
   ```

The app includes error handling and fallbacks for all environment variables to prevent crashes in production.