import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PawIcon from "@/components/PawIcon";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const email = params.get("email");

  useEffect(() => {
    if (!email) { setStatus("error"); return; }
    const doUnsub = async () => {
      const { error: ce } = await supabase.from("clients")
        .update({ newsletter_sub: false, mailing_consent: false })
        .eq("email", email);
      await supabase.from("leads")
        .update({ mailing_consent: false } as any)
        .eq("email", email);
      setStatus(ce ? "error" : "done");
    };
    doUnsub();
  }, [email]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <PawIcon className="w-12 h-12 text-primary mx-auto" />
        {status === "loading" && <p className="text-muted-foreground">Traitement en cours...</p>}
        {status === "done" && (
          <>
            <h1 className="font-display text-2xl font-bold">Vous êtes désabonné(e) ✓</h1>
            <div className="text-muted-foreground text-sm space-y-1">
              <p>L'adresse {email} a été retirée de notre liste.</p>
              <p>Vous pouvez vous réinscrire à tout moment depuis votre espace client.</p>
            </div>
          </>
        )}
        {status === "error" && <p className="text-destructive">Une erreur s'est produite. Contactez yoni@crotteandgo.be</p>}
      </div>
    </div>
  );
};

export default Unsubscribe;
