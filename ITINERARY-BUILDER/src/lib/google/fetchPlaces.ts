// lib/google/fetchPlaces.ts
import axios from "axios";
export async function fetchPlacesByText(
  city: string,
  type: "restaurant" | "tourist_attraction" | "hotel" | "cafe" | "mosque" | "shopping_mall"
) {
  try {
    const response = await axios.get("http://localhost:3001/api/places", {
      params: { city, type },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching places from backend:", error);
    return [];
  }
}

