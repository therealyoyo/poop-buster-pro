import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Camera, Clock, History, CalendarClock, X, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { uploadInterventionPhoto, useRescheduleIntervention } from "@/hooks/useInterventions";
import { supabase } from "@/integrations/supabase/client";

const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel", twice_weekly: "2x/semaine" };
const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const dayValues = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const dayFullLabels: Record<string, string> = {
  monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi", friday: "Vendredi", saturday: "Samedi",
};

interface TabInterventionsProps {
  client: any;
  interventions: any[];
  onUpdateClient: (data: any) => Promise<void>;
  onCompleteIntervention: (data: { id: string; photo_url?: string; completion_message?: string; client_id: string }) => Promise<void>;
  onCreateIntervention: (data: { client_id: string; scheduled_date: string }) => Promise<void>;
  isCompleting: boolean;
}

export default function TabInterventions({ client, interventions, onUpdateClient, onCompleteIntervention, onCreateIntervention, isCompleting }: TabInterventionsProps) {
  const [newDate, setNewDate] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionMsg, setCompletionMsg] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState<File | null>(null);
  const [pauseDate, setPauseDate] = useState<Date>();
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date>();
  const [rescheduleReason, setRescheduleReason] = useState("");
  const reschedule = useRescheduleIntervention();

  // Pending day change state
  const [pendingDay, setPendingDay] = useState<string | null>(null);
  const [pendingDay2, setPendingDay2] = useState<string | null>(null);
  const [sendingDayEmail, setSendingDayEmail] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const pastInterventions = interventions
    .filter(i => i.scheduled_date < today || i.status === "completed")
    .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());
  const futureInterventions = interventions
    .filter(i => i.scheduled_date >= today && i.status !== "completed")
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());

  const handleAdd = async () => {
    if (!newDate) return;
    await onCreateIntervention({ client_id: client.id, scheduled_date: newDate });
    setNewDate("");
    toast({ title: "Intervention planifiée !" });
  };

  const handleComplete = async (id: string) => {
    let photoUrl: string | undefined;
    if (completionPhoto) photoUrl = await uploadInterventionPhoto(completionPhoto);
    await onCompleteIntervention({ id, photo_url: photoUrl, completion_message: completionMsg || undefined, client_id: client.id });
    toast({ title: "Intervention terminée !" });
    setCompletingId(null); setCompletionMsg(""); setCompletionPhoto(null);
  };

  const handleReschedule = async (interventionId: string) => {
    if (!rescheduleDate) return;
    try {
      await reschedule.mutateAsync({
        intervention_id: interventionId,
        new_date: format(rescheduleDate, "yyyy-MM-dd"),
        reason: rescheduleReason || undefined,
      });
      toast({ title: "✅ Passage reprogrammé — Le client a été notifié par email." });
      setReschedulingId(null);
      setRescheduleDate(undefined);
      setRescheduleReason("");
    } catch (e: any) {
      toast({ title: "❌ Erreur", description: e.message, variant: "destructive" });
    }
  };

  const handleDaySelect = (day: string) => {
    setPendingDay(day);
  };

  const handleDay2Select = (day: string) => {
    setPendingDay2(day);
  };

  const handleConfirmDays = async () => {
    setSendingDayEmail(true);
    try {
      const updates: any = {};
      if (pendingDay) updates.preferred_day = pendingDay;
      if (pendingDay2) updates.preferred_day_2 = pendingDay2;
      await onUpdateClient(updates);

      const day1 = pendingDay || client.preferred_day;
      const day2 = pendingDay2 || client.preferred_day_2;
      const isTwice = client.service_frequency === "twice_weekly" && day1 && day2;
      const message = isTwice
        ? `Bonjour,\n\nVos nouveaux jours de ramassage sont le ${dayFullLabels[day1]} et le ${dayFullLabels[day2]}.\n\nL'équipe Crotte & Go®`
        : `Bonjour,\n\nVotre nouveau jour de ramassage est le ${dayFullLabels[day1 || ""]}.\n\nL'équipe Crotte & Go®`;

      await supabase.functions.invoke("send-client-email", {
        body: {
          client_id: client.id,
          subject: "📅 Mise à jour de votre jour de ramassage",
          message,
        },
      });

      toast({ title: `✅ Jours confirmés et email envoyé à ${client.email}` });
      setPendingDay(null);
      setPendingDay2(null);
    } catch (e: any) {
      toast({ title: "❌ Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSendingDayEmail(false);
    }
  };

  const hasPendingChange = pendingDay !== null || pendingDay2 !== null;
  const effectiveDay = pendingDay ?? client.preferred_day;
  const effectiveDay2 = pendingDay2 ?? client.preferred_day_2;

  const handleFreqChange = async (freq: string) => {
    try {
      await onUpdateClient({ service_frequency: freq });
      toast({ title: "✅ Fréquence mise à jour !" });
    } catch (e: any) {
      toast({ title: "❌ Erreur", description: e.message, variant: "destructive" });
    }
  };

  const handlePause = async () => {
    if (!pauseDate) return;
    await onUpdateClient({ paused_until: format(pauseDate, "yyyy-MM-dd") });
    toast({ title: "Service mis en pause ⏸" });
  };

  const handleClearPause = async () => {
    await onUpdateClient({ paused_until: null });
    toast({ title: "Pause annulée ▶️" });
  };

  const renderIntervention = (i: any, readonly = false) => (
    <div key={i.id} className={`p-3 rounded-lg border ${i.status === "completed" ? "bg-accent/30 border-accent" : "bg-card border-border"}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{format(new Date(i.scheduled_date), "d MMM yyyy", { locale: fr })}</span>
        <div className="flex items-center gap-2">
          {i.tech_name && <span className="text-xs text-muted-foreground">👷 {i.tech_name}</span>}
          <Badge variant={i.status === "completed" ? "default" : "secondary"}>
            {i.status === "completed" ? "Terminé ✅" : i.job_started_at && !i.completed_at ? "En cours 🔄" : "Planifié 🗓️"}
          </Badge>
        </div>
      </div>
      {i.photo_url && <img src={i.photo_url} alt="Photo" className="mt-2 rounded-lg max-h-24 object-cover" />}
      {i.completion_message && <p className="text-xs text-muted-foreground mt-1">{i.completion_message}</p>}

      {!readonly && i.status !== "completed" && completingId !== i.id && reschedulingId !== i.id && (
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setCompletingId(i.id)}>
            <CheckCircle2 className="w-3 h-3 mr-1" /> Marquer terminé
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => { setReschedulingId(i.id); setRescheduleDate(undefined); setRescheduleReason(""); }}>
            <CalendarClock className="w-3 h-3 mr-1" /> Reprogrammer
          </Button>
        </div>
      )}

      {completingId === i.id && (
        <div className="mt-2 space-y-2 p-2 bg-muted/30 rounded-lg">
          <Input placeholder="Message (optionnel)" value={completionMsg} onChange={e => setCompletionMsg(e.target.value)} />
          <input type="file" accept="image/*" capture="environment" ref={photoInputRef} className="hidden" onChange={e => setCompletionPhoto(e.target.files?.[0] || null)} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => photoInputRef.current?.click()}>
              <Camera className="w-3 h-3 mr-1" /> {completionPhoto ? completionPhoto.name.slice(0, 15) : "Photo"}
            </Button>
            <Button variant="cta" size="sm" className="flex-1" onClick={() => handleComplete(i.id)} disabled={isCompleting}>Confirmer</Button>
          </div>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => { setCompletingId(null); setCompletionPhoto(null); }}>Annuler</Button>
        </div>
      )}

      {reschedulingId === i.id && (
        <div className="mt-2 space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">📅 Reprogrammer ce passage</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReschedulingId(null)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("w-full justify-start text-left", !rescheduleDate && "text-muted-foreground")}>
                <Calendar className="w-3 h-3 mr-2" />
                {rescheduleDate ? format(rescheduleDate, "PPP", { locale: fr }) : "Choisir une nouvelle date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={rescheduleDate}
                onSelect={setRescheduleDate}
                disabled={(d) => d < new Date()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Textarea
            placeholder="Raison (optionnel) — ex: météo, congés..."
            value={rescheduleReason}
            onChange={e => setRescheduleReason(e.target.value)}
            className="text-sm min-h-[60px]"
          />
          <Button
            variant="cta"
            size="sm"
            className="w-full"
            disabled={!rescheduleDate || reschedule.isPending}
            onClick={() => handleReschedule(i.id)}
          >
            {reschedule.isPending ? "Envoi..." : "Confirmer & notifier le client ✉️"}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">Un email sera automatiquement envoyé au client</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Passages à venir ({futureInterventions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} min={today} />
              <Button size="sm" onClick={handleAdd} disabled={!newDate}>+ Planifier</Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {futureInterventions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucun passage planifié</p>}
              {futureInterventions.map(i => renderIntervention(i))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Historique des passages ({pastInterventions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {pastInterventions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucun passage effectué</p>}
              {pastInterventions.map(i => renderIntervention(i, true))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Planning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Jour préféré {client.service_frequency === 'twice_weekly' ? '(Jour 1)' : ''}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {dayLabels.map((label, idx) => (
                <Button key={dayValues[idx]} variant={effectiveDay === dayValues[idx] ? "default" : "outline"} size="sm" onClick={() => handleDaySelect(dayValues[idx])}>
                  {label}
                </Button>
              ))}
            </div>
          </div>
          {client.service_frequency === 'twice_weekly' && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Jour préféré (Jour 2)</p>
              <div className="grid grid-cols-3 gap-2">
                {dayLabels.map((label, idx) => {
                  if (dayValues[idx] === effectiveDay) return null;
                  return (
                    <Button
                      key={dayValues[idx]}
                      variant={effectiveDay2 === dayValues[idx] ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDay2Select(dayValues[idx])}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {hasPendingChange && (
            <Button
              className="w-full"
              onClick={handleConfirmDays}
              disabled={sendingDayEmail}
            >
              <Send className="w-4 h-4 mr-2" />
              {sendingDayEmail ? "Envoi..." : "Confirmer et envoyer email au client"}
            </Button>
          )}

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Fréquence</p>
            <Select value={client.service_frequency || "weekly"} onValueChange={handleFreqChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(freqLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Pause</p>
            {client.paused_until ? (
              <div className="flex items-center justify-between bg-accent/30 rounded-lg p-3">
                <span className="text-sm">⏸ Jusqu'au {format(new Date(client.paused_until), "d MMM yyyy", { locale: fr })}</span>
                <Button variant="outline" size="sm" onClick={handleClearPause}>Annuler</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-xs", !pauseDate && "text-muted-foreground")}>
                      {pauseDate ? format(pauseDate, "PPP", { locale: fr }) : "Date fin pause"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={pauseDate} onSelect={setPauseDate} disabled={(d) => d < new Date()} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <Button size="sm" onClick={handlePause} disabled={!pauseDate}>💤</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
