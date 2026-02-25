import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PawIcon from "@/components/PawIcon";

const FinalCTASection = ({ onOpenQuote }: { onOpenQuote?: () => void }) => (
  <section className="py-20 bg-hero-gradient paw-pattern-dense relative overflow-hidden">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          N'attendez Plus ! Inscrivez-vous Aujourd'hui !
        </h2>
        <Button variant="cta" size="lg" className="text-lg px-10 py-6 rounded-full" onClick={onOpenQuote}>
          <PawIcon className="w-5 h-5" /> Devis gratuit
        </Button>
      </motion.div>
      <div className="flex justify-center mt-8 opacity-30">
        <svg viewBox="0 0 120 80" className="w-32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="70" height="10" rx="2" fill="white" fillOpacity="0.5" />
          <rect x="30" y="20" width="60" height="22" rx="3" fill="white" fillOpacity="0.3" />
          <ellipse cx="60" cy="60" rx="20" ry="12" fill="white" fillOpacity="0.4" />
          <circle cx="60" cy="50" r="10" fill="white" fillOpacity="0.5" />
          <circle cx="56" cy="48" r="2" fill="hsl(200, 25%, 10%)" />
          <circle cx="64" cy="48" r="2" fill="hsl(200, 25%, 10%)" />
        </svg>
      </div>
    </div>
  </section>
);

export default FinalCTASection;
