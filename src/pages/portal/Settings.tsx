import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Key } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const ClientSettings = () => {
  const [gateEntryType, setGateEntryType] = useState("side_gate");
  const [gateCode, setGateCode] = useState("");
  const [gateInstructions, setGateInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const { data } = await supabase
        .from("clients")
        .select("id, gate_entry_type, gate_code, gate_special_instructions")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (data) {
        setClientId(data.id);
        setGateEntryType(data.gate_entry_type || "side_gate");
        setGateCode(data.gate_code || "");
        setGateInstructions(data.gate_special_instructions || "");
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paramètres mis à jour ! 🐾");
  };

  const handleGateSave = async () => {
    if (!clientId) return;
    const { error } = await supabase.from("clients").update({
      gate_entry_type: gateEntryType,
      gate_code: gateCode || null,
      gate_special_instructions: gateInstructions || null,
    }).eq("id", clientId);
    if (error) {
      toast.error("Erreur lors de la mise à jour.");
    } else {
      toast.success("Vos infos d'accès ont été mises à jour ! On briefera l'équipe. 🔑");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <SettingsIcon className="w-7 h-7 text-primary" />
          Paramètres du compte
        </h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card mb-6">
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
        </motion.div>

        {/* Gate & Access Self-Service */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Accès au jardin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label>Type d'accès</Label>
                    <Select value={gateEntryType} onValueChange={setGateEntryType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="side_gate">Portail latéral</SelectItem>
                        <SelectItem value="garage_code">Code garage / porte</SelectItem>
                        <SelectItem value="front_gate">Portail avant</SelectItem>
                        <SelectItem value="always_open">Toujours ouvert</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Code d'accès</Label>
                    <Input value={gateCode} onChange={e => setGateCode(e.target.value)} placeholder="ex. 4521" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Instructions spéciales d'accès</Label>
                    <Textarea value={gateInstructions} onChange={e => setGateInstructions(e.target.value)} placeholder="ex. Soulever le loquet et pousser" rows={3} />
                  </div>

                  <Button variant="cta" className="rounded-full" onClick={handleGateSave} disabled={!clientId}>
                    Enregistrer les infos d'accès
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientSettings;
