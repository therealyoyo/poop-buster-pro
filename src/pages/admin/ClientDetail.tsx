import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Camera, CheckCircle2, Calendar, Dog, MapPin, Key, Ruler } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useClient, useUpdateClient } from "@/hooks/useClients";
import { useMessages, useSendMessage, useMarkAsRead } from "@/hooks/useMessages";
import { useInterventions, useCompleteIntervention, useCreateIntervention, uploadInterventionPhoto } from "@/hooks/useInterventions";
import { useState, useRef, useEffect } from "react";
import PawIcon from "@/components/PawIcon";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  prospect: "Prospect", active: "Actif", paused: "En pause", cancelled: "Annulé", inactive: "Inactif",
};

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useClient(id!);
  const updateClient = useUpdateClient();
  const { data: messages = [] } = useMessages(id!);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead(id!);
  const { data: interventions = [] } = useInterventions(id!);
  const completeIntervention = useCompleteIntervention();
  const createIntervention = useCreateIntervention();

  const [msgText, setMsgText] = useState("");
  const [notes, setNotes] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionMsg, setCompletionMsg] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState<File | null>(null);
  const [newInterventionDate, setNewInterventionDate] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      markAsRead.mutate();
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    if (client) setNotes(client.internal_notes || "");
  }, [client]);

  if (isLoading || !client) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  const handleSendMsg = async () => {
    if (!msgText.trim()) return;
    await sendMessage.mutateAsync({ client_id: id!, content: msgText, sender_role: "admin" });
    setMsgText("");
  };

  const handleComplete = async (interventionId: string) => {
    try {
      let photoUrl: string | undefined;
      if (completionPhoto) {
        photoUrl = await uploadInterventionPhoto(completionPhoto);
      }
      await completeIntervention.mutateAsync({ id: interventionId, photo_url: photoUrl, completion_message: completionMsg || undefined, client_id: id! });
      toast({ title: "Intervention terminée !" });
      setCompletingId(null);
      setCompletionMsg("");
      setCompletionPhoto(null);
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleAddIntervention = async () => {
    if (!newInterventionDate) return;
    await createIntervention.mutateAsync({ client_id: id!, scheduled_date: newInterventionDate });
    setNewInterventionDate("");
    toast({ title: "Intervention planifiée !" });
  };

  const handleSaveNotes = async () => {
    await updateClient.mutateAsync({ id: id!, internal_notes: notes });
    toast({ title: "Notes sauvegardées" });
  };

  const handleStatusChange = async (status: string) => {
    await updateClient.mutateAsync({ id: id!, status });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Link to="/admin/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour aux clients
        </Link>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-6 h-6 text-primary" />
            {client.first_name} {client.last_name}
          </h1>
          <Select value={client.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Info */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display text-base">Coordonnées</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{client.email || "—"}</p>
                <p className="text-muted-foreground">{client.phone || "—"}</p>
                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {client.address || "—"}</p>
                <p className="flex items-center gap-1"><Dog className="w-3 h-3" /> {client.dog_count} chien(s)</p>
                <p className="flex items-center gap-1"><Ruler className="w-3 h-3" /> Jardin: {client.garden_size || "—"}</p>
                <p className="flex items-center gap-1"><Key className="w-3 h-3" /> Code: {client.gate_code || "—"}</p>
                <p>Zone: <Badge variant="secondary">{client.zone_name || "—"}</Badge></p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display text-base">Notes internes</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes..." />
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleSaveNotes}>Sauvegarder</Button>
              </CardContent>
            </Card>
          </div>

          {/* Center: Messages */}
          <div className="lg:col-span-1">
            <Card className="shadow-card h-full flex flex-col">
              <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> Messagerie</CardTitle></CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2 mb-3 p-2 bg-muted/30 rounded-lg">
                  {messages.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Aucun message</p>}
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${m.sender_role === "admin" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                        <p>{m.content}</p>
                        {m.photo_url && <img src={m.photo_url} alt="Photo" className="mt-1 rounded-lg max-w-full max-h-32 object-cover" />}
                        <p className={`text-[10px] mt-1 ${m.sender_role === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {format(new Date(m.created_at), "d MMM HH:mm", { locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Écrire un message..." value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMsg()} />
                  <Button size="icon" onClick={handleSendMsg} disabled={!msgText.trim()}><Send className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Interventions */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Interventions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input type="date" value={newInterventionDate} onChange={e => setNewInterventionDate(e.target.value)} />
                  <Button size="sm" onClick={handleAddIntervention} disabled={!newInterventionDate}>+</Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {interventions.map(i => (
                    <div key={i.id} className={`p-3 rounded-lg border ${i.status === "completed" ? "bg-accent/30 border-accent" : "bg-card border-border"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{format(new Date(i.scheduled_date), "d MMM yyyy", { locale: fr })}</span>
                        <Badge variant={i.status === "completed" ? "default" : "secondary"}>
                          {i.status === "completed" ? "Terminé" : i.status === "scheduled" ? "Planifié" : i.status}
                        </Badge>
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
                            <Button variant="cta" size="sm" className="flex-1" onClick={() => handleComplete(i.id)} disabled={completeIntervention.isPending}>
                              Confirmer
                            </Button>
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
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
