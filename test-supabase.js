const { createClient } = require('@supabase/supabase-js');

// Remplace par TES valeurs (depuis .env.local ou Supabase Settings > API)
const supabaseUrl = 'https://arevqehvhkcqivwyojou.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZXZxZWh2aGtjcWl2d3lvam91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTMzNTUsImV4cCI6MjA2Njk2OTM1NX0.hKOA66FJ7915yGwt6tLQopponsxYOB3HeVPQ9MIKJ2Y'

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', data);
  if (error) console.error('Error:', error);
})(); 