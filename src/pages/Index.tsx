import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import OnboardingForm from "@/components/OnboardingForm";
import PawIcon from "@/components/PawIcon";
import heroImage from "@/assets/hero-yard.jpg";
import { CheckCircle, Shield, Leaf, Clock, Star, Heart, Sparkles } from "lucide-react";

const features = [
  { icon: Shield, title: "Fiable & assuré", desc: "Un service professionnel sur lequel vous pouvez compter à chaque visite." },
  { icon: Leaf, title: "Écoresponsable", desc: "Produits biodégradables, sans danger pour toute la famille." },
  { icon: Clock, title: "Horaire flexible", desc: "Hebdomadaire, aux 2 semaines, mensuel ou ponctuel." },
  { icon: Star, title: "Noté 5 étoiles", desc: "Adoré par les propriétaires d'animaux du quartier." },
];

const howItWorks = [
  { step: "1", title: "Inscrivez-vous", desc: "Remplissez notre formulaire rapide — c'est gratuit !" },
  { step: "2", title: "On planifie", desc: "Nous choisissons ensemble le meilleur horaire pour vous." },
  { step: "3", title: "On ramasse !", desc: "Notre équipe s'occupe de tout. Profitez de votre jardin propre ! 🐾" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Announcement Bar */}
      <div className="bg-hero-gradient text-primary-foreground text-center py-2.5 text-sm font-display font-bold tracking-wide paw-pattern-dense">
        🐾 RÉCLAMEZ VOTRE PREMIER NETTOYAGE GRATUIT AUJOURD'HUI ! 🐾
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Beau jardin vert et propre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/55 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <PawIcon className="w-8 h-8 text-accent animate-paw-bounce" />
              <span className="font-display font-bold text-accent text-sm uppercase tracking-widest">Crotte & Go</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-4">
              On ramasse, <br />
              <span className="text-accent">vous profitez !</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg font-body">
              Service professionnel de ramassage de crottes de chien et désodorisation de jardin. On fait le sale boulot pour que vous n'ayez pas à le faire ! 💩✨
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#signup">
                <Button variant="cta" size="lg" className="text-lg px-8 py-6 rounded-full">
                  <PawIcon className="w-5 h-5" />
                  Mon nettoyage gratuit
                </Button>
              </a>
              <a href="#how">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                  Comment ça marche ?
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 1er nettoyage gratuit</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Sans contrat</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Annulez quand vous voulez</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-hero-gradient paw-pattern-dense">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Comment ça fonctionne ?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
              En 3 étapes simples, votre jardin sera impeccable.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-4 text-primary-foreground font-display text-2xl font-black border-2 border-primary-foreground/30">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">{item.title}</h3>
                <p className="text-primary-foreground/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Promesse client */}
      <section id="features" className="py-20 paw-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary font-display font-bold text-sm uppercase tracking-widest mb-2">Notre promesse</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Pourquoi les proprios d'animaux nous adorent
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              On prend soin de garder votre jardin propre, sécuritaire et sans odeur.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center group hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1 text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial-style banner */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Heart className="w-8 h-8 text-destructive mx-auto mb-4" />
            <blockquote className="font-display text-2xl md:text-3xl font-bold text-foreground max-w-3xl mx-auto mb-4">
              « Depuis que Crotte & Go s'occupe de notre jardin, mes enfants peuvent jouer dehors sans souci. Merci ! »
            </blockquote>
            <p className="text-muted-foreground">— Marie-Claude, maman de Buddy 🐕 et Luna 🐕</p>
          </motion.div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-20 bg-muted/50 paw-pattern">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <OnboardingForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-primary">
            <PawIcon className="w-5 h-5" />
            Crotte & Go
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Crotte & Go. On garde vos jardins propres, une crotte à la fois. 🐾
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="/login" className="text-muted-foreground hover:text-primary transition-colors">Admin</a>
            <a href="/portal" className="text-muted-foreground hover:text-primary transition-colors">Portail client</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
