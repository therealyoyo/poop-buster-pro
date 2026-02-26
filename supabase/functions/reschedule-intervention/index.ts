import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { intervention_id, new_date, reason } = await req.json();
    if (!intervention_id || !new_date) {
      return new Response(JSON.stringify({ error: "intervention_id and new_date required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get current intervention + client info
    const { data: intervention, error: intErr } = await supabaseAdmin
      .from("interventions")
      .select("id, scheduled_date, client_id")
      .eq("id", intervention_id)
      .single();
    if (intErr || !intervention) {
      return new Response(JSON.stringify({ error: "Intervention not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const old_date = intervention.scheduled_date;

    const { data: client, error: clientErr } = await supabaseAdmin
      .from("clients")
      .select("id, first_name, last_name, email")
      .eq("id", intervention.client_id)
      .single();
    if (clientErr || !client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update intervention date
    const { error: updateErr } = await supabaseAdmin
      .from("interventions")
      .update({ scheduled_date: new_date, updated_at: new Date().toISOString() })
      .eq("id", intervention_id);
    if (updateErr) throw updateErr;

    // Format dates in French
    const formatFr = (dateStr: string) => {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("fr-BE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const oldDateFr = formatFr(old_date);
    const newDateFr = formatFr(new_date);

    // Send email via Resend
    if (client.email) {
      const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
      const reasonHtml = reason
        ? `<p style="margin:16px 0;color:#555;font-size:14px;"><strong>Raison :</strong> ${reason}</p>`
        : "";

      await resend.emails.send({
        from: "Crotte & Go <chat@support.crotteandgo.be>",
        replyTo: "yoni@crotteandgo.be",
        to: [client.email],
        subject: `📅 Votre passage reprogrammé — ${newDateFr}`,
        html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-size:22px;color:#1a3a52;margin:0;">🐾 Crotte & Go</h1>
    </div>
    <h2 style="font-size:18px;color:#1a3a52;margin-bottom:16px;">Votre passage a été reprogrammé</h2>
    <p style="font-size:15px;color:#333;margin-bottom:8px;">Bonjour ${client.first_name},</p>
    <p style="font-size:15px;color:#333;margin-bottom:20px;">Votre passage a été modifié :</p>
    <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:15px;">
        <span style="color:#999;">Ancienne date :</span>
        <span style="text-decoration:line-through;color:#e74c3c;margin-left:8px;">${oldDateFr}</span>
      </p>
      <p style="margin:0;font-size:15px;">
        <span style="color:#999;">Nouvelle date :</span>
        <span style="color:#2d8a5e;font-weight:700;margin-left:8px;">${newDateFr}</span>
      </p>
    </div>
    ${reasonHtml}
    <div style="text-align:center;margin:28px 0;">
      <a href="https://crotteandgo.be/portal" style="display:inline-block;background:#2d8a5e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Voir mon espace client →</a>
    </div>
    <p style="font-size:13px;color:#999;text-align:center;margin-top:32px;">Crotte & Go — On ramasse, vous profitez ! 🐕</p>
  </div>
</body></html>`,
      });
    }

    // Insert message in conversation
    const msgContent = reason
      ? `📅 Votre passage a été reprogrammé du ${oldDateFr} au ${newDateFr}. Raison : ${reason}`
      : `📅 Votre passage a été reprogrammé du ${oldDateFr} au ${newDateFr}.`;

    await supabaseAdmin.from("messages").insert({
      client_id: client.id,
      sender_id: client.id,
      sender_role: "admin",
      sender_name: "Crotte & Go",
      content: msgContent,
    });

    // Log email
    await supabaseAdmin.from("email_logs").insert({
      client_id: client.id,
      email_type: "reschedule_notification",
      subject: `📅 Votre passage reprogrammé — ${newDateFr}`,
      status: "sent",
    });

    return new Response(
      JSON.stringify({ success: true, old_date, new_date }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("reschedule-intervention error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
