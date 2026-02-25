import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const ReferralSection = ({ onOpenQuote }: { onOpenQuote?: () => void }) => (
  <section className="py-20 bg-muted/50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Gift className="w-10 h-10 text-primary mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Parrainez un Ami</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Un ami ne devrait pas ramasser lui-même les crottes de son chien ! Parrainez un ami et recevez <strong className="text-foreground">25€ de réduction</strong> sur votre prochaine facture pour chaque parrainage réussi.
          </p>
          <Button variant="default" size="lg" onClick={onOpenQuote}>En savoir plus</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <svg viewBox="0 0 200 200" className="w-56 h-56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" className="fill-accent" />
            <ellipse cx="70" cy="130" rx="28" ry="22" className="fill-secondary/70" />
            <circle cx="70" cy="100" r="20" className="fill-secondary/80" />
            <circle cx="64" cy="97" r="2.5" className="fill-foreground" />
            <circle cx="76" cy="97" r="2.5" className="fill-foreground" />
            <ellipse cx="70" cy="105" rx="3" ry="2" className="fill-foreground" />
            <ellipse cx="130" cy="130" rx="28" ry="22" className="fill-primary/50" />
            <circle cx="130" cy="100" r="20" className="fill-primary/60" />
            <circle cx="124" cy="97" r="2.5" className="fill-foreground" />
            <circle cx="136" cy="97" r="2.5" className="fill-foreground" />
            <ellipse cx="130" cy="105" rx="3" ry="2" className="fill-foreground" />
            <path d="M95 85 Q100 75 105 85 Q110 75 115 85 L105 100 L95 85Z" className="fill-destructive/60" />
          </svg>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ReferralSection;
