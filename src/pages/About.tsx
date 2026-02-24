import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/landing/TopBar";
import SiteNavbar from "@/components/landing/SiteNavbar";
import SiteFooter from "@/components/landing/SiteFooter";

const About = () => (
  <div className="min-h-screen bg-background">
    <TopBar />
    <SiteNavbar />

    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="font-display font-bold text-primary text-sm uppercase tracking-widest mb-2 block">
            Crotte & Go
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Entreprise de Ramassage de Déjections Canines
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Fondée avec la mission d'améliorer la vie des propriétaires de chiens en Belgique, Crotte & Go offre un service de ramassage de déjections canines de haute qualité en région Bruxelloise et dans le Brabant Wallon. Nous nous occupons du sale boulot pour que vous puissiez profiter de votre jardin sereinement.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Notre équipe intervient régulièrement chez nos clients pour garantir un jardin propre, sain et agréable sans que vous ayez à lever le petit doigt. Que vous ayez un ou plusieurs chiens, nous adaptons notre service à vos besoins.
          </p>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Posséder un chien est un vrai bonheur, mais nettoyer ses déjections peut vite devenir une véritable corvée lorsque l'on est débordé.
          </p>
          <a href="/#signup">
            <Button variant="cta" size="lg">Demander un devis gratuit</Button>
          </a>
        </motion.div>
      </div>
    </section>

    <SiteFooter />
  </div>
);

export default About;
