import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "../AppSidebar";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { SidebarProvider } from "@/components/ui/sidebar"; 

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveTab(path || "dashboard");
  }, [location]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Header title="SmartCowork" subtitle="Gestion intelligente" />
        <div className="flex flex-grow w-full">
          <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="flex-1 w-full p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Layout;