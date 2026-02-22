import { motion } from "framer-motion";
import { Search, Shield, Monitor, FileText, Camera, Smartphone } from "lucide-react";

const reasons = [
  { icon: Search, title: "Employés Vérifiés", desc: "Notre équipe est soumise à des vérifications rigoureuses pour garantir une fiabilité et une confiance totales." },
  { icon: Shield, title: "Sécurité des Animaux", desc: "Nous nettoyons tout notre équipement et nos chaussures avec un désinfectant professionnel après chaque intervention, minimisant ainsi la propagation des germes et des maladies." },
  { icon: Monitor, title: "Portail Client", desc: "Profitez d'un service sans tracas grâce à votre propre portail client. Il vous permet de configurer des paiements automatiques, de suivre vos factures et de gérer vos services en ligne." },
  { icon: FileText, title: "Sans Contrat", desc: "Commencez, pausez ou annulez quand vous voulez." },
  { icon: Camera, title: "Photos des barrières", desc: "Après chaque visite, vous recevrez une photo de votre portail de jardin bien fermé, vous offrant une tranquillité d'esprit totale lorsque vos compagnons à quatre pattes retournent dans leur jardin propre" },
  { icon: Smartphone, title: "Notifications SMS", desc: "SMS 60 min avant l'arrivée + email de confirmation." },
];

const WhyChooseUsSection = () => (
  <section className="py-20 bg-background paw-pattern relative overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Pourquoi Choisir Crotte & Go ?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Avec notre garantie 100% satisfaction, vous avez fait le bon choix.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4">
              <r.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">{r.title}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>
      {/* Dog illustration bottom right */}
      <div className="hidden md:block absolute bottom-4 right-8 opacity-20">
        <svg viewBox="0 0 80 80" className="w-24 h-24" fill="none">
          <ellipse cx="40" cy="55" rx="25" ry="18" className="fill-primary" />
          <circle cx="40" cy="35" r="16" className="fill-primary" />
          <circle cx="35" cy="33" r="2" className="fill-primary-foreground" />
          <circle cx="45" cy="33" r="2" className="fill-primary-foreground" />
          <path d="M37 39 Q40 43 43 39" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;
