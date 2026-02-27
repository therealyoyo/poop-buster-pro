import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ClientRouteProps {
  children: React.ReactNode;
}

const ClientRoute = ({ children }: ClientRouteProps) => {
  const [state, setState] = useState<"loading" | "authorized" | "no_session" | "no_client">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/portal/login", { replace: true });
        return;
      }
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!client) {
        setState("no_client");
        return;
      }
      setState("authorized");
    };
    check();
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (state === "no_client") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <p className="text-lg font-medium text-foreground">Aucun profil client associé à ce compte.</p>
          <p className="text-muted-foreground">Veuillez contacter l'administrateur pour lier votre compte.</p>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate("/portal/login", { replace: true }); }}
            className="text-primary underline hover:opacity-80"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ClientRoute;
