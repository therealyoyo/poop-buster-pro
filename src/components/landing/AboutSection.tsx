import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const AboutSection = () => (
  <section id="about" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        {/* Image placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/3] rounded-2xl bg-accent flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 300 220" className="w-3/4" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Happy dog with person */}
              <rect x="20" y="40" width="260" height="160" rx="20" className="fill-primary/10" />
              <circle cx="150" cy="100" r="40" className="fill-secondary/60" />
              <ellipse cx="150" cy="130" rx="25" ry="15" className="fill-secondary/40" />
              <circle cx="140" cy="92" r="3" className="fill-foreground" />
              <circle cx="160" cy="92" r="3" className="fill-foreground" />
              <ellipse cx="150" cy="102" rx="4" ry="3" className="fill-foreground" />
              <path d="M143 106 Q150 114 157 106" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Tail */}
              <path d="M185 90 Q200 60 190 45" stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" strokeLinecap="round" />
              {/* Paw prints */}
              <circle cx="60" cy="170" r="4" className="fill-primary/30" />
              <circle cx="80" cy="160" r="4" className="fill-primary/20" />
              <circle cx="240" cy="170" r="4" className="fill-primary/30" />
            </svg>
          </div>
          {/* Sniffing dog SVG */}
          <svg viewBox="0 0 80 60" className="absolute -bottom-4 -left-4 w-20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="40" rx="25" ry="15" className="fill-secondary/70" />
            <circle cx="40" cy="28" r="14" className="fill-secondary/80" />
            <circle cx="36" cy="26" r="2" className="fill-foreground" />
            <circle cx="44" cy="26" r="2" className="fill-foreground" />
            <ellipse cx="40" cy="32" rx="3" ry="2" className="fill-foreground" />
            <ellipse cx="28" cy="20" rx="5" ry="8" transform="rotate(-20 28 20)" className="fill-secondary" />
            <ellipse cx="52" cy="20" rx="5" ry="8" transform="rotate(20 52 20)" className="fill-secondary" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display font-bold text-primary text-sm uppercase tracking-widest mb-2 block">Crotte & Go</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Notre Entreprise de Ramassage de Crottes
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Fondée avec la mission d'améliorer la vie des propriétaires de chiens en Belgique, Crotte & Go offre un service de ramassage de déjections canines de haute qualité dans la région bruxelloise et le Brabant Wallon. Nous nous occupons du sale boulot pour que vous puissiez profiter de votre jardin sereinement.
          </p>
          <a href="#signup">
            <Button variant="default" size="lg">En savoir plus</Button>
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
