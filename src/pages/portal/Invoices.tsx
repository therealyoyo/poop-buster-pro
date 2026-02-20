import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const invoices = [
  { id: "FAC-087", date: "1 fév. 2026", amount: 180, status: "Payée", items: "Ramassage hebdo + Désodorisation" },
  { id: "FAC-074", date: "1 jan. 2026", amount: 180, status: "Payée", items: "Ramassage hebdo + Désodorisation" },
  { id: "FAC-061", date: "1 déc. 2025", amount: 180, status: "Payée", items: "Ramassage hebdo + Désodorisation" },
  { id: "FAC-048", date: "1 nov. 2025", amount: 150, status: "Payée", items: "Ramassage hebdo" },
  { id: "FAC-035", date: "1 oct. 2025", amount: 150, status: "Payée", items: "Ramassage hebdo" },
];

const ClientInvoices = () => {
  const handleDownload = (id: string) => {
    toast.success(`Téléchargement de ${id}... 📄`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <FileText className="w-7 h-7 text-primary" />
          Historique des factures
        </h1>

        <div className="space-y-4">
          {invoices.map(inv => (
            <Card key={inv.id} className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-primary font-medium">{inv.id}</span>
                      <Badge variant="default">Payée</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{inv.items}</p>
                    <p className="text-xs text-muted-foreground mt-1">{inv.date}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-lg font-display font-bold text-foreground">{inv.amount} $</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(inv.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientInvoices;
