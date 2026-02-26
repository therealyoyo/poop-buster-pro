import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TabMessagesProps {
  clientId: string;
  clientEmail: string | null;
  messages: any[];
  onSendMessage: (data: { client_id: string; content: string; sender_role: string }) => Promise<void>;
  onMarkAsRead: () => void;
}

export default function TabMessages({ clientId, clientEmail, messages, onSendMessage, onMarkAsRead }: TabMessagesProps) {
  const [msgText, setMsgText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      onMarkAsRead();
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!msgText.trim()) return;
    const msg = msgText;
    setMsgText("");
    try {
      await onSendMessage({ client_id: clientId, content: msg, sender_role: "admin" });
      if (clientEmail) {
        try {
          await supabase.functions.invoke("send-client-email", { body: { client_id: clientId, message: msg } });
        } catch (emailErr) {
          console.error("Email send failed:", emailErr);
          toast({ title: "Message envoyé mais erreur d'envoi email", variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Erreur envoi message", variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" /> Messagerie ({messages.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 mb-3 p-3 bg-muted/30 rounded-lg">
          {messages.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Aucun message</p>}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${m.sender_role === "admin" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                <p>{m.content}</p>
                {m.photo_url && <img src={m.photo_url} alt="Photo" className="mt-1 rounded-lg max-w-full max-h-32 object-cover" />}
                <div className={`flex items-center gap-1 mt-1 ${m.sender_role === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  <p className="text-[10px]">{format(new Date(m.created_at), "d MMM HH:mm", { locale: fr })}</p>
                  {m.sender_role === "admin" && m.email_sent_at && <span className="text-[10px]">✉️</span>}
                </div>
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
  );
}
