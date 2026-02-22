import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Intervention {
  id: string;
  client_id: string;
  scheduled_date: string;
  status: string;
  completed_at: string | null;
  photo_url: string | null;
  completion_message: string | null;
  admin_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useInterventions(clientId?: string) {
  return useQuery({
    queryKey: ["interventions", clientId],
    queryFn: async () => {
      let query = supabase.from("interventions").select("*").order("scheduled_date", { ascending: false });
      if (clientId) query = query.eq("client_id", clientId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Intervention[];
    },
  });
}

export function useCompleteIntervention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, photo_url, completion_message, client_id }: { id: string; photo_url?: string; completion_message?: string; client_id: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("interventions").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        photo_url,
        completion_message,
        admin_id: session.user.id,
      }).eq("id", id);
      if (error) throw error;

      // Send auto-message to client
      const msg = completion_message
        ? `Votre jardin vient d'être nettoyé ! ${completion_message} 🐾`
        : "Votre jardin vient d'être nettoyé ! Voici une photo de votre portail fermé. 🐾";

      await supabase.from("messages").insert({
        client_id,
        sender_id: session.user.id,
        sender_role: "admin",
        content: msg,
        intervention_id: id,
        photo_url,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interventions"] });
      qc.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useCreateIntervention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (intervention: { client_id: string; scheduled_date: string }) => {
      const { error } = await supabase.from("interventions").insert(intervention);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interventions"] }),
  });
}

export async function uploadInterventionPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("intervention-photos").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("intervention-photos").getPublicUrl(path);
  return data.publicUrl;
}
