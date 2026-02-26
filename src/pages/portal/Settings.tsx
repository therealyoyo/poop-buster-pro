import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings as SettingsIcon, Key, Pause, Play, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const dayOptions: [string, string][] = [
  ["Lun", "monday"], ["Mar", "tuesday"], ["Mer", "wednesday"],
  ["Jeu", "thursday"], ["Ven", "friday"], ["Sam", "saturday"],
];

const ClientSettings = () => {
  const [gateEntryType, setGateEntryType] = useState("side_gate");
  const [gateCode, setGateCode] = useState("");
  const [gateInstructions, setGateInstructions] = useState("");
  const [pausedUntil, setPausedUntil] = useState<string | null>(null);
  const [pauseDate, setPauseDate] = useState<Date>();
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDay, setPreferredDay] = useState("");
  const [preferredDay2, setPreferredDay2] = useState("");
  const [serviceFrequency, setServiceFrequency] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const { data } = await supabase
        .from("clients")
        .select("id, first_name, last_name, email, phone, address, gate_entry_type, gate_code, gate_special_instructions, paused_until, preferred_day, preferred_day_2, service_frequency")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (data) {
        setClientId(data.id);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setGateEntryType(data.gate_entry_type || "side_gate");
        setGateCode(data.gate_code || "");
        setGateInstructions(data.gate_special_instructions || "");
        setPausedUntil(data.paused_until || null);
        setPreferredDay(data.preferred_day || "");
        setPreferredDay2(data.preferred_day_2 || "");
        setServiceFrequency(data.service_frequency || "");
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    const { error } = await supabase.from("clients").update({
      phone: phone || null,
    }).eq("id", clientId);
    if (error) toast.error("Erreur lors de la mise à jour.");
    else toast.success("Paramètres mis à jour ! 🐾");
  };

  const handleGateSave = async () => {
    if (!clientId) return;
    const { error } = await supabase.from("clients").update({
      gate_entry_type: gateEntryType,
      gate_code: gateCode || null,
      gate_special_instructions: gateInstructions || null,
    }).eq("id", clientId);
    if (error) toast.error("Erreur lors de la mise à jour.");
    else toast.success("Vos infos d'accès ont été mises à jour ! On briefera l'équipe. 🔑");
  };

  const handlePauseSave = async () => {
    if (!clientId || !pauseDate) return;
    const dateStr = format(pauseDate, "yyyy-MM-dd");
    const { error } = await supabase.from("clients").update({ paused_until: dateStr } as any).eq("id", clientId);
    if (error) toast.error("Erreur.");
    else { setPausedUntil(dateStr); toast.success("Service mis en pause ⏸"); }
  };

  const handleResume = async () => {
    if (!clientId) return;
    const { error } = await supabase.from("clients").update({ paused_until: null } as any).eq("id", clientId);
    if (error) toast.error("Erreur.");
    else { setPausedUntil(null); toast.success("Service repris ▶️"); }
  };

  const handleDaysSave = async () => {
    if (!clientId) return;
    const updates: any = { preferred_day: preferredDay };
    if (serviceFrequency === "twice_weekly") updates.preferred_day_2 = preferredDay2;
    const { error } = await supabase.from("clients").update(updates).eq("id", clientId);
    if (error) toast.error("Erreur lors de la sauvegarde.");
    else toast.success("Jours mis à jour ! Nous adapterons votre planning. 🐾");
  };

  const isTwiceWeekly = serviceFrequency === "twice_weekly";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <SettingsIcon className="w-7 h-7 text-primary" /> Paramètres du compte
        </h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card mb-6">
            <CardHeader><CardTitle className="font-display">Coordonnées</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Prénom</Label><Input value={firstName} disabled /></div>
                  <div className="space-y-1.5"><Label>Nom</Label><Input value={lastName} disabled /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Courriel</Label><Input type="email" value={email} disabled /></div>
                  <div className="space-y-1.5"><Label>Téléphone</Label><Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Adresse de service</Label><Input value={address} disabled /></div>
                <Button type="submit" variant="cta" className="rounded-full">Enregistrer les modifications</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferred Days */}
        {preferredDay !== undefined && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" /> Jours de passage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="h-16 bg-muted rounded-lg animate-pulse" />
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">Vos passages sont planifiés ces jours-là. Modifiez-les et nous adapterons le planning.</p>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">{isTwiceWeekly ? "Jour 1" : "Jour préféré"}</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {dayOptions.map(([label, val]) => (
                          <Button key={val} variant={preferredDay === val ? "default" : "outline"} size="sm" onClick={() => setPreferredDay(val)}>
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {isTwiceWeekly && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Jour 2</p>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {dayOptions
                            .filter(([, val]) => val !== preferredDay)
                            .map(([label, val]) => (
                              <Button key={val} variant={preferredDay2 === val ? "default" : "outline"} size="sm" onClick={() => setPreferredDay2(val)}>
                                {label}
                              </Button>
                            ))}
                        </div>
                      </div>
                    )}
                    <Button
                      variant="cta"
                      className="rounded-full"
                      onClick={handleDaysSave}
                      disabled={!preferredDay || (isTwiceWeekly && !preferredDay2) || !clientId}
                    >
                      Enregistrer mes jours
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Gate & Access */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" /> Accès au jardin
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
                  <div className="space-y-1.5"><Label>Code d'accès</Label><Input value={gateCode} onChange={e => setGateCode(e.target.value)} placeholder="ex. 4521" /></div>
                  <div className="space-y-1.5"><Label>Instructions spéciales d'accès</Label><Textarea value={gateInstructions} onChange={e => setGateInstructions(e.target.value)} placeholder="ex. Soulever le loquet et pousser" rows={3} /></div>
                  <Button variant="cta" className="rounded-full" onClick={handleGateSave} disabled={!clientId}>Enregistrer les infos d'accès</Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pause Service */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Pause className="w-5 h-5 text-primary" /> Pause du service ⏸
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="h-16 bg-muted rounded-lg animate-pulse" />
              ) : pausedUntil ? (
                <div className="space-y-3">
                  <div className="bg-accent/50 border border-primary/20 rounded-xl p-4">
                    <p className="text-sm font-medium">⏸ Votre service est en pause jusqu'au <strong>{format(new Date(pausedUntil), "d MMMM yyyy", { locale: fr })}</strong></p>
                  </div>
                  <Button variant="cta" className="rounded-full w-full" onClick={handleResume}>
                    <Play className="w-4 h-4" /> Reprendre le service ▶️
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("flex-1 justify-start", !pauseDate && "text-muted-foreground")}>
                          {pauseDate ? format(pauseDate, "PPP", { locale: fr }) : "Pause jusqu'au..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={pauseDate} onSelect={setPauseDate} disabled={(d) => d < new Date()} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <Button variant="cta" className="rounded-full" onClick={handlePauseSave} disabled={!pauseDate || !clientId}>
                      Sauver 💤
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground italic">Mettre en pause retire vos visites du planning. Les visites prévues pendant cette période seront annulées.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientSettings;
