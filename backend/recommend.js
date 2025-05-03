const fs = require("fs");
const path = require("path");

// Load enriched JSON data (with vectors)
const enrichedPlaces = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "places-enriched.json"), "utf-8")
);

// Cosine similarity function
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
  const magB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  return dot / (magA * magB);
}

// Recommendation function
function getRecommendations(userVector, topN = 12) {
  const scored = enrichedPlaces.map(place => ({
    ...place,
    score: parseFloat(cosineSimilarity(userVector, place.vector).toFixed(3))
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topN);
}

module.exports = { getRecommendations };
