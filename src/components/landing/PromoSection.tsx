import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import PawIcon from "@/components/PawIcon";

const PromoSection = () => (
  <section className="py-20 bg-hero-gradient paw-pattern-dense relative overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display font-bold text-primary-foreground/80 text-sm uppercase tracking-widest mb-2 block">
            Offre de lancement
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Réclamez votre premier nettoyage GRATUIT !
          </h2>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <CheckCircle className="w-5 h-5 shrink-0" /> Aucun engagement, annulable à tout moment
            </li>
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <CheckCircle className="w-5 h-5 shrink-0" /> Valable pour les nouveaux clients uniquement
            </li>
          </ul>
          <a href="#signup">
            <Button variant="cta" size="lg" className="text-lg px-8 py-6 rounded-full">
              <PawIcon className="w-5 h-5" /> Devis gratuit
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" className="fill-primary-foreground/10" />
            <ellipse cx="100" cy="130" rx="45" ry="35" fill="white" fillOpacity="0.3" />
            <circle cx="100" cy="80" r="30" fill="white" fillOpacity="0.35" />
            <ellipse cx="80" cy="62" rx="10" ry="18" transform="rotate(-15 80 62)" fill="white" fillOpacity="0.3" />
            <ellipse cx="120" cy="62" rx="10" ry="18" transform="rotate(15 120 62)" fill="white" fillOpacity="0.3" />
            <circle cx="90" cy="76" r="4" fill="hsl(200, 25%, 10%)" />
            <circle cx="110" cy="76" r="4" fill="hsl(200, 25%, 10%)" />
            <circle cx="92" cy="74" r="1.5" fill="white" />
            <circle cx="112" cy="74" r="1.5" fill="white" />
            <ellipse cx="100" cy="86" rx="5" ry="3.5" fill="hsl(200, 25%, 10%)" />
            <path d="M94 90 Q100 98 106 90" stroke="hsl(200, 25%, 10%)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="100" cy="98" rx="4" ry="5" fill="hsl(4, 70%, 60%)" fillOpacity="0.7" />
            <path d="M140 110 Q165 75 150 55" stroke="white" strokeOpacity="0.4" strokeWidth="7" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PromoSection;
