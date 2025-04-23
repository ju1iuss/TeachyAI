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
      // These values are crucial for TestFlight/Production builds
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ztsozincmaxgeqwgrbjw.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0c296aW5jbWF4Z2Vxd2dyYmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNTUzMjIsImV4cCI6MjA1NzYzMTMyMn0.9cYtVb9z_wVmSAUz67zbT3e7WgOSZdC34yTKiCVIlA0',
      EXPO_PUBLIC_DEEPSEEK_API_KEY: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || 'sk-a52b9d320b6b433da88ea1499d79f622',
      // Not using Clerk anymore
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