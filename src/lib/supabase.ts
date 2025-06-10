import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize Supabase if environment variables are available
let supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Some features may not work.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Disable session persistence to avoid lock issues
        autoRefreshToken: false, // Disable auto refresh to avoid lock issues
        detectSessionInUrl: false // Disable session detection in URL
      }
    });
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

export { supabase };

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};