import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCheckPostalCode } from "@/hooks/useZonesService";
import { usePricingRules, findMatchingPrice, getDogSurcharge } from "@/hooks/usePricingRules";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, ArrowLeft, Dog, Loader2, CheckCircle2, Building2 } from "lucide-react";
import PawIcon from "@/components/PawIcon";
import { motion } from "framer-motion";

type Step = "check" | "quote" | "out_of_zone";

const frequencies = [
  "Passage unique",
  "1x par mois",
  "Toutes les 2 semaines",
  "Hebdomadaire",
  "2x par semaine",
];

const freqToKey: Record<number, string> = {
  0: "onetime",
  1: "monthly",
  2: "biweekly",
  3: "weekly",
  4: "twice_weekly",
};

/** Divisor to convert monthly base_price to per-passage price */
const freqDivisor: Record<string, number> = {
  onetime: 1,
  monthly: 1,
  biweekly: 2,
  weekly: 4,
  twice_weekly: 8,
};

const gardenSizes = [
  { key: "small", label: "Petit", range: "0 – 250 m²", emoji: "🌱" },
  { key: "medium", label: "Moyen", range: "251 – 750 m²", emoji: "🌿" },
  { key: "large", label: "Grand", range: "751 – 1 500 m²", emoji: "🌳" },
  { key: "xl", label: "Très grand", range: "1 500 m² et +", emoji: "🏞️" },
];

const gateLocationOptions = [
  { value: "left", label: "À gauche" },
  { value: "right", label: "À droite" },
  { value: "driveway", label: "Via l'allée" },
  { value: "no_gate", label: "Pas de portail" },
  { value: "house_only", label: "Via la maison" },
  { value: "other", label: "Autre" },
];

interface PostalCodeModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isB2B?: boolean;
}

/** Non-blocking newsletter insert when mailing consent is checked */
const insertNewsletterLead = async (data: { email: string; first_name: string; last_name: string }) => {
  try {
    await supabase.from("leads").insert({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      mailing_consent: true,
      data_processing_consent: true,
      status: "new",
      lead_type: "newsletter",
      additional_comments: "Inscrit à la mailing list via formulaire devis",
    } as any);
  } catch { /* silent */ }
};

const PostalCodeModal = ({ open, onOpenChange, isB2B = false }: PostalCodeModalProps) => {
  const [step, setStep] = useState<Step>("check");
  const [codePostal, setCodePostal] = useState("");
  const [zone, setZone] = useState("");
  const checkPostalCode = useCheckPostalCode();

  // Quote form state
  const [promoCode, setPromoCode] = useState("");
  const [dogCount, setDogCount] = useState([1]);
  const [freqIndex, setFreqIndex] = useState([1]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [city, setCity] = useState("");
  const [selectedGardenSize, setSelectedGardenSize] = useState("");
  const [gateCode, setGateCode] = useState("");
  const [dataConsent, setDataConsent] = useState(false);
  const [mailing, setMailing] = useState(true);
  const [referralSource, setReferralSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // B2B fields
  const [companyName, setCompanyName] = useState("");

  // New state variables
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [dogNames, setDogNames] = useState<{ name: string; safe: boolean }[]>([]);
  const [gateLocation, setGateLocation] = useState("");
  const [gateLocationOther, setGateLocationOther] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [quarterlyBilling, setQuarterlyBilling] = useState(false);

  // Address autocomplete
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const priceCardRef = useRef<HTMLDivElement>(null);

  // Pricing
  const { data: pricingRules, isLoading: pricingLoading } = usePricingRules();

  // Out-of-zone form state
  const [oozFirstName, setOozFirstName] = useState("");
  const [oozLastName, setOozLastName] = useState("");
  const [oozEmail, setOozEmail] = useState("");
  const [oozPhone, setOozPhone] = useState("");
  const [oozComment, setOozComment] = useState("");
  const [oozSubmitting, setOozSubmitting] = useState(false);

  const resetAll = () => {
    setStep("check");
    setCodePostal("");
    setZone("");
    setPromoCode("");
    setDogCount([1]);
    setFreqIndex([1]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setStreetName("");
    setStreetNumber("");
    setCity("");
    setSelectedGardenSize("");
    setGateCode("");
    setDataConsent(false);
    setMailing(true);
    setReferralSource("");
    setAttempted(false);
    setSuggestions([]);
    setOozFirstName("");
    setOozLastName("");
    setOozEmail("");
    setOozPhone("");
    setOozComment("");
    setQuoteSubmitted(false);
    setShowFullForm(false);
    setDogNames([]);
    setGateLocation("");
    setGateLocationOther("");
    setAdditionalComments("");
    setTermsAccepted(false);
    setQuarterlyBilling(false);
    setCompanyName("");
  };

  const handleCheck = async () => {
    if (!codePostal.trim()) return;
    const result = await checkPostalCode.mutateAsync(codePostal);
    if (result) {
      setZone(result.zone);
      setStep("quote");
    } else {
      setStep("out_of_zone");
    }
  };

  // Address autocomplete via BOSA API
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3 || !codePostal) return;
    try {
      const res = await fetch(
        `https://api.bfreg.be/address/v1/streets?municipality_postcode=${encodeURIComponent(codePostal)}&street_name=${encodeURIComponent(query)}&language=fr&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        const names = (data?.streets || data || [])
          .map((s: any) => s.street_name || s.name || s.streetName || (typeof s === "string" ? s : null))
          .filter(Boolean)
          .slice(0, 5);
        setSuggestions(names);
        setShowSuggestions(names.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleStreetChange = (val: string) => {
    setStreetName(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setDogNames(prev => {
      const arr = [...prev];
      while (arr.length < dogCount[0]) arr.push({ name: "", safe: true });
      return arr.slice(0, dogCount[0]);
    });
  }, [dogCount]);

  useEffect(() => {
    if (showFullForm && priceCardRef.current) {
      setTimeout(() => {
        priceCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [showFullForm]);

  // Price calculation
  const isXl = selectedGardenSize === "xl";
  const freqKey = freqToKey[freqIndex[0]];
  const isOnetime = freqKey === "onetime";
  const isSpecialLead = isXl || isOnetime;

  const matchedRule = pricingRules && selectedGardenSize && !isSpecialLead
    ? findMatchingPrice(pricingRules, selectedGardenSize, freqKey)
    : undefined;
  const dogSurcharge = pricingRules ? getDogSurcharge(pricingRules) : 10;
  const extraDogs = Math.max(0, dogCount[0] - 1);
  const divisor = freqDivisor[freqKey] || 1;
  const perPassageBase = matchedRule ? matchedRule.base_price / divisor : null;
  const estimatedPrice = perPassageBase !== null
    ? perPassageBase + extraDogs * dogSurcharge
    : null;
  const displayPrice = quarterlyBilling && estimatedPrice
    ? Math.round(estimatedPrice * 0.9)
    : estimatedPrice ? Math.round(estimatedPrice) : null;

  const isValidBelgianPhone = (value: string): boolean => {
    const cleaned = value.replace(/[\s.\-()]/g, "");
    return (
      /^\+32[1-9][0-9]{7,8}$/.test(cleaned) ||
      /^0032[1-9][0-9]{7,8}$/.test(cleaned) ||
      /^0[1-9][0-9]{7,8}$/.test(cleaned)
    );
  };

  const isValidEmail = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  // B2B validation
  const b2bErrors = {
    firstName: !firstName.trim(),
    lastName: !lastName.trim(),
    email: !email.trim() || !isValidEmail,
    phone: !phone.trim() || !isValidBelgianPhone(phone),
    companyName: !companyName.trim(),
  };
  const b2bHasErrors = b2bErrors.firstName || b2bErrors.lastName || b2bErrors.email || b2bErrors.phone || b2bErrors.companyName;

  // Residential validation (Phase 1 fields)
  const errors = {
    firstName: !firstName.trim(),
    lastName: !lastName.trim(),
    email: !email.trim() || !isValidEmail,
    phone: !phone.trim() || !isValidBelgianPhone(phone),
    gardenSize: !selectedGardenSize,
    dataConsent: !dataConsent,
    termsAccepted: !termsAccepted,
  };
  const phase1HasErrors = errors.firstName || errors.lastName || errors.email || errors.phone || errors.gardenSize || errors.dataConsent;

  // Special lead submit (onetime / XL) — now uses early_lead type
  const handleSpecialLeadSubmit = async () => {
    setSubmitting(true);
    try {
      const address = `${streetName} ${streetNumber}, ${codePostal}`.trim().replace(/^,/, "").trim();
      const note = isOnetime ? "Devis sur mesure — Passage unique" : "Devis sur mesure — Jardin XL";
      await supabase.from("leads").insert({
        first_name: firstName, last_name: lastName, email, phone,
        address, street_name: streetName || null, street_number: streetNumber || null,
        city: zone, postal_code: codePostal,
        dog_count: dogCount[0], garden_size: selectedGardenSize,
        service_frequency: freqKey,
        referral_source: referralSource || null,
        mailing_consent: mailing, data_processing_consent: true, status: "new",
        promo_code: promoCode || null,
        additional_comments: note,
        lead_type: "early_lead",
      } as any);

      // Newsletter insert if mailing consent
      if (mailing) {
        insertNewsletterLead({ email, first_name: firstName, last_name: lastName });
      }

      setQuoteSubmitted(true);
      toast.success("Votre demande a été envoyée ! Nous vous contacterons rapidement. 🐾");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  // B2B submit
  const handleB2BSubmit = async () => {
    setAttempted(true);
    if (b2bHasErrors) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    try {
      const address = `${streetName} ${streetNumber}, ${codePostal}`.trim().replace(/^,/, "").trim();
      await supabase.from("leads").insert({
        first_name: firstName, last_name: lastName, email, phone,
        address, street_name: streetName || null, street_number: streetNumber || null,
        city: city || zone || null, postal_code: codePostal,
        mailing_consent: mailing, data_processing_consent: true, status: "new",
        company_name: companyName,
        lead_type: "b2b",
        additional_comments: "Lead B2B — Devis sur mesure",
      } as any);

      // Newsletter insert if mailing consent
      if (mailing) {
        insertNewsletterLead({ email, first_name: firstName, last_name: lastName });
      }

      setQuoteSubmitted(true);
      toast.success("Demande B2B envoyée ! 🏢");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Phase 1 CTA handler — inserts early_lead non-blocking
  const handlePhase1Submit = () => {
    setAttempted(true);
    if (phase1HasErrors) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Non-blocking early_lead insert for ALL Phase 1 submissions
    try {
      const address = `${streetName} ${streetNumber}, ${codePostal}`.trim().replace(/^,/, "").trim();
      supabase.from("leads").insert({
        first_name: firstName, last_name: lastName, email, phone,
        address: address || null, street_name: streetName || null, street_number: streetNumber || null,
        city: zone, postal_code: codePostal,
        dog_count: dogCount[0], garden_size: selectedGardenSize,
        service_frequency: freqKey,
        referral_source: referralSource || null,
        mailing_consent: mailing, data_processing_consent: true, status: "new",
        promo_code: promoCode || null,
        lead_type: "early_lead",
      } as any).then(() => {
        // Newsletter insert if mailing consent (for non-special leads going to Phase 2)
        if (mailing && !isSpecialLead) {
          insertNewsletterLead({ email, first_name: firstName, last_name: lastName });
        }
      });
    } catch { /* non-blocking */ }

    if (isSpecialLead) {
      handleSpecialLeadSubmit();
      return;
    }
    setShowFullForm(true);
  };

  // Final submit (Phase 2)
  const handleFinalSubmit = async () => {
    setAttempted(true);
    if (phase1HasErrors || !termsAccepted) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    const address = `${streetName} ${streetNumber}, ${codePostal}`.trim();
    const serviceFrequency = frequencies[freqIndex[0]];
    try {
      const sharedData = {
        first_name: firstName, last_name: lastName, email, phone,
        address, street_name: streetName || null, street_number: streetNumber || null,
        city: zone, postal_code: codePostal,
        dog_count: dogCount[0], garden_size: selectedGardenSize,
        service_frequency: serviceFrequency,
        referral_source: referralSource || null,
        mailing_consent: mailing, data_processing_consent: true,
        gate_code: gateCode || null,
        gate_location: gateLocation || null,
        gate_location_other: gateLocation === "other" ? gateLocationOther : null,
        dog_names: dogNames.length > 0 ? dogNames : null,
        additional_comments: additionalComments || null,
        terms_accepted: true,
        quarterly_billing: quarterlyBilling,
        promo_code: promoCode || null,
      };

      // Best-effort clients insert — may fail due to RLS on unauthenticated users
      try {
        await supabase.from("clients").insert({
          ...sharedData,
          status: "prospect",
          pipeline_stage: "new",
          internal_notes: promoCode ? `Code promo: ${promoCode}` : null,
        });
      } catch {
        // Best-effort — may fail due to RLS on unauthenticated users
      }

      const { error: leadError } = await supabase.from("leads").insert({
        ...sharedData,
        status: "new",
        lead_type: "qualified_lead",
      } as any);
      if (leadError) throw leadError;

      // Newsletter insert if mailing consent
      if (mailing) {
        insertNewsletterLead({ email, first_name: firstName, last_name: lastName });
      }

      setQuoteSubmitted(true);
      toast.success("Votre demande de devis a bien été reçue ! Nous vous contacterons rapidement. 🐾");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOozSubmit = async () => {
    if (!oozFirstName || !oozLastName || !oozEmail) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }
    setOozSubmitting(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        first_name: oozFirstName, last_name: oozLastName,
        email: oozEmail, phone: oozPhone || null,
        code_postal: codePostal, commentaire: oozComment || null,
        status: "hors_zone",
      });
      if (error) throw error;
      toast.success("Merci ! Nous reviendrons vers vous.");
      resetAll();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'envoi.");
    } finally {
      setOozSubmitting(false);
    }
  };

  const FieldError = ({ show, msg }: { show: boolean; msg?: string }) =>
    show ? <p className="text-xs text-destructive mt-1">{msg || "Ce champ est obligatoire"}</p> : null;

  const frequencyLabel = frequencies[freqIndex[0]];

  // ═══════════════════════════════════════
  // B2B SUCCESS SCREEN
  // ═══════════════════════════════════════
  const B2BSuccessScreen = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 space-y-4">
      <Building2 className="w-16 h-16 text-primary mx-auto" />
      <h2 className="font-display text-2xl font-bold text-foreground">🏢 Demande reçue !</h2>
      <p className="text-muted-foreground text-sm">
        Notre équipe B2B vous contactera dans les 24–48h pour élaborer votre offre sur mesure.<br />
        Merci de votre confiance ! 🐾
      </p>
    </motion.div>
  );

  // ═══════════════════════════════════════
  // SPECIAL LEAD SUCCESS SCREEN
  // ═══════════════════════════════════════
  const SpecialLeadSuccessScreen = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 space-y-4">
      <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
      <h2 className="font-display text-2xl font-bold text-foreground">✅ Nous avons bien reçu votre demande !</h2>
      <p className="text-muted-foreground text-sm">
        Notre équipe vous contactera sous 24–48h pour établir un devis personnalisé. 🐾
      </p>
    </motion.div>
  );

  // ═══════════════════════════════════════
  // B2B FORM
  // ═══════════════════════════════════════
  const B2BForm = () => (
    <div className="space-y-4 pt-2">
      <DialogHeader>
        <DialogTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Demande de devis B2B
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Prénom *</Label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={attempted && b2bErrors.firstName ? "border-destructive" : ""} />
          <FieldError show={attempted && b2bErrors.firstName} />
        </div>
        <div>
          <Label>Nom *</Label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={attempted && b2bErrors.lastName ? "border-destructive" : ""} />
          <FieldError show={attempted && b2bErrors.lastName} />
        </div>
      </div>

      <div>
        <Label>Email *</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={attempted && b2bErrors.email ? "border-destructive" : ""} />
        <FieldError show={attempted && b2bErrors.email} msg={!email.trim() ? "Ce champ est obligatoire" : "Veuillez entrer un email valide"} />
      </div>

      <div>
        <Label>Téléphone *</Label>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={attempted && b2bErrors.phone ? "border-destructive" : ""} />
        <FieldError show={attempted && b2bErrors.phone} msg={!phone.trim() ? "Ce champ est obligatoire" : "Numéro belge valide requis (ex: 0470 12 34 56)"} />
      </div>

      <div>
        <Label>Entreprise / Société *</Label>
        <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={attempted && b2bErrors.companyName ? "border-destructive" : ""} placeholder="Nom de votre société" />
        <FieldError show={attempted && b2bErrors.companyName} />
      </div>

      <Separator />

      <div className="flex gap-2">
        <div className="flex-1 relative" ref={suggestionsRef}>
          <Label>Rue</Label>
          <Input value={streetName} onChange={(e) => handleStreetChange(e.target.value)} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} placeholder="Rue de la Loi" />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-card overflow-hidden">
              {suggestions.map((s, i) => (
                <button key={i} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => { setStreetName(s); setShowSuggestions(false); }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-24">
          <Label>Numéro</Label>
          <Input value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} placeholder="12" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Code postal</Label>
          <Input value={codePostal} disabled className="bg-muted" />
        </div>
        <div>
          <Label>Ville</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bruxelles" />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="mailing-b2b" checked={mailing} onCheckedChange={(v) => setMailing(!!v)} />
        <label htmlFor="mailing-b2b" className="text-xs text-muted-foreground leading-tight cursor-pointer">
          J'accepte de recevoir des communications commerciales de Crotte &amp; Go.
        </label>
      </div>

      <Button className="w-full" variant="cta" size="lg" onClick={handleB2BSubmit} disabled={submitting}>
        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Building2 className="w-4 h-4 mr-2" />}
        Envoyer ma demande de devis B2B 🏢
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAll(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "check" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <MapPin className="w-5 h-5 text-primary" />
                {isB2B ? "Vérifiez votre zone — Devis B2B" : "Vérifiez votre zone de ramassage"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="cp">Code postal</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="cp" placeholder="Ex: 1000" value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    maxLength={5}
                  />
                  <Button onClick={handleCheck} disabled={checkPostalCode.isPending || !codePostal.trim()}>
                    {checkPostalCode.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vérifier"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {step === "quote" && (
          <>
            {/* B2B flow */}
            {isB2B ? (
              quoteSubmitted ? <B2BSuccessScreen /> : <B2BForm />
            ) : (
              <>
                {/* Residential success screen */}
                {quoteSubmitted ? (
                  isSpecialLead ? <SpecialLeadSuccessScreen /> : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 space-y-4">
                      <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                      <h2 className="font-display text-2xl font-bold text-foreground">C'est tout bon ! 🎉</h2>
                      <p className="text-muted-foreground text-sm">
                        Merci ! Nous avons bien reçu votre demande de devis et vous contacterons rapidement par email.
                      </p>
                    </motion.div>
                  )
                ) : (
                  <>
                    {/* Green banner */}
                    <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-t-lg -mx-6 -mt-6 mb-4 font-display font-bold text-sm">
                      ⚡ Réclamez votre premier ramassage GRATUIT !
                    </div>
                    <DialogHeader>
                      <DialogTitle className="text-lg">Votre devis gratuit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      {/* Postal code + promo */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Code postal</Label>
                          <Input value={codePostal} disabled className="bg-muted" />
                        </div>
                        <div>
                          <Label>Code promo</Label>
                          <Input placeholder="Optionnel" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                        </div>
                      </div>

                      {/* Garden size tiles */}
                      <div>
                        <Label>Taille du jardin *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {gardenSizes.map((g) => (
                            <button
                              key={g.key} type="button"
                              onClick={() => setSelectedGardenSize(g.key)}
                              className={`rounded-xl border-2 p-3 text-center transition-all ${
                                selectedGardenSize === g.key
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border bg-card hover:border-muted-foreground/30"
                              }`}
                            >
                              <span className="text-xl block">{g.emoji}</span>
                              <span className="font-display font-bold text-sm text-foreground block">{g.label}</span>
                              <span className="text-[10px] text-muted-foreground">{g.range}</span>
                            </button>
                          ))}
                        </div>
                        <FieldError show={attempted && errors.gardenSize} />
                      </div>

                      {/* XL special message */}
                      {isXl && (
                        <div className="bg-accent/50 rounded-lg p-4 text-center">
                          <PawIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                          <p className="text-sm text-foreground font-display font-bold">
                            Votre jardin nécessite un devis personnalisé.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Remplissez vos coordonnées et nous vous contacterons rapidement !
                          </p>
                        </div>
                      )}

                      {/* Dog count slider */}
                      <div>
                        <Label className="flex items-center gap-2">
                          <Dog className="w-4 h-4 text-primary" />
                          Nombre de chiens : {dogCount[0] === 4 ? "4+" : dogCount[0]}
                        </Label>
                        <div className="relative mt-2">
                          <Slider value={dogCount} onValueChange={setDogCount} min={1} max={4} step={1} />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            {[1, 2, 3, "4+"].map((n, i) => <span key={i}>{n}</span>)}
                          </div>
                        </div>
                        {dogCount[0] === 4 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Pour 4 chiens et plus, nous vous contacterons pour adapter le devis.
                          </p>
                        )}
                      </div>

                      {/* Frequency slider — hidden for XL */}
                      {!isXl && (
                        <div>
                          <Label className="flex items-center gap-2">
                            <PawIcon className="w-4 h-4 text-primary" />
                            Fréquence : {frequencyLabel}
                          </Label>
                          <div className="relative mt-2">
                            <Slider value={freqIndex} onValueChange={setFreqIndex} min={0} max={4} step={1} />
                            <div className="flex justify-between mt-1 px-0">
                              {frequencies.map((f, i) => (
                                <span key={i} className="text-[9px] leading-tight text-muted-foreground text-center" style={{ width: "20%", display: "inline-block" }}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* "Sur devis" message for onetime */}
                      {isOnetime && !isXl && (
                        <div className="bg-accent/50 rounded-lg p-4 text-center">
                          <PawIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                          <p className="text-sm text-foreground font-display font-bold">
                            Sur devis — Nous vous contactons 🐾
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Les passages uniques font l'objet d'un devis personnalisé par notre équipe.
                          </p>
                        </div>
                      )}

                      {/* Contact info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Prénom *</Label>
                          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={attempted && errors.firstName ? "border-destructive" : ""} />
                          <FieldError show={attempted && errors.firstName} />
                        </div>
                        <div>
                          <Label>Nom *</Label>
                          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={attempted && errors.lastName ? "border-destructive" : ""} />
                          <FieldError show={attempted && errors.lastName} />
                        </div>
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={attempted && errors.email ? "border-destructive" : ""} />
                        <FieldError show={attempted && errors.email} msg={!email.trim() ? "Ce champ est obligatoire" : "Veuillez entrer un email valide"} />
                      </div>
                      <div>
                        <Label>Téléphone *</Label>
                        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={attempted && errors.phone ? "border-destructive" : ""} />
                        <FieldError show={attempted && errors.phone} msg={!phone.trim() ? "Ce champ est obligatoire" : "Veuillez entrer un numéro de téléphone belge valide (ex: 0470 12 34 56)"} />
                      </div>

                      {/* Referral source */}
                      <div>
                        <Label>Comment avez-vous entendu parler de nous ?</Label>
                        <Select value={referralSource} onValueChange={setReferralSource}>
                          <SelectTrigger><SelectValue placeholder="Choisir une option" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google">Google</SelectItem>
                            <SelectItem value="bouche_a_oreilles">Bouche à oreilles</SelectItem>
                            <SelectItem value="social">Réseaux sociaux</SelectItem>
                            <SelectItem value="flyer">Flyer / Dépliant</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Consent checkboxes — hidden after Phase 2 reveals */}
                      {!showFullForm && (
                        <>
                          <div className="flex items-start gap-2">
                            <Checkbox id="mailing" checked={mailing} onCheckedChange={(v) => setMailing(!!v)} />
                            <label htmlFor="mailing" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                              J'accepte de recevoir d'autres communications de Crotte &amp; Go.
                            </label>
                          </div>
                          <div>
                            <div className="flex items-start gap-2">
                              <Checkbox id="dataConsent" checked={dataConsent} onCheckedChange={(v) => setDataConsent(!!v)} />
                              <label htmlFor="dataConsent" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                                J'accepte que Crotte &amp; Go conserve et traite mes données personnelles conformément à la déclaration de confidentialité. <span className="text-destructive">*</span>
                              </label>
                            </div>
                            <FieldError show={attempted && errors.dataConsent} msg="Vous devez accepter le traitement de vos données pour continuer." />
                          </div>

                          {/* Phase 1 CTA */}
                          <Button className="w-full" variant="cta" size="lg" onClick={handlePhase1Submit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Obtenir mon devis gratuit 🐾
                          </Button>
                        </>
                      )}

                      {/* ═══════════════════════════════════════ */}
                      {/* PHASE 2 — Revealed after Phase 1 CTA   */}
                      {/* ═══════════════════════════════════════ */}
                      {showFullForm && !isSpecialLead && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-5"
                        >
                          {/* ── SECTION A: PRICE CARD ── */}
                          <div ref={priceCardRef}>
                            <Card className="border-2 border-primary/40 shadow-card overflow-hidden">
                              <div className="p-5 text-center space-y-3">
                                <h3 className="font-display font-bold text-base text-foreground">
                                  Devis pour passage {frequencyLabel}
                                </h3>
                                {pricingLoading ? (
                                  <Skeleton className="h-12 w-40 mx-auto" />
                                ) : displayPrice ? (
                                  <div>
                                    <span className="font-display text-5xl font-black text-primary">€{displayPrice}</span>
                                    <span className="text-sm text-muted-foreground ml-1">/ passage</span>
                                    {quarterlyBilling && (
                                      <span className="block text-xs text-primary font-semibold mt-1">−10% facturation trimestrielle appliquée</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Prix sur demande</span>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Estimation basée sur la taille de votre jardin et la fréquence de passage. Le devis final sera confirmé par notre équipe.
                                </p>
                              </div>
                            </Card>
                          </div>

                          {/* Promotional text */}
                          <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                              🎁 <strong>Votre premier nettoyage est 100% GRATUIT</strong> lors de la souscription à un service récurrent.
                              Ces nettoyages coûtent généralement 100 € et + en raison des déchets accumulés.
                            </p>
                            <p>
                              Limite : une promotion par client. Les passages uniques ne sont pas éligibles aux promotions.
                              Pour un devis de passage unique, nous vous répondrons par email.
                            </p>
                          </div>

                          {/* Yellow quarterly billing callout */}
                          <Card className="bg-accent/30 border-2 border-accent rounded-xl p-4">
                            <p className="text-sm font-bold text-foreground">
                              🏷️ Économisez 10% avec la facturation trimestrielle !
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Recevez 10% de réduction sur votre abonnement en optant pour la facturation trimestrielle.
                            </p>
                            <div className="flex items-start gap-2 mt-3">
                              <Checkbox id="quarterly" checked={quarterlyBilling} onCheckedChange={(v) => setQuarterlyBilling(!!v)} />
                              <label htmlFor="quarterly" className="text-xs text-foreground leading-tight cursor-pointer font-medium">
                                Oui, je souhaite bénéficier de la facturation trimestrielle (-10%)
                              </label>
                            </div>
                          </Card>

                          <Separator />

                          {/* ── SECTION B: INSCRIPTION ── */}
                          <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3 pb-2 border-b border-border">
                            📋 Vos informations
                          </h3>

                          {/* Address with BOSA autocomplete */}
                          <div className="flex gap-2">
                            <div className="flex-1 relative" ref={suggestionsRef}>
                              <Label>Nom de la rue</Label>
                              <Input value={streetName} onChange={(e) => handleStreetChange(e.target.value)} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} placeholder="Rue de la Loi" />
                              {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-card overflow-hidden">
                                  {suggestions.map((s, i) => (
                                    <button key={i} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => { setStreetName(s); setShowSuggestions(false); }}>
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="w-24">
                              <Label>Numéro</Label>
                              <Input value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} placeholder="12" />
                            </div>
                          </div>

                          {/* Gate code */}
                          <div>
                            <Label>Code de portail / instructions spéciales</Label>
                            <Textarea value={gateCode} onChange={(e) => setGateCode(e.target.value)} placeholder="Optionnel" rows={2} />
                          </div>

                          {/* Dog names */}
                          {dogCount[0] >= 1 && (
                            <div className="space-y-3">
                              <h4 className="font-display font-bold text-sm text-foreground">🐕 Infos sur vos chiens</h4>
                              {dogNames.map((dog, idx) => (
                                <div key={idx} className="space-y-2">
                                  <div>
                                    <Label>Nom du chien #{idx + 1}</Label>
                                    <Input placeholder="Rex" value={dog.name} onChange={(e) => {
                                      const updated = [...dogNames];
                                      updated[idx] = { ...updated[idx], name: e.target.value };
                                      setDogNames(updated);
                                    }} />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">
                                      Est-il sûr pour nous d'être dans le jardin avec le chien #{idx + 1} ?
                                    </Label>
                                    <Select value={dog.safe ? "yes" : "no"} onValueChange={(v) => {
                                      const updated = [...dogNames];
                                      updated[idx] = { ...updated[idx], safe: v === "yes" };
                                      setDogNames(updated);
                                    }}>
                                      <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="yes">Oui</SelectItem>
                                        <SelectItem value="no">Non</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {idx < dogNames.length - 1 && <Separator className="my-2" />}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Gate location */}
                          <div>
                            <Label>Où se trouve l'accès à votre jardin ?</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {gateLocationOptions.map((opt) => (
                                <button key={opt.value} type="button" onClick={() => setGateLocation(opt.value)}
                                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                                    gateLocation === opt.value
                                      ? "border-primary bg-primary/10 text-primary font-medium"
                                      : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            {gateLocation === "other" && (
                              <Textarea className="mt-2" placeholder="Précisez l'emplacement de l'accès à votre jardin" value={gateLocationOther} onChange={(e) => setGateLocationOther(e.target.value)} rows={2} />
                            )}
                          </div>

                          <Separator />

                          {/* ── SECTION C: FINALISATION ── */}
                          <div>
                            <Label>Commentaires supplémentaires</Label>
                            <Textarea rows={3} placeholder="Tout ce que nous devrions savoir..." value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} />
                          </div>

                          {/* Terms checkbox */}
                          <div>
                            <div className="flex items-start gap-2">
                              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
                              <label htmlFor="terms" className="text-sm text-foreground leading-tight cursor-pointer">
                                J'accepte les{" "}
                                <a href="/terms" target="_blank" className="text-primary underline">conditions générales de service</a>
                                {" "}<span className="text-destructive">*</span>
                              </label>
                            </div>
                            <FieldError show={attempted && errors.termsAccepted} msg="Vous devez accepter les conditions générales pour continuer." />
                          </div>

                          {/* hCaptcha placeholder */}
                          <div className="border border-border rounded-xl p-4 bg-muted/30 text-center">
                            <p className="text-xs text-muted-foreground">🤖 Vérification anti-robot (hCaptcha)</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Intégrez hCaptcha ici avec la librairie @hcaptcha/react-hcaptcha
                            </p>
                          </div>

                          {/* Final CTA */}
                          <Button className="w-full text-base" variant="hero" size="lg" onClick={handleFinalSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <PawIcon className="w-5 h-5 mr-2" />}
                            Démarrer mon service ! 🐾
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {step === "out_of_zone" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">Zone non desservie</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Notre service n'est peut-être pas encore disponible dans votre région. Veuillez vérifier votre code postal. S'il est incorrect, revenez en arrière pour le corriger. Sinon, laissez-nous vos coordonnées et nous reviendrons vers vous.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prénom *</Label>
                  <Input value={oozFirstName} onChange={(e) => setOozFirstName(e.target.value)} />
                </div>
                <div>
                  <Label>Nom *</Label>
                  <Input value={oozLastName} onChange={(e) => setOozLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={oozEmail} onChange={(e) => setOozEmail(e.target.value)} />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input type="tel" value={oozPhone} onChange={(e) => setOozPhone(e.target.value)} />
              </div>
              <div>
                <Label>Code postal</Label>
                <Input value={codePostal} disabled className="bg-muted" />
              </div>
              <div>
                <Label>Commentaire</Label>
                <Textarea value={oozComment} onChange={(e) => setOozComment(e.target.value)} rows={3} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("check")} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Modifier mon code postal
                </Button>
                <Button onClick={handleOozSubmit} disabled={oozSubmitting} className="flex-1">
                  {oozSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Envoyer ma demande
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostalCodeModal;
