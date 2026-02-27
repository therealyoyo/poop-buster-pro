import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PawIcon from "@/components/PawIcon";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useArchiveClient, useDeleteClient } from "@/hooks/useClients";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusLabels: Record<string, string> = {
  prospect: "Prospect", active: "Actif", paused: "En pause", cancelled: "Annulé", inactive: "Inactif",
};

const pipelineLabels: Record<string, { label: string; emoji: string }> = {
  new: { label: "Nouveau", emoji: "🐾" },
  new_lead: { label: "Nouveau", emoji: "🐾" },
  qualified_lead: { label: "Qualifié", emoji: "🏷️" },
  quote_sent: { label: "Devis envoyé", emoji: "📧" },
  active: { label: "Actif", emoji: "✅" },
  inactive: { label: "Inactif", emoji: "⏸" },
  winback: { label: "Winback", emoji: "🔄" },
};

interface ClientHeaderProps {
  client: any;
  onStatusChange: (status: string) => void;
  onOpenQuoteBuilder: () => void;
  onClearPause: () => void;
}

export default function ClientHeader({ client, onStatusChange, onOpenQuoteBuilder, onClearPause }: ClientHeaderProps) {
  const navigate = useNavigate();
  const archiveClient = useArchiveClient();
  const deleteClient = useDeleteClient();

  const canGenerateQuote = client.pipeline_stage === "new" || client.pipeline_stage === "new_lead" || client.pipeline_stage === "qualified_lead" || client.pipeline_stage === "quote_sent";
  const pipeline = pipelineLabels[client.pipeline_stage] || { label: client.pipeline_stage, emoji: "❓" };

  const handleArchive = async () => {
    try {
      await archiveClient.mutateAsync(client.id);
      toast({ title: "Client archivé (statut → Annulé) ✓" });
      navigate("/admin/clients");
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient.mutateAsync(client.id);
      toast({ title: "Client supprimé définitivement ✓" });
      navigate("/admin/clients");
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Link to="/admin/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour aux clients
      </Link>

      {client.paused_until && (
        <div className="bg-accent/50 border border-primary/20 rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">⏸ Service en pause jusqu'au {format(new Date(client.paused_until), "d MMMM yyyy", { locale: fr })}</span>
          <Button variant="outline" size="sm" onClick={onClearPause}>Reprendre ▶️</Button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-6 h-6 text-primary" />
            {client.first_name} {client.last_name}
          </h1>
          <Badge variant="outline" className="text-xs">
            {pipeline.emoji} {pipeline.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {canGenerateQuote && (
            <Button variant="cta" size="sm" className="rounded-full" onClick={onOpenQuoteBuilder}>
              📋 Générer un devis
            </Button>
          )}
          <Select value={client.status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Bouton Archiver */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-1" /> Archiver
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archiver ce client ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Le statut du client sera mis à « Annulé ». Vous pourrez le retrouver et le réactiver à tout moment. Cette action est réversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>Archiver</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Bouton Supprimer */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer définitivement ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les données liées à ce client (devis, passages, messages, historique) seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Supprimer définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
