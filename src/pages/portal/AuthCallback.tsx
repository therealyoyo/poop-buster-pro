import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        toast.error("Erreur lors de la connexion Google.");
        navigate("/portal/login");
        return;
      }

      // Check if admin — redirect away
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (role?.role === "admin") {
        await supabase.auth.signOut();
        toast.error("Ce portail est réservé aux clients.");
        navigate("/portal/login");
        return;
      }

      // Check if this email corresponds to a known client
      const { data: client } = await supabase
        .from("clients")
        .select("id, status")
        .eq("email", session.user.email!)
        .maybeSingle();

      if (!client) {
        await supabase.auth.signOut();
        toast.error(
          "Aucun compte client trouvé pour cet email Google. Votre compte est créé automatiquement lors de l'acceptation de votre devis."
        );
        navigate("/portal/login");
        return;
      }

      // Link the auth user to the client if not already linked
      await supabase
        .from("clients")
        .update({ user_id: session.user.id })
        .eq("id", client.id)
        .is("user_id", null);

      toast.success("Connexion réussie ! 🐾");
      navigate("/portal");
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Connexion en cours...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
