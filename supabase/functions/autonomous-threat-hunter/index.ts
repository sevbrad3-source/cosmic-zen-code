// Autonomous Threat Hunter — periodically scans recent events + IOCs and
// proposes hunt hypotheses. Persists results to ai_hunts.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an autonomous threat hunter on an elite SOC team.
You receive a snapshot: recent security events, active IOCs, network assets at risk, and existing investigations.
Generate 2-4 NEW hunt hypotheses. Each hypothesis must:
- Identify a plausible adversary behavior (cite MITRE T-id when applicable)
- Reference concrete evidence from the snapshot
- Suggest a concrete query / data source to validate it
- Avoid duplicating active investigations
Do not hedge. Be specific and actionable.`;

const huntsTool = {
  type: "function",
  function: {
    name: "emit_hunts",
    description: "Emit a list of hunt hypotheses.",
    parameters: {
      type: "object",
      properties: {
        hunts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hypothesis: { type: "string" },
              rationale: { type: "string" },
              suggested_query: { type: "string" },
              related_technique_ids: { type: "array", items: { type: "string" } },
              related_event_ids: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
            },
            required: ["hypothesis", "rationale", "suggested_query", "confidence", "priority"],
            additionalProperties: false,
          },
        },
      },
      required: ["hunts"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const [{ data: events }, { data: iocs }, { data: assets }, { data: investigations }] =
      await Promise.all([
        supabase.from("security_events")
          .select("id,event_type,severity,source_ip,destination_ip,detected_at,mitre_technique,description")
          .order("detected_at", { ascending: false }).limit(40),
        supabase.from("iocs")
          .select("id,value,ioc_type,threat_level,tags").eq("is_active", true).limit(40),
        supabase.from("network_assets")
          .select("id,ip_address,hostname,asset_type,zone,is_compromised,risk_score")
          .order("risk_score", { ascending: false }).limit(20),
        supabase.from("investigations")
          .select("id,title,status,priority,mitre_tactics").in("status", ["open", "active"]).limit(20),
      ]);

    const snapshot = {
      recent_events: events ?? [],
      active_iocs: iocs ?? [],
      high_risk_assets: assets ?? [],
      open_investigations: investigations ?? [],
    };

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(snapshot) },
        ],
        tools: [huntsTool],
        tool_choice: { type: "function", function: { name: "emit_hunts" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      if (aiResp.status === 429)
        return new Response(JSON.stringify({ error: "Rate limited" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway: ${aiResp.status} ${t}`);
    }

    const aiJson = await aiResp.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI returned no tool call");
    const { hunts } = JSON.parse(call.function.arguments) as { hunts: any[] };

    const rows = (hunts ?? []).map((h) => ({
      agent: "autonomous-threat-hunter",
      hypothesis: h.hypothesis,
      rationale: h.rationale,
      suggested_query: h.suggested_query,
      related_technique_ids: h.related_technique_ids ?? [],
      related_event_ids: h.related_event_ids ?? [],
      confidence: h.confidence,
      priority: h.priority,
      status: "open",
    }));

    let inserted: any[] = [];
    if (rows.length) {
      const { data } = await supabase.from("ai_hunts").insert(rows).select("id");
      inserted = data ?? [];
    }

    return new Response(JSON.stringify({ count: inserted.length, hunts: rows }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("autonomous-threat-hunter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
