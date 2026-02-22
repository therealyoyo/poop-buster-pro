import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { text: "Service impeccable, jardin toujours propre. Je recommande vivement !", author: "Marie D.", city: "Bruxelles" },
  { text: "Enfin un service fiable ! L'équipe est ponctuelle et professionnelle.", author: "Thomas L.", city: "Wavre" },
  { text: "Mes enfants peuvent jouer dans le jardin sans souci. Merci !", author: "Sophie M.", city: "Ottignies" },
];

const ReviewsSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Nos Clients Adorent le Service !
        </h2>
        <div className="flex justify-center items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-accent-foreground text-accent-foreground" />)}
          <span className="ml-2 text-muted-foreground font-display font-bold">5/5</span>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.map((r, i) => (
          <motion.div
            key={r.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent-foreground text-accent-foreground" />)}
            </div>
            <p className="text-muted-foreground italic mb-4">"{r.text}"</p>
            <p className="font-display font-bold text-foreground text-sm">— {r.author}, {r.city}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
