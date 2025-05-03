import { test, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

test('RLS blocks access to itineraries not owned by the user', async () => {
  const forbiddenItineraryId = '01f2b0f6-f180-4727-92ea-2cd2c74a28eb'; 

  // Attempt to read the itinerary
  const { data: itinerary, error: itineraryError } = await supabase
    .from('manual_itineraries')
    .select('*')
    .eq('id', forbiddenItineraryId)
    .single();

    expect(itinerary).toBeNull();
    expect(itineraryError).toBeDefined();
});
