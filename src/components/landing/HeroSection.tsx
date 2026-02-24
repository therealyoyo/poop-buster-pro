import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PawIcon from "@/components/PawIcon";
import { Dog } from "lucide-react";

const HeroSection = () =>
<section className="relative overflow-hidden bg-background py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}>

          <span className="inline-block font-display font-bold text-primary text-sm uppercase tracking-widest mb-3">
            Un service unique en Belgique
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
            Ramassage de{" "}
            <span className="text-primary">déjections canines</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Fini le ramassage de crottes, recevez votre devis gratuit dès aujourd'hui !
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#signup">
              <Button variant="cta" size="lg" className="text-lg px-8 py-6 rounded-full">
                <PawIcon className="w-5 h-5" />
                Devis gratuit
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex justify-center">

          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Cute dog illustration placeholder */}
            <div className="w-full h-full rounded-full bg-accent flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dog body */}
                <ellipse cx="100" cy="130" rx="55" ry="45" className="fill-secondary/80" />
                {/* Head */}
                <circle cx="100" cy="75" r="38" className="fill-secondary/90" />
                {/* Ears */}
                <ellipse cx="68" cy="52" rx="14" ry="22" transform="rotate(-15 68 52)" className="fill-secondary" />
                <ellipse cx="132" cy="52" rx="14" ry="22" transform="rotate(15 132 52)" className="fill-secondary" />
                {/* Eyes */}
                <circle cx="86" cy="72" r="5" className="fill-foreground" />
                <circle cx="114" cy="72" r="5" className="fill-foreground" />
                <circle cx="88" cy="70" r="2" className="fill-primary-foreground" />
                <circle cx="116" cy="70" r="2" className="fill-primary-foreground" />
                {/* Nose */}
                <ellipse cx="100" cy="85" rx="6" ry="4" className="fill-foreground" />
                {/* Mouth */}
                <path d="M94 89 Q100 96 106 89" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Tongue */}
                <ellipse cx="100" cy="97" rx="4" ry="6" className="fill-destructive/70" />
                {/* Tail */}
                <path d="M150 115 Q170 80 155 65" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" strokeLinecap="round" />
                {/* Front legs */}
                <rect x="78" y="160" width="12" height="25" rx="6" className="fill-secondary/80" />
                <rect x="110" y="160" width="12" height="25" rx="6" className="fill-secondary/80" />
                {/* Collar */}
                <rect x="72" y="100" width="56" height="8" rx="4" className="fill-primary" />
                <circle cx="100" cy="108" r="4" className="fill-accent" />
              </svg>
            </div>
            {/* Floating paws */}
            <PawIcon className="absolute top-4 right-0 w-8 h-8 text-primary/40 animate-float" />
            <div className="absolute bottom-8 left-0 animate-float" style={{ animationDelay: '1s' }}>
              <PawIcon className="w-6 h-6 text-primary/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>;


export default HeroSection;