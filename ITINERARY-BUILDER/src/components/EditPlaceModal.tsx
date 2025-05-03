// EditPlaceModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "./supabaseConfig";
import curatedPlaces from "../sample-places-clean.json";
import "./EditPlaceModal.css";

type Place = {
  name: string;
  address: string;
  imageUrl: string;
  type: string;
  lat: number | null;
  lng: number | null;
  rating?: number | null;
};

type CuratedPlace = {
  name: string;
  stars: number | null;
  description: string;
  address_line: string;
  type: string[];
  url?: string | null;
  opening_hours?: Record<string, string[]>;
  imageUrl?: string;
  city: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
  currentPlace: any;
  city: string;
  onUpdate: () => void;
};

const EditPlaceModal: React.FC<Props> = ({ show, onClose, currentPlace, city, onUpdate }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(
    currentPlace.type || "tourist_attraction"
  );

  const fetchPlaces = async (typeOverride?: string) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/places", {
        params: {
          city,
          type: typeOverride || selectedType,
        },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setPlaces(response.data);
      } else {
        throw new Error("API returned no results");
      }
    } catch (err) {
      console.warn("⚠️ API failed, using curated fallback");

      const fallback = (curatedPlaces as CuratedPlace[])
        .filter((p) => {
          const matchCity = p.city === city;
          const lowerTypes = p.type.map((t) => t.toLowerCase());
          const isRestaurant = ["restaurant", "diner", "grill", "shawarma", "pizza", "cafe"].some((r) =>
            lowerTypes.some((type) => type.includes(r))
          );
          const matchType = selectedType === "restaurant" ? isRestaurant : !isRestaurant;
          return matchCity && matchType;
        })
        .map((p) => ({
          name: p.name,
          address: p.address_line,
          imageUrl: p.imageUrl || "",
          type: p.type.join(", "),
          lat: null,
          lng: null,
          rating: p.stars ?? null,
        }));

      setPlaces(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchPlaces();
    }
  }, [show, selectedType]);

  const handleSelect = async (place: Place) => {
    const { error } = await supabase
      .from("selected_places")
      .update({
        place_name: place.name,
        address: place.address,
        image_url: place.imageUrl,
        lat: place.lat,
        lng: place.lng,
        type: place.type,
      })
      .eq("id", currentPlace.id);

    if (!error) {
      onUpdate();
      onClose();
    } else {
      alert("❌ Failed to update place.");
    }
  };

  if (!show) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2 className="modal-header">Edit Place in {city}</h2>

        <div className="filter">
          <label className="filter-label">Type:</label>
          <select
            className="type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="tourist_attraction">Tourist Attractions</option>
            <option value="restaurant">Restaurants</option>
          </select>
        </div>

        {loading ? (
          <p className="status-text">Loading...</p>
        ) : places.length === 0 ? (
          <p className="status-text">No places found.</p>
        ) : (
          <div className="places-grid">
            {places.map((place, index) => (
              <div key={index} className="place-card">
                <img src={place.imageUrl} alt={place.name} className="place-img" />
                <div className="place-info">
                  <h3 className="place-name">{place.name}</h3>
                  <p className="place-address">📍 {place.address}</p>
                  {place.rating && (
                    <p className="place-rating">⭐ {place.rating} stars</p>
                  )}
                  <button
                    className="select-btn"
                    onClick={() => handleSelect(place)}
                  >
                    Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPlaceModal;
