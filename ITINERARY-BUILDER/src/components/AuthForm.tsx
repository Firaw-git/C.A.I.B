import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseConfig";
import "./AuthForm.css";

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/ItinerarySelectionPage");
      setLoading(false);
    });
  }, [navigate]);

  // Email/password login
  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate("/ItinerarySelectionPage");
      } else {
        setError("Login succeeded but session not found.");
      }

      setLoading(false);
    }
  };

  // Google OAuth login with redirect to correct domain
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          import.meta.env.MODE === "development"
            ? "http://localhost:5173/"
            : "https://c-a-i-b.vercel.app/"
      }
    });

    if (error) setError(error.message);
  };

  if (loading) return <p className="auth-loading">Loading...</p>;

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Welcome Back</h2>
      {error && <p className="auth-error">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />

      <button onClick={handleSignIn} className="auth-btn action-btn">
        Sign In
      </button>

      <hr className="auth-divider" />

      <button onClick={handleGoogleSignIn} className="auth-btn google-btn">
        Sign in with Google
      </button>

      <p className="auth-footer">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/SignUpPage")} className="auth-link">
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default AuthForm;
