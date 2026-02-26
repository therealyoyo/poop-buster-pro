import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import PawIcon from "@/components/PawIcon";
import { DollarSign, TrendingUp, Wallet, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface FinancialRow {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  paid_at: string | null;
  created_at: string | null;
  clients: { first_name: string; last_name: string } | null;
}

const AdminBilling = () => {
  const { data: financials = [], isLoading } = useQuery({
    queryKey: ["billing-financials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financials")
        .select("id, amount, type, description, paid_at, created_at, clients(first_name, last_name)")
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return (data || []) as FinancialRow[];
    },
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const revenueThisMonth = financials
    .filter(f => (f.paid_at || f.created_at || "") >= monthStart)
    .reduce((s, f) => s + Number(f.amount), 0);

  const subscriptionRevenue = financials
    .filter(f => f.type === "subscription")
    .reduce((s, f) => s + Number(f.amount), 0);

  const totalRevenue = financials.reduce((s, f) => s + Number(f.amount), 0);

  const stats = [
    { label: "Revenu ce mois", value: `${revenueThisMonth.toFixed(0)} €`, icon: TrendingUp },
    { label: "Abonnements (total)", value: `${subscriptionRevenue.toFixed(0)} €`, icon: DollarSign },
    { label: "Revenu total", value: `${totalRevenue.toFixed(0)} €`, icon: Wallet },
  ];

  const renderRows = (rows: FinancialRow[]) => {
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
            Aucune transaction trouvée.
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((f, idx) => (
      <TableRow key={f.id}>
        <TableCell className="font-mono text-xs text-muted-foreground">#{idx + 1}</TableCell>
        <TableCell>{f.clients ? `${f.clients.first_name} ${f.clients.last_name}` : "—"}</TableCell>
        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
          {f.paid_at ? format(new Date(f.paid_at), "d MMM yyyy", { locale: fr }) : "—"}
        </TableCell>
        <TableCell>
          {f.type === "subscription" ? (
            <Badge variant="default">Abonnement</Badge>
          ) : (
            <Badge variant="secondary">Unique</Badge>
          )}
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{f.description || "—"}</TableCell>
        <TableCell className="text-right font-medium">{Number(f.amount).toFixed(2)} €</TableCell>
      </TableRow>
    ));
  };

  const subscriptions = financials.filter(f => f.type === "subscription");
  const oneOffs = financials.filter(f => f.type !== "subscription");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Facturation
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-2 rounded-xl bg-accent">
                  <s.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-24 mt-1" />
                  ) : (
                    <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="shadow-card">
          <CardHeader>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Tous ({financials.length})</TabsTrigger>
                <TabsTrigger value="sub">Abonnements ({subscriptions.length})</TabsTrigger>
                <TabsTrigger value="one">Uniques ({oneOffs.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : renderRows(financials)}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="sub">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{isLoading ? null : renderRows(subscriptions)}</TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="one">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{isLoading ? null : renderRows(oneOffs)}</TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AdminBilling;
