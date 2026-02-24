import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const SiteFooter = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Coordonnées */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Crotte & Go" className="h-10" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Belgique</p>
          <p className="text-sm text-muted-foreground mb-1">info@crottego.be</p>
          <p className="text-sm text-muted-foreground">+32 2 123 45 67</p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display font-bold text-foreground mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services/residential" className="hover:text-primary transition-colors">Résidentiel</Link></li>
            <li><Link to="/services/commercial" className="hover:text-primary transition-colors">Professionnel / B2B</Link></li>
          </ul>
        </div>

        {/* Zones */}
        <div>
          <h4 className="font-display font-bold text-foreground mb-4">Zones</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#zones" className="hover:text-primary transition-colors">Bruxelles</a></li>
            <li><a href="#zones" className="hover:text-primary transition-colors">Brabant Wallon</a></li>
          </ul>
        </div>

        {/* À propos */}
        <div>
          <h4 className="font-display font-bold text-foreground mb-4">À propos</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-colors">À propos</Link></li>
            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#signup" className="hover:text-primary transition-colors">Contact</a></li>
            <li><Link to="/login" className="hover:text-primary transition-colors">Connexion client</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Crotte & Go. Tous droits réservés. 🐾
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
