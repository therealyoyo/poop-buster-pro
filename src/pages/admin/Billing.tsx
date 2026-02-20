import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PawIcon from "@/components/PawIcon";
import { DollarSign, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const invoices = [
  { id: "FAC-001", client: "Sophie Tremblay", amount: 180, status: "Payée", date: "1 fév. 2026", due: "15 fév. 2026" },
  { id: "FAC-002", client: "Marc Leblanc", amount: 80, status: "Payée", date: "1 fév. 2026", due: "15 fév. 2026" },
  { id: "FAC-003", client: "Émilie Gagnon", amount: 290, status: "En attente", date: "1 fév. 2026", due: "15 fév. 2026" },
  { id: "FAC-004", client: "Jacques Morin", amount: 400, status: "En attente", date: "1 fév. 2026", due: "15 fév. 2026" },
  { id: "FAC-005", client: "Thomas Roy", amount: 45, status: "En retard", date: "1 jan. 2026", due: "15 jan. 2026" },
  { id: "FAC-006", client: "Lisa Côté", amount: 180, status: "Payée", date: "1 fév. 2026", due: "15 fév. 2026" },
  { id: "FAC-007", client: "David Lavoie", amount: 90, status: "En attente", date: "1 fév. 2026", due: "28 fév. 2026" },
  { id: "FAC-008", client: "Anne Bouchard", amount: 60, status: "En retard", date: "1 déc. 2025", due: "15 déc. 2025" },
];

const stats = [
  { label: "Payées ce mois", value: "440 $", icon: CheckCircle, count: 3 },
  { label: "En attente", value: "780 $", icon: Clock, count: 3 },
  { label: "En retard", value: "105 $", icon: AlertTriangle, count: 2 },
];

const AdminBilling = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payée": return <Badge variant="default">{status}</Badge>;
      case "En attente": return <Badge variant="secondary">{status}</Badge>;
      case "En retard": return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Facturation
          </h1>
          <Button variant="cta" size="sm" className="rounded-full">
            <DollarSign className="w-4 h-4" /> Créer une facture
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-2 rounded-xl bg-accent">
                  <s.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.count} factures</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="paid">Payées</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="overdue">En retard</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Facture</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Échéance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-3 px-4 font-mono text-sm text-primary font-medium">{inv.id}</td>
                      <td className="py-3 px-4 text-foreground">{inv.client}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{inv.date}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{inv.due}</td>
                      <td className="py-3 px-4">{getStatusBadge(inv.status)}</td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">{inv.amount} $</td>
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

export default AdminBilling;
