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

The app gracefully handles missing variables in production, but for full functionality, set up:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
EXPO_PUBLIC_DEEPSEEK_API_KEY=your-deepseek-key
CLERK_PUBLISHABLE_KEY=your-clerk-key
```

In the EAS Dashboard for production builds.