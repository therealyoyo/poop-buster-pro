import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PawIcon from "@/components/PawIcon";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");
  const isPortal = location.pathname.startsWith("/portal");

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <PawIcon className="w-7 h-7 animate-paw-bounce" />
          Poop Buster
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link to="/admin"><Button variant={location.pathname === "/admin" ? "default" : "ghost"} size="sm">Dashboard</Button></Link>
              <Link to="/admin/clients"><Button variant={location.pathname === "/admin/clients" ? "default" : "ghost"} size="sm">Clients</Button></Link>
              <Link to="/admin/billing"><Button variant={location.pathname === "/admin/billing" ? "default" : "ghost"} size="sm">Billing</Button></Link>
            </>
          ) : isPortal ? (
            <>
              <Link to="/portal"><Button variant={location.pathname === "/portal" ? "default" : "ghost"} size="sm">My Dashboard</Button></Link>
              <Link to="/portal/invoices"><Button variant={location.pathname === "/portal/invoices" ? "default" : "ghost"} size="sm">Invoices</Button></Link>
              <Link to="/portal/settings"><Button variant={location.pathname === "/portal/settings" ? "default" : "ghost"} size="sm">Settings</Button></Link>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/#signup"><Button variant="hero" size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-2">
          {isAdmin ? (
            <>
              <Link to="/admin" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Dashboard</Button></Link>
              <Link to="/admin/clients" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Clients</Button></Link>
              <Link to="/admin/billing" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Billing</Button></Link>
            </>
          ) : isPortal ? (
            <>
              <Link to="/portal" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">My Dashboard</Button></Link>
              <Link to="/portal/invoices" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Invoices</Button></Link>
              <Link to="/portal/settings" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Settings</Button></Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Login</Button></Link>
              <Link to="/#signup" onClick={() => setMobileOpen(false)}><Button variant="hero" className="w-full">Get Started</Button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
