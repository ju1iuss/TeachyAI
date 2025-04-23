module.exports = {
  expo: {
    name: 'TeachyAI',
    slug: 'teachy',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.teachy.app',
      config: {
        usesNonExemptEncryption: false
      },
      buildNumber: "17"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.teachy.app',
      versionCode: 1
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-dev-client',
        {
          silentLaunch: true
        }
      ]
    ],
    extra: {
      // Set these in .env file locally or in the EAS build configuration
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gffrwhbajzndpplxyyxi.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZnJ3aGJhanpuZHBwbHh5eXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA0MTE1NTMsImV4cCI6MjAxNTk4NzU1M30.OoXqXGOI6uQVKDQ0ZEYxrRhHiBZhM5nDn7-9nIgNXCE',
      EXPO_PUBLIC_DEEPSEEK_API_KEY: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || 'YOUR_DEEPSEEK_API_KEY',
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || 'YOUR_CLERK_KEY',
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '',
      eas: {
        projectId: "1aeb71e2-edfe-4a20-81b2-6490ed422973"
      }
    },
    scheme: 'teachyai',
    experiments: {
      tsconfigPaths: true
    }
  }
}; 