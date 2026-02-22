import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { CheckCircle } from "lucide-react";

const stats = [
  { icon: "🐾", value: "500+", label: "Clients Satisfaits" },
  { icon: "🐕", value: "800+", label: "Chiens Heureux" },
  { icon: "✅", value: "5 000+", label: "Jardins Nettoyés" },
];

const StatsSection = () => (
  <section className="py-16 bg-foreground">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <span className="text-4xl mb-2 block">{s.icon}</span>
            <p className="font-display text-4xl md:text-5xl font-black text-primary-foreground mb-1">{s.value}</p>
            <p className="text-primary-foreground/70 font-display font-bold text-sm uppercase tracking-widest">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
