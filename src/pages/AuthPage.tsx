import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginData = { email: string; password: string };
type RegisterData = { firstName: string; lastName: string; email: string; password: string };

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const data = contentType?.includes("application/json") ? await res.json() : null;
        throw new Error(data?.message || "Erreur de connexion");
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const data = contentType?.includes("application/json") ? await res.json() : null;
        throw new Error(data?.message || "Erreur d'inscription");
      }

      setIsLogin(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ffe4e6] via-[#fef2f2] to-[#fff5f5] px-6 py-10">
      <div className="backdrop-blur-sm bg-white/90 w-full max-w-2xl rounded-3xl shadow-2xl border border-red-200 p-12">
        {/* Logo + Titre */}
        <div className="text-center mb-10">
          <img
            src="/téléchargement.png"
            alt="Smart Cowork"
            className="h-24 w-auto mx-auto mb-6"
          />
          <h1 className="text-5xl font-extrabold text-red-700">Smart Cowork</h1>
          <p className="text-xl text-gray-600 mt-2">Espace de travail intelligent et connecté</p>
        </div>

        {/* Toggle Connexion / Inscription */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`w-1/2 py-3 text-lg font-semibold rounded-lg transition ${
              isLogin ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`w-1/2 py-3 text-lg font-semibold rounded-lg transition ${
              !isLogin ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded text-center text-base">
            {error}
          </div>
        )}

        {/* Formulaires */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-red-800 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-red-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-medium text-red-800 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-red-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label htmlFor="firstName" className="block text-base font-medium text-red-800 mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-red-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-base font-medium text-red-800 mb-2">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-red-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-medium text-red-800 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-red-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-medium text-red-800 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                minLength={6}
                disabled={loading}
                className="w-full px-5 py-3 border border-red-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
