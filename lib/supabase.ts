import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { errorLogger } from '../app/utils/errorLogger';
import { env } from '../app/utils/env';

// Debug environment variables in development
if (__DEV__) {
  console.log('Supabase Configuration:', {
    URL: env.EXPO_PUBLIC_SUPABASE_URL ? `${env.EXPO_PUBLIC_SUPABASE_URL.substring(0, 12)}...` : 'Not set',
    KEY: env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'
  });
}

// Create a Supabase client with fallback handling
let supabaseClient;

try {
  // Always use the environment variables (which now have proper fallbacks)
  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'fallback_value_for_build' || 
      supabaseKey === 'fallback_value_for_build' ||
      supabaseUrl === 'YOUR_SUPABASE_URL' ||
      supabaseKey === 'YOUR_SUPABASE_KEY') {
    
    throw new Error('Invalid Supabase credentials');
  }
  
  // Create the Supabase client with the provided credentials
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  
  if (__DEV__) {
    console.log('Supabase client created successfully');
  }
} catch (error) {
  // If client creation fails, log error and create a fallback client
  if (__DEV__) {
    console.error('Failed to create Supabase client:', error);
  }
  
  errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
    context: 'Supabase Client Initialization'
  });
  
  // Create a fallback client that will show appropriate errors
  // We'll use the values from env.ts which should have hardcoded fallbacks
  supabaseClient = createClient(
    env.EXPO_PUBLIC_SUPABASE_URL || 'https://gffrwhbajzndpplxyyxi.supabase.co', 
    env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZnJ3aGJhanpuZHBwbHh5eXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA0MTE1NTMsImV4cCI6MjAxNTk4NzU1M30.OoXqXGOI6uQVKDQ0ZEYxrRhHiBZhM5nDn7-9nIgNXCE',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    }
  );
}

// Export the client
export const supabase = supabaseClient;

// Test connection function with more resilient error handling
export async function testSupabaseConnection() {
  try {
    // Check if we're using the placeholder client
    if (supabase.supabaseUrl === 'https://placeholder-url.supabase.co') {
      console.warn('Using placeholder Supabase client, connection test skipped');
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      errorLogger.logError(error, { context: 'Supabase Connection Test' });
      return false;
    }

    return true;
  } catch (error) {
    // Don't crash on connection errors
    const errorObj = error instanceof Error ? error : new Error(String(error));
    errorLogger.logError(errorObj, { context: 'Supabase Connection Test' });
    return false;
  }
}

// Error handling wrapper for Supabase operations
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ data: T | null; error: Error | null }> {
  try {
    // First test the connection
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      throw new Error('Supabase connection failed');
    }

    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error(String(error));
    errorLogger.logError(errorMessage, { context });
    return { data: null, error: errorMessage };
  }
} 