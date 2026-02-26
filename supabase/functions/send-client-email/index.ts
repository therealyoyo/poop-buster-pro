import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { client_id, message, subject, attachments, message_id } = await req.json();
    if (!client_id || !message) throw new Error("Missing client_id or message");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client info
    const { data: client, error: cErr } = await supabase
      .from("clients")
      .select("first_name, last_name, email")
      .eq("id", client_id)
      .single();
    if (cErr || !client) throw new Error("Client not found");
    if (!client.email) throw new Error("Client has no email");

    const emailSubject = subject || "💬 Message de Crotte & Go";

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#1a3a52">🐾 Crotte & Go</h2>
        <p>Bonjour ${client.first_name},</p>
        <div style="background:#f8f9fa;border-left:4px solid #2d8a5e;padding:16px;margin:20px 0;border-radius:4px">
          <p style="margin:0;white-space:pre-wrap">${message}</p>
        </div>
        ${attachments?.length ? `<p style="color:#666;font-size:13px">📎 ${attachments.length} pièce(s) jointe(s)</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
        <p style="color:#999;font-size:12px">Répondez directement à cet email pour me contacter.</p>
        <p style="color:#999;font-size:12px">Yoni — Crotte & Go 🐾</p>
      </div>
    `;

    // Send via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const { Resend } = await import("npm:resend@4.0.0");
    const resend = new Resend(resendKey);

    const resendPayload: any = {
      from: "Crotte & Go <yoni@crotteandgo.be>",
      reply_to: "yoni@crotteandgo.be",
      to: [client.email],
      subject: emailSubject,
      html,
      headers: {
        "X-Client-Id": client_id,
      },
    };

    // Add attachments if provided
    if (attachments?.length) {
      resendPayload.attachments = attachments.map((a: any) => ({
        filename: a.filename,
        path: a.url,
      }));
    }

    await resend.emails.send(resendPayload);

    // Update message with email_sent_at if message_id provided
    if (message_id) {
      await supabase
        .from("messages")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("id", message_id);
    }

    // Log in email_logs
    await supabase.from("email_logs").insert({
      client_id,
      email_type: "manual_chat",
      subject: emailSubject,
      status: "sent",
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-client-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
