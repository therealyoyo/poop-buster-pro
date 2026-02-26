import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { quote_token, accepted_by_name, preferred_day } = await req.json();
    if (!quote_token) throw new Error("Missing quote_token");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: quote, error: qErr } = await supabase
      .from("quotes")
      .select("*, clients(id, first_name, last_name, email, stripe_customer_id)")
      .eq("token", quote_token)
      .single();
    if (qErr || !quote) throw new Error("Quote not found");
    if (quote.status !== "sent") throw new Error("Quote is not in sent status");

    const client = (quote as any).clients;
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });

    // Create or retrieve Stripe customer
    let customerId = client.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: `${client.first_name} ${client.last_name}`,
        metadata: { client_id: client.id },
      });
      customerId = customer.id;
      await supabase.from("clients").update({ stripe_customer_id: customerId }).eq("id", client.id);
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://example.com";
    const isSubscription = quote.frequency !== "onetime";
    const amountCents = Math.round(Number(quote.total_price) * 100);
    const billingCycle = quote.billing_cycle || "monthly";

    // Determine Stripe interval
    let interval: "week" | "month" = "month";
    let intervalCount = 1;

    if (isSubscription) {
      if (billingCycle === "quarterly") {
        // Quarterly billing: charge every 3 months
        interval = "month";
        intervalCount = 3;
        // Amount is monthly price, multiply by 3 for quarterly
      } else {
        // Monthly billing: use frequency-based intervals
        if (quote.frequency === "weekly") {
          interval = "week";
          intervalCount = 1;
        } else if (quote.frequency === "biweekly") {
          interval = "week";
          intervalCount = 2;
        } else {
          interval = "month";
          intervalCount = 1;
        }
      }
    }

    // For quarterly, the checkout amount should be 3x the monthly price
    const checkoutAmountCents = (isSubscription && billingCycle === "quarterly")
      ? amountCents * 3
      : amountCents;

    // Create a dynamic price
    const price = await stripe.prices.create({
      unit_amount: checkoutAmountCents,
      currency: "eur",
      ...(isSubscription
        ? {
            recurring: {
              interval,
              interval_count: intervalCount,
            },
          }
        : {}),
      product_data: {
        name: `Crotte & Go® — ${({"weekly":"Hebdomadaire (4 visites/mois)","biweekly":"Bimensuel (2 visites/mois)","monthly":"Mensuel (1 visite/mois)","twice_weekly":"2 fois/semaine (8 visites/mois)","onetime":"Visite unique"} as Record<string,string>)[quote.frequency] || quote.frequency}`,
        description: `${billingCycle === "quarterly" ? "Facturation trimestrielle" : "Facturation mensuelle"} · ${quote.dog_count} chien(s) · Jardin ${({"small":"petit","medium":"moyen","large":"grand","xl":"très grand"} as Record<string,string>)[quote.garden_size] || quote.garden_size}`,
      },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${siteUrl}/quote/success?token=${quote_token}`,
      cancel_url: `${siteUrl}/quote/accept/${quote_token}?step=4&cancelled=true`,
      metadata: {
        quote_id: quote.id,
        client_id: client.id,
        preferred_day: preferred_day || "",
        accepted_by_name: accepted_by_name || "",
        billing_cycle: billingCycle,
      },
    });

    // Update quote
    await supabase.from("quotes").update({
      stripe_checkout_session_id: session.id,
      accepted_by_name,
      preferred_day,
    }).eq("id", quote.id);

    return new Response(JSON.stringify({ checkout_url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
