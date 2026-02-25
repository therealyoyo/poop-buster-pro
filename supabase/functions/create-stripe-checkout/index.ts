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

    // Create a dynamic price
    const price = await stripe.prices.create({
      unit_amount: amountCents,
      currency: "eur",
      ...(isSubscription
        ? {
            recurring: {
              interval: quote.frequency === "weekly" ? "week" as const :
                       quote.frequency === "biweekly" ? "week" as const : "month" as const,
              ...(quote.frequency === "biweekly" ? { interval_count: 2 } : {}),
            },
          }
        : {}),
      product_data: { name: `Poop Buster Pro — ${quote.frequency}` },
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
