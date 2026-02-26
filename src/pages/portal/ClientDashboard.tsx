import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { Calendar, DollarSign, Star, MapPin, Dog, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ServiceHistoryFeed from "@/components/ServiceHistoryFeed";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  dog_count: number;
  address: string | null;
  service_frequency: string | null;
  paused_until: string | null;
}

const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel" };

const ClientDashboard = () => {
  const [client, setClient] = useState<ClientData | null>(null);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [nextVisit, setNextVisit] = useState<string | null>(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data: clientData } = await supabase
        .from("clients")
        .select("id, first_name, last_name, dog_count, address, service_frequency, paused_until")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!clientData) { setLoading(false); return; }
      setClient(clientData as ClientData);

      // Completed interventions
      const { data: completed } = await supabase
        .from("interventions")
        .select("*")
        .eq("client_id", clientData.id)
        .eq("status", "completed")
        .order("scheduled_date", { ascending: false })
        .limit(10);
      setInterventions(completed || []);
      setTotalVisits((completed || []).length);

      // Next scheduled
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: next } = await supabase
        .from("interventions")
        .select("scheduled_date")
        .eq("client_id", clientData.id)
        .eq("status", "scheduled")
        .gte("scheduled_date", today)
        .order("scheduled_date", { ascending: true })
        .limit(1);
      if (next?.length) setNextVisit(next[0].scheduled_date);

      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground">Compte client non trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <PawIcon className="w-7 h-7 text-primary animate-paw-bounce" />
              Bonjour, {client.first_name} ! 🐾
            </h1>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">Voici un résumé de votre service.</p>
        </motion.div>

        {/* Pause warning */}
        {client.paused_until && (
          <div className="bg-accent/50 border border-primary/20 rounded-xl p-3 mb-6">
            <span className="text-sm font-medium">⏸ Service en pause jusqu'au {format(new Date(client.paused_until), "d MMMM yyyy", { locale: fr })}</span>
          </div>
        )}

        {/* Stats Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-hero-gradient text-primary-foreground shadow-card mb-8 overflow-hidden relative">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" />
                <h2 className="font-display text-xl font-bold">Votre bilan</h2>
              </div>
              <p className="text-primary-foreground/90 text-lg">
                Votre jardin a été nettoyé <span className="font-bold text-primary-foreground">{totalVisits} fois</span> ! 💪🐕
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Votre service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fréquence</span>
                  <span className="font-medium text-foreground">{freqLabels[client.service_frequency || ""] || client.service_frequency || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochaine visite</span>
                  <span className="font-medium text-foreground">
                    {nextVisit ? format(new Date(nextVisit), "d MMM yyyy", { locale: fr }) : "Aucune planifiée"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Dog className="w-4 h-4" /> Chiens</span>
                  <span className="font-medium text-foreground">{client.dog_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> Adresse</span>
                  <span className="text-sm text-foreground">{client.address || "—"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" /> Facturation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/portal/invoices">
                  <Button variant="outline" size="sm" className="w-full">Voir les factures →</Button>
                </Link>
                <Link to="/portal/messages">
                  <Button variant="outline" size="sm" className="w-full">Messages →</Button>
                </Link>
                <Link to="/portal/settings">
                  <Button variant="outline" size="sm" className="w-full">Paramètres →</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Dernières visites</h2>
          <ServiceHistoryFeed interventions={interventions} isLoading={loading} />
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
