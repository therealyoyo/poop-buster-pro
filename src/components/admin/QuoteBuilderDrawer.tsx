import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { usePricingRules, findMatchingPrice } from "@/hooks/usePricingRules";
import { useCreateQuote, type LineItem } from "@/hooks/useQuotes";
import { useUpdateClient } from "@/hooks/useClients";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuoteBuilderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    garden_size: string | null;
    dog_count: number;
    service_frequency: string | null;
  };
}

const gardenLabels: Record<string, string> = { small: "Petit", medium: "Moyen", large: "Grand", xl: "Très grand" };
const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel" };

const QuoteBuilderDrawer = ({ open, onOpenChange, client }: QuoteBuilderDrawerProps) => {
  const { data: rules = [] } = usePricingRules();
  const createQuote = useCreateQuote();
  const updateClient = useUpdateClient();

  const [gardenSize, setGardenSize] = useState(client.garden_size || "medium");
  const [dogCount, setDogCount] = useState(client.dog_count || 1);
  const [frequency, setFrequency] = useState(client.service_frequency || "weekly");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [manualPrice, setManualPrice] = useState<number | null>(null);

  useEffect(() => {
    setGardenSize(client.garden_size || "medium");
    setDogCount(client.dog_count || 1);
    setFrequency(client.service_frequency || "weekly");
    setLineItems([]);
    setAdminNotes("");
    setManualPrice(null);
  }, [client.id, open]);

  const matchedRule = findMatchingPrice(rules, gardenSize, dogCount, frequency);
  const basePrice = matchedRule ? Number(matchedRule.base_price) : manualPrice || 0;
  const lineItemsTotal = lineItems.reduce((s, li) => s + li.price, 0);
  const totalPrice = basePrice + lineItemsTotal;

  const addLineItem = () => setLineItems([...lineItems, { label: "", price: 0 }]);
  const removeLineItem = (idx: number) => setLineItems(lineItems.filter((_, i) => i !== idx));
  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[idx] = { ...updated[idx], [field]: field === "price" ? parseFloat(String(value)) || 0 : value };
    setLineItems(updated);
  };

  const handleSave = async (send: boolean) => {
    try {
      const quote = await createQuote.mutateAsync({
        client_id: client.id,
        status: send ? "sent" : "draft",
        garden_size: gardenSize,
        dog_count: dogCount,
        frequency,
        base_price: basePrice,
        line_items: lineItems as any,
        total_price: totalPrice,
        admin_notes: adminNotes || null,
        terms_text: null,
        preferred_day: null,
      });

      await updateClient.mutateAsync({ id: client.id, pipeline_stage: "quote_sent" });

      if (send) {
        try {
          await supabase.functions.invoke("send-quote-email", { body: { quote_id: quote.id } });
          toast({ title: `Devis envoyé à ${client.email} ! 🐾` });
        } catch {
          toast({ title: "Devis sauvé mais erreur d'envoi email", variant: "destructive" });
        }
      } else {
        toast({ title: "Devis sauvegardé en brouillon 📋" });
      }

      onOpenChange(false);
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle className="font-display">Nouveau devis — {client.first_name} {client.last_name}</DrawerTitle>
          <DrawerDescription>Générer un devis basé sur la grille tarifaire</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-5 overflow-y-auto">
          {/* Section 1 — Base Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Taille du jardin</Label>
              <Select value={gardenSize} onValueChange={setGardenSize}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(gardenLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nb chiens</Label>
              <Input type="number" min={1} value={dogCount} onChange={e => setDogCount(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Fréquence</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(freqLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 2 — Auto Price */}
          {matchedRule ? (
            <div className="bg-accent/50 border border-secondary/30 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Prix de base</p>
              <p className="text-2xl font-display font-bold text-foreground">€{basePrice.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ visite</span></p>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Aucune règle tarifaire — saisie manuelle</p>
              <Input type="number" step="0.01" placeholder="Prix de base (€)" value={manualPrice || ""} onChange={e => setManualPrice(parseFloat(e.target.value) || null)} />
            </div>
          )}

          {/* Section 3 — Line Items */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Lignes additionnelles</Label>
            {lineItems.map((li, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input placeholder="Description" value={li.label} onChange={e => updateLineItem(idx, "label", e.target.value)} className="flex-1" />
                <div className="flex items-center gap-1 w-28">
                  <span className="text-muted-foreground text-sm">€</span>
                  <Input type="number" step="0.01" value={li.price} onChange={e => updateLineItem(idx, "price", e.target.value)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeLineItem(idx)}><X className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLineItem}><Plus className="w-3 h-3 mr-1" /> Ajouter une ligne</Button>
          </div>

          {/* Total */}
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Total du devis</p>
            <p className="text-3xl font-display font-bold text-foreground">€{totalPrice.toFixed(2)}</p>
          </div>

          {/* Section 4 — Admin Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs">Notes internes (non visibles pour le client)</Label>
            <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2} placeholder="Notes..." />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => handleSave(false)} disabled={createQuote.isPending || totalPrice <= 0}>
              Sauver brouillon
            </Button>
            <Button variant="cta" className="flex-1 rounded-full" onClick={() => handleSave(true)} disabled={createQuote.isPending || totalPrice <= 0 || !client.email}>
              Envoyer le devis 📧
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QuoteBuilderDrawer;
