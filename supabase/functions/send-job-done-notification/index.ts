import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { intervention_id, photo_urls = [], technician_notes = "" } = await req.json();
    if (!intervention_id) throw new Error("Missing intervention_id");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: intervention, error: iErr } = await supabase
      .from("interventions")
      .select("*, clients(first_name, last_name, email, phone, dog_names)")
      .eq("id", intervention_id)
      .single();
    if (iErr || !intervention) throw new Error("Intervention not found");

    const client = (intervention as any).clients;
    const firstName = client?.first_name || "Client";
    const scheduledDate = new Date(intervention.scheduled_date).toLocaleDateString("fr-BE", {
      weekday: "long", day: "numeric", month: "long"
    });

    // 1. Send EMAIL via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const { Resend } = await import("npm:resend@4.0.0");
    const resend = new Resend(resendKey);

    const photosHtml = photo_urls.length > 0
      ? `<div style="margin:20px 0">${photo_urls.map((url: string) =>
          `<img src="${url}" style="max-width:100%;border-radius:8px;margin-bottom:8px" />`
        ).join("")}</div>`
      : "";

    if (client?.email) {
      await resend.emails.send({
        from: "Crotte & Go <updates@support.crotteandgo.be>",
        reply_to: "yoni@crotteandgo.be",
        to: [client.email],
        subject: `✅ Passage terminé — ${scheduledDate}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h2 style="color:#1a3a52">✅ Passage terminé !</h2>
            <p>Bonjour ${firstName},</p>
            <p>Votre jardin vient d'être nettoyé par Crotte & Go ! 🐾</p>
            <p>📅 ${scheduledDate}</p>
            ${technician_notes ? `<p>📝 ${technician_notes}</p>` : ""}
            ${photosHtml}
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
            <p style="color:#999;font-size:12px">Crotte & Go — yoni@crotteandgo.be</p>
          </div>
        `,
      });
    }

    // 2. Send SMS via Twilio (if phone available)
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (twilioSid && twilioToken && twilioFrom && client?.phone) {
      const smsBody = `Crotte & Go ✅ Passage terminé !\nBonjour ${firstName}, votre jardin est nickel ! 🌿\nPhoto envoyée par email.\nÀ bientôt !`;
      const params = new URLSearchParams({
        From: twilioFrom,
        To: client.phone,
        Body: smsBody,
      });
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${twilioSid}:${twilioToken}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
    }

    // 3. Mark intervention as completed
    await supabase
      .from("interventions")
      .update({ status: "completed", completion_message: technician_notes || null })
      .eq("id", intervention_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-job-done-notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
