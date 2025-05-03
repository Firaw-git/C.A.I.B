// LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can clear any auth data here if stored (e.g. tokens, user info)
    navigate("/"); // Go back to home page
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      🔓 Log Out
    </button>
  );
};

export default LogoutButton;
