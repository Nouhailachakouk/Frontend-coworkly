
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Dashboard  from "@/components/Dashboard";
import { BookingForm } from "@/components/BookingForm";
import History  from "@/components/History";
import { Insights } from "@/components/Insights";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Tableau de bord";
      case "booking":
        return "Nouvelle réservation";
      case "history":
        return "Historique des réservations";
      case "insights":
        return "Insights Intelligence Artificielle";
      default:
        return "SmartCowork";
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Vue d'ensemble de votre activité";
      case "booking":
        return "Réservez votre espace de travail idéal";
      case "history":
        return "Consultez vos réservations passées et futures";
      case "insights":
        return "Analyses et prédictions basées sur l'IA";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "booking":
        return <BookingForm />;
      case "history":
        return <History />;
      case "insights":
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden p-2 border-b glass-effect">
            <SidebarTrigger />
          </div>
          
          <Header 
            title={getPageTitle()} 
            subtitle={getPageSubtitle()}
          />
          
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
