import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. Running in local/offline fallback mode.");
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
}
export const supabase = supabaseInstance;