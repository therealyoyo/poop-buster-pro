import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Filter, MessageSquare, Download, UserMinus, ArrowRight, FileText, Archive, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PawIcon from "@/components/PawIcon";
import { useClients, useServiceZones, useLeads, useUpdateLead, useCreateClient, useDeleteLead, useArchiveLead } from "@/hooks/useClients";
import type { Lead } from "@/hooks/useClients";
import { useUnreadCount } from "@/hooks/useMessages";
import AddClientDialog from "@/components/admin/AddClientDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import QuoteBuilderDrawer from "@/components/admin/QuoteBuilderDrawer";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  prospect: "Prospect", active: "Actif", paused: "En pause", cancelled: "Annulé", inactive: "Inactif",
};
const frequencyLabels: Record<string, string> = {
  weekly: "Hebdo", biweekly: "Aux 2 sem.", monthly: "Mensuel", one_time: "Ponctuel", twice_weekly: "2x/sem.",
};

const leadTypeOptions = [
  { value: "early_lead", label: "Prospect early", color: "bg-amber-100 text-amber-800" },
  { value: "qualified_lead", label: "Qualifié", color: "bg-green-100 text-green-800" },
  { value: "b2b", label: "B2B", color: "bg-blue-100 text-blue-800" },
];

const getLeadTypeColor = (type: string | null) => {
  return leadTypeOptions.find(o => o.value === type)?.color || "bg-muted text-muted-foreground";
};

const pipelineFilters = [
  { value: "all", label: "Tous" },
  { value: "new_lead", label: "🐾 Prospects" },
  { value: "quote_sent", label: "📧 Devis envoyés" },
  { value: "active", label: "✅ Actifs" },
  { value: "inactive", label: "⏸ Inactifs" },
];

const AdminCRM = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [freqFilter, setFreqFilter] = useState("all");
  const [pipelineFilter, setPipelineFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [quoteClient, setQuoteClient] = useState<any>(null);
  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();

  const { data: clients = [], isLoading } = useClients({ search, status: statusFilter, zone: zoneFilter, frequency: freqFilter });
  const { data: leads = [], isLoading: leadsLoading } = useLeads({ search, status: statusFilter });
  const { data: zones = [] } = useServiceZones();
  const { data: unreadCount = 0 } = useUnreadCount();
  const updateLead = useUpdateLead();
  const createClient = useCreateClient();
  const deleteLead = useDeleteLead();
  const archiveLead = useArchiveLead();

  const filteredClients = pipelineFilter === "all" ? clients : clients.filter(c => c.pipeline_stage === pipelineFilter);
  const filteredLeads = showArchived ? leads : leads.filter(l => l.status !== "archived");

  const handleLeadTypeChange = (leadId: string, newType: string) => {
    updateLead.mutate({ id: leadId, lead_type: newType } as any, {
      onSuccess: () => toast.success("Catégorie mise à jour ✓"),
      onError: () => toast.error("Erreur lors de la mise à jour"),
    });
  };

  const handleConvertLead = async (lead: Lead) => {
    try {
      const result = await createClient.mutateAsync({
        first_name: lead.first_name || "—",
        last_name: lead.last_name || "",
        email: lead.email,
        phone: lead.phone || null,
        address: lead.address || null,
        dog_count: lead.dog_count || 1,
        garden_size: lead.garden_size || null,
        service_frequency: lead.service_frequency || null,
        pipeline_stage: "new_lead",
        status: "prospect",
        user_id: null,
        zone_id: null,
        gate_code: null,
        internal_notes: null,
      } as any);
      if (!result?.id) throw new Error("ID manquant après création");
      await updateLead.mutateAsync({ id: lead.id, status: "converted" } as any);
      toast.success("Lead converti en client ✓");
      navigate(`/admin/clients/${result.id}`);
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
    }
  };

  // Newsletter contacts: deduplicated by email
  const newsletterContacts = (() => {
    const fromClients = clients
      .filter(c => (c as any).newsletter_sub || (c as any).mailing_consent)
      .map(c => ({ ...c, contactType: "Client" as const }));
    const fromLeads = leads
      .filter(l => (l as any).mailing_consent)
      .map(l => ({ ...l, contactType: "Lead" as const }));
    const all = [...fromClients, ...fromLeads];
    const seen = new Set<string>();
    return all.filter(c => {
      const e = (c as any).email;
      if (!e || seen.has(e)) return false;
      seen.add(e);
      return true;
    });
  })();

  const handleUnsubscribe = async (contact: any) => {
    if (contact.contactType === "Client") {
      await supabase.from("clients").update({ newsletter_sub: false, mailing_consent: false }).eq("id", contact.id);
    } else {
      await supabase.from("leads").update({ mailing_consent: false } as any).eq("id", contact.id);
    }
    toast.success(`${contact.email} désabonné(e) ✓`);
  };

  const handleExportCSV = () => {
    const emails = newsletterContacts.map(c => (c as any).email).filter(Boolean);
    const csv = "email\n" + emails.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${emails.length} emails exportés`);
  };

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

        {/* Tabs */}
        <Tabs defaultValue="clients">
          <TabsList className="mb-4">
            <TabsTrigger value="clients">Clients ({filteredClients.length})</TabsTrigger>
            <TabsTrigger value="leads">Leads ({filteredLeads.length})</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter 📨 ({newsletterContacts.length})</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients">
            {/* Pipeline quick filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {pipelineFilters.map(f => (
                <Button
                  key={f.value}
                  variant={pipelineFilter === f.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPipelineFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

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
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Dernière activité</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map(c => (
                        <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <Link to={`/admin/clients/${c.id}`} className="hover:underline">
                              <p className="font-medium text-foreground">
                                {c.first_name} {c.last_name}
                                {c.pipeline_stage === "quote_sent" && (
                                  <Badge className="ml-2 bg-orange-100 text-orange-800 border-0 text-xs">📧 Devis en attente</Badge>
                                )}
                              </p>
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
                          <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">
                            {formatDistanceToNow(new Date(c.updated_at), { locale: fr, addSuffix: true })}
                          </td>
                          <td className="py-3 px-4 text-center flex items-center justify-center gap-1">
                            <Link to={`/admin/clients/${c.id}`}>
                              <Button variant="ghost" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => setQuoteClient(c)}>
                              <FileText className="w-4 h-4 mr-1" /> Devis
                            </Button>
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
                {!isLoading && filteredClients.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun client trouvé.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? "Masquer archivés" : "📦 Voir archivés"}
              </Button>
            </div>
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Nom</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Téléphone</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Code postal</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Chiens</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Fréquence</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Catégorie</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Notes</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((l: Lead) => (
                        <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-medium text-foreground">{l.first_name || "—"} {l.last_name || ""}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{l.email}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{l.phone || "—"}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{l.postal_code || "—"}</td>
                          <td className="py-3 px-4 text-center">{l.dog_count ?? "—"}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{l.service_frequency || "—"}</td>
                          <td className="py-3 px-4">
                            <Select value={l.lead_type || "early_lead"} onValueChange={(v) => handleLeadTypeChange(l.id, v)}>
                              <SelectTrigger className={`h-7 w-[140px] text-xs font-medium border-0 ${getLeadTypeColor(l.lead_type)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {leadTypeOptions.map(o => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {l.created_at ? new Date(l.created_at).toLocaleDateString("fr-BE") : "—"}
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <Textarea
                              rows={1}
                              className="text-xs min-h-0 h-7 resize-none"
                              defaultValue={l.additional_comments || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (l.additional_comments || "")) {
                                  updateLead.mutate({ id: l.id, additional_comments: e.target.value } as any);
                                }
                              }}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1">
                              {l.status === "converted" ? (
                                <Badge className="bg-green-100 text-green-800 border-0">Converti ✓</Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConvertLead(l)}
                                  disabled={createClient.isPending}
                                >
                                  Convertir <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              )}
                              {l.status !== "archived" && l.status !== "converted" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    if (window.confirm("Archiver ce lead ?")) archiveLead.mutate(l.id);
                                  }}
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (window.confirm("Supprimer définitivement ? Action irréversible.")) deleteLead.mutate(l.id);
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {leadsLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  </div>
                )}
                {!leadsLoading && filteredLeads.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun lead trouvé.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="flex justify-end p-4 pb-0">
                  <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={newsletterContacts.length === 0}>
                    <Download className="w-4 h-4 mr-1" /> Exporter CSV
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Prénom</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Statut</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletterContacts.map((c: any) => (
                        <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium">{c.first_name || "—"}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{c.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={c.contactType === "Client" ? "default" : "secondary"}>{c.contactType}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{c.status || "—"}</td>
                          <td className="py-3 px-4 text-center">
                            <Button variant="ghost" size="sm" onClick={() => handleUnsubscribe(c)}>
                              <UserMinus className="w-4 h-4 mr-1" /> Désinscrire
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {newsletterContacts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun abonné newsletter.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddClientDialog open={showAdd} onClose={() => setShowAdd(false)} />
      {quoteClient && (
        <QuoteBuilderDrawer
          open={!!quoteClient}
          onOpenChange={(o) => { if (!o) setQuoteClient(null); }}
          client={quoteClient}
        />
      )}
    </div>
  );
};

export default AdminCRM;
