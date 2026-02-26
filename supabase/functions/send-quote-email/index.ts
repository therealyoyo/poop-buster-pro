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
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${li.label}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${li.price < 0 ? '-' : ''}€${Math.abs(Number(li.price)).toFixed(2)}</td></tr>`
    ).join("");

    const TVA_RATE = 0.21;
    const totalHTVA = Number(quote.total_price) / (1 + TVA_RATE);
    const montantTVA = Number(quote.total_price) - totalHTVA;
    const freqDivisor: Record<string, number> = { onetime: 1, monthly: 1, biweekly: 2, weekly: 4, twice_weekly: 8 };
    const passagesParMois = freqDivisor[quote.frequency] || 1;
    const prixParPassage = Number(quote.total_price) / passagesParMois;
    const isQuarterly = quote.billing_cycle === "quarterly";
    const quarterlyTotal = isQuarterly ? Number(quote.quarterly_price || quote.total_price * 3) : null;

    const gardenLabels: Record<string, string> = { small: "Petit jardin", medium: "Jardin moyen", large: "Grand jardin", xl: "Très grand jardin" };
    const freqLabels: Record<string, string> = { weekly: "Hebdomadaire", biweekly: "Bi-mensuel", monthly: "Mensuel", onetime: "Ponctuel", twice_weekly: "2x/semaine" };

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h1 style="color:#1a3a52">Bonjour ${client.first_name} 🐾</h1>
        <p>Votre devis Crotte & Go est prêt !</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Jardin</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${gardenLabels[quote.garden_size] || quote.garden_size}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Chiens</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${quote.dog_count} 🐕</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Fréquence</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${freqLabels[quote.frequency] || quote.frequency}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Prix de base</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${Number(quote.base_price).toFixed(2)}</td></tr>
          ${lineItemsHtml}
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Total HTVA</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${totalHTVA.toFixed(2)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">TVA 21%</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${montantTVA.toFixed(2)}</td></tr>
          <tr style="background:#f0fdf4"><td style="padding:12px 8px;font-weight:bold;font-size:18px">Total TVAC</td><td style="padding:12px 8px;font-weight:bold;font-size:18px;text-align:right;color:#16a34a">€${Number(quote.total_price).toFixed(2)}/mois</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Par passage</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${prixParPassage.toFixed(2)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Passages/mois</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${passagesParMois} visite(s)</td></tr>
          ${isQuarterly ? `<tr style="background:#dcfce7"><td colspan="2" style="padding:12px 8px;font-weight:bold;color:#15803d;text-align:center">Facturation trimestrielle : €${quarterlyTotal?.toFixed(2)} / 3 mois (${passagesParMois * 3} passages) — Économie 10% incluse ✅</td></tr>` : ""}
        </table>
        <div style="text-align:center;margin:30px 0">
          <a href="${siteUrl}/quote/accept/${quote.token}" style="background:#2d8a5e;color:white;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block">✅ Accepter mon devis et démarrer</a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center">Ce devis est valable 14 jours.</p>
      </div>
    `;

    // Resend is mandatory
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured in Supabase secrets");

    const { Resend } = await import("npm:resend@4.0.0");
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "Crotte & Go Facturation <billing@support.crotteandgo.be>",
      reply_to: "yoni@crotteandgo.be",
      to: [client.email],
      subject: `📋 Votre devis Crotte & Go n°${quote_id.slice(0,8).toUpperCase()} — €${Number(quote.total_price).toFixed(2)}/mois`,
      html,
    });

    // Mark quote as sent — only after successful email
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
