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
  let currentSession = null;
  const authListeners = new Set();

  supabaseInstance.auth.getSession = async () => {
    return {
      data: { session: currentSession },
      error: null
    };
  };

  supabaseInstance.auth.signInWithPassword = async ({ email, password }) => {
    if (email === "admin.ikhwan@gmail.com" && password === "AdminPassword123!") {
      currentSession = {
        user: { email: "admin.ikhwan@gmail.com" }
      };
      authListeners.forEach(cb => cb("SIGNED_IN", currentSession));
      return {
        data: {
          user: currentSession.user,
          session: currentSession
        },
        error: null
      };
    } else {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid credentials" }
      };
    }
  };

  supabaseInstance.auth.signOut = async () => {
    currentSession = null;
    authListeners.forEach(cb => cb("SIGNED_OUT", null));
    return { error: null };
  };

  supabaseInstance.auth.onAuthStateChange = (callback) => {
    authListeners.add(callback);
    callback(currentSession ? "SIGNED_IN" : "SIGNED_OUT", currentSession);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          }
        }
      }
    };
  };
}

export const supabase = supabaseInstance;