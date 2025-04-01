import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Debug all environment variables
console.log('All environment variables:', Constants.expoConfig?.extra);

// Get the environment variables from Expo Constants
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-application-name': 'teachy'
      }
    }
  });
  
  // Test the connection by making a simple query
  supabase.from('finanznews').select('count').limit(1).then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
      if (error.message.includes('Invalid API key')) {
        console.error('Please verify your anon key in the Supabase dashboard and .env file');
        console.error('Current anon key length:', supabaseAnonKey?.length);
        console.error('Current anon key first 10 chars:', supabaseAnonKey?.substring(0, 10));
      }
    } else {
      console.log('Supabase client created and connection tested successfully');
    }
  }).catch(error => {
    console.error('Error testing Supabase connection:', error);
  });
} catch (error) {
  console.error('Error creating Supabase client:', error);
  throw error;
}

export { supabase }; 