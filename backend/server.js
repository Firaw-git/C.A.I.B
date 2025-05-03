const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { getRecommendations } = require('./recommend'); // ✅ Import recommender

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // ✅ Needed to parse POST JSON bodies

// ✅ Google Places Search API Endpoint
app.get('/api/places', async (req, res) => {
  const { city, type } = req.query;

  if (!city || !type) {
    return res.status(400).json({ error: "Missing city or type" });
  }

  // Build search query
  let query;
  switch (type) {
    case "restaurant":
      query = `top restaurants in ${city} Saudi Arabia`;
      break;
    case "tourist_attraction":
      query = `top tourist attractions in ${city} Saudi Arabia`;
      break;
    case "hotel":
      query = `top hotels in ${city} Saudi Arabia`;
      break;
    case "cafe":
      query = `best cafes in ${city} Saudi Arabia`;
      break;
    case "mosque":
      query = `beautiful mosques in ${city} Saudi Arabia`;
      break;
    case "shopping_mall":
      query = `top shopping malls in ${city} Saudi Arabia`;
      break;
    default:
      query = `places in ${city} Saudi Arabia`;
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

  try {
    const response = await axios.get(url, {
      params: {
        query,
        key: process.env.VITE_GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== "OK") {
      console.warn("Google Places API returned:", response.data.status, response.data.error_message);
      return res.json([]);
    }

    const results = response.data.results || [];

    const filteredResults = results.filter(place =>
      place.formatted_address && place.formatted_address.toLowerCase().includes(city.toLowerCase())
    );

    const places = filteredResults
      .filter(place => place.photos?.[0]?.photo_reference)
      .slice(0, 10)
      .map(place => {
        const photoRef = place.photos[0].photo_reference;
        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`;

        let mappedType = [];

        if (place.types.includes("restaurant")) mappedType.push("restaurant");
        if (place.types.includes("tourist_attraction")) mappedType.push("tourist_attraction");
        if (place.types.includes("lodging")) mappedType.push("hotel");
        if (place.types.includes("cafe")) mappedType.push("cafe");
        if (place.types.includes("mosque")) mappedType.push("mosque");
        if (place.types.includes("shopping_mall")) mappedType.push("shopping_mall");

        if (mappedType.length === 0) mappedType = ["other"];

        return {
          name: place.name,
          address: place.formatted_address,
          stars: place.rating ?? null,
          type: mappedType,
          imageUrl,
          lat: place.geometry?.location?.lat ?? null,
          lng: place.geometry?.location?.lng ?? null,
        };
      });

    res.json(places);
  } catch (error) {
    console.error("❌ Error fetching from Google Places API:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Recommendation Endpoint (Cosine Similarity)
app.post('/api/recommend', (req, res) => {
  const { vector } = req.body;

  if (!vector || !Array.isArray(vector) || vector.length !== 5) {
    return res.status(400).json({ error: "Invalid user vector" });
  }

  try {
    const recommendations = getRecommendations(vector, 12);
    res.json(recommendations);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server is running on http://${HOST}:${PORT}`);
});
