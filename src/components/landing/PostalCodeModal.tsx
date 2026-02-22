import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useCheckPostalCode } from "@/hooks/useZonesService";
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
  const [address, setAddress] = useState("");
  
  const [gateCode, setGateCode] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    setAddress("");
    
    setGateCode("");
    setRgpd(false);
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

  const handleQuoteSubmit = async () => {
    if (!firstName || !lastName || !email || !phone || !address || !rgpd) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("clients").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        dog_count: dogCount[0],
        service_frequency: frequencies[freqIndex[0]],
        gate_code: gateCode || null,
        garden_size: null,
        status: "prospect",
        pipeline_stage: "new",
        internal_notes: promoCode ? `Code promo: ${promoCode}` : null,
      });
      if (error) throw error;
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

              {/* Dog count slider */}
              <div>
                <Label className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-primary" />
                  Nombre de chiens : {dogCount[0]}
                </Label>
                <div className="relative mt-2">
                  <Slider value={dogCount} onValueChange={setDogCount} min={1} max={4} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    {[1, 2, 3, 4].map(n => <span key={n}>{n}</span>)}
                  </div>
                </div>
              </div>

              {/* Frequency slider */}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prénom *</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label>Nom *</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Téléphone *</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Adresse complète (Rue, numéro) *</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Code de portail / instructions spéciales</Label>
                <Textarea value={gateCode} onChange={(e) => setGateCode(e.target.value)} placeholder="Optionnel" rows={2} />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="rgpd" checked={rgpd} onCheckedChange={(v) => setRgpd(!!v)} />
                <label htmlFor="rgpd" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                  J'accepte de recevoir des communications de Crotte & Go. Vous pouvez vous désinscrire à tout moment.
                </label>
              </div>
              <Button className="w-full" size="lg" onClick={handleQuoteSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Obtenir mon devis gratuit 🐾
              </Button>
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
