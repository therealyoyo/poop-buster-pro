import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Financial {
  id: string;
  client_id: string | null;
  stripe_event_id: string | null;
  amount: number;
  currency: string;
  type: string;
  stripe_invoice_id: string | null;
  stripe_subscription_id: string | null;
  description: string | null;
  paid_at: string;
  created_at: string;
}

export function useFinancials(clientId?: string) {
  return useQuery({
    queryKey: ["financials", clientId],
    queryFn: async () => {
      let query = supabase.from("financials").select("*").order("paid_at", { ascending: false });
      if (clientId) query = query.eq("client_id", clientId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Financial[];
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [financialsRes, clientsRes, quotesRes] = await Promise.all([
        supabase.from("financials").select("amount, type, paid_at"),
        supabase.from("clients").select("id, status"),
        supabase.from("quotes").select("id, status").eq("status", "declined"),
      ]);

      const financials = (financialsRes.data || []) as Financial[];
      const clients = clientsRes.data || [];
      const declinedQuotes = quotesRes.data || [];

      const mrr = financials
        .filter(f => f.type === "subscription" && f.paid_at >= monthStart)
        .reduce((sum, f) => sum + Number(f.amount), 0);

      const totalRevenue = financials.reduce((sum, f) => sum + Number(f.amount), 0);
      const activeClients = clients.filter(c => c.status === "active").length;

      return { mrr, totalRevenue, activeClients, leadsLost: declinedQuotes.length };
    },
  });
}

export function useRevenueByMonth() {
  return useQuery({
    queryKey: ["revenue-by-month"],
    queryFn: async () => {
      const { data, error } = await supabase.from("financials").select("amount, type, paid_at");
      if (error) throw error;
      const financials = (data || []) as Financial[];

      const months: Record<string, { recurring: number; oneOff: number }> = {};
      const now = new Date();

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        months[key] = { recurring: 0, oneOff: 0 };
      }

      for (const f of financials) {
        const d = new Date(f.paid_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (months[key]) {
          if (f.type === "subscription") months[key].recurring += Number(f.amount);
          else months[key].oneOff += Number(f.amount);
        }
      }

      const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      return Object.entries(months).map(([key, val]) => {
        const monthIdx = parseInt(key.split("-")[1]) - 1;
        return { month: labels[monthIdx], recurring: val.recurring, oneOff: val.oneOff };
      });
    },
  });
}
