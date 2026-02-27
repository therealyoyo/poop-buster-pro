import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Loader2, Download, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface StripeInvoice {
  id: string;
  number: string | null;
  date: number;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  pdf_url: string | null;
  hosted_url: string | null;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  paid: { label: "Payée", variant: "default" },
  open: { label: "En attente", variant: "secondary" },
  void: { label: "Annulée", variant: "outline" },
  uncollectible: { label: "Impayée", variant: "destructive" },
  draft: { label: "Brouillon", variant: "outline" },
};

const ClientInvoices = () => {
  const [invoices, setInvoices] = useState<StripeInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [noCustomer, setNoCustomer] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-stripe-invoices");
        if (error) throw error;
        setInvoices(data.invoices || []);
        setHasSubscription(data.has_subscription || false);
        setNoCustomer(data.no_customer || false);
      } catch {
        toast.error("Erreur lors du chargement des factures.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-stripe-portal-session");
      if (error) throw error;
      if (data?.portal_url) window.location.href = data.portal_url;
    } catch {
      toast.error("Erreur lors de l'ouverture du portail de paiement.");
    } finally {
      setPortalLoading(false);
    }
  };

  const formatAmount = (cents: number, currency: string) => {
    return new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <FileText className="w-7 h-7 text-primary" />
          Mes factures
        </h1>

        {/* Manage subscription button */}
        {!loading && hasSubscription && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card mb-6">
              <CardContent className="pt-5 pb-5">
                <p className="text-sm text-muted-foreground mb-3">
                  Gérez votre mode de paiement, téléchargez vos factures ou annulez votre abonnement.
                </p>
                <Button variant="cta" className="rounded-full" onClick={handleBillingPortal} disabled={portalLoading}>
                  {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Gérer mon abonnement →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : noCustomer ? (
          <Card className="shadow-card">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Aucune facture disponible.</p>
            </CardContent>
          </Card>
        ) : invoices.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Aucune facture pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv, i) => {
              const st = statusLabels[inv.status] || { label: inv.status, variant: "outline" as const };
              return (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={st.variant}>{st.label}</Badge>
                            {inv.number && (
                              <span className="text-xs text-muted-foreground">#{inv.number}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(inv.date * 1000), "d MMMM yyyy", { locale: fr })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-display font-bold text-foreground whitespace-nowrap">
                            {formatAmount(inv.status === "paid" ? inv.amount_paid : inv.amount_due, inv.currency)}
                          </span>
                          {inv.pdf_url && (
                            <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" title="Télécharger PDF">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          {inv.hosted_url && (
                            <a href={inv.hosted_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" title="Voir en ligne">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInvoices;
