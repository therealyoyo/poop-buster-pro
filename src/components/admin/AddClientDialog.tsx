import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClient } from "@/hooks/useClients";
import { useServiceZones } from "@/hooks/useClients";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const AddClientDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { data: zones = [] } = useServiceZones();
  const createClient = useCreateClient();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", address: "",
    zone_id: null as string | null, dog_count: 1, garden_size: "",
    gate_code: "", status: "prospect", pipeline_stage: "new",
    service_frequency: null as string | null, internal_notes: "", user_id: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient.mutateAsync(form as any);
      toast({ title: "Client ajouté !" });
      onClose();
      setForm({ first_name: "", last_name: "", email: "", phone: "", address: "", zone_id: null, dog_count: 1, garden_size: "", gate_code: "", status: "prospect", pipeline_stage: "new", service_frequency: null, internal_notes: "", user_id: null });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'ajouter le client.", variant: "destructive" });
    }
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display">Nouveau client</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Prénom *</Label><Input required value={form.first_name} onChange={e => set("first_name", e.target.value)} /></div>
            <div><Label>Nom *</Label><Input required value={form.last_name} onChange={e => set("last_name", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Email</Label><Input type="email" value={form.email || ""} onChange={e => set("email", e.target.value)} /></div>
            <div><Label>Téléphone</Label><Input value={form.phone || ""} onChange={e => set("phone", e.target.value)} /></div>
          </div>
          <div><Label>Adresse</Label><Input value={form.address || ""} onChange={e => set("address", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Zone</Label>
              <Select value={form.zone_id || ""} onValueChange={v => set("zone_id", v || null)}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>{zones.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Nb chiens</Label><Input type="number" min={1} value={form.dog_count} onChange={e => set("dog_count", parseInt(e.target.value) || 1)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Taille jardin</Label>
              <Select value={form.garden_size || ""} onValueChange={v => set("garden_size", v || null)}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="petit">Petit</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="grand">Grand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Code portail</Label><Input value={form.gate_code || ""} onChange={e => set("gate_code", e.target.value)} /></div>
          </div>
          <div>
            <Label>Fréquence</Label>
            <Select value={form.service_frequency || ""} onValueChange={v => set("service_frequency", v || null)}>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="biweekly">Aux 2 semaines</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="one_time">Ponctuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Notes internes</Label><Textarea value={form.internal_notes || ""} onChange={e => set("internal_notes", e.target.value)} /></div>
          <Button type="submit" variant="cta" className="w-full" disabled={createClient.isPending}>
            {createClient.isPending ? "Ajout..." : "Ajouter le client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
