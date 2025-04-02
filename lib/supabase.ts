import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Debug all environment variables
console.log('All environment variables:', Constants.expoConfig?.extra);

// Get the environment variables from Expo Constants
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Debug the actual values being used
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase anon key:', supabaseAnonKey);

// Validate URL format
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Invalid Supabase URL:', supabaseUrl);
  throw new Error('Invalid Supabase URL. URL should start with https://');
}

// Validate anon key format
if (!supabaseAnonKey || !supabaseAnonKey.startsWith('eyJ')) {
  console.error('Invalid Supabase anon key format');
  throw new Error('Invalid Supabase anon key format. Key should start with eyJ');
}

console.log('Initializing Supabase with URL:', supabaseUrl);
console.log('Supabase anon key length:', supabaseAnonKey?.length);
console.log('Supabase anon key first 10 chars:', supabaseAnonKey?.substring(0, 10));

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'implicit'
  },
  global: {
    headers: { 'x-application-name': 'teachy' }
  },
  db: {
    schema: 'public'
  }
});

// Test database connection and schema
(async () => {
  try {
    // Test auth configuration
    const { data: authConfig, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth configuration error:', authError);
    } else {
      console.log('Auth configuration valid');
    }

    // Test profiles table
    const { data: profilesTest, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError) {
      console.error('Profiles table error:', profilesError);
      if (profilesError.message.includes('relation "profiles" does not exist')) {
        console.error('Profiles table does not exist - check database schema');
      } else if (profilesError.message.includes('permission denied')) {
        console.error('RLS policies might be incorrectly configured');
      }
    } else {
      console.log('Profiles table accessible');
    }

    // Test overall connection
    const { data: testData, error: testError } = await supabase
      .from('finanznews')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
    } else {
      console.log('Database connection successful');
    }
  } catch (error) {
    console.error('Critical error testing Supabase setup:', error);
  }
})(); 