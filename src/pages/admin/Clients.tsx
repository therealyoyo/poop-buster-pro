import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter } from "lucide-react";
import { useState } from "react";
import PawIcon from "@/components/PawIcon";

const allClients = [
  { id: 1, name: "Sophie Tremblay", email: "sophie@courriel.com", address: "123 rue des Chênes", dogs: 2, plan: "Hebdo", status: "Actif", deodorizing: true, revenue: 2160, nextService: "22 fév. 2026" },
  { id: 2, name: "Marc Leblanc", email: "marc@courriel.com", address: "456 av. des Pins", dogs: 1, plan: "Aux 2 sem.", status: "Actif", deodorizing: false, revenue: 960, nextService: "25 fév. 2026" },
  { id: 3, name: "Émilie Gagnon", email: "emilie@courriel.com", address: "789 boul. des Érables", dogs: 3, plan: "Hebdo", status: "Actif", deodorizing: true, revenue: 3480, nextService: "21 fév. 2026" },
  { id: 4, name: "Thomas Roy", email: "thomas@courriel.com", address: "321 rue du Parc", dogs: 1, plan: "Mensuel", status: "Pausé", deodorizing: false, revenue: 540, nextService: "—" },
  { id: 5, name: "Lisa Côté", email: "lisa@courriel.com", address: "654 boul. des Cèdres", dogs: 2, plan: "Hebdo", status: "Actif", deodorizing: false, revenue: 1800, nextService: "23 fév. 2026" },
  { id: 6, name: "Jacques Morin", email: "jacques@courriel.com", address: "987 rue des Bouleaux", dogs: 4, plan: "Hebdo", status: "Actif", deodorizing: true, revenue: 4800, nextService: "22 fév. 2026" },
  { id: 7, name: "Anne Bouchard", email: "anne@courriel.com", address: "135 rue des Noyers", dogs: 1, plan: "Aux 2 sem.", status: "Annulé", deodorizing: false, revenue: 320, nextService: "—" },
  { id: 8, name: "David Lavoie", email: "david@courriel.com", address: "246 rue des Frênes", dogs: 2, plan: "Mensuel", status: "Actif", deodorizing: true, revenue: 720, nextService: "1 mars 2026" },
];

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = allClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-7 h-7 text-primary" />
            Gestion des clients
          </h1>
          <Button variant="cta" size="sm" className="rounded-full">
            <UserPlus className="w-4 h-4" /> Ajouter un client
          </Button>
        </div>

        <Card className="shadow-card mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou courriel..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <Filter className="w-4 h-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="pausé">Pausé</SelectItem>
                  <SelectItem value="annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Adresse</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Chiens</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Statut</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Désodo.</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Prochain service</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Revenus</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{c.address}</td>
                      <td className="py-3 px-4 text-center">{c.dogs} 🐕</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{c.plan}</td>
                      <td className="py-3 px-4">
                        <Badge variant={c.status === "Actif" ? "default" : c.status === "Pausé" ? "secondary" : "destructive"}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center hidden lg:table-cell">{c.deodorizing ? "✅" : "—"}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">{c.nextService}</td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">{c.revenue.toLocaleString()} $</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun client trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClients;
