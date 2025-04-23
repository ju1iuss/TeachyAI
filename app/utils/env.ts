import Constants from 'expo-constants';

export interface EnvVariables {
  EXPO_PUBLIC_SUPABASE_URL: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  EXPO_PUBLIC_DEEPSEEK_API_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
}

function getEnvironmentVariables(): EnvVariables {
  try {
    const env = Constants.expoConfig?.extra || {};
    
    // In development, validate strictly
    if (__DEV__) {
      if (!env) {
        console.warn('Environment variables are not loaded');
      }

      const requiredVars = [
        'EXPO_PUBLIC_SUPABASE_URL',
        'EXPO_PUBLIC_SUPABASE_ANON_KEY',
        'EXPO_PUBLIC_DEEPSEEK_API_KEY',
        'CLERK_PUBLISHABLE_KEY',
      ];

      const missingVars = requiredVars.filter(
        (key) => !env[key]
      );

      if (missingVars.length > 0) {
        console.warn(
          `Missing environment variables: ${missingVars.join(', ')}. Using fallbacks.`
        );
      }
    }

    // Return values or empty strings as fallbacks
    return {
      EXPO_PUBLIC_SUPABASE_URL: env.EXPO_PUBLIC_SUPABASE_URL || '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
      EXPO_PUBLIC_DEEPSEEK_API_KEY: env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '',
      CLERK_PUBLISHABLE_KEY: env.CLERK_PUBLISHABLE_KEY || ''
    };
  } catch (error) {
    console.error('Error loading environment variables:', error);
    // Return empty values instead of crashing
    return {
      EXPO_PUBLIC_SUPABASE_URL: '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: '',
      EXPO_PUBLIC_DEEPSEEK_API_KEY: '',
      CLERK_PUBLISHABLE_KEY: ''
    };
  }
}

export const env = getEnvironmentVariables(); 