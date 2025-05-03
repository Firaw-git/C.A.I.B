// lib/supabase/storeFullManualItinerary.ts
import { supabase } from "../../components/supabaseConfig";
import { v4 as uuidv4 } from "uuid";
import placesData from "../../sample-places-clean.json";

// Create a lookup using both name and city as key
const placeLookup = Object.fromEntries(
  (placesData as any[]).map((place) => [`${place.name}|${place.city}`, place])
);

export const storeFullManualItinerary = async (
  itineraryId: string,
  selectedPlaces: {
    [dayKey: string]: {
      [city: string]: string[];
    };
  }
) => {
  for (const [dayKey, cities] of Object.entries(selectedPlaces)) {
    const dayNumber = parseInt(dayKey.replace("day", ""), 10);

    for (const [city, places] of Object.entries(cities)) {
      const dailyPlanId = uuidv4();

      const { error: dailyPlanError } = await supabase.from("daily_plans").insert({
        id: dailyPlanId,
        itinerary_id: itineraryId,
        day_number: dayNumber + 1,
        city,
      });

      if (dailyPlanError) {
        console.error("❌ Error inserting daily_plan:", dailyPlanError.message);
        continue;
      }

      const placeInserts = places.map((placeName) => {
        const lookupKey = `${placeName}|${city}`;
        const place = placeLookup[lookupKey];

        return {
          id: uuidv4(),
          daily_plan_id: dailyPlanId,
          place_name: placeName,
          address: place?.address_line || "",
          image_url: place?.imageUrl || "",
          type: place?.type?.join(", ") || "",
          notes: "",
        };
      });

      const { error: placeInsertError } = await supabase
        .from("selected_places")
        .insert(placeInserts);

      if (placeInsertError) {
        console.error("❌ Error inserting selected_places:", placeInsertError.message);
      }
    }
  }
};
