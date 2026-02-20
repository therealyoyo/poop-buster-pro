import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PawIcon from "@/components/PawIcon";
import { DollarSign, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const invoices = [
  { id: "INV-001", client: "Sarah Johnson", amount: 180, status: "Paid", date: "Feb 1, 2026", due: "Feb 15, 2026" },
  { id: "INV-002", client: "Mike Chen", amount: 80, status: "Paid", date: "Feb 1, 2026", due: "Feb 15, 2026" },
  { id: "INV-003", client: "Emily Davis", amount: 290, status: "Pending", date: "Feb 1, 2026", due: "Feb 15, 2026" },
  { id: "INV-004", client: "James Brown", amount: 400, status: "Pending", date: "Feb 1, 2026", due: "Feb 15, 2026" },
  { id: "INV-005", client: "Tom Wilson", amount: 45, status: "Overdue", date: "Jan 1, 2026", due: "Jan 15, 2026" },
  { id: "INV-006", client: "Lisa Park", amount: 180, status: "Paid", date: "Feb 1, 2026", due: "Feb 15, 2026" },
  { id: "INV-007", client: "David Lee", amount: 90, status: "Pending", date: "Feb 1, 2026", due: "Feb 28, 2026" },
  { id: "INV-008", client: "Anna Kim", amount: 60, status: "Overdue", date: "Dec 1, 2025", due: "Dec 15, 2025" },
];

const stats = [
  { label: "Paid This Month", value: "$440", icon: CheckCircle, count: 3 },
  { label: "Pending", value: "$780", icon: Clock, count: 3 },
  { label: "Overdue", value: "$105", icon: AlertTriangle, count: 2 },
];

const AdminBilling = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid": return <Badge variant="default">{status}</Badge>;
      case "Pending": return <Badge variant="secondary">{status}</Badge>;
      case "Overdue": return <Badge variant="destructive">{status}</Badge>;
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
            Billing & Invoices
          </h1>
          <Button variant="hero" size="sm">
            <DollarSign className="w-4 h-4" /> Create Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent">
                  <s.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.count} invoices</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoice Table */}
        <Card className="shadow-card">
          <CardHeader>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Due</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
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
                      <td className="py-3 px-4 text-right font-medium text-foreground">${inv.amount}</td>
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
