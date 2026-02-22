import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";

const bullets = [
  "Options flexibles : hebdomadaire, bihebdomadaire, mensuel, ponctuel",
  "Avis 5 étoiles de clients satisfaits en Belgique",
  "Service de désodorisation pour un jardin frais et sans odeurs",
];

const ResidentialSection = () => (
  <section id="services" className="py-20 bg-muted/50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display font-bold text-primary text-sm uppercase tracking-widest mb-2 block">
            Dites adieu aux déjections canines
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Services Résidentiels de Ramassage
          </h2>
          <ul className="space-y-4 mb-8">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <a href="#signup">
            <Button variant="default" size="lg">En savoir plus</Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="bg-card rounded-2xl p-8 shadow-card max-w-sm w-full">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-accent-foreground text-accent-foreground" />)}
            </div>
            <p className="text-muted-foreground italic mb-4">
              "Service impeccable ! Mon jardin n'a jamais été aussi propre."
            </p>
            <p className="font-display font-bold text-foreground text-sm">— Client satisfait, Bruxelles</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ResidentialSection;
