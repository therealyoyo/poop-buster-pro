import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TabFeedbackProps {
  clientId: string;
}

export default function TabFeedback({ clientId }: TabFeedbackProps) {
  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["client-feedback", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.filter(f => f.rating).length).toFixed(1)
    : null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" /> Feedback ({feedbacks.length})
          </CardTitle>
          {avgRating && (
            <Badge variant="secondary" className="text-sm">
              ⭐ {avgRating}/5
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-20 bg-muted rounded-lg animate-pulse" />
        ) : feedbacks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Aucun feedback reçu</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map(f => (
              <div key={f.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {f.rating && Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < f.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {f.created_at ? format(new Date(f.created_at), "d MMM yyyy", { locale: fr }) : ""}
                  </span>
                </div>
                {f.comment && <p className="text-sm text-foreground">{f.comment}</p>}
                {f.feedback_type && <Badge variant="outline" className="mt-1 text-xs">{f.feedback_type}</Badge>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
