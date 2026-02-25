import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { quote_id } = await req.json();
    if (!quote_id) throw new Error("Missing quote_id");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: quote, error: qErr } = await supabase
      .from("quotes")
      .select("*, clients(first_name, last_name, email)")
      .eq("id", quote_id)
      .single();
    if (qErr || !quote) throw new Error("Quote not found");

    const client = (quote as any).clients;
    if (!client?.email) throw new Error("Client has no email");

    const lineItems = Array.isArray(quote.line_items) ? quote.line_items : [];
    const siteUrl = Deno.env.get("SITE_URL") || Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", ".lovable.app") || "https://example.com";

    const lineItemsHtml = lineItems.map((li: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${li.label}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${Number(li.price).toFixed(2)}</td></tr>`
    ).join("");

    const gardenLabels: Record<string, string> = { small: "Petit jardin", medium: "Jardin moyen", large: "Grand jardin", xl: "Très grand jardin" };
    const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel" };

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h1 style="color:#1a3a52">Bonjour ${client.first_name} 🐾</h1>
        <p>Votre devis Poop Buster Pro est prêt !</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Jardin</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${gardenLabels[quote.garden_size] || quote.garden_size}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Chiens</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${quote.dog_count} 🐕</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Fréquence</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${freqLabels[quote.frequency] || quote.frequency}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Prix de base</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${Number(quote.base_price).toFixed(2)}</td></tr>
          ${lineItemsHtml}
          <tr><td style="padding:12px 8px;font-weight:bold;font-size:18px">Total</td><td style="padding:12px 8px;font-weight:bold;font-size:18px;text-align:right">€${Number(quote.total_price).toFixed(2)}</td></tr>
        </table>
        <div style="text-align:center;margin:30px 0">
          <a href="${siteUrl}/quote/accept/${quote.token}" style="background:#2d8a5e;color:white;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block">✅ Accepter mon devis et démarrer</a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center">Ce devis est valable 14 jours.</p>
      </div>
    `;

    // Try Resend if available
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const { Resend } = await import("npm:resend@4.0.0");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Poop Buster Pro <noreply@resend.dev>",
        to: [client.email],
        subject: "Votre devis Poop Buster Pro est prêt 🐾",
        html,
      });
    }

    // Mark quote as sent
    await supabase.from("quotes").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", quote_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
