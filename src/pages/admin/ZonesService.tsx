import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useZonesService, useAddPostalCode, useDeletePostalCode, useToggleZone } from "@/hooks/useZonesService";
import { X, Plus, MapPin, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const zones = ["Bruxelles", "Brabant Wallon"];

const ZonesService = () => {
  const { data: allZones = [], isLoading } = useZonesService();
  const addPostalCode = useAddPostalCode();
  const deletePostalCode = useDeletePostalCode();
  const toggleZone = useToggleZone();
  const [newCodes, setNewCodes] = useState<Record<string, string>>({ Bruxelles: "", "Brabant Wallon": "" });

  const handleAdd = async (zone: string) => {
    const code = newCodes[zone]?.trim();
    if (!code) return;
    if (allZones.some(z => z.code_postal === code && z.zone === zone)) {
      toast.error("Ce code postal existe déjà dans cette zone.");
      return;
    }
    try {
      await addPostalCode.mutateAsync({ code_postal: code, zone });
      setNewCodes(prev => ({ ...prev, [zone]: "" }));
      toast.success(`Code postal ${code} ajouté.`);
    } catch {
      toast.error("Erreur lors de l'ajout.");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    try {
      await deletePostalCode.mutateAsync(id);
      toast.success(`Code postal ${code} supprimé.`);
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleToggleZone = async (zone: string, currentlyActive: boolean) => {
    try {
      await toggleZone.mutateAsync({ zone, actif: !currentlyActive });
      toast.success(`Zone ${zone} ${!currentlyActive ? "activée" : "désactivée"}.`);
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Zones de service
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {zones.map(zone => {
            const zoneItems = allZones.filter(z => z.zone === zone);
            const activeItems = zoneItems.filter(z => z.actif);
            const isZoneActive = activeItems.length > 0;

            return (
              <Card key={zone}>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg">{zone}</CardTitle>
                  <Button
                    variant={isZoneActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleZone(zone, isZoneActive)}
                    disabled={toggleZone.isPending}
                  >
                    {isZoneActive ? <><PowerOff className="w-4 h-4 mr-1" /> Désactiver</> : <><Power className="w-4 h-4 mr-1" /> Activer</>}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {zoneItems.map(z => (
                      <Badge
                        key={z.id}
                        variant={z.actif ? "default" : "secondary"}
                        className="gap-1 pr-1"
                      >
                        {z.code_postal}
                        <button
                          onClick={() => handleDelete(z.id, z.code_postal)}
                          className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {zoneItems.length === 0 && (
                      <p className="text-sm text-muted-foreground">Aucun code postal.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nouveau code postal"
                      value={newCodes[zone]}
                      onChange={(e) => setNewCodes(prev => ({ ...prev, [zone]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd(zone)}
                      maxLength={5}
                      className="max-w-[180px]"
                    />
                    <Button size="sm" onClick={() => handleAdd(zone)} disabled={addPostalCode.isPending}>
                      <Plus className="w-4 h-4 mr-1" /> Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {allZones.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(z => (
                <p key={z.id} className="text-sm text-muted-foreground">
                  Code postal <span className="font-medium text-foreground">{z.code_postal}</span> ({z.zone}) ajouté le {format(new Date(z.created_at), "dd/MM/yyyy", { locale: fr })}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZonesService;
