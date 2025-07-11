import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulons une authentification simple
    if (email === "user@test.com" && password === "password") {
      localStorage.setItem("token", "dummy-token");
      navigate("/dashboard");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="block w-full mb-2"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="block w-full mb-2"
      />
      <button type="submit" className="btn btn-primary w-full">Se connecter</button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </form>
  );
}
