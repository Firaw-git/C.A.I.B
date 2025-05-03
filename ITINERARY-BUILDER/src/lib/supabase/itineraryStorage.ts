import { supabase } from "../../components/supabaseConfig";

export async function saveManualItinerary(
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('manual_itineraries')
    .insert([
      {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      },
    ])
    .select();

  if (error) throw error;
  return data[0]; // returning the inserted itinerary
}
