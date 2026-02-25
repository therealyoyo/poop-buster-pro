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
import { CheckCircle, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DogEntry {
  name: string;
  breed: string;
}

const OnboardingForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [gateEntryType, setGateEntryType] = useState("");
  const [dogs, setDogs] = useState<DogEntry[]>([{ name: "", breed: "" }]);
  const [submitting, setSubmitting] = useState(false);

  const addDog = () => setDogs([...dogs, { name: "", breed: "" }]);
  const removeDog = (index: number) => setDogs(dogs.filter((_, i) => i !== index));
  const updateDog = (index: number, field: keyof DogEntry, value: string) => {
    const updated = [...dogs];
    updated[index][field] = value;
    setDogs(updated);
  };

  const showAccessCode = gateEntryType === "garage_code" || gateEntryType === "side_gate";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const dogDetails = dogs.filter(d => d.name.trim() !== "");

    try {
      const insertData: Record<string, unknown> = {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("street") as string,
        dog_count: parseInt(formData.get("dogs") as string) || dogDetails.length || 1,
        garden_size: formData.get("gardenSize") as string,
        service_frequency: formData.get("frequency") as string,
        gate_entry_type: gateEntryType || null,
        gate_code: formData.get("accessCode") as string || null,
        gate_special_instructions: formData.get("gateInstructions") as string || null,
        dog_details: dogDetails,
        status: "prospect",
        pipeline_stage: "new",
      };
      const { error } = await supabase.from("clients").insert(insertData as any);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Bienvenue chez Crotte & Go ! 🐾 On vous contacte très vite.");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
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
              <Input id="firstName" name="firstName" placeholder="Jean" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" placeholder="Dupont" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Courriel</Label>
              <Input id="email" name="email" type="email" placeholder="jean@exemple.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+32 470 12 34 56" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="street">Adresse</Label>
            <Input id="street" name="street" placeholder="123 rue de la Loi" required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" placeholder="Bruxelles" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input id="postalCode" name="postalCode" placeholder="1000" required />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label htmlFor="dogs">Nombre de chiens</Label>
              <Select name="dogs" required>
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
              <Select name="gardenSize" required>
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
              <Select name="frequency" required>
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
            <Select name="source">
              <SelectTrigger><SelectValue placeholder="Choisir une option" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="referral">Recommandation</SelectItem>
                <SelectItem value="social">Réseaux sociaux</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gate & Access Info */}
          <div className="border-t border-border pt-5 space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">🔑 Accès au jardin</h3>

            <div className="space-y-1.5">
              <Label>Comment accédons-nous au jardin ?</Label>
              <Select value={gateEntryType} onValueChange={setGateEntryType} required>
                <SelectTrigger><SelectValue placeholder="Choisir un type d'accès" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="side_gate">Portail latéral</SelectItem>
                  <SelectItem value="garage_code">Code garage / porte</SelectItem>
                  <SelectItem value="front_gate">Portail avant</SelectItem>
                  <SelectItem value="always_open">Toujours ouvert</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showAccessCode && (
              <div className="space-y-1.5">
                <Label htmlFor="accessCode">Code d'accès ou instructions</Label>
                <Input id="accessCode" name="accessCode" placeholder="ex. 4521 ou 'soulever le loquet'" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="gateInstructions">Instructions spéciales</Label>
              <Textarea id="gateInstructions" name="gateInstructions" placeholder="ex. Attention à la planche branlante de la clôture, le chien est timide" rows={2} />
            </div>
          </div>

          {/* Dog Info */}
          <div className="border-t border-border pt-5 space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">🐕 Infos sur vos chiens</h3>
            {dogs.map((dog, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label>Nom</Label>
                  <Input value={dog.name} onChange={e => updateDog(i, "name", e.target.value)} placeholder="Rex" />
                </div>
                <div className="flex-1 space-y-1">
                  <Label>Race</Label>
                  <Input value={dog.breed} onChange={e => updateDog(i, "breed", e.target.value)} placeholder="Labrador" />
                </div>
                {dogs.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDog(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addDog}>
              <Plus className="w-4 h-4" /> Ajouter un chien 🐕
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea id="notes" name="notes" placeholder="Autre chose qu'on devrait savoir ?" rows={3} />
          </div>

          <Button type="submit" variant="cta" size="lg" className="w-full text-lg py-6" disabled={submitting}>
            <PawIcon className="w-5 h-5 mr-1" />
            {submitting ? "Envoi en cours..." : "Obtenir mon premier nettoyage gratuit !"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;
