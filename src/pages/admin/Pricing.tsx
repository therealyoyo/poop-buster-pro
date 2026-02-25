import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePricingRules, useUpdatePricingRule } from "@/hooks/usePricingRules";

const gardenLabels: Record<string, string> = {
  small: "Petit", medium: "Moyen", large: "Grand", xl: "Très grand",
};
const dogLabels: Record<string, string> = { "1-2": "1–2 chiens", "3-99": "3+ chiens" };
const freqOrder = ["weekly", "biweekly", "monthly", "onetime"];
const freqLabels: Record<string, string> = {
  weekly: "Hebdo", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel",
};
const gardenOrder = ["small", "medium", "large", "xl"];

const Pricing = () => {
  const { data: rules = [], isLoading } = usePricingRules();
  const updateRule = useUpdatePricingRule();
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleBlur = async (id: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;
    await updateRule.mutateAsync({ id, base_price: num });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const getRule = (garden: string, dogRange: string, freq: string) => {
    const [min, max] = dogRange === "1-2" ? [1, 2] : [3, 99];
    return rules.find(
      r => r.garden_size === garden && r.dog_count_min === min && r.dog_count_max === max && r.frequency === freq
    );
  };

  const rows = gardenOrder.flatMap(g => ["1-2", "3-99"].map(d => ({ garden: g, dogs: d })));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
            <PawIcon className="w-6 h-6 text-primary" /> Grille tarifaire 💰
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Ces prix s'appliquent automatiquement lors de la génération de devis. Vous pouvez toujours ajuster manuellement par devis.
          </p>
        </motion.div>

        <Card className="shadow-card">
          <CardContent className="pt-6 overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Taille</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Chiens</th>
                    {freqOrder.map(f => (
                      <th key={f} className="text-center py-3 px-2 font-semibold text-muted-foreground">{freqLabels[f]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <motion.tr
                      key={`${row.garden}-${row.dogs}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50"
                    >
                      <td className="py-2 px-2 font-medium text-foreground">{gardenLabels[row.garden]}</td>
                      <td className="py-2 px-2 text-muted-foreground">{dogLabels[row.dogs]}</td>
                      {freqOrder.map(freq => {
                        const rule = getRule(row.garden, row.dogs, freq);
                        if (!rule) return <td key={freq} className="py-2 px-2 text-center text-muted-foreground">—</td>;
                        return (
                          <td key={freq} className="py-2 px-2">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-muted-foreground">€</span>
                              <Input
                                type="number"
                                step="0.01"
                                defaultValue={rule.base_price}
                                className="w-20 text-center h-8"
                                onBlur={(e) => handleBlur(rule.id, e.target.value)}
                              />
                              {savedId === rule.id && <Check className="w-4 h-4 text-secondary" />}
                            </div>
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
