import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { quote_id, client_id, preferred_day, accepted_by_name } = session.metadata || {};
    if (!quote_id || !client_id) return new Response("OK");

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

    // Update quote
    await supabase.from("quotes").update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      stripe_customer_id: session.customer as string,
      accepted_by_name,
      preferred_day,
    }).eq("id", quote_id);

    // Fetch quote for details
    const { data: quote } = await supabase.from("quotes").select("*").eq("id", quote_id).single();

    const isRecurring = quote?.frequency !== "onetime";

    // Update client
    await supabase.from("clients").update({
      pipeline_stage: "active",
      status: "active",
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscriptionId,
      preferred_day,
      is_recurring: isRecurring,
    }).eq("id", client_id);

    // Insert financial
    await supabase.from("financials").insert({
      client_id,
      stripe_event_id: event.id,
      amount: (session.amount_total || 0) / 100,
      type: isRecurring ? "subscription" : "one_time",
      stripe_invoice_id: typeof session.invoice === "string" ? session.invoice : null,
      stripe_subscription_id: subscriptionId,
      description: `Paiement initial — ${quote?.frequency}`,
    });

    // Auto-generate first intervention
    const dayMap: Record<string, number> = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0,
    };
    const now = new Date();
    let scheduledDate = now;
    if (preferred_day && dayMap[preferred_day] !== undefined) {
      const target = dayMap[preferred_day];
      const diff = (target - now.getDay() + 7) % 7 || 7;
      scheduledDate = new Date(now.getTime() + diff * 86400000);
    }

    await supabase.from("interventions").insert({
      client_id,
      scheduled_date: scheduledDate.toISOString().split("T")[0],
      status: "scheduled",
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
    if (!subscriptionId) return new Response("OK");

    // Find client by subscription
    const { data: client } = await supabase.from("clients")
      .select("id, preferred_day")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();
    if (!client) return new Response("OK");

    await supabase.from("financials").insert({
      client_id: client.id,
      stripe_event_id: event.id,
      amount: (invoice.amount_paid || 0) / 100,
      type: "subscription",
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      description: "Paiement récurrent",
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase.from("clients").update({
      status: "inactive",
      pipeline_stage: "inactive",
    }).eq("stripe_subscription_id", subscription.id);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
