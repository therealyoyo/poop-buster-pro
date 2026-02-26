import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const pipelineStages = [
  { value: "new", label: "Nouveau lead", emoji: "🐾" },
  { value: "new_lead", label: "Nouveau lead", emoji: "🐾" },
  { value: "qualified_lead", label: "Qualifié", emoji: "🏷️" },
  { value: "quote_sent", label: "Devis envoyé", emoji: "📧" },
  { value: "active", label: "Actif", emoji: "✅" },
  { value: "inactive", label: "Inactif", emoji: "⏸" },
  { value: "winback", label: "Winback", emoji: "🔄" },
];

interface TabCRMProps {
  client: any;
  onUpdateClient: (data: any) => Promise<void>;
}

export default function TabCRM({ client, onUpdateClient }: TabCRMProps) {
  const [followUpDate, setFollowUpDate] = useState(client.follow_up_date || "");

  const handlePipelineChange = async (stage: string) => {
    await onUpdateClient({ pipeline_stage: stage });
    toast({ title: "Pipeline mis à jour" });
  };

  const handleFollowUp = async () => {
    if (!followUpDate) return;
    await onUpdateClient({ follow_up_date: followUpDate });
    toast({ title: "Date de suivi enregistrée" });
  };

  const handleClearFollowUp = async () => {
    await onUpdateClient({ follow_up_date: null });
    setFollowUpDate("");
    toast({ title: "Suivi supprimé" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" /> Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pipelineStages.filter((s, i, a) => a.findIndex(x => x.value === s.value) === i).map(stage => (
              <button
                key={stage.value}
                onClick={() => handlePipelineChange(stage.value)}
                className={`text-center p-3 rounded-xl transition-all text-sm ${
                  client.pipeline_stage === stage.value
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                    : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                <span className="text-lg">{stage.emoji}</span>
                <p className="text-xs font-medium mt-1">{stage.label}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Suivi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
              <Button size="sm" onClick={handleFollowUp} disabled={!followUpDate}>📞 Planifier</Button>
            </div>
            {client.follow_up_date && (
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <span className="text-sm">📞 Suivi le {format(new Date(client.follow_up_date), "d MMM yyyy", { locale: fr })}</span>
                <Button variant="ghost" size="sm" onClick={handleClearFollowUp}>✕</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-base">Infos CRM</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span>{client.lead_source || client.referral_source || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Créé le</span><span>{format(new Date(client.created_at), "d MMM yyyy", { locale: fr })}</span></div>
            {client.last_interaction_at && (
              <div className="flex justify-between"><span className="text-muted-foreground">Dernière interaction</span><span>{format(new Date(client.last_interaction_at), "d MMM yyyy", { locale: fr })}</span></div>
            )}
            {client.winback_sent_at && (
              <div className="flex justify-between"><span className="text-muted-foreground">Winback envoyé</span><span>{format(new Date(client.winback_sent_at), "d MMM yyyy", { locale: fr })}</span></div>
            )}
            {client.inactivated_at && (
              <div className="flex justify-between"><span className="text-muted-foreground">Inactivé le</span><span>{format(new Date(client.inactivated_at), "d MMM yyyy", { locale: fr })}</span></div>
            )}
            {client.promo_code && <div className="flex justify-between"><span className="text-muted-foreground">Code promo</span><Badge variant="secondary">{client.promo_code}</Badge></div>}
            {client.referral_code && <div className="flex justify-between"><span className="text-muted-foreground">Code parrainage</span><Badge variant="secondary">{client.referral_code}</Badge></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
