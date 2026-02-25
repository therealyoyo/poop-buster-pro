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
import { useCheckPostalCode } from "@/hooks/useZonesService";
import { usePricingRules, findMatchingPrice } from "@/hooks/usePricingRules";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, ArrowLeft, Dog, Loader2 } from "lucide-react";
import PawIcon from "@/components/PawIcon";

type Step = "check" | "quote" | "out_of_zone";

const frequencies = [
  "Deux fois par semaine",
  "Hebdomadaire",
  "Toutes les deux semaines",
  "Une fois par mois",
  "Passage unique",
];

const freqToKey: Record<number, string> = {
  0: "weekly", // 2x/week mapped to weekly pricing
  1: "weekly",
  2: "biweekly",
  3: "monthly",
  4: "onetime",
};

const gardenSizes = [
  { key: "small", label: "Petit", range: "0 – 250 m²", emoji: "🌱" },
  { key: "medium", label: "Moyen", range: "251 – 750 m²", emoji: "🌿" },
  { key: "large", label: "Grand", range: "751 – 1 500 m²", emoji: "🌳" },
  { key: "xl", label: "Très grand", range: "1 500 m² et +", emoji: "🏞️" },
];

const PostalCodeModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
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
  const [selectedGardenSize, setSelectedGardenSize] = useState("");

  const [gateCode, setGateCode] = useState("");
  const [dataConsent, setDataConsent] = useState(false);
  const [mailing, setMailing] = useState(false);
  const [referralSource, setReferralSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Address autocomplete
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

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
    setSelectedGardenSize("");
    setGateCode("");
    setDataConsent(false);
    setMailing(false);
    setReferralSource("");
    setAttempted(false);
    setSuggestions([]);
    setOozFirstName("");
    setOozLastName("");
    setOozEmail("");
    setOozPhone("");
    setOozComment("");
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

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Price calculation
  const isXl = selectedGardenSize === "xl";
  const freqKey = freqToKey[freqIndex[0]];
  const matchedRule = pricingRules && selectedGardenSize && !isXl
    ? findMatchingPrice(pricingRules, selectedGardenSize, dogCount[0], freqKey)
    : undefined;
  const estimatedPrice = matchedRule
    ? matchedRule.base_price + (dogCount[0] - 1) * 4
    : null;

  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const errors = {
    firstName: !firstName.trim(),
    lastName: !lastName.trim(),
    email: !email.trim() || !isValidEmail,
    phone: !phone.trim(),
    streetName: !streetName.trim(),
    streetNumber: !streetNumber.trim(),
    gardenSize: !selectedGardenSize,
    dataConsent: !dataConsent,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleQuoteSubmit = async () => {
    setAttempted(true);
    if (hasErrors) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    const address = `${streetName} ${streetNumber}, ${codePostal}`;
    const serviceFrequency = isXl ? "custom" : frequencies[freqIndex[0]];
    try {
      const clientData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        street_name: streetName,
        street_number: streetNumber,
        city: zone,
        postal_code: codePostal,
        dog_count: dogCount[0],
        garden_size: selectedGardenSize,
        service_frequency: serviceFrequency,
        referral_source: referralSource || null,
        mailing_consent: mailing,
        data_processing_consent: true,
        gate_code: gateCode || null,
        internal_notes: promoCode ? `Code promo: ${promoCode}` : null,
        status: "prospect",
        pipeline_stage: "new",
      };

      const { error: clientError } = await supabase.from("clients").insert(clientData);
      if (clientError) throw clientError;

      // Also insert into leads
      await supabase.from("leads").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        street_name: streetName,
        street_number: streetNumber,
        city: zone,
        postal_code: codePostal,
        dog_count: dogCount[0],
        garden_size: selectedGardenSize,
        service_frequency: serviceFrequency,
        referral_source: referralSource || null,
        mailing_consent: mailing,
        data_processing_consent: true,
        status: "new",
      });

      toast.success("Votre demande de devis a été envoyée ! 🐾");
      resetAll();
      onOpenChange(false);
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
        first_name: oozFirstName,
        last_name: oozLastName,
        email: oozEmail,
        phone: oozPhone || null,
        code_postal: codePostal,
        commentaire: oozComment || null,
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

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAll(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "check" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <MapPin className="w-5 h-5 text-primary" />
                Vérifiez votre zone de ramassage
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="cp">Code postal</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="cp"
                    placeholder="Ex: 1000"
                    value={codePostal}
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
            <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-t-lg -mx-6 -mt-6 mb-4 font-display font-bold text-sm">
              ⚡ Réclamez votre premier ramassage GRATUIT !
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg">Votre devis gratuit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
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
                      key={g.key}
                      type="button"
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
                    Fréquence : {frequencies[freqIndex[0]]}
                  </Label>
                  <div className="relative mt-2">
                    <Slider value={freqIndex} onValueChange={setFreqIndex} min={0} max={4} step={1} />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      {frequencies.map((f, i) => <span key={i} className="text-center max-w-[60px]">{f.split(" ").slice(0, 2).join(" ")}</span>)}
                    </div>
                  </div>
                </div>
              )}

              {/* Price estimate */}
              {!isXl && selectedGardenSize && (
                <div className="bg-accent/50 rounded-lg p-3 text-center">
                  {pricingLoading ? (
                    <Skeleton className="h-6 w-40 mx-auto" />
                  ) : estimatedPrice ? (
                    <>
                      <span className="font-display font-bold text-lg text-primary">à partir de €{estimatedPrice.toFixed(0)}</span>
                      <span className="text-xs text-muted-foreground"> / passage</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Prix sur demande</span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prénom *</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={attempted && errors.firstName ? "border-destructive" : ""}
                  />
                  <FieldError show={attempted && errors.firstName} />
                </div>
                <div>
                  <Label>Nom *</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={attempted && errors.lastName ? "border-destructive" : ""}
                  />
                  <FieldError show={attempted && errors.lastName} />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={attempted && errors.email ? "border-destructive" : ""}
                />
                <FieldError show={attempted && errors.email} msg={!email.trim() ? "Ce champ est obligatoire" : "Veuillez entrer un email valide"} />
              </div>
              <div>
                <Label>Téléphone *</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={attempted && errors.phone ? "border-destructive" : ""}
                />
                <FieldError show={attempted && errors.phone} />
              </div>

              {/* Address: street + number */}
              <div className="flex gap-2">
                <div className="flex-1 relative" ref={suggestionsRef}>
                  <Label>Nom de la rue *</Label>
                  <Input
                    value={streetName}
                    onChange={(e) => handleStreetChange(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Rue de la Loi"
                    className={attempted && errors.streetName ? "border-destructive" : ""}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-card overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => {
                            setStreetName(s);
                            setShowSuggestions(false);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <FieldError show={attempted && errors.streetName} />
                </div>
                <div className="w-24">
                  <Label>Numéro *</Label>
                  <Input
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    placeholder="12"
                    className={attempted && errors.streetNumber ? "border-destructive" : ""}
                  />
                  <FieldError show={attempted && errors.streetNumber} />
                </div>
              </div>

              <div>
                <Label>Code de portail / instructions spéciales</Label>
                <Textarea value={gateCode} onChange={(e) => setGateCode(e.target.value)} placeholder="Optionnel" rows={2} />
              </div>
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

              {/* Consent checkboxes */}
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

              {/* Submit */}
              {!isXl ? (
                <Button className="w-full" size="lg" onClick={handleQuoteSubmit} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Obtenir mon devis gratuit 🐾
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handleQuoteSubmit} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Demander un devis personnalisé 🐾
                </Button>
              )}
            </div>
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
