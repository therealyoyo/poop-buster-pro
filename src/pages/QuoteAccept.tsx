import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { CalendarIcon, Loader2, Check } from "lucide-react";
import { useQuoteByToken, type LineItem } from "@/hooks/useQuotes";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const freqLabels: Record<string, string> = {
  weekly: "Hebdomadaire (4 visites/mois)", biweekly: "Bi-mensuel (2 visites/mois)",
  monthly: "Mensuel (1 visite/mois)", onetime: "Visite unique",
};
const gardenLabels: Record<string, string> = { small: "Petit jardin", medium: "Jardin moyen", large: "Grand jardin", xl: "Très grand jardin" };
const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const dayValues = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Full CGS rendered inline in Step 3

const QuoteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "1");
  const { data: quoteData, isLoading } = useQuoteByToken(token);
  const [step, setStep] = useState(initialStep);
  const [preferredDay, setPreferredDay] = useState<string>("");
  const [onetimeDate, setOnetimeDate] = useState<Date>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card max-w-md w-full"><CardContent className="py-12 text-center">
          <PawIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold mb-2">Devis introuvable</h2>
          <p className="text-muted-foreground text-sm">Ce lien n'est plus valide ou le devis a été supprimé.</p>
        </CardContent></Card>
      </div>
    );
  }

  const quote = quoteData;
  const clientName = quote.clients?.first_name || "Client";
  const isExpired = differenceInDays(new Date(), new Date(quote.created_at)) > 14;
  const isAlreadyAccepted = quote.status === "accepted";

  if (isAlreadyAccepted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card max-w-md w-full"><CardContent className="py-12 text-center">
          <Check className="w-12 h-12 text-secondary mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold mb-2">Devis déjà accepté ✅</h2>
          <p className="text-muted-foreground text-sm">Ce devis a été accepté le {format(new Date(quote.accepted_at!), "d MMMM yyyy", { locale: fr })}.</p>
        </CardContent></Card>
      </div>
    );
  }

  if (isExpired && quote.status === "sent") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card max-w-md w-full"><CardContent className="py-12 text-center">
          <PawIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold mb-2">Devis expiré</h2>
          <p className="text-muted-foreground text-sm">Ce devis est valable 14 jours. Contactez-nous pour un nouveau devis.</p>
        </CardContent></Card>
      </div>
    );
  }

  const lineItems = (quote.line_items || []) as LineItem[];

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const chosenDay = quote.frequency === "onetime" && onetimeDate ? format(onetimeDate, "yyyy-MM-dd") : preferredDay;
      const { data, error } = await supabase.functions.invoke("create-stripe-checkout", {
        body: { quote_token: token, accepted_by_name: signatureName, preferred_day: chosenDay },
      });
      if (error) throw error;
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawIcon className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-sm">Crotte & Go</span>
          </div>
          <span className="text-xs text-muted-foreground">Étape {step} sur 4</span>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-1 bg-secondary transition-all" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Step 1 — Summary */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold">Bonjour {clientName}, voici votre devis 🐾</h1>
            </div>

            <Card className="shadow-card">
              <CardContent className="pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jardin</span>
                  <span className="font-medium">{gardenLabels[quote.garden_size] || quote.garden_size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Chiens</span>
                  <span className="font-medium">{quote.dog_count} 🐕</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fréquence</span>
                  <span className="font-medium">{freqLabels[quote.frequency] || quote.frequency}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prix de base</span>
                    <span>€{Number(quote.base_price).toFixed(2)}</span>
                  </div>
                  {lineItems.map((li, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{li.label}</span>
                      <span className={li.price < 0 ? "text-secondary" : ""}>€{li.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-bold text-lg">€{Number(quote.total_price).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="cta" className="w-full rounded-full py-6 text-lg" onClick={() => setStep(2)}>
              Continuer →
            </Button>
          </motion.div>
        )}

        {/* Step 2 — Choose Day */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="font-display text-xl font-bold">Choisissez votre jour de visite 📅</h2>

            {quote.frequency === "onetime" ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sélectionnez une date pour la visite :</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !onetimeDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {onetimeDate ? format(onetimeDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={onetimeDate} onSelect={setOnetimeDate} disabled={(date) => date < new Date()} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {dayLabels.map((label, i) => (
                  <Button
                    key={dayValues[i]}
                    variant={preferredDay === dayValues[i] ? "default" : "outline"}
                    className="py-6 text-lg"
                    onClick={() => setPreferredDay(dayValues[i])}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Retour</Button>
              <Button
                variant="cta"
                className="flex-1 rounded-full"
                disabled={quote.frequency === "onetime" ? !onetimeDate : !preferredDay}
                onClick={() => setStep(3)}
              >
                Continuer →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Terms */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="font-display text-xl font-bold">Conditions générales 📜</h2>

            <div className="max-h-64 overflow-y-auto border rounded p-3 text-xs text-muted-foreground space-y-2 bg-muted/30">
              <p className="font-bold text-foreground">CROTTE & GO — CONDITIONS GÉNÉRALES DE SERVICES</p>
              <p className="font-semibold">Version 1.0</p>

              <p className="font-semibold">ARTICLE 1 — IDENTIFICATION DES PARTIES ET CHAMP D'APPLICATION</p>
              <p>Les présentes Conditions Générales de Services (« CGS ») régissent la relation contractuelle entre Crotte & Go, entreprise de services de ramassage de déjections canines établie en Belgique (« le Prestataire »), et toute personne ayant souscrit à un service (« le Client »). En acceptant un devis, le Client accepte ces CGS sans réserve.</p>

              <p className="font-semibold">ARTICLE 2 — DESCRIPTION DES SERVICES</p>
              <p>Crotte & Go propose : le ramassage régulier ou ponctuel de déjections canines dans les jardins privés résidentiels, ainsi que des services pour entreprises et espaces communs (B2B). Les services sont réalisés selon la fréquence convenue (unique, 1x/mois, toutes les 2 semaines, hebdomadaire ou 2x/semaine).</p>

              <p className="font-semibold">ARTICLE 3 — DEVIS ET FORMATION DU CONTRAT</p>
              <p>Tout service fait l'objet d'un devis valable 14 jours. Le contrat est formé à l'acceptation expresse du devis par le Client via le lien électronique sécurisé fourni, accompagnée de la signature électronique. L'acceptation vaut acceptation des présentes CGS.</p>

              <p className="font-semibold">ARTICLE 4 — TARIFS ET FACTURATION</p>
              <p>Les tarifs sont en EUR TTC. Toute modification tarifaire est notifiée 30 jours à l'avance. Facturation mensuelle ou trimestrielle (-10% sur le trimestre). Les codes promotionnels et remises de parrainage (25 € pour le filleul) sont à usage unique. En cas de retard de paiement, des intérêts légaux et une indemnité forfaitaire de 40 EUR sont appliqués de plein droit conformément à la loi belge du 2 août 2002.</p>

              <p className="font-semibold">ARTICLE 5 — ACCÈS AU JARDIN ET CONDITIONS D'INTERVENTION</p>
              <p>Le Client s'engage à permettre l'accès au jardin, à fournir les informations d'accès nécessaires et à signaler tout animal agressif. En cas d'accès impossible imputable au Client, la prestation est facturée. Crotte & Go ne peut être tenu responsable des dommages causés par un animal non signalé.</p>

              <p className="font-semibold">ARTICLE 6 — RÉSILIATION ET SUSPENSION</p>
              <p>Résiliation possible à tout moment sans frais avec 7 jours de préavis (email à contact@crotteetgo.be). Suspension temporaire possible jusqu'à 3 mois/an sur notification écrite. Crotte & Go peut résilier en cas de non-paiement, comportement abusif ou informations fausses.</p>

              <p className="font-semibold">ARTICLE 7 — RESPONSABILITÉS ET GARANTIES</p>
              <p>En cas de prestation insatisfaisante, le Client peut demander un repassage gratuit dans les 24h avec photo à l'appui. La responsabilité de Crotte & Go est limitée au montant de la prestation concernée. Crotte & Go est couvert par une assurance RC professionnelle.</p>

              <p className="font-semibold">ARTICLE 8 — PROTECTION DES DONNÉES (RGPD)</p>
              <p>Crotte & Go traite les données personnelles du Client pour l'exécution du contrat, conformément au RGPD (UE) 2016/679 et à la loi belge du 30 juillet 2018. Données conservées 7 ans après résiliation. Droits d'accès, rectification, effacement et opposition exercés via privacy@crotteetgo.be. Réclamations possibles auprès de l'APD (autoriteprotectiondonnees.be).</p>

              <p className="font-semibold">ARTICLE 9 — MODIFICATION DES CGS</p>
              <p>Toute modification est notifiée 30 jours à l'avance. En l'absence d'opposition, les nouvelles CGS sont réputées acceptées.</p>

              <p className="font-semibold">ARTICLE 10 — DROIT APPLICABLE ET LITIGES</p>
              <p>Droit belge applicable. En cas de litige, recherche d'une solution amiable dans les 30 jours, puis compétence des tribunaux belges. Recours possible auprès du Service de Médiation pour le Consommateur (mediationconsommateur.be) ou via la plateforme ODR européenne.</p>

              <p className="font-semibold">ARTICLE 11 — DISPOSITIONS DIVERSES</p>
              <p>Le contrat est intuitu personae et non cessible sans accord écrit. Si une clause est nulle, les autres restent en vigueur. La version française fait foi.</p>

              <p className="font-semibold">Crotte & Go — contact@crotteetgo.be — www.crotteetgo.be — Belgique</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(!!c)} />
              <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
                J'ai lu et j'accepte les conditions générales
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nom complet (signature électronique)</label>
              <Input value={signatureName} onChange={e => setSignatureName(e.target.value)} placeholder="Votre nom complet" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Retour</Button>
              <Button
                variant="cta"
                className="flex-1 rounded-full"
                disabled={!termsAccepted || !signatureName.trim()}
                onClick={() => { setStep(4); handleCheckout(); }}
              >
                Accepter et payer →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4 — Stripe redirect */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 space-y-4">
            {searchParams.get("cancelled") ? (
              <>
                <PawIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                <h2 className="font-display text-xl font-bold">Pas de souci !</h2>
                <p className="text-muted-foreground">Votre devis est toujours valide. Réessayez quand vous le souhaitez.</p>
                <Button variant="cta" className="rounded-full" onClick={() => setStep(1)}>← Revoir le devis</Button>
              </>
            ) : (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <h2 className="font-display text-xl font-bold">Configuration du paiement sécurisé...</h2>
                <p className="text-sm text-muted-foreground">Vous allez être redirigé vers Stripe.</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuoteAccept;
