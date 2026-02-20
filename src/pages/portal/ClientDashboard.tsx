import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { Calendar, DollarSign, Leaf, Star, MapPin, Dog } from "lucide-react";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-7 h-7 text-primary animate-paw-bounce" />
            Bonjour, Sophie ! 🐾
          </h1>
          <p className="text-muted-foreground mt-1">Voici un résumé de votre service.</p>
        </motion.div>

        {/* Fun Stats Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-hero-gradient text-primary-foreground shadow-card mb-8 overflow-hidden relative paw-pattern-dense">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
              <PawIcon className="w-full h-full" />
            </div>
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" />
                <h2 className="font-display text-xl font-bold">Votre bilan de cour</h2>
              </div>
              <p className="text-primary-foreground/90 text-lg">
                Votre cour a été nettoyée <span className="font-bold text-primary-foreground">47 fois</span> cette année ! C'est plus de <span className="font-bold text-primary-foreground">43 kg</span> de crottes qu'on a ramassées ! 💪🐕
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Votre plan de service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fréquence</span>
                  <span className="font-medium text-foreground">Hebdomadaire</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochaine visite</span>
                  <span className="font-medium text-foreground">22 fév. 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Dog className="w-4 h-4" /> Chiens</span>
                  <span className="font-medium text-foreground">2 chiens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Leaf className="w-4 h-4" /> Désodorisation</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">Active ✅</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> Adresse</span>
                  <span className="text-sm text-foreground">123 rue des Chênes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Résumé de facturation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coût mensuel</span>
                  <span className="font-bold text-foreground text-lg">180 $/mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ramassage</span>
                  <span className="text-foreground">150 $</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Désodorisation</span>
                  <span className="text-foreground">30 $</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochaine facture</span>
                  <span className="text-foreground">1 mars 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paiement</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">Tout payé ✅</span>
                </div>
                <Link to="/portal/invoices">
                  <Button variant="outline" size="sm" className="w-full mt-2">Voir toutes les factures →</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Dernières visites de service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "15 fév. 2026", notes: "Nettoyage complet + désodorisation ✨", tech: "Marc" },
                { date: "8 fév. 2026", notes: "Nettoyage régulier, code du portail OK 🐾", tech: "Marc" },
                { date: "1 fév. 2026", notes: "Nettoyage complet + désodo, attention particulière à la cour arrière", tech: "Julie" },
                { date: "25 jan. 2026", notes: "Nettoyage hebdomadaire régulier 🐕", tech: "Marc" },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-sm">{v.date}</p>
                    <p className="text-xs text-muted-foreground">{v.notes}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Tech : {v.tech}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
