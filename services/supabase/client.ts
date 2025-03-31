import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Make sure to add these to your app.config.js or app.json
const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 