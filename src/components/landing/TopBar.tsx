import { Link } from "react-router-dom";

const TopBar = () => (
  <div className="bg-hero-gradient text-primary-foreground text-center py-2 text-sm font-display font-bold tracking-wide relative">
    <span>🐾 Réclamez votre premier nettoyage GRATUIT !</span>
    <Link to="/login" className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline text-primary-foreground/80 hover:text-primary-foreground text-xs underline underline-offset-2">
      Connexion client
    </Link>
  </div>
);

export default TopBar;
