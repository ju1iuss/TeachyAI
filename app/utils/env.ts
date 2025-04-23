import Constants from 'expo-constants';

// Hardcoded fallback values for TestFlight and Production
// IMPORTANT: Replace these with your actual values before building for production
const FALLBACKS = {
  SUPABASE_URL: "https://gffrwhbajzndpplxyyxi.supabase.co", // REPLACE WITH YOUR ACTUAL SUPABASE URL
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZnJ3aGJhanpuZHBwbHh5eXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA0MTE1NTMsImV4cCI6MjAxNTk4NzU1M30.OoXqXGOI6uQVKDQ0ZEYxrRhHiBZhM5nDn7-9nIgNXCE", // REPLACE WITH YOUR ACTUAL ANON KEY
  DEEPSEEK_API_KEY: "YOUR_DEEPSEEK_API_KEY", // Replace with actual key if needed
  CLERK_PUBLISHABLE_KEY: "YOUR_CLERK_KEY" // Replace with actual key if needed 
};

export interface EnvVariables {
  EXPO_PUBLIC_SUPABASE_URL: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  EXPO_PUBLIC_DEEPSEEK_API_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
}

function getEnvironmentVariables(): EnvVariables {
  try {
    // For React Native, we need to try multiple sources for the environment variables
    
    // 1. Try process.env first (this works in some contexts)
    const processEnv = {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_DEEPSEEK_API_KEY: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY,
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY
    };
    
    // 2. Try expo constants (this usually works in dev/testing)
    const expoConfig = Constants.expoConfig?.extra || {};
    
    // 3. Combine all sources with fallbacks
    const env = {
      EXPO_PUBLIC_SUPABASE_URL: 
        processEnv.EXPO_PUBLIC_SUPABASE_URL || 
        expoConfig.EXPO_PUBLIC_SUPABASE_URL || 
        FALLBACKS.SUPABASE_URL,
      
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 
        processEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
        expoConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
        FALLBACKS.SUPABASE_ANON_KEY,
      
      EXPO_PUBLIC_DEEPSEEK_API_KEY: 
        processEnv.EXPO_PUBLIC_DEEPSEEK_API_KEY || 
        expoConfig.EXPO_PUBLIC_DEEPSEEK_API_KEY || 
        FALLBACKS.DEEPSEEK_API_KEY,
      
      CLERK_PUBLISHABLE_KEY: 
        processEnv.CLERK_PUBLISHABLE_KEY || 
        expoConfig.CLERK_PUBLISHABLE_KEY || 
        FALLBACKS.CLERK_PUBLISHABLE_KEY
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
      EXPO_PUBLIC_DEEPSEEK_API_KEY: FALLBACKS.DEEPSEEK_API_KEY,
      CLERK_PUBLISHABLE_KEY: FALLBACKS.CLERK_PUBLISHABLE_KEY
    };
  }
}

// Debug the environment variables in development
const envVars = getEnvironmentVariables();
if (__DEV__) {
  console.log('Environment variables loaded:', {
    SUPABASE_URL: envVars.EXPO_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Not set ✗',
    SUPABASE_ANON_KEY: envVars.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗',
    DEEPSEEK_API_KEY: envVars.EXPO_PUBLIC_DEEPSEEK_API_KEY ? 'Set ✓' : 'Not set ✗',
    CLERK_KEY: envVars.CLERK_PUBLISHABLE_KEY ? 'Set ✓' : 'Not set ✗'
  });
}

export const env = envVars; 