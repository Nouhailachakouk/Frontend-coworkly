import { Home, Calendar, History, Brain, LogOut, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: "Tableau de bord",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Réservation",
    icon: Calendar,
    id: "booking",
  },
  {
    title: "Historique",
    icon: History,
    id: "historique",
  },
  {
    title: "Insights IA",
    icon: Brain,
    id: "insights",
  },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Sidebar className="border-r bg-white/50 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b bg-gradient-to-r from-red-50 to-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">SC</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
              SmartCowork
            </h2>
            <p className="text-base text-muted-foreground">Gestion intelligente</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === item.id}
                    className="w-full mb-3"
                  >
                    <button
                      onClick={() => onTabChange(item.id)}
                      className={`flex items-center gap-4 w-full p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                        activeTab === item.id
                          ? "gradient-primary text-white shadow-lg"
                          : "hover:bg-gradient-to-r hover:from-red-50 hover:to-slate-50"
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="font-semibold text-lg">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-4 w-full p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-6 w-6" />
                <span className="text-base">Paramètres</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full p-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-base">Déconnexion</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
