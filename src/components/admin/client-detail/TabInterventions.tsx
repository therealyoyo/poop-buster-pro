import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Camera, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { uploadInterventionPhoto } from "@/hooks/useInterventions";

const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel", twice_weekly: "2x/semaine" };
const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const dayValues = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

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

  const handleDaySelect = async (day: string) => {
    await onUpdateClient({ preferred_day: day });
    toast({ title: "Jour de visite mis à jour !" });
  };

  const handleFreqChange = async (freq: string) => {
    await onUpdateClient({ service_frequency: freq });
    toast({ title: "Fréquence mise à jour !" });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interventions list */}
      <div className="lg:col-span-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Interventions ({interventions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              <Button size="sm" onClick={handleAdd} disabled={!newDate}>+ Planifier</Button>
            </div>
            <div className="max-h-[500px] overflow-y-auto space-y-2">
              {interventions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune intervention</p>}
              {interventions.map(i => (
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
                  {i.status !== "completed" && completingId !== i.id && (
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setCompletingId(i.id)}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Marquer comme terminé
                    </Button>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning sidebar */}
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
                <Button key={dayValues[idx]} variant={client.preferred_day === dayValues[idx] ? "default" : "outline"} size="sm" onClick={() => handleDaySelect(dayValues[idx])}>
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
                  if (dayValues[idx] === client.preferred_day) return null;
                  return (
                    <Button
                      key={dayValues[idx]}
                      variant={client.preferred_day_2 === dayValues[idx] ? "default" : "outline"}
                      size="sm"
                      onClick={async () => {
                        await onUpdateClient({ preferred_day_2: dayValues[idx] });
                        toast({ title: "Jour 2 mis à jour !" });
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
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
