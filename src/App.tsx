import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/ui/PrivateRoute";

import Dashboard from "./components/Dashboard";
import { BookingForm } from "./components/BookingForm";

import AuthPage from "./pages/AuthPage"; // page login/inscription
import Layout from "./components/ui/Layout"; // layout avec sidebar

import History from "./components/History"; // composant History (ta page historique)
import {Insights} from "./components/Insights"; // composant Insights (ta page insights IA)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page publique Auth */}
          <Route path="/" element={<AuthPage />} />

          {/* Routes privées */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking" element={<BookingForm />} />
              <Route path="/historique" element={<History />} />
              <Route path="/insights" element={<Insights />} />
            </Route>
          </Route>

          {/* Page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
