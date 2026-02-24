import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Trees,
  Dog,
  Hotel,
  Tent,
  Landmark,
  CheckCircle,
  ArrowRight } from
"lucide-react";
import PawIcon from "@/components/PawIcon";

const sectors = [
{ icon: Building2, label: "Copropriétés & Syndics" },
{ icon: Landmark, label: "Communes & Services publics" },
{ icon: Trees, label: "Parcs & Espaces verts" },
{ icon: Dog, label: "Centres & Éducateurs canins" },
{ icon: Hotel, label: "Hôtels & Gîtes" },
{ icon: Tent, label: "Campings & Villages vacances" }];


const advantages = [
"Plans sur mesure adaptés à la taille et la fréquence de vos besoins",
"Visites régulières programmées (quotidiennes, hebdomadaires, etc.)",
"Réactivité et flexibilité pour les événements ponctuels",
"Amélioration de l'image de marque de vos espaces",
"Réduction des risques sanitaires pour vos visiteurs et résidents",
"Facturation claire et professionnelle"];


const CommercialSection = () =>
<section id="commercial" className="py-20 bg-hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 paw-pattern-dense opacity-20" />
    <div className="container mx-auto px-4 max-w-5xl relative z-10">
      {/* Header */}
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16">

        <span className="font-display font-bold text-secondary text-sm uppercase tracking-widest mb-2 block">
          Service Professionnel & B2B
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
          Ramassage de Déjections Canines pour les Professionnels
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">Vous gérez un espace accueillant des chiens ? Crotte&Go propose un service professionnel de ramassage de déjections canines pour garantir la propreté, l'hygiène et le confort de vos espaces extérieurs : pour vos clients, résidents et visiteurs.



      </p>
      </motion.div>

      {/* Sectors grid */}
      <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-display text-2xl font-bold text-white text-center mb-8">

        Secteurs que Nous Accompagnons
      </motion.h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
        {sectors.map((s, i) =>
      <motion.div
        key={s.label}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-white/15 transition-all">

            <s.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-white font-display font-bold text-sm">{s.label}</p>
          </motion.div>
      )}
      </div>

      {/* Advantages + CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}>

          <h3 className="font-display text-2xl font-bold text-white mb-6">
            Les Avantages de Notre Service Commercial
          </h3>
          <ul className="space-y-3">
            {advantages.map((a) =>
          <li key={a} className="flex items-start gap-3 text-white/90">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <span>{a}</span>
              </li>
          )}
          </ul>
        </motion.div>

        <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">

          <Building2 className="w-14 h-14 text-secondary mx-auto mb-4" />
          <h4 className="font-display text-xl font-bold text-white mb-3">
            Devis Commercial Sur Mesure
          </h4>
          <p className="text-white/80 mb-6">
            Chaque espace est unique. Contactez-nous pour recevoir une offre personnalisée 
            adaptée à vos besoins et à la superficie de vos espaces.
          </p>
          <a href="#signup">
            <Button variant="cta" size="lg" className="rounded-full px-8">
              <PawIcon className="w-5 h-5" /> Demander un devis B2B
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  </section>;


export default CommercialSection;