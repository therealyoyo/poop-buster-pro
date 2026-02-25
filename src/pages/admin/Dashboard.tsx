import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, AlertCircle, UserPlus, BarChart3, Calendar } from "lucide-react";
import PawIcon from "@/components/PawIcon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useInterventions } from "@/hooks/useInterventions";
import { useClients } from "@/hooks/useClients";
import { useDashboardStats, useRevenueByMonth } from "@/hooks/useFinancials";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const AdminDashboard = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: interventions = [] } = useInterventions();
  const { data: clients = [] } = useClients();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData = [], isLoading: revenueLoading } = useRevenueByMonth();
  const todayInterventions = interventions.filter(i => i.scheduled_date === today);

  const getClient = (clientId: string) => clients.find(cl => cl.id === clientId);

  const statCards = [
    { label: "MRR", value: stats ? `€${stats.mrr.toFixed(0)}` : "—", icon: DollarSign, change: "Ce mois" },
    { label: "Revenus totaux", value: stats ? `€${stats.totalRevenue.toFixed(0)}` : "—", icon: TrendingUp, change: "Tous les temps" },
    { label: "Clients actifs", value: stats ? `${stats.activeClients}` : "—", icon: Users, change: "Statut actif" },
    { label: "Leads perdus", value: stats ? `${stats.leadsLost}` : "—", icon: AlertCircle, change: "Devis refusés" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <PawIcon className="w-7 h-7 text-primary" /> Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-1">Bon retour ! Voici un aperçu de votre entreprise.</p>
          </div>
          <Link to="/admin/clients">
            <Button variant="cta" size="sm" className="rounded-full"><UserPlus className="w-4 h-4" /> Ajouter un client</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      {statsLoading ? (
                        <div className="h-8 w-20 bg-muted rounded animate-pulse mt-1" />
                      ) : (
                        <p className="text-2xl font-display font-bold text-foreground mt-1">{s.value}</p>
                      )}
                      <p className="text-xs text-primary mt-1">{s.change}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-accent"><s.icon className="w-5 h-5 text-accent-foreground" /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Revenus (12 derniers mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-[300px] bg-muted rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(180, 12%, 87%)" />
                  <XAxis dataKey="month" stroke="hsl(200, 12%, 42%)" fontSize={12} />
                  <YAxis stroke="hsl(200, 12%, 42%)" fontSize={12} tickFormatter={v => `€${v}`} />
                  <Tooltip
                    formatter={(v: number, name: string) => [`€${v.toFixed(2)}`, name === "recurring" ? "Récurrent" : "Ponctuel"]}
                    contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(180, 12%, 87%)" }}
                  />
                  <Bar dataKey="recurring" fill="hsl(174, 62%, 42%)" radius={[8, 8, 0, 0]} name="recurring" />
                  <Bar dataKey="oneOff" fill="hsl(36, 90%, 55%)" radius={[8, 8, 0, 0]} name="oneOff" />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Récurrent</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(36, 90%, 55%)" }} />
                <span className="text-muted-foreground">Ponctuel</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Agenda */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Agenda du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayInterventions.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">Aucune intervention prévue aujourd'hui 🎉</p>
              ) : (
                <div className="space-y-2">
                  {todayInterventions.map(intervention => {
                    const client = getClient(intervention.client_id);
                    const dogDetails = client ? (client as any).dog_details : [];
                    const dogNames = Array.isArray(dogDetails) ? dogDetails.map((d: any) => d.name).filter(Boolean).join(", ") : "";
                    const isInProgress = (intervention as any).job_started_at && !intervention.completed_at;

                    return (
                      <Link key={intervention.id} to={`/admin/clients/${intervention.client_id}`}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {client ? `${client.first_name} ${client.last_name}` : "Client"}
                              {dogNames && <span className="text-muted-foreground ml-2 text-xs">🐕 {dogNames}</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">{client?.address || ""}</p>
                            {intervention.tech_name && <p className="text-xs text-muted-foreground">👷 {intervention.tech_name}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {intervention.photo_url && <img src={intervention.photo_url} alt="" className="w-8 h-8 rounded object-cover" />}
                            {intervention.status === "completed" ? (
                              <Badge className="bg-accent text-accent-foreground">Terminé ✅</Badge>
                            ) : isInProgress ? (
                              <Badge className="bg-secondary text-secondary-foreground">En cours 🔄</Badge>
                            ) : (
                              <Badge variant="secondary">Planifié 🗓️</Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Clients */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Clients récents</CardTitle>
            <Link to="/admin/clients"><Button variant="ghost" size="sm">Voir tout →</Button></Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Nom</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Chiens</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Fréquence</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 5).map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="py-3 px-2">
                        <Link to={`/admin/clients/${c.id}`} className="font-medium text-foreground hover:underline">{c.first_name} {c.last_name}</Link>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{c.dog_count} 🐕</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.service_frequency || "—"}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === "active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
