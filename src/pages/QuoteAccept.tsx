import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useQuoteByToken, type LineItem } from "@/hooks/useQuotes";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const poppins = "'Poppins', sans-serif";

const freqLabels: Record<string, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bi-mensuel",
  monthly: "Mensuel",
  onetime: "Visite unique",
  twice_weekly: "2x/semaine",
};
const freqLabelsLong: Record<string, string> = {
  weekly: "Hebdomadaire (4 visites/mois)",
  biweekly: "Bi-mensuel (2 visites/mois)",
  monthly: "Mensuel (1 visite/mois)",
  onetime: "Visite unique",
  twice_weekly: "2x/semaine (8 visites/mois)",
};
const gardenLabels: Record<string, string> = {
  small: "Petit jardin",
  medium: "Jardin moyen",
  large: "Grand jardin",
  xl: "Très grand jardin",
};
const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const dayValues = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/* ─── SVG Icons ─── */
const HouseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
    <path d="M9 21V14h6v7" />
    <path d="M6 21h12" stroke="#B7E4C7" strokeWidth="2" />
  </svg>
);
const DogIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7c-1.5-2-4-3-6-2s-3 4-2 6c.5 1 1 2 2 3l1 5h3l1-4h2l1 4h3l1-5c1-1 1.5-2 2-3 1-2 0-5-2-6s-4.5 0-6 2z" />
    <circle cx="9" cy="10" r="1" fill="#2D6A4F" />
    <circle cx="15" cy="10" r="1" fill="#2D6A4F" />
  </svg>
);
const CalIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="#B7E4C7" />
  </svg>
);
const VisaIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="#F0F0F0"/><text x="6" y="16" fontSize="9" fontWeight="bold" fill="#999">VISA</text></svg>
);
const McIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="#F0F0F0"/><circle cx="14" cy="12" r="6" fill="#ccc" opacity="0.6"/><circle cx="22" cy="12" r="6" fill="#bbb" opacity="0.6"/></svg>
);
const BancontactIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="#F0F0F0"/><text x="3" y="15" fontSize="6" fontWeight="600" fill="#999">Bancontact</text></svg>
);

/* ─── Component ─── */
const QuoteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "1");
  const { data: quoteData, isLoading } = useQuoteByToken(token);
  const [step, setStep] = useState(initialStep);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [onetimeDate, setOnetimeDate] = useState<Date>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: poppins, background: "#F4F7F6" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#2D6A4F" }} />
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ fontFamily: poppins, background: "#F4F7F6" }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <img src={logo} alt="Crotte & Go®" className="h-14 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#2D6A4F" }}>Devis introuvable</h2>
          <p className="text-sm text-gray-500">Ce lien n'est plus valide ou le devis a été supprimé.</p>
        </div>
      </div>
    );
  }

  const quote = quoteData;
  const clientName = quote.clients?.first_name || "Client";
  const clientLastName = quote.clients?.last_name?.toLowerCase().trim() || "";
  const isExpired = differenceInDays(new Date(), new Date(quote.created_at)) > 14;
  const isAlreadyAccepted = quote.status === "accepted";

  if (isAlreadyAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ fontFamily: poppins, background: "#F4F7F6" }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <img src={logo} alt="Crotte & Go®" className="h-14 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#2D6A4F" }}>Devis déjà accepté ✅</h2>
          <p className="text-sm text-gray-500">Ce devis a été accepté le {format(new Date(quote.accepted_at!), "d MMMM yyyy", { locale: fr })}.</p>
        </div>
      </div>
    );
  }

  if (isExpired && quote.status === "sent") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ fontFamily: poppins, background: "#F4F7F6" }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <img src={logo} alt="Crotte & Go®" className="h-14 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#2D6A4F" }}>Devis expiré</h2>
          <p className="text-sm text-gray-500">Ce devis est valable 14 jours. Contactez-nous pour un nouveau devis.</p>
        </div>
      </div>
    );
  }

  const lineItems = (quote.line_items || []) as LineItem[];

  const TVA_RATE = 0.21;
  const totalHTVA = Number(quote.total_price) / (1 + TVA_RATE);
  const montantTVA = Number(quote.total_price) - totalHTVA;
  const freqDivisorMap: Record<string, number> = { onetime: 1, monthly: 1, biweekly: 2, weekly: 4, twice_weekly: 8 };
  const passagesParMois = freqDivisorMap[quote.frequency] || 1;
  const prixParPassage = Number(quote.total_price) / passagesParMois;
  const isQuarterly = (quote as any).billing_cycle === "quarterly";
  const quarterlyTotal = isQuarterly ? Number((quote as any).quarterly_price || quote.total_price * 3) : null;

  const isTwiceWeekly = quote.frequency === "twice_weekly";
  const signatureValid = signatureName.toLowerCase().trim().includes(clientLastName) && clientLastName.length > 0;

  const toggleDay = (day: string) => {
    if (isTwiceWeekly) {
      setPreferredDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : prev.length < 2 ? [...prev, day] : prev
      );
    } else {
      setPreferredDays([day]);
    }
  };

  const daySelectionValid = quote.frequency === "onetime"
    ? !!onetimeDate
    : isTwiceWeekly
      ? preferredDays.length === 2
      : preferredDays.length >= 1;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const chosenDay = quote.frequency === "onetime" && onetimeDate
        ? format(onetimeDate, "yyyy-MM-dd")
        : preferredDays.join(",");
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
    <div className="min-h-screen" style={{ fontFamily: poppins, background: "#FFFFFF" }}>
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Crotte & Go®" className="h-9 w-auto" />
          <span className="text-xs text-gray-400">Crotte & Go - 📞 +32460976545</span>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-1 transition-all" style={{ width: `${(step / 4) * 100}%`, background: "#2D6A4F" }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* ─── STEP 1 — Summary ─── */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Welcome */}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#2D6A4F" }}>Bonjour {clientName} !</h1>
              <p className="text-base text-gray-500 mt-1">Votre jardin est prêt pour un service 5 étoiles.</p>
            </div>

            {/* Service Details Grid */}
            <div className="rounded-2xl p-4" style={{ background: "#F4F7F6" }}>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 text-center">
                  <HouseIcon />
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Votre jardin</span>
                  <span className="text-sm font-semibold text-gray-800">{gardenLabels[quote.garden_size] || quote.garden_size}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <DogIcon />
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Vos chiens</span>
                  <span className="text-sm font-semibold text-gray-800">{quote.dog_count}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <CalIcon />
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Fréquence</span>
                  <span className="text-sm font-semibold text-gray-800">{freqLabels[quote.frequency] || quote.frequency}</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-0">
              {/* Base price */}
              <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Prix de base</span>
                <span className="text-gray-900 font-medium">€{Number(quote.base_price).toFixed(2)}</span>
              </div>
              {/* Line items */}
              {lineItems.map((li, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                  <span className={li.price < 0 ? "font-medium" : "text-gray-500"} style={li.price < 0 ? { color: "#2D6A4F" } : undefined}>
                    {li.label}
                  </span>
                  <span className={li.price < 0 ? "font-medium" : "text-gray-900 font-medium"} style={li.price < 0 ? { color: "#2D6A4F" } : undefined}>
                    €{li.price.toFixed(2)}
                  </span>
                </div>
              ))}
              {/* HTVA */}
              <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Total HTVA</span>
                <span className="text-gray-900 font-medium">€{totalHTVA.toFixed(2)}</span>
              </div>
              {/* TVA */}
              <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-500">TVA 21%</span>
                <span className="text-gray-900 font-medium">€{montantTVA.toFixed(2)}</span>
              </div>
              {/* Total TVAC */}
              <div className="flex justify-between items-center rounded-xl px-3 py-3 -mx-1 mt-1" style={{ background: "rgba(183,228,199,0.3)" }}>
                <span className="font-bold text-base text-gray-800">Total TVAC</span>
                <span className="font-bold text-xl" style={{ color: "#2D6A4F" }}>€{Number(quote.total_price).toFixed(2)}/mois</span>
              </div>
              {/* Per visit */}
              <div className="flex justify-between text-sm py-1.5 border-b border-gray-50 mt-1">
                <span className="text-gray-500">Par passage</span>
                <span className="text-gray-900 font-medium">€{prixParPassage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-1.5">
                <span className="text-gray-500">Passages/mois</span>
                <span className="text-gray-900 font-medium">{passagesParMois} visite(s)</span>
              </div>
            </div>

            {/* Quarterly banner */}
            {isQuarterly && quarterlyTotal && (
              <div className="rounded-xl p-3 text-sm border" style={{ background: "rgba(183,228,199,0.4)", borderColor: "rgba(45,106,79,0.3)", color: "#2D6A4F" }}>
                💡 Économie de 10% incluse — Facturation trimestrielle : <span className="font-bold">€{quarterlyTotal.toFixed(2)}</span>/3 mois ({passagesParMois * 3} passages).
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => setStep(2)}
              className="w-full text-white font-bold text-lg py-4 rounded-2xl shadow-md transition-colors"
              style={{ background: "#2D6A4F" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1B4332")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2D6A4F")}
            >
              🚀 Démarrer mon service
            </button>

            {/* Footer */}
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-400">Validité du devis : 14 jours</p>
              <div className="flex justify-center gap-2 opacity-40">
                <VisaIcon />
                <McIcon />
                <BancontactIcon />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2 — Choose Day ─── */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Choisissez votre jour de visite 📅</h2>
              {isTwiceWeekly && (
                <p className="text-sm text-gray-500 mt-1">Sélectionnez 2 jours distincts pour vos passages.</p>
              )}
            </div>

            {quote.frequency === "onetime" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Sélectionnez une date pour la visite :</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "w-full flex items-center justify-start text-left border rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        !onetimeDate ? "text-gray-400 border-gray-200 bg-white" : "text-gray-800 border-gray-200 bg-white"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {onetimeDate ? format(onetimeDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={onetimeDate} onSelect={setOnetimeDate} disabled={(date) => date < new Date()} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {dayLabels.map((label, i) => {
                  const isSelected = preferredDays.includes(dayValues[i]);
                  const isDisabled = isTwiceWeekly && preferredDays.length >= 2 && !isSelected;
                  return (
                    <button
                      key={dayValues[i]}
                      disabled={isDisabled}
                      className={cn(
                        "py-4 text-base font-medium rounded-xl border transition-all",
                        isSelected
                          ? "text-white font-bold border-transparent shadow-sm"
                          : isDisabled
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      )}
                      style={isSelected ? { background: "#2D6A4F" } : undefined}
                      onClick={() => toggleDay(dayValues[i])}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 bg-white text-gray-700 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                ← Retour
              </button>
              <button
                disabled={!daySelectionValid}
                onClick={() => setStep(3)}
                className="flex-1 text-white font-bold py-3 rounded-2xl shadow-md transition-colors disabled:opacity-40"
                style={{ background: "#2D6A4F" }}
              >
                Continuer →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3 — Terms ─── */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Conditions générales 📜</h2>

            <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-2xl p-4 text-xs text-gray-500 space-y-2 bg-gray-50/50">
              <p className="font-bold text-gray-800">CROTTE & GO® — CONDITIONS GÉNÉRALES DE SERVICES</p>
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
              <p>Résiliation possible à tout moment sans frais avec 7 jours de préavis (email à hello@crotteandgo.be). Suspension temporaire possible jusqu'à 3 mois/an sur notification écrite. Crotte & Go peut résilier en cas de non-paiement, comportement abusif ou informations fausses.</p>

              <p className="font-semibold">ARTICLE 7 — RESPONSABILITÉS ET GARANTIES</p>
              <p>En cas de prestation insatisfaisante, le Client peut demander un repassage gratuit dans les 24h avec photo à l'appui. La responsabilité de Crotte & Go est limitée au montant de la prestation concernée. Crotte & Go est couvert par une assurance RC professionnelle.</p>

              <p className="font-semibold">ARTICLE 8 — PROTECTION DES DONNÉES (RGPD)</p>
              <p>Crotte & Go traite les données personnelles du Client pour l'exécution du contrat, conformément au RGPD (UE) 2016/679 et à la loi belge du 30 juillet 2018. Données conservées 7 ans après résiliation. Droits d'accès, rectification, effacement et opposition exercés via privacy@crotteandgo.be. Réclamations possibles auprès de l'APD (autoriteprotectiondonnees.be).</p>

              <p className="font-semibold">ARTICLE 9 — MODIFICATION DES CGS</p>
              <p>Toute modification est notifiée 30 jours à l'avance. En l'absence d'opposition, les nouvelles CGS sont réputées acceptées.</p>

              <p className="font-semibold">ARTICLE 10 — DROIT APPLICABLE ET LITIGES</p>
              <p>Droit belge applicable. En cas de litige, recherche d'une solution amiable dans les 30 jours, puis compétence des tribunaux belges. Recours possible auprès du Service de Médiation pour le Consommateur (mediationconsommateur.be) ou via la plateforme ODR européenne.</p>

              <p className="font-semibold">ARTICLE 11 — DISPOSITIONS DIVERSES</p>
              <p>Le contrat est intuitu personae et non cessible sans accord écrit. Si une clause est nulle, les autres restent en vigueur. La version française fait foi.</p>

              <p className="font-semibold">Crotte & Go® — hello@crotteandgo.be — www.crotteandgo.be — Belgique</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(!!c)} />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                J'ai lu et j'accepte les{" "}
                <a href="https://crotteandgo.be/conditions-generales" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2D6A4F" }}>
                  conditions générales
                </a>{" "}
                de Crotte & Go.
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nom complet (signature électronique)</label>
              <Input
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Votre nom de famille"
                className="rounded-xl border-gray-200"
              />
              <p className="text-xs text-gray-400 mt-1">La signature doit correspondre au nom de famille du devis.</p>
              {signatureName.trim().length > 0 && !signatureValid && (
                <p className="text-xs text-red-500 mt-1">Le nom saisi ne correspond pas au nom du devis.</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 bg-white text-gray-700 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                ← Retour
              </button>
              <button
                disabled={!termsAccepted || !signatureValid}
                onClick={() => { setStep(4); handleCheckout(); }}
                className="flex-1 text-white font-bold py-3 rounded-2xl shadow-md transition-colors disabled:opacity-40"
                style={{ background: "#2D6A4F" }}
              >
                Accepter et démarrer 🚀
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              En acceptant ce devis, vous acceptez les conditions générales de Crotte & Go.<br />
              Le service est facturé selon la fréquence convenue.<br />
              © Crotte & Go® — hello@crotteandgo.be
            </p>
          </motion.div>
        )}

        {/* ─── STEP 4 — Stripe redirect ─── */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 space-y-4">
            {searchParams.get("cancelled") ? (
              <>
                <img src={logo} alt="Crotte & Go®" className="h-14 w-auto mx-auto" />
                <h2 className="text-xl font-bold" style={{ color: "#2D6A4F" }}>Pas de souci !</h2>
                <p className="text-gray-500">Votre devis est toujours valide. Réessayez quand vous le souhaitez.</p>
                <button
                  onClick={() => setStep(1)}
                  className="text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-colors"
                  style={{ background: "#2D6A4F" }}
                >
                  ← Revoir le devis
                </button>
              </>
            ) : (
              <>
                <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: "#2D6A4F" }} />
                <h2 className="text-xl font-bold text-gray-800">Configuration du paiement sécurisé...</h2>
                <p className="text-sm text-gray-500">Vous allez être redirigé vers Stripe.</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuoteAccept;
