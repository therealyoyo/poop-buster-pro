import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useClients, useUpdateClient } from "@/hooks/useClients";
import { useQuotes } from "@/hooks/useQuotes";
import PawIcon from "@/components/PawIcon";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import QuoteBuilderDrawer from "@/components/admin/QuoteBuilderDrawer";

const stages = [
  { key: "new", label: "New Lead 🐾" },
  { key: "quote_sent", label: "Quote Sent 📧" },
  { key: "active", label: "Active Client ✅" },
  { key: "inactive", label: "Inactive ⏸" },
];

const Pipeline = () => {
  const { data: clients = [] } = useClients();
  const { data: allQuotes = [] } = useQuotes("__all__"); // won't fire, we fetch per client below
  const updateClient = useUpdateClient();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [quoteClient, setQuoteClient] = useState<any>(null);

  const handleDrop = async (stage: string) => {
    if (!draggedId) return;
    try {
      const statusMap: Record<string, string> = { new: "prospect", quote_sent: "prospect", active: "active", inactive: "inactive" };
      await updateClient.mutateAsync({ id: draggedId, pipeline_stage: stage, status: statusMap[stage] || "prospect" });
      toast({ title: "Client déplacé !" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
    setDraggedId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/admin/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour CRM
        </Link>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
          <PawIcon className="w-6 h-6 text-primary" /> Pipeline Prospects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map(stage => {
            const stageClients = clients.filter(c => {
              if (stage.key === "active") return c.pipeline_stage === "active" && (c as any).is_recurring !== false;
              return c.pipeline_stage === stage.key;
            });
            return (
              <div
                key={stage.key}
                className="bg-muted/30 rounded-xl p-3 min-h-[300px]"
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm text-foreground">{stage.label}</h3>
                  <Badge variant="secondary">{stageClients.length}</Badge>
                </div>
                <div className="space-y-2">
                  {stageClients.map(c => (
                    <Card
                      key={c.id}
                      draggable
                      onDragStart={() => setDraggedId(c.id)}
                      className={`cursor-grab active:cursor-grabbing shadow-card hover:shadow-card-hover transition-all ${draggedId === c.id ? "opacity-50" : ""}`}
                    >
                      <CardContent className="p-3">
                        <Link to={`/admin/clients/${c.id}`} className="hover:underline">
                          <p className="font-medium text-sm text-foreground">{c.first_name} {c.last_name}</p>
                        </Link>
                        <p className="text-xs text-muted-foreground">{c.email || "—"}</p>
                        <p className="text-xs text-muted-foreground">{c.dog_count} 🐕 · {c.zone_name || "—"}</p>

                        {stage.key === "new" && (
                          <Button
                            variant="cta"
                            size="sm"
                            className="w-full mt-2 rounded-full text-xs"
                            onClick={(e) => { e.preventDefault(); setQuoteClient(c); }}
                          >
                            📋 Envoyer un devis
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quoteClient && (
        <QuoteBuilderDrawer
          open={!!quoteClient}
          onOpenChange={(open) => { if (!open) setQuoteClient(null); }}
          client={quoteClient}
        />
      )}
    </div>
  );
};

export default Pipeline;
