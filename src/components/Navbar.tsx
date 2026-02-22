import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PawIcon from "@/components/PawIcon";
import { Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useUnreadCount } from "@/hooks/useMessages";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");
  const isPortal = location.pathname.startsWith("/portal");
  const { data: unreadCount = 0 } = useUnreadCount();

  const adminLinks = [
    { to: "/admin", label: "Tableau de bord" },
    { to: "/admin/clients", label: "CRM" },
    { to: "/admin/pipeline", label: "Pipeline" },
    { to: "/admin/billing", label: "Facturation" },
    { to: "/admin/zones", label: "Zones" },
  ];

  const portalLinks = [
    { to: "/portal", label: "Mon espace" },
    { to: "/portal/messages", label: "Messages" },
    { to: "/portal/invoices", label: "Factures" },
    { to: "/portal/settings", label: "Paramètres" },
  ];

  const links = isAdmin ? adminLinks : isPortal ? portalLinks : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <PawIcon className="w-7 h-7 animate-paw-bounce" />
          Crotte & Go
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {links.length > 0 ? links.map(l => (
            <Link key={l.to} to={l.to}>
              <Button variant={location.pathname === l.to ? "default" : "ghost"} size="sm" className="relative">
                {l.label}
                {l.label === "CRM" && isAdmin && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </Button>
            </Link>
          )) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
              <Link to="/#signup"><Button variant="cta" size="sm">Commencer</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-2">
          {links.length > 0 ? links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">{l.label}</Button>
            </Link>
          )) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Connexion</Button></Link>
              <Link to="/#signup" onClick={() => setMobileOpen(false)}><Button variant="cta" className="w-full">Commencer</Button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
