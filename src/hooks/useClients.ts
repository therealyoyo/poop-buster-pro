import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  zone_id: string | null;
  dog_count: number;
  garden_size: string | null;
  gate_code: string | null;
  status: string;
  pipeline_stage: string;
  service_frequency: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  zone_name?: string;
}

export function useClients(filters?: { zone?: string; status?: string; frequency?: string; search?: string }) {
  return useQuery({
    queryKey: ["clients", filters],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*, service_zones(name)")
        .order("created_at", { ascending: false });

      if (filters?.zone && filters.zone !== "all") {
        query = query.eq("zone_id", filters.zone);
      }
      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.frequency && filters.frequency !== "all") {
        query = query.eq("service_frequency", filters.frequency);
      }
      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((c: any) => ({
        ...c,
        zone_name: c.service_zones?.name || null,
      })) as Client[];
    },
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, service_zones(name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return { ...data, zone_name: (data as any).service_zones?.name || null } as Client;
    },
    enabled: !!id,
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { error } = await supabase.from("clients").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client"] });
    },
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: Omit<Client, "id" | "created_at" | "updated_at" | "zone_name">) => {
      const { error } = await supabase.from("clients").insert(client);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export interface Lead {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  dog_count: number | null;
  garden_size: string | null;
  service_frequency: string | null;
  status: string | null;
  lead_type: string | null;
  promo_code: string | null;
  mailing_consent: boolean | null;
  referral_source: string | null;
  additional_comments: string | null;
  created_at: string | null;
}

export function useLeads(filters?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .not("lead_type", "eq", "newsletter")
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }
      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Lead[];
    },
  });
}

export function useServiceZones() {
  return useQuery({
    queryKey: ["service_zones"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_zones").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}
