import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Est-ce que vous nettoyez tout le jardin ?", a: "Oui ! Nous parcourons systématiquement l'ensemble de votre jardin pour ne laisser aucune surprise. Chaque visite est complète et minutieuse." },
  { q: "Proposez-vous le service toute l'année ?", a: "Absolument. Nous travaillons 12 mois par an, beau temps comme mauvais temps. Votre jardin reste propre en toute saison." },
  { q: "Comment assurez-vous la sécurité de mes chiens ?", a: "Nos équipes sont formées à la manipulation en toute sécurité. Nous utilisons des désinfectants de qualité vétérinaire et nos outils sont nettoyés entre chaque visite." },
  { q: "Combien coûte le service ?", a: "Le tarif dépend de la taille de votre jardin, du nombre de chiens et de la fréquence choisie. Demandez un devis gratuit pour connaître votre prix personnalisé !" },
  { q: "Dois-je signer un contrat ?", a: "Non ! Aucun contrat ni engagement. Vous pouvez commencer, mettre en pause ou annuler votre service à tout moment." },
  { q: "Comment sont éliminées les déjections ?", a: "Les déjections sont collectées dans des sacs biodégradables et éliminées de manière écologique et conforme aux réglementations locales." },
];

const FAQSection = () => (
  <section id="faq" className="py-20 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Questions Fréquentes</h2>
      </motion.div>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl px-6 border border-border">
            <AccordionTrigger className="font-display font-bold text-foreground text-left">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
