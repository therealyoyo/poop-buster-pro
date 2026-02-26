import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useClients, useUpdateClient } from "@/hooks/useClients";
import PawIcon from "@/components/PawIcon";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import QuoteBuilderDrawer from "@/components/admin/QuoteBuilderDrawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const stages = [
  { key: "new_lead", label: "New Lead 🐾", color: "bg-amber-500/10 border-amber-500/30" },
  { key: "qualified_lead", label: "Qualified 🏷️", color: "bg-blue-500/10 border-blue-500/30" },
  { key: "quote_sent", label: "Quote Sent 📧", color: "bg-purple-500/10 border-purple-500/30" },
  { key: "active", label: "Active ✅", color: "bg-green-500/10 border-green-500/30" },
  { key: "inactive", label: "Inactive ⏸", color: "bg-muted border-border" },
  { key: "winback", label: "Win-Back 🔄", color: "bg-orange-500/10 border-orange-500/30" },
];

const stageStatusMap: Record<string, string> = {
  new_lead: "prospect", new: "prospect", qualified_lead: "prospect", quote_sent: "prospect",
  active: "active", inactive: "inactive", winback: "inactive",
};

const Pipeline = () => {
  const { data: clients = [] } = useClients();
  const updateClient = useUpdateClient();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [quoteClient, setQuoteClient] = useState<any>(null);

  const handleDrop = async (stage: string) => {
    if (!draggedId) return;
    try {
      await updateClient.mutateAsync({
        id: draggedId,
        pipeline_stage: stage,
        status: stageStatusMap[stage] || "prospect",
      });
      toast({ title: "Client déplacé !" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
    setDraggedId(null);
  };

  // Map old "new" stage to "new_lead" for display
  const getStageClients = (stageKey: string) => {
    return clients.filter(c => {
      const ps = c.pipeline_stage;
      if (stageKey === "new_lead") return ps === "new_lead" || ps === "new";
      return ps === stageKey;
    });
  };

  // Out of zone clients
  const outOfZoneClients = clients.filter(c => c.pipeline_stage === "out_of_zone" || (c as any).out_of_zone);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {stages.map(stage => {
            const stageClients = getStageClients(stage.key);
            return (
              <div
                key={stage.key}
                className={`rounded-xl p-3 min-h-[300px] border ${stage.color}`}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-xs text-foreground">{stage.label}</h3>
                  <Badge variant="secondary" className="text-xs">{stageClients.length}</Badge>
                </div>
                <div className="space-y-2">
                  {stageClients.map(c => {
                    const tags = (c as any).tags as string[] | null;
                    const isB2B = tags?.includes("b2b") || !!(c as any).company;
                    const isDuplicate = (c as any).is_duplicate;
                    const lastInteraction = (c as any).last_interaction_at;
                    const daysSince = lastInteraction
                      ? formatDistanceToNow(new Date(lastInteraction), { locale: fr, addSuffix: true })
                      : null;
                    const isUrgent = stage.key === "new_lead" && lastInteraction &&
                      (Date.now() - new Date(lastInteraction).getTime()) > 24 * 60 * 60 * 1000;

                    return (
                      <Card
                        key={c.id}
                        draggable
                        onDragStart={() => setDraggedId(c.id)}
                        className={`cursor-grab active:cursor-grabbing shadow-card hover:shadow-card-hover transition-all ${draggedId === c.id ? "opacity-50" : ""} ${isUrgent ? "border-l-4 border-l-orange-500" : ""}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <Link to={`/admin/clients/${c.id}`} className="hover:underline flex-1">
                              <p className="font-medium text-sm text-foreground">{c.first_name} {c.last_name}</p>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="w-3 h-3" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link to={`/admin/clients/${c.id}`}>Voir fiche</Link></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{c.email || "—"}</p>
                          <p className="text-xs text-muted-foreground">{c.phone || "—"}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {isB2B && <Badge variant="outline" className="text-[10px] px-1 py-0 border-blue-500 text-blue-600">B2B</Badge>}
                            {!isB2B && <Badge variant="outline" className="text-[10px] px-1 py-0 border-green-500 text-green-600">B2C</Badge>}
                            {isDuplicate && <Badge variant="destructive" className="text-[10px] px-1 py-0">DOUBLON</Badge>}
                            {tags?.includes("newsletter") && <Badge variant="secondary" className="text-[10px] px-1 py-0">Newsletter</Badge>}
                          </div>
                          {daysSince && <p className="text-[10px] text-muted-foreground mt-1">{daysSince}</p>}
                          <p className="text-xs text-muted-foreground">{c.dog_count} 🐕</p>

                          {(stage.key === "new_lead" || stage.key === "qualified_lead" || stage.key === "new") && (
                            <Button
                              variant="cta"
                              size="sm"
                              className="w-full mt-2 rounded-full text-xs"
                              onClick={(e) => { e.preventDefault(); setQuoteClient(c); }}
                            >
                              📋 Créer devis
                            </Button>
                          )}
                          {stage.key === "quote_sent" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2 rounded-full text-xs"
                              onClick={(e) => { e.preventDefault(); /* TODO: relance */ }}
                            >
                              📧 Relancer
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Out of Zone Section */}
        {outOfZoneClients.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-4">
              📍 Hors Zone <Badge variant="secondary">{outOfZoneClients.length}</Badge>
            </h2>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="space-y-2">
                {outOfZoneClients.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">{c.first_name} {c.last_name}</p>
                      <p className="text-xs text-muted-foreground">{c.email} · {c.phone || "—"}</p>
                      <p className="text-xs text-muted-foreground">{(c as any).postal_code || "—"}</p>
                    </div>
                    <div className="flex gap-2">
                      {(c as any).company && <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">B2B</Badge>}
                      <Link to={`/admin/clients/${c.id}`}>
                        <Button variant="ghost" size="sm">Voir</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
