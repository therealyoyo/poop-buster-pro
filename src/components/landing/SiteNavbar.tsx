import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const SiteNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Crotte & Go" className="h-10" />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {/* Services dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Services <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
              <a href="#services" className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">Résidentiel</a>
            </div>
          </div>

          <a href="#faq" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">FAQ</a>
          <a href="#about" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">À propos</a>

          {/* Zones dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Zones desservies <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
              <a href="#zones" className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">Bruxelles</a>
              <a href="#zones" className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">Brabant Wallon</a>
            </div>
          </div>

          <Link to="/login" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">Connexion client</Link>
          <a href="#signup">
            <Button variant="cta" size="sm" className="ml-2">Devis gratuit</Button>
          </a>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 flex flex-col gap-1">
          <button onClick={() => setServicesOpen(!servicesOpen)} className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground">
            Services <ChevronDown className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
          </button>
          {servicesOpen && (
            <div className="pl-6 flex flex-col gap-1">
              <a href="#services" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Résidentiel</a>
            </div>
          )}
          <a href="#faq" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground">FAQ</a>
          <a href="#about" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground">À propos</a>
          <button onClick={() => setZonesOpen(!zonesOpen)} className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground">
            Zones desservies <ChevronDown className={`w-3 h-3 transition-transform ${zonesOpen ? 'rotate-180' : ''}`} />
          </button>
          {zonesOpen && (
            <div className="pl-6 flex flex-col gap-1">
              <a href="#zones" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Bruxelles</a>
              <a href="#zones" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Brabant Wallon</a>
            </div>
          )}
          <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground">Connexion client</Link>
          <a href="#signup" onClick={() => setMobileOpen(false)}>
            <Button variant="cta" className="w-full mt-2">Devis gratuit</Button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default SiteNavbar;
