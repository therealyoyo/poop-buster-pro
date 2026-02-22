import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, AlertCircle, UserPlus, BarChart3 } from "lucide-react";
import PawIcon from "@/components/PawIcon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total clients", value: "127", icon: Users, change: "+8 ce mois" },
  { label: "Clients actifs", value: "98", icon: UserPlus, change: "77 % actifs" },
  { label: "Revenus mensuels", value: "8 420 $", icon: DollarSign, change: "+12 % vs mois dernier" },
  { label: "Factures en attente", value: "14", icon: AlertCircle, change: "1 240 $ en attente" },
];

const revenueData = [
  { month: "Mar", revenue: 5200 }, { month: "Avr", revenue: 5800 },
  { month: "Mai", revenue: 6100 }, { month: "Juin", revenue: 6900 },
  { month: "Juil", revenue: 7200 }, { month: "Août", revenue: 7500 },
  { month: "Sep", revenue: 7100 }, { month: "Oct", revenue: 7800 },
  { month: "Nov", revenue: 8000 }, { month: "Déc", revenue: 7600 },
  { month: "Jan", revenue: 8100 }, { month: "Fév", revenue: 8420 },
];

const serviceBreakdown = [
  { name: "Ramassage", value: 8420, color: "hsl(174, 62%, 42%)" },
];

const recentClients = [
  { name: "Sophie Tremblay", dogs: 2, plan: "Hebdo", status: "Actif", revenue: "180 $/mo" },
  { name: "Marc Leblanc", dogs: 1, plan: "Aux 2 sem.", status: "Actif", revenue: "80 $/mo" },
  { name: "Émilie Gagnon", dogs: 3, plan: "Hebdo", status: "Actif", revenue: "240 $/mo" },
  { name: "Thomas Roy", dogs: 1, plan: "Mensuel", status: "Pausé", revenue: "45 $/mo" },
  { name: "Lisa Côté", dogs: 2, plan: "Hebdo", status: "Actif", revenue: "180 $/mo" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <PawIcon className="w-7 h-7 text-primary" />
              Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-1">Bon retour ! Voici un aperçu de votre entreprise.</p>
          </div>
          <Link to="/admin/clients">
            <Button variant="cta" size="sm" className="rounded-full">
              <UserPlus className="w-4 h-4" /> Ajouter un client
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-display font-bold text-foreground mt-1">{s.value}</p>
                      <p className="text-xs text-primary mt-1">{s.change}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-accent">
                      <s.icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Revenus (12 derniers mois)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(180, 12%, 87%)" />
                  <XAxis dataKey="month" stroke="hsl(200, 12%, 42%)" fontSize={12} />
                  <YAxis stroke="hsl(200, 12%, 42%)" fontSize={12} tickFormatter={v => `${v / 1000}k$`} />
                  <Tooltip
                    formatter={(v: number) => [`${v.toLocaleString()} $`, "Revenus"]}
                    contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(180, 12%, 87%)" }}
                  />
                  <Bar dataKey="revenue" fill="hsl(174, 62%, 42%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Service Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenus par service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5}>
                    {serviceBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} $`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {serviceBreakdown.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Clients récents</CardTitle>
            <Link to="/admin/clients">
              <Button variant="ghost" size="sm">Voir tout →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Nom</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Chiens</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Statut</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Revenus</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClients.map(c => (
                    <tr key={c.name} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="py-3 px-2 font-medium text-foreground">{c.name}</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.dogs} 🐕</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.plan}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "Actif" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-foreground">{c.revenue}</td>
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
