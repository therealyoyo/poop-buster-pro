import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, History } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [pipelineHistory, setPipelineHistory] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("pipeline_history")
      .select("*")
      .eq("client_id", client.id)
      .order("changed_at", { ascending: false })
      .then(({ data }) => setPipelineHistory(data || []));
  }, [client.id]);

  const handlePipelineChange = async (stage: string) => {
    await onUpdateClient({ pipeline_stage: stage });
    toast({ title: "Pipeline mis à jour" });
    const { data } = await supabase.from("pipeline_history")
      .select("*")
      .eq("client_id", client.id)
      .order("changed_at", { ascending: false });
    setPipelineHistory(data || []);
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

          {pipelineHistory.length > 0 && (
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                <History className="w-3 h-3" /> Historique pipeline
              </p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {pipelineHistory.map((h: any) => (
                  <div key={h.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(new Date(h.changed_at), "d MMM HH:mm", { locale: fr })}</span>
                    <span>→</span>
                    <Badge variant="secondary" className="text-[10px]">{h.to_stage}</Badge>
                    {h.from_stage && <span className="text-[10px]">(depuis {h.from_stage})</span>}
                    <span className="text-[10px]">par {h.changed_by}</span>
                  </div>
                ))}
              </div>
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
  );
}
