import { motion } from "framer-motion";
import { Shield, CheckCircle, Leaf } from "lucide-react";
import PawIcon from "@/components/PawIcon";

const promises = [
{
  icon: PawIcon,
  title: "Service Fiable & Sans Tracas",
  desc: "Notre service de ramassage vous garantit des passages ponctuels et sans tracas pour un jardin impeccable. Profitez de plus de temps avec votre chien pendant que nous nous occupons du reste !",
  isPaw: true
},
{
  icon: CheckCircle,
  title: "Satisfaction Garantie",
  desc: "Chez Crotte & Go®, nous garantissons votre entière satisfaction avec notre service de ramassage de déjections canines. Si vous n'êtes pas satisfait, on s'en occupe car votre tranquillité d'esprit est notre priorité.",
  isPaw: false
},
{
  icon: Leaf,
  title: "Engagement Santé & Sécurité",
  desc: "Crotte & Go® fait de la santé et de la sécurité sa priorité en utilisant des pratiques sanitaires et des méthodes d'élimination écoresponsables, garantissant ainsi un environnement propre et sûr pour les animaux et leurs familles.",
  isPaw: false
}];


const PromiseSection = () =>
<section className="py-20 bg-muted/50 paw-pattern">
    <div className="container mx-auto px-4">
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12">

        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Notre Engagement Client</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {promises.map((p, i) =>
      <motion.div
        key={p.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.15 }}
        className="bg-card rounded-2xl p-8 shadow-card text-center hover:shadow-card-hover transition-all hover:-translate-y-1">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-4">
              {p.isPaw ? <PawIcon className="w-7 h-7 text-accent-foreground" /> : <p.icon className="w-7 h-7 text-accent-foreground" />}
            </div>
            <h3 className="font-display font-bold text-foreground text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </motion.div>
      )}
      </div>
    </div>
  </section>;


export default PromiseSection;