import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const SiteNavbar = ({ onOpenQuote }: { onOpenQuote?: () => void }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Crotte & Go" className="h-20" />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {/* Services dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Services <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
              <Link to="/services/residential" className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">Résidentiel</Link>
              <Link to="/services/commercial" className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">Professionnel / B2B</Link>
            </div>
          </div>

          <a href="#faq" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">FAQ</a>
          <Link to="/about" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">À propos</Link>

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
          <Button variant="cta" size="sm" className="ml-2" onClick={onOpenQuote}>Devis gratuit</Button>
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
              <Link to="/services/residential" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Résidentiel</Link>
              <Link to="/services/commercial" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Professionnel / B2B</Link>
            </div>
          )}
          <a href="#faq" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground">FAQ</a>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground">À propos</Link>
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
          <Button variant="cta" className="w-full mt-2" onClick={() => { setMobileOpen(false); onOpenQuote?.(); }}>Devis gratuit</Button>
        </div>
      )}
    </nav>
  );
};

export default SiteNavbar;
