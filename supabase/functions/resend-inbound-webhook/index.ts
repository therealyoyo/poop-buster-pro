import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    console.log("Resend inbound webhook received:", JSON.stringify(payload).slice(0, 500));

    // Resend wraps the email data inside a "data" object
    const emailData = payload.data || payload;
    const fromEmail = extractEmail(emailData.from);
    const textContent = emailData.text || emailData.html?.replace(/<[^>]*>/g, '') || "";

    if (!fromEmail || !textContent.trim()) {
      console.log("Empty email or no sender, skipping");
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find client by email
    const { data: client } = await supabase
      .from("clients")
      .select("id, user_id")
      .eq("email", fromEmail)
      .maybeSingle();

    if (!client) {
      console.log(`No client found for email: ${fromEmail}`);
      return new Response(JSON.stringify({ ok: true, skipped: "no_client" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Clean the email content - remove quoted/forwarded text
    const cleanContent = cleanEmailReply(textContent);
    if (!cleanContent.trim()) {
      console.log("Empty after cleaning, skipping");
      return new Response(JSON.stringify({ ok: true, skipped: "empty_after_clean" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert message as client reply
    const { error: insertErr } = await supabase.from("messages").insert({
      client_id: client.id,
      sender_id: client.user_id || null,
      sender_role: "client",
      content: cleanContent,
      sender_name: emailData.from?.split("<")[0]?.trim() || fromEmail,
    });

    if (insertErr) {
      console.error("Failed to insert message:", insertErr);
      throw new Error(`Insert failed: ${insertErr.message}`);
    }

    console.log(`Message from ${fromEmail} saved for client ${client.id}`);

    return new Response(JSON.stringify({ ok: true, client_id: client.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("resend-inbound-webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function extractEmail(from: string): string | null {
  if (!from) return null;
  const match = from.match(/<([^>]+)>/);
  if (match) return match[1].toLowerCase();
  if (from.includes("@")) return from.trim().toLowerCase();
  return null;
}

function cleanEmailReply(text: string): string {
  const lines = text.split("\n");
  const cleanLines: string[] = [];

  for (const line of lines) {
    // Stop at common reply markers
    if (/^(On .+ wrote:|Le .+ a écrit :|---+\s*Original|From:|De :|Envoyé :|Sent:)/i.test(line.trim())) break;
    if (/^>/.test(line.trim())) continue; // Skip quoted lines
    if (/^(Répondez directement|Yoni — Crotte)/i.test(line.trim())) break; // Our footer
    cleanLines.push(line);
  }

  return cleanLines.join("\n").trim();
}
