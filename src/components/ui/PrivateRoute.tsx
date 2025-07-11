import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  if (!isAuthenticated) {
    // Pas connecté ? Redirection vers la page d'authentification ("/")
    return <Navigate to="/" replace />;
  }

  // Connecté ? Affiche les routes enfants protégées
  return <Outlet />;
};

export default PrivateRoute;
