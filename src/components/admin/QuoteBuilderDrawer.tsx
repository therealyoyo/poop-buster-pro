import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Eye } from "lucide-react";
import { usePricingRules, findMatchingPrice, getDogSurcharge } from "@/hooks/usePricingRules";
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

const gardenLabels: Record<string, string> = { small: "0–250 m²", medium: "251–750 m²", large: "751–1500 m²", xl: "1500 m²+" };
const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "2x/mois", monthly: "1x/mois", twice_weekly: "2x/sem.", onetime: "Ponctuel" };
const freqDivisor: Record<string, number> = { onetime: 1, monthly: 1, biweekly: 2, weekly: 4, twice_weekly: 8 };
const TVA_RATE = 0.21;

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

  // Promos
  const [promoReferral, setPromoReferral] = useState(false);
  const [promoFirstFree, setPromoFirstFree] = useState(false);
  const [referralAmount, setReferralAmount] = useState(25);

  // Promo flags from client
  const referralAlreadyUsed = !!(client as any).referral_discount_used;
  const firstFreeAlreadyUsed = !!(client as any).first_free_used;

  // Preview
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setGardenSize(client.garden_size || "medium");
    setDogCount(client.dog_count || 1);
    setFrequency(client.service_frequency || "weekly");
    setLineItems([]);
    setAdminNotes("");
    setManualPrice(null);
    setPromoReferral(false);
    setPromoFirstFree(false);
    setReferralAmount(25);
  }, [client.id, open]);

  const matchedRule = findMatchingPrice(rules, gardenSize, frequency);
  const dogSurcharge = getDogSurcharge(rules);
  const extraDogs = Math.max(0, dogCount - 1);
  const basePrice = matchedRule ? Number(matchedRule.base_price) + extraDogs * dogSurcharge : manualPrice || 0;
  const lineItemsTotal = lineItems.reduce((s, li) => s + li.price, 0);
  const totalPrice = basePrice + lineItemsTotal;

  // Promos - non-cumulable
  const canCheckReferral = !referralAlreadyUsed && !promoFirstFree;
  const canApplyFirstFree = frequency !== "onetime";
  const canCheckFirstFree = !firstFreeAlreadyUsed && !promoReferral;
  const referralDiscount = promoReferral ? referralAmount : 0;
  const firstPassageValue = basePrice / (freqDivisor[frequency] || 1);
  const firstFreeDiscount = (promoFirstFree && canApplyFirstFree) ? firstPassageValue : 0;
  const totalDiscount = referralDiscount + firstFreeDiscount;
  const totalPriceAfterDiscount = Math.max(0, totalPrice - totalDiscount);

  // TVA
  const totalHTVA = totalPriceAfterDiscount / (1 + TVA_RATE);
  const montantTVA = totalPriceAfterDiscount - totalHTVA;

  const addLineItem = () => setLineItems([...lineItems, { label: "", price: 0 }]);
  const removeLineItem = (idx: number) => setLineItems(lineItems.filter((_, i) => i !== idx));
  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[idx] = { ...updated[idx], [field]: field === "price" ? parseFloat(String(value)) || 0 : value };
    setLineItems(updated);
  };

  const getAllLineItems = () => [
    ...lineItems,
    ...(promoReferral ? [{ label: "Réduction parrainage", price: -referralAmount }] : []),
    ...(promoFirstFree && canApplyFirstFree ? [{ label: "1er passage offert", price: -firstPassageValue }] : []),
  ];

  const handleSave = async (send: boolean) => {
    try {
      const quote = await createQuote.mutateAsync({
        client_id: client.id,
        status: send ? "sent" : "draft",
        garden_size: gardenSize,
        dog_count: dogCount,
        frequency,
        base_price: basePrice,
        line_items: getAllLineItems() as any,
        total_price: totalPriceAfterDiscount,
        admin_notes: adminNotes || null,
        terms_text: null,
        preferred_day: null,
      });

      await updateClient.mutateAsync({ id: client.id, pipeline_stage: "quote_sent" });

      // Update promo flags on client
      if (promoReferral) {
        await supabase.from("clients").update({ referral_discount_used: true }).eq("id", client.id);
      }
      if (promoFirstFree && canApplyFirstFree) {
        await supabase.from("clients").update({ first_free_used: true }).eq("id", client.id);
      }

      if (send) {
        const { data: emailRes, error: emailErr } = await supabase.functions.invoke("send-quote-email", { body: { quote_id: quote.id } });
        if (emailErr || emailRes?.error) {
          toast({ title: "⚠️ Devis sauvé, email non envoyé", description: emailRes?.error || "Vérifiez la configuration Resend", variant: "destructive" });
        } else {
          toast({ title: `✅ Devis envoyé à ${client.email} ! 🐾` });
        }
      } else {
        toast({ title: "Devis sauvegardé en brouillon 📋" });
      }

      onOpenChange(false);
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const generatePreviewHtml = () => {
    const allItems = getAllLineItems();
    const lineItemsRows = allItems.map(li => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${li.label}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;${li.price < 0 ? 'color:#16a34a' : ''}">
          ${li.price < 0 ? '-' : ''}€${Math.abs(li.price).toFixed(2)}
        </td>
      </tr>
    `).join("");

    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border-radius:12px">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="color:#1a3a52;margin:0">🐾 Crotte & Go</h1>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:20px">
          <div>
            <h2 style="margin:0;color:#1a3a52">Devis — APERÇU</h2>
            <p style="color:#666;margin:4px 0">${new Date().toLocaleDateString('fr-BE')}</p>
            <p style="color:#666;margin:4px 0">Valable 30 jours</p>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:20px">
          <strong>${client.first_name} ${client.last_name}</strong><br/>
          ${client.email || ''}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:8px;text-align:left">Prestation</th>
              <th style="padding:8px;text-align:right">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee">${gardenLabels[gardenSize] || gardenSize} — ${freqLabels[frequency]} — ${dogCount} chien(s)</td>
              <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${basePrice.toFixed(2)}</td>
            </tr>
            ${lineItemsRows}
          </tbody>
        </table>
        <div style="background:#f1f5f9;padding:16px;border-radius:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span>Total HTVA</span><strong>€${totalHTVA.toFixed(2)}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span>TVA 21%</span><strong>€${montantTVA.toFixed(2)}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:18px">
            <strong>Total TVAC</strong><strong>€${totalPriceAfterDiscount.toFixed(2)}/mois</strong>
          </div>
          <div style="display:flex;justify-content:space-between;color:#666">
            <span>Par passage</span><strong>€${(totalPriceAfterDiscount / (freqDivisor[frequency] || 1)).toFixed(2)}</strong>
          </div>
        </div>
        <div style="margin-top:20px;padding:12px;background:#fef3c7;border-radius:8px;text-align:center;color:#92400e;font-size:13px">
          ⚠️ Ceci est un aperçu. Le devis final sera généré et envoyé par email.
        </div>
      </div>
    `;
  };

  return (
    <>
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
                <p className="text-2xl font-display font-bold text-foreground">€{basePrice.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ mois</span></p>
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

            {/* Section Promotions */}
            <div className="space-y-3 border border-border rounded-xl p-4">
              <p className="text-sm font-semibold">🎁 Promotions</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={promoReferral} onCheckedChange={v => setPromoReferral(!!v)} disabled={!canCheckReferral} />
                  <Label className="text-sm">
                    Réduction parrainage
                    {referralAlreadyUsed && <span className="text-xs text-destructive ml-1">(déjà utilisée)</span>}
                    {promoFirstFree && !referralAlreadyUsed && <span className="text-xs text-muted-foreground ml-1">(non cumulable)</span>}
                  </Label>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">-€</span>
                  <Input
                    type="number" min={0} step="1"
                    value={referralAmount}
                    onChange={e => setReferralAmount(Number(e.target.value))}
                    className="w-20 h-7 text-sm text-right"
                    disabled={!promoReferral}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={promoFirstFree}
                  onCheckedChange={v => setPromoFirstFree(!!v)}
                  disabled={!canApplyFirstFree || !canCheckFirstFree}
                />
                <Label className="text-sm">
                  1er passage gratuit{" "}
                  {firstFreeAlreadyUsed && <span className="text-xs text-destructive">(déjà utilisée)</span>}
                  {promoReferral && !firstFreeAlreadyUsed && <span className="text-xs text-muted-foreground">(non cumulable)</span>}
                  {!firstFreeAlreadyUsed && canApplyFirstFree && canCheckFirstFree && <span className="text-xs text-muted-foreground">(-€{firstPassageValue.toFixed(2)})</span>}
                  {!canApplyFirstFree && <span className="text-xs text-muted-foreground">(non disponible pour passage unique)</span>}
                </Label>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm font-medium text-green-600 pt-2 border-t border-border">
                  <span>Réduction totale</span>
                  <span>-€{totalDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total with TVA */}
            <div className="bg-primary/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total HTVA</span>
                <span>€{totalHTVA.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>TVA 21%</span>
                <span>€{montantTVA.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-display font-bold text-foreground">
                <span>Total TVAC</span>
                <span>€{totalPriceAfterDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Par passage</span>
                <span>€{(totalPriceAfterDiscount / (freqDivisor[frequency] || 1)).toFixed(2)}</span>
              </div>
            </div>

            {/* Section 4 — Admin Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs">Notes internes (non visibles pour le client)</Label>
              <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2} placeholder="Notes..." />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              📧 Le devis sera envoyé depuis billing@support.crotteandgo.be (réponses vers yoni@crotteandgo.be)
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} disabled={totalPriceAfterDiscount <= 0}>
                <Eye className="w-3 h-3 mr-1" /> Aperçu
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleSave(false)} disabled={createQuote.isPending || totalPriceAfterDiscount <= 0}>
                Sauver brouillon
              </Button>
              <Button variant="cta" className="flex-1 rounded-full" onClick={() => handleSave(true)} disabled={createQuote.isPending || totalPriceAfterDiscount <= 0 || !client.email}>
                Envoyer le devis 📧
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du devis</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }} />
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Fermer</Button>
            <Button variant="cta" onClick={() => { setShowPreview(false); handleSave(true); }}>
              ✅ Confirmer et envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteBuilderDrawer;
