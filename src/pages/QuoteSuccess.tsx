import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PawIcon from "@/components/PawIcon";
import { useQuoteByToken } from "@/hooks/useQuotes";
import { Loader2 } from "lucide-react";

const dayLabelsMap: Record<string, string> = {
  monday: "lundi", tuesday: "mardi", wednesday: "mercredi",
  thursday: "jeudi", friday: "vendredi", saturday: "samedi",
};

const QuoteSuccess = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { data: quote, isLoading } = useQuoteByToken(token || undefined);

  const generateIcs = () => {
    if (!quote) return;
    const day = quote.preferred_day || "monday";
    const now = new Date();
    // Find next occurrence of preferred day
    const dayIdx = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(day);
    const diff = (dayIdx - now.getDay() + 7) % 7 || 7;
    const nextDate = new Date(now.getTime() + diff * 86400000);
    const dateStr = nextDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const freq = quote.frequency === "weekly" ? "WEEKLY" : quote.frequency === "biweekly" ? "WEEKLY;INTERVAL=2" : "MONTHLY";
    const rrule = quote.frequency !== "onetime" ? `\nRRULE:FREQ=${freq}` : "";

    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dateStr}\nDURATION:PT1H\nSUMMARY:Poop Buster Pro - Visite de service 🐾${rrule}\nDESCRIPTION:Visite de nettoyage programmée\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poop-buster-pro.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const clientName = quote?.clients?.first_name || "Client";
  const dayLabel = dayLabelsMap[quote?.preferred_day || ""] || quote?.preferred_day || "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
        <Card className="shadow-card">
          <CardContent className="py-12 text-center space-y-4">
            <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.8, delay: 0.3 }}>
              <PawIcon className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold">
              Bienvenue chez Poop Buster Pro, {clientName} !
            </h1>
            {dayLabel && (
              <p className="text-muted-foreground">
                On se voit le <strong>{dayLabel}</strong>. Votre jardin va être impeccable ! 🌿
              </p>
            )}
            <Button variant="cta" className="rounded-full" onClick={generateIcs}>
              📅 Ajouter au calendrier
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuoteSuccess;
