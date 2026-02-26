import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

const quoteStatusLabels: Record<string, string> = {
  draft: "Brouillon", sent: "Envoyé", accepted: "Accepté", declined: "Refusé",
};
const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel" };

interface TabQuotesProps {
  quotes: any[];
}

export default function TabQuotes({ quotes }: TabQuotesProps) {
  const [viewQuoteId, setViewQuoteId] = useState<string | null>(null);
  const viewedQuote = quotes.find(q => q.id === viewQuoteId);

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Devis ({quotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun devis</p>
          ) : (
            <div className="space-y-2">
              {quotes.map(q => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{format(new Date(q.created_at), "d MMM yyyy", { locale: fr })}</p>
                    <p className="text-xs text-muted-foreground">{freqLabels[q.frequency] || q.frequency} · {q.dog_count} 🐕</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold">€{Number(q.total_price).toFixed(2)}</span>
                    <Badge variant={q.status === "accepted" ? "default" : "secondary"}>
                      {quoteStatusLabels[q.status] || q.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setViewQuoteId(q.id)}>Voir</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Drawer open={!!viewQuoteId} onOpenChange={(open) => { if (!open) setViewQuoteId(null); }}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="font-display">Détails du devis</DrawerTitle>
            <DrawerDescription>Consultation en lecture seule</DrawerDescription>
          </DrawerHeader>
          {viewedQuote && (
            <div className="px-4 pb-6 space-y-3 overflow-y-auto">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={viewedQuote.status === "accepted" ? "default" : "secondary"}>{quoteStatusLabels[viewedQuote.status]}</Badge>
              </div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Jardin</span><span>{viewedQuote.garden_size}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Chiens</span><span>{viewedQuote.dog_count}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fréquence</span><span>{freqLabels[viewedQuote.frequency]}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Base</span><span>€{Number(viewedQuote.base_price).toFixed(2)}</span></div>
              {Array.isArray(viewedQuote.line_items) && viewedQuote.line_items.map((li: any, i: number) => (
                <div key={i} className="flex justify-between text-sm"><span className="text-muted-foreground">{li.label}</span><span>€{li.price.toFixed(2)}</span></div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>Total</span><span>€{Number(viewedQuote.total_price).toFixed(2)}</span>
              </div>
              {viewedQuote.accepted_at && (
                <p className="text-xs text-muted-foreground">Accepté le {format(new Date(viewedQuote.accepted_at), "d MMM yyyy", { locale: fr })} par {viewedQuote.accepted_by_name}</p>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
