import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const ClientSettings = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paramètres mis à jour ! 🐾");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <SettingsIcon className="w-7 h-7 text-primary" />
          Paramètres du compte
        </h1>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Coordonnées</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Prénom</Label>
                  <Input defaultValue="Sophie" />
                </div>
                <div className="space-y-1.5">
                  <Label>Nom</Label>
                  <Input defaultValue="Tremblay" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Courriel</Label>
                  <Input type="email" defaultValue="sophie@courriel.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input type="tel" defaultValue="(514) 123-4567" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Adresse de service</Label>
                <Input defaultValue="123 rue des Chênes, Montréal, H2X 1Y4" />
              </div>
              <div className="space-y-1.5">
                <Label>Instructions spéciales / Code de portail</Label>
                <Textarea defaultValue="Code du portail #1234. Les chiens sont gentils, généralement dans le jardin arrière." rows={3} />
              </div>
              <Button type="submit" variant="cta" className="rounded-full">Enregistrer les modifications</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSettings;
