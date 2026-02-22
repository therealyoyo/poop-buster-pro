import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  sender_role: string;
  content: string;
  is_read: boolean;
  intervention_id: string | null;
  photo_url: string | null;
  created_at: string;
}

export function useMessages(clientId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!clientId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel(`messages-${clientId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["messages", clientId] });
          qc.invalidateQueries({ queryKey: ["unread_count"] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [clientId, qc]);

  return query;
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: { client_id: string; content: string; sender_role: string; intervention_id?: string; photo_url?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("messages").insert({
        ...msg,
        sender_id: session.user.id,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["messages", vars.client_id] });
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["unread_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false)
        .eq("sender_role", "client");
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useMarkAsRead(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("client_id", clientId)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["unread_count"] });
    },
  });
}
