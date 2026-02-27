import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          await handlePostLogin(session);
        } else if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
          subscription.unsubscribe();
          toast.error("Erreur lors de la connexion Google. Réessayez.");
          navigate("/portal/login");
        }
      }
    );

    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      toast.error("La connexion a pris trop de temps. Réessayez.");
      navigate("/portal/login");
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  const handlePostLogin = async (session: any) => {
    try {
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

      const { data: client } = await supabase
        .from("clients")
        .select("id, status, user_id")
        .eq("email", session.user.email!)
        .maybeSingle();

      if (!client) {
        await supabase.auth.signOut();
        toast.error(
          "Aucun compte client trouvé pour cet email. Votre compte est créé automatiquement lors de l'acceptation de votre devis."
        );
        navigate("/portal/login");
        return;
      }

      if (!client.user_id) {
        await supabase
          .from("clients")
          .update({ user_id: session.user.id })
          .eq("id", client.id);
      }

      toast.success("Connexion réussie ! 🐾");
      navigate("/portal");
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
      navigate("/portal/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Connexion Google en cours...</p>
        <p className="text-xs text-muted-foreground">Ne fermez pas cette page</p>
      </div>
    </div>
  );
};

export default AuthCallback;
