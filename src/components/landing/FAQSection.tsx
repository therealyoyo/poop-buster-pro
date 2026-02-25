import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
{ q: "Est-ce que vous nettoyez tout le jardin ?", a: "Crotte&Go® nettoie toutes les zones de votre propriété où l'on peut trouver des déjections canines : jardins avant, arrière et latéraux, parterres de fleurs, enclos pour chiens, etc." },
{ q: "Proposez-vous vos services de ramassage toute l'année ?", a: "Absolument. Crotte&Go® assure ses services toute l'année et même en hiver." },
{ q: "Comment assurez-vous la sécurité de mes chiens ?", a: "La sécurité de nos clients et de leurs chiens est notre priorité absolue. Pour éviter la propagation de germes, nous désinfectons tout notre matériel et nos chaussures entre chaque passage chez un client avec des produits de qualité vétérinaire. Nous prenons également une photo du portail de votre jardin une fois le travail terminé pour vous assurer qu'il est bien fermé." },
{ q: "Dois-je signer un contrat ?", a: "Non ! Aucun contrat ni engagement. Vous pouvez commencer, mettre en pause ou annuler votre service à tout moment via votre portail client ou en nous téléphonant." },
{ q: "Dois-je être présent lors du passage ?", a: "Non, pas nécessaire ! Il vous suffit de nous donner accès au jardin. Après chaque visite, vous recevrez un e-mail de confirmation de notre passage et une photo de votre portail fermé." },
{ q: "Que faites-vous des déjections ramassées ?", a: "On emballe les déjections dans un double sac avant de les déposer dans votre poubelle. Si vous n'avez pas de poubelle ou de benne accessible, les sacs doublés seront simplement déposés sur le côté de votre domicile." },
{ q: "Pouvez-vous intervenir si mon chien est dans le jardin ?", a: "Oui, nous adorons travailler en présence des chiens ! Nous vous demandons simplement de garder votre animal à l'intérieur pendant l'intervention s'il lui arrive de montrer des signes d'agressivité. La sécurité de notre équipe est une priorité absolue ; ainsi, si votre chien se montre agressif envers nos techniciens, nous vous demanderons de le rentrer." },
{ q: "Dans quelles régions intervenez-vous ?", a: "Pour le moment, Crotte&Go® intervient exclusivement à Bruxelles et dans le Brabant Wallon. Nous prévoyons d'étendre nos zones de service prochainement — restez à l'écoute !" },
];


const FAQSection = () =>
<section id="faq" className="py-20 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12">

        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Foire aux Questions</h2>
      </motion.div>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) =>
      <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl px-6 border border-border">
            <AccordionTrigger className="font-display font-bold text-foreground text-left">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
      )}
      </Accordion>
    </div>
  </section>;


export default FAQSection;