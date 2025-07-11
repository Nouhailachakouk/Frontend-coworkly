import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm shadow-elegant">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-600 mt-1">{subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-10 w-80 bg-white/70 border-slate-200"
              />
            </div>
            
            <Button variant="outline" size="icon" className="relative bg-white/70 border-slate-200 hover:bg-red-50">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}