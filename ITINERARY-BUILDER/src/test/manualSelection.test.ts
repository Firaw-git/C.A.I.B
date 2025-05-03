/// <reference types="vitest" />
import { test, expect } from 'vitest';
import { fetchPlacesByText } from '../lib/google/fetchPlaces';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

test('REAL Manual Selection inserts selected place into Supabase', async () => {
  const city = "Riyadh";
  const type = "tourist_attraction";

  const dailyPlanId = "7b898cc7-a783-436c-8d82-d3b01b1725f5";

  const places = await fetchPlacesByText(city, type);
  expect(places.length).toBeGreaterThan(0);

  const place = places[0];

  const { data: insertData, error: insertError } = await supabase
    .from("selected_places")
    .insert([{
      daily_plan_id: dailyPlanId,
      place_name: place.name,
      address: place.address,
      image_url: place.imageUrl,
      type: type,
      lat: place.lat,
      lng: place.lng,
      notes: "Added via real test"
    }])
    .select();

  console.log("✅ Inserted:", insertData);
  expect(insertError).toBeNull();
  expect(insertData).toBeDefined();
});
