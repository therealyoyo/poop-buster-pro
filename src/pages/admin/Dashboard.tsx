import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, AlertCircle, UserPlus, BarChart3, Calendar, Bell, Mail, RefreshCw, Zap, Clock } from "lucide-react";
import PawIcon from "@/components/PawIcon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useInterventions } from "@/hooks/useInterventions";
import { useClients } from "@/hooks/useClients";
import { useDashboardStats, useRevenueByMonth } from "@/hooks/useFinancials";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const AdminDashboard = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: interventions = [] } = useInterventions();
  const { data: clients = [] } = useClients();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData = [], isLoading: revenueLoading } = useRevenueByMonth();
  const todayInterventions = interventions.filter(i => i.scheduled_date === today);
  const [runningCRM, setRunningCRM] = useState(false);

  // Pipeline stats
  const pipelineStats = {
    new_lead: clients.filter(c => c.pipeline_stage === "new" || c.pipeline_stage === "new_lead").length,
    qualified: clients.filter(c => c.pipeline_stage === "qualified_lead").length,
    quote_sent: clients.filter(c => c.pipeline_stage === "quote_sent").length,
    active: clients.filter(c => c.pipeline_stage === "active").length,
    inactive: clients.filter(c => c.pipeline_stage === "inactive").length,
    winback: clients.filter(c => c.pipeline_stage === "winback").length,
  };

  // Alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ["admin-alerts"],
    queryFn: async () => {
      const items: { type: string; label: string; count: number; icon: string; link: string }[] = [];

      // Quotes pending > 5 days
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const { data: oldQuotes } = await supabase
        .from("quotes")
        .select("id")
        .eq("status", "sent")
        .lte("sent_at", fiveDaysAgo);
      if (oldQuotes?.length) items.push({ type: "warning", label: "Devis sans réponse (5j+)", count: oldQuotes.length, icon: "📋", link: "/admin/pipeline" });

      // Unread messages
      const { data: unread } = await supabase
        .from("messages")
        .select("id")
        .eq("sender_role", "client")
        .eq("is_read", false);
      if (unread?.length) items.push({ type: "info", label: "Messages non lus", count: unread.length, icon: "💬", link: "/admin/crm" });

      // Clients without intervention scheduled
      const activeClients = clients.filter(c => c.status === "active");
      if (activeClients.length) {
        const { data: scheduled } = await supabase
          .from("interventions")
          .select("client_id")
          .gte("scheduled_date", today)
          .eq("status", "scheduled");
        const scheduledClientIds = new Set((scheduled || []).map(i => i.client_id));
        const unscheduled = activeClients.filter(c => !scheduledClientIds.has(c.id)).length;
        if (unscheduled) items.push({ type: "warning", label: "Clients actifs sans visite planifiée", count: unscheduled, icon: "📅", link: "/admin/clients" });
      }

      // Follow-up dates due today or past
      const followUpDue = clients.filter(c => (c as any).follow_up_date && (c as any).follow_up_date <= today).length;
      if (followUpDue) items.push({ type: "action", label: "Suivis à faire aujourd'hui", count: followUpDue, icon: "📞", link: "/admin/pipeline" });

      return items;
    },
    enabled: clients.length > 0,
  });

  // Recent activity feed
  const { data: recentActivity = [] } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const items: { id: string; text: string; time: string; icon: string }[] = [];

      const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, first_name, last_name, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      for (const l of recentLeads || []) {
        items.push({
          id: `lead-${l.id}`,
          text: `Nouveau lead : ${l.first_name} ${l.last_name}`,
          time: l.created_at || "",
          icon: "🐾",
        });
      }

      const { data: recentMessages } = await supabase
        .from("messages")
        .select("id, sender_name, sender_role, created_at")
        .eq("sender_role", "client")
        .order("created_at", { ascending: false })
        .limit(3);
      for (const m of recentMessages || []) {
        items.push({
          id: `msg-${m.id}`,
          text: `Message de ${m.sender_name || "client"}`,
          time: m.created_at,
          icon: "💬",
        });
      }

      const { data: recentEmails } = await supabase
        .from("email_logs")
        .select("id, email_type, status, sent_at")
        .order("sent_at", { ascending: false })
        .limit(3);
      for (const e of recentEmails || []) {
        const typeLabels: Record<string, string> = {
          manual_chat: "Email envoyé",
          quote_followup: "Relance devis",
          winback: "Campagne winback",
        };
        items.push({
          id: `email-${e.id}`,
          text: `${typeLabels[e.email_type] || e.email_type} — ${e.status}`,
          time: e.sent_at || "",
          icon: e.status === "sent" ? "✉️" : "❌",
        });
      }

      return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
    },
  });

  const handleRunCRM = async () => {
    setRunningCRM(true);
    try {
      const { data, error } = await supabase.functions.invoke("crm-automation");
      if (error) throw error;
      const results = data?.results || {};
      const total = Object.values(results).reduce((s: number, v: any) => s + (v as number), 0);
      if ((total as number) > 0) {
        toast.success(`Automation CRM : ${total} client(s) mis à jour`, {
          description: `A:${results.A} B:${results.B} C:${results.C} D:${results.D} E:${results.E}`,
        });
      } else {
        toast.info("Aucune transition de pipeline détectée.");
      }
    } catch (e: any) {
      toast.error(e.message || "Erreur CRM automation");
    } finally {
      setRunningCRM(false);
    }
  };

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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleRunCRM} disabled={runningCRM}>
              <Zap className="w-4 h-4" /> {runningCRM ? "En cours..." : "Run CRM"}
            </Button>
            <Link to="/admin/clients">
              <Button variant="cta" size="sm" className="rounded-full"><UserPlus className="w-4 h-4" /> Ajouter un client</Button>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {alerts.map((alert, i) => (
                <Link key={i} to={alert.link}>
                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:-translate-y-0.5 cursor-pointer ${
                    alert.type === "warning" ? "bg-orange-500/10 border-orange-500/30" :
                    alert.type === "action" ? "bg-blue-500/10 border-blue-500/30" :
                    "bg-muted border-border"
                  }`}>
                    <span className="text-xl">{alert.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{alert.label}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">{alert.count}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

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

        {/* Pipeline Summary */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" /> Pipeline CRM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: "New", count: pipelineStats.new_lead, color: "bg-amber-500/20 text-amber-700", emoji: "🐾" },
                { label: "Qualifié", count: pipelineStats.qualified, color: "bg-blue-500/20 text-blue-700", emoji: "🏷️" },
                { label: "Devis", count: pipelineStats.quote_sent, color: "bg-purple-500/20 text-purple-700", emoji: "📧" },
                { label: "Actif", count: pipelineStats.active, color: "bg-green-500/20 text-green-700", emoji: "✅" },
                { label: "Inactif", count: pipelineStats.inactive, color: "bg-muted text-muted-foreground", emoji: "⏸" },
                { label: "Winback", count: pipelineStats.winback, color: "bg-orange-500/20 text-orange-700", emoji: "🔄" },
              ].map(stage => (
                <Link key={stage.label} to="/admin/pipeline">
                  <div className={`text-center p-3 rounded-xl ${stage.color} cursor-pointer hover:opacity-80 transition-opacity`}>
                    <p className="text-2xl font-display font-bold">{stage.count}</p>
                    <p className="text-xs font-medium">{stage.emoji} {stage.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Revenus (12 derniers mois)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="h-[250px] bg-muted rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
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

          {/* Activity Feed */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">Aucune activité récente</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map(a => (
                    <div key={a.id} className="flex items-start gap-2">
                      <span className="text-sm mt-0.5">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{a.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.time ? formatDistanceToNow(new Date(a.time), { addSuffix: true, locale: fr }) : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
