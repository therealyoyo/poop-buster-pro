import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PricingRule {
  id: string;
  garden_size: string;
  dog_count_min: number;
  dog_count_max: number;
  frequency: string;
  base_price: number;
  created_at: string;
  updated_at: string;
}

export function usePricingRules() {
  return useQuery({
    queryKey: ["pricing_rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_rules")
        .select("*")
        .order("garden_size")
        .order("dog_count_min")
        .order("frequency");
      if (error) throw error;
      return data as PricingRule[];
    },
  });
}

export function useUpdatePricingRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, base_price }: { id: string; base_price: number }) => {
      const { error } = await supabase
        .from("pricing_rules")
        .update({ base_price, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pricing_rules"] }),
  });
}

/** Find matching price rule. Returns undefined for xl garden or onetime frequency (= "Sur devis"). */
export function findMatchingPrice(
  rules: PricingRule[],
  gardenSize: string,
  frequency: string
): PricingRule | undefined {
  if (gardenSize === "xl" || frequency === "onetime") return undefined;
  return rules.find(
    (r) =>
      r.garden_size === gardenSize &&
      r.frequency === frequency &&
      r.frequency !== "dog_surcharge"
  );
}

/** Get the dog surcharge rule */
export function getDogSurcharge(rules: PricingRule[]): number {
  const rule = rules.find((r) => r.frequency === "dog_surcharge");
  return rule?.base_price ?? 10;
}
