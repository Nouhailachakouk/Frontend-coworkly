
import { Heart, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Développé avec</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>par l'équipe SmartCowork</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>contact@smartcowork.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+33 1 23 45 67 89</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 SmartCowork. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
