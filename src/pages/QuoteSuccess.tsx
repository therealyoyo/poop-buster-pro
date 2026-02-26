import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PawIcon from "@/components/PawIcon";
import { useQuoteByToken } from "@/hooks/useQuotes";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const dayLabelsMap: Record<string, string> = {
  monday: "lundi", tuesday: "mardi", wednesday: "mercredi",
  thursday: "jeudi", friday: "vendredi", saturday: "samedi",
};

const dayOptions: [string, string][] = [
  ["Lundi", "monday"], ["Mardi", "tuesday"], ["Mercredi", "wednesday"],
  ["Jeudi", "thursday"], ["Vendredi", "friday"], ["Samedi", "saturday"],
];

const QuoteSuccess = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { data: quote, isLoading } = useQuoteByToken(token || undefined);

  const isTwiceWeekly = quote?.frequency === "twice_weekly";
  const [day1, setDay1] = useState(quote?.preferred_day || "");
  const [day2, setDay2] = useState((quote as any)?.preferred_day_2 || "");
  const [daysSaved, setDaysSaved] = useState(false);

  const handleSaveDays = async () => {
    if (!quote?.client_id) return;
    await supabase.from("clients")
      .update({
        preferred_day: day1,
        ...(isTwiceWeekly ? { preferred_day_2: day2 } : {}),
      })
      .eq("id", quote.client_id);
    setDaysSaved(true);
    toast.success("Jours de passage enregistrés ! 🐾");
  };

  const generateIcs = () => {
    if (!quote) return;
    const day = quote.preferred_day || day1 || "monday";
    const now = new Date();
    const dayIdx = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(day);
    const diff = (dayIdx - now.getDay() + 7) % 7 || 7;
    const nextDate = new Date(now.getTime() + diff * 86400000);
    const dateStr = nextDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const freq = quote.frequency === "weekly" ? "WEEKLY" : quote.frequency === "biweekly" ? "WEEKLY;INTERVAL=2" : "MONTHLY";
    const rrule = quote.frequency !== "onetime" ? `\nRRULE:FREQ=${freq}` : "";

    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dateStr}\nDURATION:PT1H\nSUMMARY:Crotte & Go® - Visite de service 🐾${rrule}\nDESCRIPTION:Visite de nettoyage programmée\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crotte-and-go-passage.ics";
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full space-y-4">
        <Card className="shadow-card">
          <CardContent className="py-12 text-center space-y-4">
            <img src={logo} alt="Crotte & Go®" className="h-16 w-auto mx-auto" />
            <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.8, delay: 0.3 }}>
              <PawIcon className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold">
              Bienvenue chez Crotte & Go®, {clientName} !
            </h1>
            {dayLabel && (
              <p className="text-muted-foreground">
                On se voit le <strong>{dayLabel}</strong>. Votre jardin va être impeccable ! 🌿
              </p>
            )}
            <Button variant="cta" className="rounded-full" onClick={generateIcs}>
              📅 Ajouter au calendrier
            </Button>

            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Gérez vos passages, factures et messages depuis votre espace client.
              </p>
              <Link to="/portal">
                <Button variant="outline" className="rounded-full w-full">
                  🏠 Accéder à mon espace client Crotte & Go®
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Day selection if not already set */}
        {!daysSaved && !quote?.preferred_day && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg text-center">
                📅 Choisissez {isTwiceWeekly ? "vos jours" : "votre jour"} de passage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  {isTwiceWeekly ? "Jour 1" : "Jour préféré"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {dayOptions.map(([label, val]) => (
                    <Button key={val} variant={day1 === val ? "default" : "outline"} size="sm" onClick={() => setDay1(val)}>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {isTwiceWeekly && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Jour 2</p>
                  <div className="grid grid-cols-3 gap-2">
                    {dayOptions
                      .filter(([, val]) => val !== day1)
                      .map(([label, val]) => (
                        <Button key={val} variant={day2 === val ? "default" : "outline"} size="sm" onClick={() => setDay2(val)}>
                          {label}
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              <Button
                variant="cta"
                className="w-full rounded-full"
                onClick={handleSaveDays}
                disabled={!day1 || (isTwiceWeekly && !day2)}
              >
                ✅ Confirmer mes jours de passage
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default QuoteSuccess;
