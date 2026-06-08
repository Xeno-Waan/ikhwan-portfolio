import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://paekxqutrenruwuzbozz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZWt4cXV0cmVucnV3dXpib3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODE4NjQsImV4cCI6MjA4Mzk1Nzg2NH0.vGFULCrkVy_qL-1ZxEWHiz6uBXRxaY8ieTBB2AYdAoY";

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpUser() {
  const email = `test.admin${Date.now()}@gmail.com`;
  const password = "AdminPassword123!";
  console.log(`Attempting to sign up user: ${email}`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Sign up failed:", error.message);
  } else {
    console.log("Sign up success!", data);
    console.log(`Please use email: ${email} and password: ${password} to login.`);
  }
}

signUpUser();
