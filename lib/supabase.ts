import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { errorLogger } from '../app/utils/errorLogger';
import { env } from '../app/utils/env';

// Create a Supabase client with fallback handling
let supabaseClient;

try {
  // Check if environment variables are available
  if (!env.EXPO_PUBLIC_SUPABASE_URL || !env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    if (__DEV__) {
      console.warn('Missing Supabase environment variables, using fallback client');
    }
    
    // In production/TestFlight, create a placeholder client that won't crash
    // but will return appropriate errors when used
    supabaseClient = createClient(
      'https://placeholder-url.supabase.co',
      'placeholder-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      }
    );
  } else {
    // Create the real Supabase client with valid credentials
    supabaseClient = createClient(
      env.EXPO_PUBLIC_SUPABASE_URL,
      env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      }
    );
  }
} catch (error) {
  // If client creation fails, log error and create a fallback client
  errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
    context: 'Supabase Client Initialization'
  });
  
  supabaseClient = createClient(
    'https://placeholder-url.supabase.co',
    'placeholder-key',
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