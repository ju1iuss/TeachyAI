import Constants from 'expo-constants';

// Hardcoded fallback values for TestFlight and Production
// These values work in TestFlight and production builds
export const FALLBACKS = {
  SUPABASE_URL: "https://ztsozincmaxgeqwgrbjw.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0c296aW5jbWF4Z2Vxd2dyYmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNTUzMjIsImV4cCI6MjA1NzYzMTMyMn0.9cYtVb9z_wVmSAUz67zbT3e7WgOSZdC34yTKiCVIlA0",
  DEEPSEEK_API_KEY: "sk-a52b9d320b6b433da88ea1499d79f622",
};

export interface EnvVariables {
  EXPO_PUBLIC_SUPABASE_URL: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  EXPO_PUBLIC_DEEPSEEK_API_KEY: string;
}

function getEnvironmentVariables(): EnvVariables {
  try {
    // For React Native, we need to try multiple sources for the environment variables
    
    // 1. Try process.env first (this works in some contexts)
    const processEnv = {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_DEEPSEEK_API_KEY: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY
    };
    
    // 2. Try expo constants (this works in all environments including TestFlight/App Store)
    const expoConfig = Constants.expoConfig?.extra || {};
    
    // 3. Combine all sources with fallbacks - prioritize Constants in production
    const isProd = !__DEV__;
    
    const env = {
      EXPO_PUBLIC_SUPABASE_URL: 
        (isProd ? expoConfig.EXPO_PUBLIC_SUPABASE_URL : processEnv.EXPO_PUBLIC_SUPABASE_URL) || 
        expoConfig.EXPO_PUBLIC_SUPABASE_URL || 
        processEnv.EXPO_PUBLIC_SUPABASE_URL || 
        FALLBACKS.SUPABASE_URL,
      
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 
        (isProd ? expoConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY : processEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY) || 
        expoConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
        processEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
        FALLBACKS.SUPABASE_ANON_KEY,
      
      EXPO_PUBLIC_DEEPSEEK_API_KEY: 
        (isProd ? expoConfig.EXPO_PUBLIC_DEEPSEEK_API_KEY : processEnv.EXPO_PUBLIC_DEEPSEEK_API_KEY) || 
        expoConfig.EXPO_PUBLIC_DEEPSEEK_API_KEY || 
        processEnv.EXPO_PUBLIC_DEEPSEEK_API_KEY || 
        FALLBACKS.DEEPSEEK_API_KEY
    };
    
    // In development, log missing variables
    if (__DEV__) {
      const missingVars = Object.entries(env)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        console.warn(
          `Missing environment variables: ${missingVars.join(', ')}. Using fallbacks.`
        );
      }
    }

    return env as EnvVariables;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    // Return fallback values instead of crashing
    return {
      EXPO_PUBLIC_SUPABASE_URL: FALLBACKS.SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: FALLBACKS.SUPABASE_ANON_KEY,
      EXPO_PUBLIC_DEEPSEEK_API_KEY: FALLBACKS.DEEPSEEK_API_KEY
    };
  }
}

// Debug the environment variables in development
const envVars = getEnvironmentVariables();
// Always log environment vars to help debug TestFlight issues
console.log('Environment variables loaded:', {
  SUPABASE_URL: envVars.EXPO_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Not set ✗',
  SUPABASE_ANON_KEY: envVars.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗',
  DEEPSEEK_API_KEY: envVars.EXPO_PUBLIC_DEEPSEEK_API_KEY ? 'Set ✓' : 'Not set ✗',
  IS_PROD: !__DEV__,
  IS_USING_FALLBACKS: envVars.EXPO_PUBLIC_SUPABASE_URL === FALLBACKS.SUPABASE_URL
});

export const env = envVars; 