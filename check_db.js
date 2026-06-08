import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://paekxqutrenruwuzbozz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZWt4cXV0cmVucnV3dXpib3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODE4NjQsImV4cCI6MjA4Mzk1Nzg2NH0.vGFULCrkVy_qL-1ZxEWHiz6uBXRxaY8ieTBB2AYdAoY";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCommonTables() {
  const commonTables = ['about', 'profile', 'user_profile', 'metadata', 'portfolio_settings', 'experience_settings'];
  for (const table of commonTables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`Table '${table}' exists! Data:`, data);
    } else {
      console.log(`Table '${table}' query error:`, error.message);
    }
  }
}

checkCommonTables();
