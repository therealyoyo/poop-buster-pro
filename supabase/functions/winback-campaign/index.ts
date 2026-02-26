import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Winback Campaign — runs weekly via cron.
 * Sends a winback email to clients in 'winback' pipeline stage
 * who haven't received a winback email yet.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Find winback clients who haven't received a winback email
    const { data: clients } = await supabase
      .from("clients")
      .select("id, first_name, last_name, email, dog_count, service_frequency")
      .eq("pipeline_stage", "winback")
      .is("winback_sent_at", null)
      .not("email", "is", null);

    if (!clients?.length) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");
    const { Resend } = await import("npm:resend@4.0.0");
    const resend = new Resend(resendKey);

    let sent = 0;

    for (const client of clients) {
      if (!client.email) continue;

      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2 style="color:#1a3a52">🐾 Votre jardin vous manque ?</h2>
          <p>Bonjour ${client.first_name},</p>
          <p>Cela fait un moment que nous n'avons pas nettoyé votre jardin, et on parie que vos ${client.dog_count} toutou${client.dog_count > 1 ? "s" : ""} ${client.dog_count > 1 ? "ont" : "a"} continué à faire des petits cadeaux... 🎁💩</p>
          <p><strong>Bonne nouvelle !</strong> Pour fêter votre retour, nous vous offrons <strong>-20% sur votre premier mois</strong> de reprise.</p>
          <p>
            <a href="https://crotteandgo.be" style="display:inline-block;background:#2d8a5e;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
              🐕 Reprendre le service
            </a>
          </p>
          <p style="color:#666;font-size:13px;margin-top:20px">Répondez à cet email ou appelez-nous pour reprendre là où on s'est arrêté !</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
          <p style="color:#999;font-size:12px">Yoni — Crotte & Go 🐾</p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: "Crotte & Go <yoni@crotteandgo.be>",
          reply_to: "yoni@crotteandgo.be",
          to: [client.email],
          subject: "🔄 Votre jardin vous manque ? -20% pour votre retour !",
          html,
        });

        await supabase
          .from("clients")
          .update({ winback_sent_at: new Date().toISOString() })
          .eq("id", client.id);

        await supabase.from("email_logs").insert({
          client_id: client.id,
          email_type: "winback",
          subject: "Winback -20%",
          status: "sent",
        });

        sent++;
      } catch (emailErr: any) {
        console.error(`Winback failed for client ${client.id}:`, emailErr);
        await supabase.from("email_logs").insert({
          client_id: client.id,
          email_type: "winback",
          subject: "Winback -20%",
          status: "failed",
          error_message: emailErr.message,
        });
      }
    }

    console.log(`Winback campaign: ${sent} emails sent`);
    return new Response(JSON.stringify({ ok: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("winback-campaign error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
