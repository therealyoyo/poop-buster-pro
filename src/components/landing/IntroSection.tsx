import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Heart, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Un service adapté à vos besoins",
    desc: "Besoin d'un nettoyage ponctuel, de visites hebdomadaires ou même de plusieurs passages par semaine ? Nous proposons une planification flexible qui s'adapte à votre rythme de vie.",
  },
  {
    icon: Heart,
    title: "Un service pensé pour votre famille",
    desc: "Notre intervention fiable et soignée garantit un jardin propre et sûr, pour que vous puissiez créer des souvenirs en toute tranquillité avec vos enfants et vos animaux.",
  },
  {
    icon: ShieldCheck,
    title: "Un service sans tracas",
    desc: "Tarifs clairs, processus simple et transparent : nous nous occupons de tout, sans frais cachés ni complications.",
  },
];

const IntroSection = ({ onOpenQuote }: { onOpenQuote?: () => void }) => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          Marre de perdre votre temps à ramasser les crottes de votre chien au lieu de profiter de votre jardin en famille ?
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-4">
          Chez Crotte&Go, nous libérons les propriétaires de chiens de la corvée la moins appréciée afin de leur permettre de se détendre et de profiter pleinement de leur extérieur.
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
          C'est pourquoi nous sommes spécialisés dans le ramassage professionnel des déjections canines, afin que vous puissiez récupérer votre temps libre et profiter d'un jardin toujours propre et prêt pour les moments en famille.
        </p>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
      >
        Pourquoi nous choisir ?
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center hover:shadow-card-hover transition-all hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-4">
              <b.icon className="w-7 h-7 text-accent-foreground" />
            </div>
            <h4 className="font-display font-bold text-foreground text-lg mb-2">{b.title}</h4>
            <p className="text-sm text-muted-foreground">{b.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="font-display text-xl font-bold text-foreground mb-6">
          Ne ramassez plus, profitez simplement.
        </p>
        <Button variant="default" size="lg" onClick={onOpenQuote}>
          Planifier mon premier ramassage
        </Button>
      </motion.div>
    </div>
  </section>
);

export default IntroSection;
