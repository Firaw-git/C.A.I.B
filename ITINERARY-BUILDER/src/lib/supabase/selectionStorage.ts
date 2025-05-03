// lib/supabase/selectionStorage.ts
import { supabase } from "../../components/supabaseConfig";
import { v4 as uuidv4 } from "uuid";
import placesData from "../../sample-places-clean.json";

const placeLookup = Object.fromEntries(
  (placesData as any[]).map((place) => [place.name, place])
);

type ToggleArgs = {
  itineraryId: string;
  dayNumber: number;
  city: string;
  placeName: string;
  isAdding: boolean;
};

export const togglePlaceSelection = async ({
  itineraryId,
  dayNumber,
  city,
  placeName,
  isAdding,
}: ToggleArgs) => {
  const place = placeLookup[placeName];
  if (!place) {
    console.warn(`⚠️ Place not found in lookup: ${placeName}`);
    return;
  }

  // 1. Check if daily_plan exists
  const { data: existingPlan } = await supabase
    .from("daily_plans")
    .select("id")
    .eq("itinerary_id", itineraryId)
    .eq("day_number", dayNumber)
    .eq("city", city)
    .single();

  let dailyPlanId: string;

  if (!existingPlan) {
    // 2. Insert daily plan if not found
    dailyPlanId = uuidv4();
    const { error: insertError } = await supabase.from("daily_plans").insert({
      id: dailyPlanId,
      itinerary_id: itineraryId,
      day_number: dayNumber,
      city,
    });
    if (insertError) {
      console.error("❌ Failed to insert daily_plan:", insertError.message);
      return;
    }
  } else {
    dailyPlanId = existingPlan.id;
  }

  if (isAdding) {
    // 3. Insert full place data
    const { error: insertPlaceError } = await supabase.from("selected_places").insert({
      id: uuidv4(),
      daily_plan_id: dailyPlanId,
      place_name: place.name,
      address: place.address_line,
      image_url: place.imageUrl,
      type: place.type?.join(", "),
      notes: "",
    });
    if (insertPlaceError) {
      console.error("❌ Error inserting place:", insertPlaceError.message);
    }
  } else {
    // 4. Remove by name and plan ID
    const { error: deleteError } = await supabase
      .from("selected_places")
      .delete()
      .eq("daily_plan_id", dailyPlanId)
      .eq("place_name", placeName);

    if (deleteError) {
      console.error("❌ Error deleting place:", deleteError.message);
    }
  }
};
