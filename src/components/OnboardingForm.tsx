import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PawIcon from "@/components/PawIcon";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const OnboardingForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Bienvenue chez Crotte & Go ! 🐾 On vous contacte très vite.");
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">C'est tout bon ! 🎉</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Merci pour votre inscription ! Nous vous contacterons rapidement pour planifier votre premier nettoyage gratuit. Le jardin de votre toutou va briller ! ✨
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <PawIcon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="font-display text-2xl">Obtenez votre premier nettoyage gratuit !</CardTitle>
        <CardDescription>Remplissez le formulaire et on s'occupe du reste 🐾</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" placeholder="Jean" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" placeholder="Dupont" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Courriel</Label>
              <Input id="email" type="email" placeholder="jean@exemple.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="+32 470 12 34 56" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="street">Adresse</Label>
            <Input id="street" placeholder="123 rue de la Loi" required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" placeholder="Bruxelles" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input id="postalCode" placeholder="1000" required />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label htmlFor="dogs">Nombre de chiens</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "chien" : "chiens"}</SelectItem>
                  ))}
                  <SelectItem value="6+">6+ chiens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Taille du jardin</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="xl">Très grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fréquence du service</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="À quelle fréquence ?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="biweekly">Aux 2 semaines</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="onetime">Ponctuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Comment avez-vous entendu parler de nous ?</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choisir une option" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="referral">Recommandation</SelectItem>
                <SelectItem value="social">Réseaux sociaux</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Instructions spéciales / Code de portail</Label>
            <Textarea id="notes" placeholder="Ex. : Code du portail #1234, les chiens sont gentils..." rows={3} />
          </div>

          <Button type="submit" variant="cta" size="lg" className="w-full text-lg py-6">
            <PawIcon className="w-5 h-5 mr-1" />
            Obtenir mon premier nettoyage gratuit !
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;
