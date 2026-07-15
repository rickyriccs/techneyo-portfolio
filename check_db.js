import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqwddohpubsblhuspci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXdkZG9ocHVic2JsaHVzcGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDk4NjcsImV4cCI6MjA5NjcyNTg2N30.ldFHpRGIx4HQV2167qh6rzeF_Ur4uKTGifgAFLtGtRc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('offers')
    .select('*');
  
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
