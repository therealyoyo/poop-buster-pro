import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Camera as CameraIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PawIcon from "@/components/PawIcon";
import { motion } from "framer-motion";

interface MessageItem {
  id: string;
  content: string;
  sender_role: string;
  photo_url: string | null;
  created_at: string;
  intervention_id: string | null;
}

interface InterventionItem {
  id: string;
  scheduled_date: string;
  status: string;
  photo_url: string | null;
  completion_message: string | null;
  completed_at: string | null;
}

const ClientMessages = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [interventions, setInterventions] = useState<InterventionItem[]>([]);
  const [msgText, setMsgText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (clientData) {
        setClientId(clientData.id);
        await loadData(clientData.id);
      }
      setLoading(false);
    };
    init();
  }, []);

  const loadData = async (cid: string) => {
    const [{ data: msgs }, { data: ints }] = await Promise.all([
      supabase.from("messages").select("*").eq("client_id", cid).order("created_at", { ascending: true }),
      supabase.from("interventions").select("*").eq("client_id", cid).eq("status", "completed").order("scheduled_date", { ascending: false }),
    ]);
    setMessages((msgs || []) as MessageItem[]);
    setInterventions((ints || []) as InterventionItem[]);
  };

  // Realtime
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel(`client-messages-${clientId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` }, () => {
        loadData(clientId);
        toast({ title: "Nouveau message ! 🐾" });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [clientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!msgText.trim() || !clientId) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("messages").insert({
      client_id: clientId,
      sender_id: session.user.id,
      sender_role: "client",
      content: msgText,
    });
    setMsgText("");
    await loadData(clientId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground">Votre compte client n'est pas encore configuré.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
          <PawIcon className="w-6 h-6 text-primary" /> Messages & Visites
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Messages</CardTitle></CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 mb-3 p-2 bg-muted/30 rounded-lg">
                {messages.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Aucun message</p>}
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender_role === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${m.sender_role === "client" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                      <p>{m.content}</p>
                      {m.photo_url && <img src={m.photo_url} alt="Photo" className="mt-1 rounded-lg max-w-full max-h-40 object-cover" />}
                      <p className={`text-[10px] mt-1 ${m.sender_role === "client" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {format(new Date(m.created_at), "d MMM HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input placeholder="Écrire un message..." value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} />
                <Button size="icon" onClick={handleSend} disabled={!msgText.trim()}><Send className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>

          {/* Interventions / Visites */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><CameraIcon className="w-4 h-4 text-primary" /> Historique des visites</CardTitle></CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto space-y-3">
                {interventions.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Aucune visite terminée</p>}
                {interventions.map(i => (
                  <motion.div key={i.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg border border-border bg-card">
                    <p className="text-sm font-medium text-foreground">{format(new Date(i.scheduled_date), "d MMMM yyyy", { locale: fr })}</p>
                    {i.photo_url && (
                      <img src={i.photo_url} alt="Photo intervention" className="mt-2 rounded-lg w-full max-h-48 object-cover" />
                    )}
                    {i.completion_message && <p className="text-sm text-muted-foreground mt-2">{i.completion_message}</p>}
                    <p className="text-xs text-accent-foreground mt-1">✅ Nettoyé</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientMessages;
