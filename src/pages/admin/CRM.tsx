import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PawIcon from "@/components/PawIcon";
import { useClients, useServiceZones } from "@/hooks/useClients";
import { useUnreadCount } from "@/hooks/useMessages";
import AddClientDialog from "@/components/admin/AddClientDialog";

const statusLabels: Record<string, string> = {
  prospect: "Prospect", active: "Actif", paused: "En pause", cancelled: "Annulé", inactive: "Inactif",
};
const frequencyLabels: Record<string, string> = {
  weekly: "Hebdo", biweekly: "Aux 2 sem.", monthly: "Mensuel", one_time: "Ponctuel",
};

const AdminCRM = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [freqFilter, setFreqFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const { data: clients = [], isLoading } = useClients({ search, status: statusFilter, zone: zoneFilter, frequency: freqFilter });
  const { data: zones = [] } = useServiceZones();
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-7 h-7 text-primary" />
            CRM Clients
          </h1>
          <div className="flex gap-2">
            <Link to="/admin/pipeline">
              <Button variant="outline" size="sm">Pipeline</Button>
            </Link>
            <Button variant="cta" size="sm" className="rounded-full" onClick={() => setShowAdd(true)}>
              <UserPlus className="w-4 h-4" /> Ajouter
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-card mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <Filter className="w-4 h-4 mr-1" /><SelectValue placeholder="Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les zones</SelectItem>
                  {zones.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={freqFilter} onValueChange={setFreqFilter}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Fréquence" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes fréquences</SelectItem>
                  {Object.entries(frequencyLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Zone</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Chiens</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Fréquence</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Statut</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link to={`/admin/clients/${c.id}`} className="hover:underline">
                          <p className="font-medium text-foreground">{c.first_name} {c.last_name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{c.zone_name || "—"}</td>
                      <td className="py-3 px-4 text-center">{c.dog_count} 🐕</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{c.service_frequency ? frequencyLabels[c.service_frequency] || c.service_frequency : "—"}</td>
                      <td className="py-3 px-4">
                        <Badge variant={c.status === "active" ? "default" : c.status === "paused" ? "secondary" : "destructive"}>
                          {statusLabels[c.status] || c.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link to={`/admin/clients/${c.id}`}>
                          <Button variant="ghost" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </div>
            )}
            {!isLoading && clients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun client trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddClientDialog open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
};

export default AdminCRM;
