import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarCheck, Clock, Sparkles, Shield, ChevronDown } from "lucide-react";
import PawIcon from "@/components/PawIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    icon: CalendarCheck,
    title: "2x par semaine",
    desc: "Idéal pour les foyers avec plusieurs chiens ou en cas d'accumulation importante de déjections.\nPermet de maintenir un jardin propre et agréable en permanence tout en réduisant plus rapidement les odeurs et la prolifération des bactéries grâce à des interventions plus fréquente",
  },
  {
    icon: Clock,
    title: "Hebdomadaire",
    desc: "Notre service le plus populaire, parfait  pour les propriétaires d'animaux au quotidien bien rempli. Garantit une hygiène optimale en limitant les bactéries et les mauvaises odeurs. Idéal pour les foyers comptant 1 à 2 chiens.",
  },
  {
    icon: Sparkles,
    title: "Toutes les 2 semaines",
    desc: "Une excellente option pour les habitations avec une accumulation de déjections modérée. Parfait pour les propriétaires qui souhaitent un nettoyage régulier sans avoir besoin d'un passage hebdomadaire",
  },
  {
    icon: Shield,
    title: "Ponctuel",
    desc: "Un nettoyage unique et complet de votre jardin. Idéal avant un événement, après l'hiver ou pour un premier grand ménage.",
  },
];

const benefits = [
  "Jardin propre et sain pour votre famille et vos animaux",
  "Réduction des risques sanitaires liés aux déjections",
  "Plus de temps libre pour profiter de votre extérieur",
  "Service flexible, sans contrat ni engagement",
  "Équipe vérifiée, professionnelle et discrète",
  "Photo de confirmation après chaque passage",
];

const faqs = [
  {
    q: "Combien coûte le service de ramassage ?",
    a: "Nos tarifs dépendent de la taille de votre jardin, du nombre de chiens et de la fréquence choisie. Demandez votre devis gratuit pour recevoir une offre personnalisée en quelques minutes.",
  },
  {
    q: "Dois-je être présent lors du passage ?",
    a: "Non, pas nécessaire ! Il vous suffit de nous donner accès au jardin. Après chaque visite, vous recevrez une photo de confirmation de notre passage et du portail fermé.",
  },
  {
    q: "Que faites-vous des déjections ramassées ?",
    a: "Nous emportons toutes les déjections avec nous après chaque visite. Vous n'avez rien à faire — votre jardin reste propre et vous n'avez pas à gérer l'élimination.",
  },
];

const ResidentialDetailSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="font-display font-bold text-secondary text-sm uppercase tracking-widest mb-2 block">
          Service Résidentiel
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          Un Jardin Propre, Sans Lever le Petit Doigt
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
          Vous en avez assez de consacrer votre temps libre au ramassage des déjections de votre chien ? 
          Chez Crotte&Go, nous prenons en charge cette corvée pour que vous puissiez profiter pleinement 
          de votre jardin en famille, en toute tranquillité.
        </p>
      </motion.div>

      {/* Service plans */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-2xl font-bold text-foreground text-center mb-10"
      >
        Nos Formules de Ramassage
      </motion.h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center hover:shadow-card-hover transition-all hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4">
              <s.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h4 className="font-display font-bold text-foreground mb-2">{s.title}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Pourquoi Faire Appel à Crotte&Go ?
          </h3>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-muted/50 rounded-2xl p-8 text-center"
        >
          <PawIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h4 className="font-display text-xl font-bold text-foreground mb-3">
            Premier ramassage GRATUIT
          </h4>
          <p className="text-muted-foreground mb-6">
            Testez notre service sans engagement. Aucune carte bancaire requise.
          </p>
          <a href="#signup">
            <Button variant="cta" size="lg" className="rounded-full px-8">
              <PawIcon className="w-5 h-5" /> Obtenir mon devis gratuit
            </Button>
          </a>
        </motion.div>
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <h3 className="font-display text-2xl font-bold text-foreground text-center mb-8">
          Questions Fréquentes — Résidentiel
        </h3>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl shadow-card border-none px-6"
            >
              <AccordionTrigger className="font-display font-bold text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default ResidentialDetailSection;
