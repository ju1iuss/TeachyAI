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
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.teachy.app'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-secure-store'
    ],
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
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