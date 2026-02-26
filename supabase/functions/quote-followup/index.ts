import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Quote Follow-Up — runs daily via cron.
 * Sends a reminder email for quotes sent 3+ days ago that haven't been accepted.
 * Only sends one followup per quote.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // Find quotes sent 3+ days ago, not accepted, no followup sent
    const { data: quotes } = await supabase
      .from("quotes")
      .select("id, client_id, total_price, frequency, token, sent_at")
      .eq("status", "sent")
      .is("followup_sent_at", null)
      .lte("sent_at", threeDaysAgo);

    if (!quotes?.length) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");
    const { Resend } = await import("npm:resend@4.0.0");
    const resend = new Resend(resendKey);

    let sent = 0;

    for (const quote of quotes) {
      // Get client info
      const { data: client } = await supabase
        .from("clients")
        .select("first_name, last_name, email")
        .eq("id", quote.client_id)
        .single();

      if (!client?.email) continue;

      const acceptUrl = `${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", ".supabase.co").replace("https://", "https://")}/functions/v1/..`;
      // Simple approach: link to the app's quote accept page
      const quoteLink = `https://crotteandgo.be/devis/${quote.token}`;

      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2 style="color:#1a3a52">🐾 Rappel — Votre devis Crotte & Go</h2>
          <p>Bonjour ${client.first_name},</p>
          <p>Nous avons remarqué que vous n'avez pas encore donné suite à notre devis.</p>
          <p>Pour rappel, votre service <strong>${quote.frequency}</strong> est estimé à <strong>€${Number(quote.total_price).toFixed(2)}/mois</strong>.</p>
          <p>
            <a href="${quoteLink}" style="display:inline-block;background:#2d8a5e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
              📋 Voir mon devis
            </a>
          </p>
          <p style="color:#666;font-size:13px;margin-top:20px">Si vous avez des questions, répondez simplement à cet email.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
          <p style="color:#999;font-size:12px">Yoni — Crotte & Go 🐾</p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: "Crotte & Go Facturation <billing@support.crotteandgo.be>",
          reply_to: "yoni@crotteandgo.be",
          to: [client.email],
          subject: "📋 Rappel : votre devis Crotte & Go vous attend",
          html,
        });

        await supabase
          .from("quotes")
          .update({ followup_sent_at: new Date().toISOString() })
          .eq("id", quote.id);

        await supabase.from("email_logs").insert({
          client_id: quote.client_id,
          email_type: "quote_followup",
          subject: "Rappel devis",
          status: "sent",
        });

        sent++;
      } catch (emailErr: any) {
        console.error(`Failed to send followup for quote ${quote.id}:`, emailErr);
        await supabase.from("email_logs").insert({
          client_id: quote.client_id,
          email_type: "quote_followup",
          subject: "Rappel devis",
          status: "failed",
          error_message: emailErr.message,
        });
      }
    }

    console.log(`Quote followup: ${sent} emails sent`);
    return new Response(JSON.stringify({ ok: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("quote-followup error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
