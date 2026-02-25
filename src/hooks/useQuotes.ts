import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface LineItem {
  label: string;
  price: number;
}

export interface Quote {
  id: string;
  client_id: string;
  status: string;
  garden_size: string;
  dog_count: number;
  frequency: string;
  base_price: number;
  line_items: LineItem[];
  total_price: number;
  admin_notes: string | null;
  terms_text: string | null;
  accepted_at: string | null;
  accepted_by_name: string | null;
  preferred_day: string | null;
  token: string;
  stripe_checkout_session_id: string | null;
  stripe_customer_id: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapQuote(raw: any): Quote {
  return {
    ...raw,
    line_items: Array.isArray(raw.line_items) ? raw.line_items : [],
  };
}

export function useQuotes(clientId?: string) {
  return useQuery({
    queryKey: ["quotes", clientId],
    queryFn: async () => {
      let query = supabase.from("quotes").select("*").order("created_at", { ascending: false });
      if (clientId) query = query.eq("client_id", clientId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapQuote);
    },
    enabled: !!clientId,
  });
}

export function useQuoteByToken(token?: string) {
  return useQuery({
    queryKey: ["quote-token", token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, clients(first_name, last_name, email)")
        .eq("token", token!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { ...mapQuote(data), clients: (data as any).clients } as Quote & { clients: { first_name: string; last_name: string; email: string } };
    },
    enabled: !!token,
  });
}

export function useCreateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (quote: {
      client_id: string; status: string; garden_size: string; dog_count: number;
      frequency: string; base_price: number; line_items: LineItem[]; total_price: number;
      admin_notes: string | null; terms_text: string | null; preferred_day: string | null;
    }) => {
      const { data, error } = await supabase.from("quotes").insert({
        ...quote,
        line_items: quote.line_items as unknown as Json,
      }).select().single();
      if (error) throw error;
      return mapQuote(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}

export function useUpdateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      if (updates.line_items) updates.line_items = updates.line_items as unknown as Json;
      const { error } = await supabase.from("quotes").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}
