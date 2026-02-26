import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dog, MapPin, Key, Ruler, Mail, Phone, Building, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface TabProfileProps {
  client: any;
  onUpdateClient: (data: any) => Promise<void>;
}

export default function TabProfile({ client, onUpdateClient }: TabProfileProps) {
  const [notes, setNotes] = useState(client.internal_notes || "");

  useEffect(() => {
    setNotes(client.internal_notes || "");
  }, [client.internal_notes]);

  const handleSaveNotes = async () => {
    await onUpdateClient({ internal_notes: notes });
    toast({ title: "Notes sauvegardées" });
  };

  const dogDetails = Array.isArray(client.dog_details) ? client.dog_details : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-display text-base">Coordonnées</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> <span>{client.email || "—"}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> <span>{client.phone || "—"}</span></div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <span>{client.address || `${client.street_number || ""} ${client.street_name || ""}`.trim() || "—"}</span>
              {(client.postal_code || client.city) && (
                <p className="text-xs text-muted-foreground ml-0">{[client.postal_code, client.city].filter(Boolean).join(" ")}</p>
              )}
            </div>
          </div>
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
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes..." />
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleSaveNotes}>Sauvegarder</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
