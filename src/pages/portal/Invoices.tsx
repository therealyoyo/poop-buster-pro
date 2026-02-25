import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface FinancialRow {
  id: string; amount: number; type: string; description: string | null; paid_at: string;
}

const ClientInvoices = () => {
  const [financials, setFinancials] = useState<FinancialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      // Get client for this user
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (client) {
        const { data } = await supabase
          .from("financials")
          .select("id, amount, type, description, paid_at")
          .eq("client_id", client.id)
          .order("paid_at", { ascending: false });
        setFinancials((data || []) as FinancialRow[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-stripe-portal-session", {
        body: {},
      });
      if (error) throw error;
      if (data?.portal_url) window.location.href = data.portal_url;
    } catch {
      toast.error("Erreur lors de l'ouverture du portail de paiement.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <FileText className="w-7 h-7 text-primary" />
          Historique des factures
        </h1>

        {/* Billing Portal Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card mb-6">
            <CardContent className="pt-5 pb-5">
              <p className="text-sm text-muted-foreground mb-3">
                Gérez votre mode de paiement, téléchargez vos factures ou annulez votre abonnement.
              </p>
              <Button variant="cta" className="rounded-full" onClick={handleBillingPortal} disabled={portalLoading}>
                {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Ouvrir le portail facturation →
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : financials.length === 0 ? (
          <Card className="shadow-card"><CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Aucune facture pour le moment.</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-4">
            {financials.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant="default">{f.type === "subscription" ? "Récurrent" : "Ponctuel"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{f.description || "Paiement"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(f.paid_at), "d MMM yyyy", { locale: fr })}</p>
                      </div>
                      <span className="text-lg font-display font-bold text-foreground">€{Number(f.amount).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInvoices;
