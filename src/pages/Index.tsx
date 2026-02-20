import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import OnboardingForm from "@/components/OnboardingForm";
import PawIcon from "@/components/PawIcon";
import heroImage from "@/assets/hero-yard.jpg";
import { CheckCircle, Shield, Leaf, Clock, Star } from "lucide-react";

const features = [
  { icon: Shield, title: "Reliable & Insured", desc: "Professional service you can count on every visit." },
  { icon: Leaf, title: "Eco-Friendly", desc: "Biodegradable products safe for your whole family." },
  { icon: Clock, title: "Flexible Scheduling", desc: "Weekly, bi-weekly, monthly, or one-time cleanups." },
  { icon: Star, title: "5-Star Rated", desc: "Loved by pet owners across the neighborhood." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Clean green yard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <PawIcon className="w-8 h-8 text-accent animate-paw-bounce" />
              <span className="font-display font-bold text-accent text-sm uppercase tracking-wider">Poop Buster</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-4">
              Your Yard, <br />Poop-Free & Fresh!
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg font-body">
              Professional dog poop scooping & yard deodorizing. We do the dirty work so you don't have to. 🐾
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#signup">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  <PawIcon className="w-5 h-5" />
                  Get My Free Cleanup
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                  Learn More
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> First cleanup free</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> No contracts</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 paw-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Pet Parents Love Us
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We take pride in keeping your yard clean, safe, and smelling fresh.
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
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-4">
                  <f.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-20 bg-muted/50">
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
            Poop Buster
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Poop Buster. Keeping yards clean, one scoop at a time. 🐾
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="/login" className="text-muted-foreground hover:text-primary transition-colors">Admin</a>
            <a href="/portal" className="text-muted-foreground hover:text-primary transition-colors">Client Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
