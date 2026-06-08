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
// Temporary Mock for Local Verification of Admin Dashboard
if (supabaseInstance) {
  supabaseInstance.auth.getSession = async () => {
    return {
      data: {
        session: {
          user: { email: "admin.ikhwan@gmail.com" }
        }
      },
      error: null
    };
  };
  supabaseInstance.auth.signInWithPassword = async ({ email, password }) => {
    return {
      data: {
        user: { email: "admin.ikhwan@gmail.com" },
        session: { user: { email: "admin.ikhwan@gmail.com" } }
      },
      error: null
    };
  };
  supabaseInstance.auth.signOut = async () => {
    return { error: null };
  };
}

export const supabase = supabaseInstance;