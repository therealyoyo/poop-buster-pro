import Navbar from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useClient, useUpdateClient } from "@/hooks/useClients";
import { useMessages, useSendMessage, useMarkAsRead } from "@/hooks/useMessages";
import { useInterventions, useCompleteIntervention, useCreateIntervention } from "@/hooks/useInterventions";
import { useQuotes } from "@/hooks/useQuotes";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, RefreshCw, Calendar, FileText, MessageSquare, Star } from "lucide-react";
import QuoteBuilderDrawer from "@/components/admin/QuoteBuilderDrawer";
import ClientHeader from "@/components/admin/client-detail/ClientHeader";
import TabProfile from "@/components/admin/client-detail/TabProfile";
import TabCRM from "@/components/admin/client-detail/TabCRM";
import TabInterventions from "@/components/admin/client-detail/TabInterventions";
import TabQuotes from "@/components/admin/client-detail/TabQuotes";
import TabMessages from "@/components/admin/client-detail/TabMessages";
import TabFeedback from "@/components/admin/client-detail/TabFeedback";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useClient(id!);
  const updateClient = useUpdateClient();
  const { data: messages = [] } = useMessages(id!);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead(id!);
  const { data: interventions = [] } = useInterventions(id!);
  const completeIntervention = useCompleteIntervention();
  const createIntervention = useCreateIntervention();
  const { data: quotes = [] } = useQuotes(id!);
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);

  if (isLoading || !client) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  const handleUpdateClient = async (data: any) => {
    await updateClient.mutateAsync({ id: id!, ...data });
  };

  const unreadCount = messages.filter(m => m.sender_role === "client" && !m.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <ClientHeader
          client={client}
          onStatusChange={(status) => handleUpdateClient({ status })}
          onOpenQuoteBuilder={() => setQuoteDrawerOpen(true)}
          onClearPause={() => handleUpdateClient({ paused_until: null })}
        />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger value="profile" className="rounded-lg gap-1.5 data-[state=active]:bg-background">
              <User className="w-4 h-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="crm" className="rounded-lg gap-1.5 data-[state=active]:bg-background">
              <RefreshCw className="w-4 h-4" /> CRM
            </TabsTrigger>
            <TabsTrigger value="interventions" className="rounded-lg gap-1.5 data-[state=active]:bg-background">
              <Calendar className="w-4 h-4" /> Passages ({interventions.length})
            </TabsTrigger>
            <TabsTrigger value="quotes" className="rounded-lg gap-1.5 data-[state=active]:bg-background">
              <FileText className="w-4 h-4" /> Devis ({quotes.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg gap-1.5 data-[state=active]:bg-background relative">
              <MessageSquare className="w-4 h-4" /> Messages
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="rounded-lg gap-1.5 data-[state=active]:bg-background">
              <Star className="w-4 h-4" /> Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <TabProfile client={client} onUpdateClient={handleUpdateClient} />
          </TabsContent>

          <TabsContent value="crm">
            <TabCRM client={client} onUpdateClient={handleUpdateClient} />
          </TabsContent>

          <TabsContent value="interventions">
            <TabInterventions
              client={client}
              interventions={interventions}
              onUpdateClient={handleUpdateClient}
              onCompleteIntervention={(data) => completeIntervention.mutateAsync(data)}
              onCreateIntervention={(data) => createIntervention.mutateAsync(data)}
              isCompleting={completeIntervention.isPending}
            />
          </TabsContent>

          <TabsContent value="quotes">
            <TabQuotes quotes={quotes} />
          </TabsContent>

          <TabsContent value="messages">
            <TabMessages
              clientId={id!}
              clientEmail={client.email}
              messages={messages}
              onSendMessage={(data) => sendMessage.mutateAsync(data)}
              onMarkAsRead={() => markAsRead.mutate()}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <TabFeedback clientId={id!} />
          </TabsContent>
        </Tabs>
      </div>

      <QuoteBuilderDrawer
        open={quoteDrawerOpen}
        onOpenChange={setQuoteDrawerOpen}
        client={client}
      />
    </div>
  );
};

export default ClientDetail;
