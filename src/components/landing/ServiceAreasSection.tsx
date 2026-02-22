import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const areas = [
  { name: "Bruxelles", services: ["Ramassage résidentiel"] },
  { name: "Brabant Wallon", services: ["Ramassage résidentiel"] },
];

const ServiceAreasSection = () => (
  <section id="zones" className="py-20 bg-muted/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Zones Desservies</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Nous couvrons fièrement Bruxelles et le Brabant Wallon.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {areas.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center hover:shadow-card-hover transition-all"
          >
            <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-3">{a.name}</h3>
            
          </motion.div>
        ))}
      </div>


    </div>
  </section>
);

export default ServiceAreasSection;
