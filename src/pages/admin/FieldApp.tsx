import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { MapPin, Navigation, Camera, CheckCircle, Dog, Key, AlertTriangle, Loader2, Lock } from "lucide-react";
import { useInterventions, useCompleteIntervention, uploadInterventionPhoto } from "@/hooks/useInterventions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DogDetail { name: string; breed: string; }
interface ClientWithDetails {
  id: string; first_name: string; last_name: string; address: string | null;
  dog_count: number; dog_details: DogDetail[]; gate_entry_type: string | null;
  gate_code: string | null; gate_special_instructions: string | null; zone_id: string | null;
}

const FieldApp = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: interventions = [], isLoading } = useInterventions();
  const completeMutation = useCompleteIntervention();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [gateRevealed, setGateRevealed] = useState(false);
  const [gateClosedVerified, setGateClosedVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayInterventions = interventions.filter(i => i.scheduled_date === today);

  const { data: clients = [] } = useQuery({
    queryKey: ["field-clients"],
    queryFn: async () => {
      const clientIds = todayInterventions.map(i => i.client_id);
      if (clientIds.length === 0) return [];
      const { data, error } = await supabase
        .from("clients")
        .select("id, first_name, last_name, address, dog_count, dog_details, gate_entry_type, gate_code, gate_special_instructions, zone_id")
        .in("id", clientIds);
      if (error) throw error;
      return (data || []) as unknown as ClientWithDetails[];
    },
    enabled: todayInterventions.length > 0,
  });

  const { data: zones = [] } = useQuery({
    queryKey: ["field-zones"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_zones").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const getClient = (clientId: string) => clients.find(c => c.id === clientId);
  const getZone = (zoneId: string | null) => zones.find(z => z.id === zoneId);

  const selectedIntervention = todayInterventions.find(i => i.id === selectedJob);
  const selectedClient = selectedIntervention ? getClient(selectedIntervention.client_id) : null;

  const gateLabels: Record<string, string> = {
    side_gate: "Portail latéral", garage_code: "Code garage / porte",
    front_gate: "Portail avant", always_open: "Toujours ouvert", other: "Autre",
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleCompleteJob = async () => {
    if (!selectedIntervention || !selectedClient) return;
    setUploading(true);
    try {
      let photoUrl: string | undefined;
      if (photoFile) {
        photoUrl = await uploadInterventionPhoto(photoFile);
      }
      await completeMutation.mutateAsync({
        id: selectedIntervention.id,
        client_id: selectedIntervention.client_id,
        photo_url: photoUrl,
        completion_message: "Nettoyage terminé !",
      });

      // Insert service_log
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from("service_logs").insert({
        job_id: selectedIntervention.id,
        photo_url: photoUrl || null,
        gate_closed_verified: gateClosedVerified,
        tech_name: session?.user?.email || "Technicien",
        notes: null,
      });

      toast.success("Job terminé ! Photo uploadée dans le portail client. 🐾");
      setSelectedJob(null);
      setPhotoPreview(null);
      setPhotoFile(null);
      setGateRevealed(false);
      setGateClosedVerified(false);
    } catch {
      toast.error("Erreur lors de la complétion du job.");
    } finally {
      setUploading(false);
    }
  };

  const openDrawer = (id: string) => {
    setSelectedJob(id);
    setGateRevealed(false);
    setGateClosedVerified(false);
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const pendingJobs = todayInterventions.filter(i => i.status !== "completed");
  const doneJobs = todayInterventions.filter(i => i.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-6 h-6 text-primary" /> Route du jour
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })} — {pendingJobs.length} job{pendingJobs.length !== 1 ? "s" : ""} restant{pendingJobs.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : todayInterventions.length === 0 ? (
          <Card className="shadow-card"><CardContent className="py-12 text-center">
            <PawIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun job prévu aujourd'hui 🎉</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {[...pendingJobs, ...doneJobs].map((intervention, i) => {
              const client = getClient(intervention.client_id);
              const zone = client ? getZone(client.zone_id) : null;
              const isDone = intervention.status === "completed";
              const dogDetails = (client?.dog_details || []) as DogDetail[];
              return (
                <motion.div key={intervention.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className={`shadow-card transition-all ${isDone ? "opacity-60" : "hover:shadow-card-hover hover:-translate-y-0.5"}`}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-display font-bold text-foreground">{client ? `${client.first_name} ${client.last_name}` : "Client"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{client?.address || "Adresse non définie"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {zone && <Badge variant="outline" className="text-xs">{zone.name}</Badge>}
                          {isDone ? <Badge className="bg-accent text-accent-foreground">Terminé ✅</Badge> : <Badge variant="secondary">Planifié 🗓️</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Dog className="w-3 h-3" /> {client?.dog_count || 0} chien{(client?.dog_count || 0) > 1 ? "s" : ""}</span>
                        {dogDetails.length > 0 && <span>{dogDetails.map(d => d.name).join(", ")}</span>}
                      </div>
                      {!isDone && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { if (client?.address) window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`, "_blank"); }}>
                            <Navigation className="w-4 h-4" /> Naviguer
                          </Button>
                          <Button variant="cta" size="sm" className="flex-1 rounded-full" onClick={() => openDrawer(intervention.id)}>
                            Start Job 🚀
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Drawer open={!!selectedJob} onOpenChange={(open) => { if (!open) { setSelectedJob(null); setPhotoPreview(null); setPhotoFile(null); setGateRevealed(false); setGateClosedVerified(false); } }}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="font-display">{selectedClient ? `${selectedClient.first_name} ${selectedClient.last_name}` : "Job"}</DrawerTitle>
            <DrawerDescription>Infos d'accès et complétion du job</DrawerDescription>
          </DrawerHeader>

          {selectedClient && (
            <div className="px-4 pb-6 space-y-4 overflow-y-auto">
              {/* Gate Info - with blur reveal */}
              <div className="bg-accent/50 border border-primary/20 rounded-xl p-4 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg text-foreground">Accès</h3>
                </div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {gateLabels[selectedClient.gate_entry_type || "side_gate"] || selectedClient.gate_entry_type}
                </p>
                {selectedClient.gate_code && (
                  <div className="relative">
                    <p className={`text-2xl font-mono font-bold text-primary transition-all ${!gateRevealed ? "blur-md select-none" : ""}`}>
                      Code : {selectedClient.gate_code}
                    </p>
                    {!gateRevealed && (
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-accent/60 rounded-lg cursor-pointer"
                        onClick={() => setGateRevealed(true)}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Lock className="w-4 h-4" /> 🔓 Tap pour révéler
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {selectedClient.gate_special_instructions && (
                <div className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">Instructions spéciales</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedClient.gate_special_instructions}</p>
                </div>
              )}

              {((selectedClient.dog_details || []) as DogDetail[]).length > 0 && (
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-foreground flex items-center gap-1"><Dog className="w-4 h-4" /> Chiens</p>
                  {((selectedClient.dog_details || []) as DogDetail[]).map((d, i) => (
                    <p key={i} className="text-sm text-muted-foreground">🐕 {d.name} — {d.breed}</p>
                  ))}
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />

              {photoPreview ? (
                <div className="space-y-3">
                  <img src={photoPreview} alt="Preview" className="w-full rounded-xl max-h-64 object-cover" />

                  {/* Gate closed verified checkbox */}
                  <div className="flex items-start gap-3 bg-muted rounded-xl p-4">
                    <Checkbox
                      id="gate-closed"
                      checked={gateClosedVerified}
                      onCheckedChange={(c) => setGateClosedVerified(!!c)}
                    />
                    <label htmlFor="gate-closed" className="text-sm font-medium text-foreground cursor-pointer">
                      Gate closed and locked ✅
                    </label>
                  </div>

                  <Button
                    variant="cta"
                    className="w-full rounded-full py-6 text-lg"
                    onClick={handleCompleteJob}
                    disabled={uploading || !gateClosedVerified}
                  >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    {uploading ? "Upload en cours..." : "Upload & Terminer le job ✅"}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full py-6 text-lg" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-5 h-5" /> Prendre une photo 📷
                </Button>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FieldApp;
