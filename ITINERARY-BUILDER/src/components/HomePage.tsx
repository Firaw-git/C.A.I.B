import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CuratedPlacesDisplay from "./CuratedPlacesDisplay";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const fullText = "Discover Saudi Arabia";
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let index = 1; // start from second character
    let timeoutId: ReturnType<typeof setTimeout>;
  
    setTypedText(fullText.charAt(0)); // instantly type first character
  
    const type = () => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
        timeoutId = setTimeout(type, 100);
      } else {
        setIsFinished(true);
      }
    };
  
    timeoutId = setTimeout(type, 100);
  
    return () => clearTimeout(timeoutId);
  }, []);
  
  

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className={`home-title typing-text ${isFinished ? "finished" : ""}`}>
          {typedText}
        </h1>
        <p className="home-subtitle">
          Explore famous attractions and restaurants before creating your custom itinerary.
        </p>
        <button className="start-button" onClick={() => navigate("/LoginPage")}>
          🚀 Start Planning
        </button>
      </header>

      {/* Explore mode (read-only) */}
      <CuratedPlacesDisplay mode="explore" />
    </div>
  );
}
