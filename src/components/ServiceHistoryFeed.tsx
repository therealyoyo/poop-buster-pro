import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { Camera, Download, Share2, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Intervention } from "@/hooks/useInterventions";

interface ServiceHistoryFeedProps {
  interventions: Intervention[];
  isLoading: boolean;
}

const ServiceHistoryFeed = ({ interventions, isLoading }: ServiceHistoryFeedProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = interventions.find(i => i.id === selectedId);

  const grouped: Record<string, Intervention[]> = {};
  interventions.forEach(i => {
    const key = i.scheduled_date;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(i);
  });

  const handleShare = async (intervention: Intervention) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Crotte & Go - Service complété",
          text: intervention.completion_message || "Nettoyage complété !",
          url: intervention.photo_url || window.location.href,
        });
      } catch { /* user cancelled */ }
    }
  };

  const handleDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "service-photo.jpg";
    a.target = "_blank";
    a.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (interventions.length === 0) {
    return (
      <div className="text-center py-8">
        <PawIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Aucune visite pour le moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {format(new Date(date + "T12:00:00"), "EEEE d MMMM", { locale: fr })}
            </p>
            <div className="space-y-2">
              {items.map((intervention, i) => {
                const isDone = intervention.status === "completed";
                const message = intervention.completion_message || "";
                const truncated = message.length > 60 ? message.slice(0, 60) + "…" : message;

                return (
                  <motion.div
                    key={intervention.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card
                      className="shadow-card hover:shadow-card-hover transition-all cursor-pointer hover:-translate-y-0.5"
                      onClick={() => setSelectedId(intervention.id)}
                    >
                      <CardContent className="pt-3 pb-3 flex items-center gap-3">
                        {intervention.photo_url ? (
                          <img
                            src={intervention.photo_url}
                            alt="Service"
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                            <PawIcon className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-muted-foreground">
                              Tech : {intervention.tech_name || "Notre équipe"}
                            </span>
                            {isDone ? (
                              <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5">Complété ✅</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] px-1.5">Planifié 🗓️</Badge>
                            )}
                          </div>
                          {truncated && (
                            <p className="text-sm text-foreground truncate">{truncated}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Drawer open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="font-display">Détails de la visite</DrawerTitle>
            <DrawerDescription>
              {selected && format(new Date(selected.scheduled_date + "T12:00:00"), "EEEE d MMMM yyyy", { locale: fr })}
            </DrawerDescription>
          </DrawerHeader>
          {selected && (
            <div className="px-4 pb-6 space-y-4 overflow-y-auto">
              {selected.photo_url ? (
                <img src={selected.photo_url} alt="Service" className="w-full rounded-xl max-h-80 object-cover" />
              ) : (
                <div className="w-full h-48 rounded-xl bg-accent flex items-center justify-center">
                  <PawIcon className="w-16 h-16 text-primary/30" />
                </div>
              )}

              <div className="flex gap-2">
                {selected.photo_url && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(selected.photo_url!)}>
                      <Download className="w-4 h-4" /> Télécharger
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleShare(selected)}>
                      <Share2 className="w-4 h-4" /> Partager
                    </Button>
                  </>
                )}
              </div>

              {selected.completion_message && (
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">Message</p>
                  <p className="text-sm text-muted-foreground">{selected.completion_message}</p>
                </div>
              )}

              <div className="text-sm text-muted-foreground space-y-1">
                <p>Tech : {selected.tech_name || "Notre équipe"}</p>
                {selected.completed_at && (
                  <p>Complété : {format(new Date(selected.completed_at), "d MMM yyyy à HH:mm", { locale: fr })}</p>
                )}
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ServiceHistoryFeed;
