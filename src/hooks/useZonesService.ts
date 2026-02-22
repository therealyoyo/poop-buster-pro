import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ZoneService {
  id: string;
  code_postal: string;
  zone: string;
  actif: boolean;
  created_at: string;
}

export function useZonesService() {
  return useQuery({
    queryKey: ["zones_service"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones_service")
        .select("*")
        .order("code_postal");
      if (error) throw error;
      return data as ZoneService[];
    },
  });
}

export function useActiveZones() {
  return useQuery({
    queryKey: ["zones_service", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones_service")
        .select("*")
        .eq("actif", true)
        .order("code_postal");
      if (error) throw error;
      return data as ZoneService[];
    },
  });
}

export function useCheckPostalCode() {
  return useMutation({
    mutationFn: async (codePostal: string) => {
      const { data, error } = await supabase
        .from("zones_service")
        .select("*")
        .eq("code_postal", codePostal.trim())
        .eq("actif", true)
        .maybeSingle();
      if (error) throw error;
      return data as ZoneService | null;
    },
  });
}

export function useAddPostalCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ code_postal, zone }: { code_postal: string; zone: string }) => {
      const { error } = await supabase.from("zones_service").insert({ code_postal, zone });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["zones_service"] }),
  });
}

export function useDeletePostalCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("zones_service").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["zones_service"] }),
  });
}

export function useToggleZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ zone, actif }: { zone: string; actif: boolean }) => {
      const { error } = await supabase
        .from("zones_service")
        .update({ actif })
        .eq("zone", zone);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["zones_service"] }),
  });
}
