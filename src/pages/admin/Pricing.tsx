import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePricingRules, useUpdatePricingRule } from "@/hooks/usePricingRules";

const gardenOrder = ["small", "medium", "large", "xl"];
const gardenLabels: Record<string, string> = {
  small: "0–250 m²", medium: "251–750 m²", large: "751–1 500 m²", xl: "1 500 m²+",
};
const freqOrder = ["monthly", "biweekly", "weekly", "twice_weekly", "onetime"];
const freqLabels: Record<string, string> = {
  monthly: "1x/mois", biweekly: "2x/mois", weekly: "Hebdo", twice_weekly: "2x/sem.", onetime: "Ponctuel",
};

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

  const getRule = (garden: string, freq: string) => {
    return rules.find(
      r => r.garden_size === garden && r.frequency === freq && r.frequency !== "dog_surcharge"
    );
  };

  const dogSurchargeRule = rules.find(r => r.frequency === "dog_surcharge");

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
            Prix de base pour 1 chien par passage. Le supplément par chien supplémentaire est configurable ci-dessous.
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
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Surface</th>
                    {freqOrder.map(f => (
                      <th key={f} className="text-center py-3 px-2 font-semibold text-muted-foreground">{freqLabels[f]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gardenOrder.map((garden, i) => (
                    <motion.tr
                      key={garden}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50"
                    >
                      <td className="py-2 px-2 font-medium text-foreground">{gardenLabels[garden]}</td>
                      {freqOrder.map(freq => {
                        // XL or onetime → "Sur devis"
                        if (garden === "xl" || freq === "onetime") {
                          return (
                            <td key={freq} className="py-2 px-2 text-center text-muted-foreground text-xs italic">
                              Sur devis
                            </td>
                          );
                        }
                        const rule = getRule(garden, freq);
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

        {/* Dog surcharge field */}
        <Card className="shadow-card mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-lg">💶</span>
              <span className="font-display font-bold text-foreground">Supplément par chien supplémentaire :</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={dogSurchargeRule?.base_price ?? 10}
                  className="w-24 text-center h-8"
                  onBlur={(e) => {
                    if (dogSurchargeRule) handleBlur(dogSurchargeRule.id, e.target.value);
                  }}
                />
                <span className="text-muted-foreground">€ / mois</span>
                {savedId === dogSurchargeRule?.id && <Check className="w-4 h-4 text-secondary" />}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Ce montant mensuel est ajouté par chien au-delà du premier, puis réparti sur chaque passage.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
