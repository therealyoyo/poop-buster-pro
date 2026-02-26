import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * CRM Automation — runs on schedule or manually.
 * Triggers:
 *   A) New lead → qualified: if lead has all required fields
 *   B) Qualified → quote_sent: when a quote exists with status 'sent'
 *   C) Quote accepted → active client
 *   D) Active → inactive: no intervention in 60 days
 *   E) Inactive → winback: after 30 days of inactivity
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const results: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  try {
    // ═══ Trigger A: new_lead → qualified_lead ═══
    // Clients with pipeline_stage='new' who have email + phone + garden_size
    const { data: newLeads } = await supabase
      .from("clients")
      .select("id")
      .eq("pipeline_stage", "new")
      .not("email", "is", null)
      .not("phone", "is", null)
      .not("garden_size", "is", null);

    if (newLeads?.length) {
      const ids = newLeads.map(c => c.id);
      await supabase.from("clients").update({ pipeline_stage: "qualified_lead" }).in("id", ids);
      results.A = ids.length;
    }

    // ═══ Trigger B: qualified_lead → quote_sent ═══
    // Clients with pipeline_stage='qualified_lead' who have a quote with status='sent'
    const { data: qualifiedClients } = await supabase
      .from("clients")
      .select("id")
      .eq("pipeline_stage", "qualified_lead");

    if (qualifiedClients?.length) {
      const qIds = qualifiedClients.map(c => c.id);
      const { data: sentQuotes } = await supabase
        .from("quotes")
        .select("client_id")
        .eq("status", "sent")
        .in("client_id", qIds);

      if (sentQuotes?.length) {
        const clientIds = [...new Set(sentQuotes.map(q => q.client_id))];
        await supabase.from("clients").update({ pipeline_stage: "quote_sent" }).in("id", clientIds);
        results.B = clientIds.length;
      }
    }

    // ═══ Trigger C: quote_sent → active ═══
    // Clients with pipeline_stage='quote_sent' who have an accepted quote
    const { data: quoteSentClients } = await supabase
      .from("clients")
      .select("id")
      .eq("pipeline_stage", "quote_sent");

    if (quoteSentClients?.length) {
      const qsIds = quoteSentClients.map(c => c.id);
      const { data: acceptedQuotes } = await supabase
        .from("quotes")
        .select("client_id")
        .eq("status", "accepted")
        .in("client_id", qsIds);

      if (acceptedQuotes?.length) {
        const clientIds = [...new Set(acceptedQuotes.map(q => q.client_id))];
        await supabase
          .from("clients")
          .update({ pipeline_stage: "active", status: "active" })
          .in("id", clientIds);
        results.C = clientIds.length;
      }
    }

    // ═══ Trigger D: active → inactive (no intervention in 60 days) ═══
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const { data: activeClients } = await supabase
      .from("clients")
      .select("id")
      .eq("pipeline_stage", "active")
      .eq("status", "active");

    if (activeClients?.length) {
      for (const client of activeClients) {
        const { data: recentIntervention } = await supabase
          .from("interventions")
          .select("id")
          .eq("client_id", client.id)
          .gte("scheduled_date", sixtyDaysAgo.split("T")[0])
          .limit(1);

        if (!recentIntervention?.length) {
          await supabase
            .from("clients")
            .update({
              pipeline_stage: "inactive",
              status: "inactive",
              inactivated_at: new Date().toISOString(),
            })
            .eq("id", client.id);
          results.D++;
        }
      }
    }

    // ═══ Trigger E: inactive → winback (30+ days inactive, no winback sent) ═══
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: inactiveClients } = await supabase
      .from("clients")
      .select("id, inactivated_at, winback_sent_at")
      .eq("pipeline_stage", "inactive")
      .is("winback_sent_at", null)
      .not("inactivated_at", "is", null)
      .lte("inactivated_at", thirtyDaysAgo);

    if (inactiveClients?.length) {
      const ids = inactiveClients.map(c => c.id);
      await supabase.from("clients").update({ pipeline_stage: "winback" }).in("id", ids);
      results.E = ids.length;
    }

    console.log("CRM automation results:", results);

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("crm-automation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
