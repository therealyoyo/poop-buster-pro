import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dog, MapPin, Key, Ruler, Mail, Phone, Building, Tag, Pencil, Save, X, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface TabProfileProps {
  client: any;
  onUpdateClient: (data: any) => Promise<void>;
}

export default function TabProfile({ client, onUpdateClient }: TabProfileProps) {
  const [notes, setNotes] = useState(client.internal_notes || "");
  const [isEditingCoords, setIsEditingCoords] = useState(false);
  const [isSavingCoords, setIsSavingCoords] = useState(false);

  const [editEmail, setEditEmail] = useState(client.email || "");
  const [editPhone, setEditPhone] = useState(client.phone || "");
  const [editAddress, setEditAddress] = useState(
    client.address || `${client.street_number || ""} ${client.street_name || ""}`.trim() || ""
  );
  const [editPostalCode, setEditPostalCode] = useState(client.postal_code || "");
  const [editCity, setEditCity] = useState(client.city || "");

  useEffect(() => {
    setNotes(client.internal_notes || "");
    setEditEmail(client.email || "");
    setEditPhone(client.phone || "");
    setEditAddress(client.address || `${client.street_number || ""} ${client.street_name || ""}`.trim() || "");
    setEditPostalCode(client.postal_code || "");
    setEditCity(client.city || "");
  }, [client]);

  const handleSaveNotes = async () => {
    await onUpdateClient({ internal_notes: notes });
    toast({ title: "Notes sauvegardées ✓" });
  };

  const handleSaveCoords = async () => {
    setIsSavingCoords(true);
    try {
      await onUpdateClient({
        email: editEmail || null,
        phone: editPhone || null,
        address: editAddress || null,
        postal_code: editPostalCode || null,
        city: editCity || null,
      });
      toast({ title: "Coordonnées mises à jour ✓" });
      setIsEditingCoords(false);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setIsSavingCoords(false);
    }
  };

  const handleCancelCoords = () => {
    setEditEmail(client.email || "");
    setEditPhone(client.phone || "");
    setEditAddress(client.address || `${client.street_number || ""} ${client.street_name || ""}`.trim() || "");
    setEditPostalCode(client.postal_code || "");
    setEditCity(client.city || "");
    setIsEditingCoords(false);
  };

  const dogDetails = Array.isArray(client.dog_details) ? client.dog_details : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Coordonnées — éditables */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base">Coordonnées</CardTitle>
            {!isEditingCoords ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingCoords(true)}>
                <Pencil className="w-3.5 h-3.5 mr-1" /> Modifier
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="default" size="sm" onClick={handleSaveCoords} disabled={isSavingCoords}>
                  <Save className="w-3.5 h-3.5 mr-1" /> {isSavingCoords ? "..." : "Sauvegarder"}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelCoords}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!isEditingCoords ? (
            <>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> <span>{client.email || "—"}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> <span>{client.phone || "—"}</span></div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <span>{client.address || `${client.street_number || ""} ${client.street_name || ""}`.trim() || "—"}</span>
                  {(client.postal_code || client.city) && (
                    <p className="text-xs text-muted-foreground">{[client.postal_code, client.city].filter(Boolean).join(" ")}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="email@exemple.com" className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Téléphone</Label>
                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="0470 12 34 56" className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Adresse</Label>
                <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="123 rue de la Paix" className="h-8 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Code postal</Label>
                  <Input value={editPostalCode} onChange={e => setEditPostalCode(e.target.value)} placeholder="1000" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Ville</Label>
                  <Input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Bruxelles" className="h-8 text-sm" />
                </div>
              </div>
            </div>
          )}

          {client.company && <div className="flex items-center gap-2"><Building className="w-4 h-4 text-muted-foreground" /> <span>{client.company}</span></div>}
          <div className="flex items-center gap-2"><Ruler className="w-4 h-4 text-muted-foreground" /> <span>Jardin: {client.garden_size || "—"}</span></div>
          <div className="flex items-center gap-2"><Key className="w-4 h-4 text-muted-foreground" /> <span>Code portail: {client.gate_code || "—"}</span></div>
          {client.gate_entry_type && <p className="text-muted-foreground text-xs">Entrée: {client.gate_entry_type} {client.gate_location ? `(${client.gate_location})` : ""}</p>}
          {client.gate_special_instructions && <p className="text-muted-foreground text-xs">📋 {client.gate_special_instructions}</p>}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><Dog className="w-4 h-4 text-primary" /> Chiens ({client.dog_count})</CardTitle></CardHeader>
          <CardContent>
            {dogDetails.length > 0 ? (
              <div className="space-y-2">
                {dogDetails.map((d: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                    <span className="text-lg">🐕</span>
                    <div>
                      <p className="font-medium">{d.name || `Chien ${i + 1}`}</p>
                      {d.breed && <p className="text-xs text-muted-foreground">{d.breed}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{client.dog_count} chien(s) — pas de détails</p>
            )}
          </CardContent>
        </Card>

        {/* Commentaires du formulaire de devis */}
        {client.additional_comments && (
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Commentaires du devis</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.additional_comments}</p>
            </CardContent>
          </Card>
        )}

        {client.tags?.length > 0 && (
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Tags</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-base">Notes internes</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes visibles uniquement par l'équipe..." />
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleSaveNotes}>Sauvegarder</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
