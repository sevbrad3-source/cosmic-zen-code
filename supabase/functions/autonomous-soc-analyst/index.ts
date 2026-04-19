// Autonomous SOC Analyst — triages a security event, correlates IOCs/assets,
// proposes a response playbook, and (optionally) opens an investigation.
// Powered by Lovable AI Gateway. Returns a structured decision.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an elite autonomous SOC Tier-3 analyst embedded in a joint command center.
You receive a security event plus context (recent related events, known IOCs, network assets).
Your job:
1) Triage severity (informational | low | medium | high | critical) with a confidence 0-1.
2) Identify the most likely MITRE ATT&CK technique (T-id + name).
3) Correlate against provided IOCs and assets — list which are involved.
4) Decide if an investigation should be opened (boolean).
5) Propose a concrete response playbook: ordered steps, each with action, target, and rationale.
6) Write a 2-3 sentence executive narrative.

Be decisive. No hedging. No disclaimers. Operate as if running production defense.`;

const decisionTool = {
  type: "function",
  function: {
    name: "emit_decision",
    description: "Emit the analyst's structured triage decision.",
    parameters: {
      type: "object",
      properties: {
        severity: { type: "string", enum: ["informational", "low", "medium", "high", "critical"] },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        mitre_technique_id: { type: "string" },
        mitre_technique_name: { type: "string" },
        correlated_ioc_ids: { type: "array", items: { type: "string" } },
        affected_asset_ids: { type: "array", items: { type: "string" } },
        open_investigation: { type: "boolean" },
        investigation_title: { type: "string" },
        playbook: {
          type: "array",
          items: {
            type: "object",
            properties: {
              step: { type: "number" },
              action: { type: "string" },
              target: { type: "string" },
              rationale: { type: "string" },
              auto_executable: { type: "boolean" },
            },
            required: ["step", "action", "target", "rationale", "auto_executable"],
            additionalProperties: false,
          },
        },
        narrative: { type: "string" },
      },
      required: [
        "severity",
        "confidence",
        "mitre_technique_id",
        "mitre_technique_name",
        "correlated_ioc_ids",
        "affected_asset_ids",
        "open_investigation",
        "investigation_title",
        "playbook",
        "narrative",
      ],
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
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { event_id, auto_open_investigation = true } = await req.json();
    if (!event_id) {
      return new Response(JSON.stringify({ error: "event_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull the event + context
    const { data: event, error: evErr } = await supabase
      .from("security_events")
      .select("*")
      .eq("id", event_id)
      .single();
    if (evErr || !event) throw new Error(`event not found: ${evErr?.message}`);

    const [{ data: iocs }, { data: assets }, { data: recent }] = await Promise.all([
      supabase.from("iocs").select("id,value,ioc_type,threat_level,tags").eq("is_active", true).limit(40),
      supabase.from("network_assets").select("id,ip_address,hostname,asset_type,zone,is_compromised,risk_score").limit(40),
      supabase
        .from("security_events")
        .select("id,event_type,severity,source_ip,destination_ip,detected_at,mitre_technique")
        .order("detected_at", { ascending: false })
        .limit(15),
    ]);

    const userPayload = {
      event,
      context: { iocs: iocs ?? [], assets: assets ?? [], recent_events: recent ?? [] },
    };

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
        tools: [decisionTool],
        tool_choice: { type: "function", function: { name: "emit_decision" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway: ${aiResp.status} ${t}`);
    }

    const aiJson = await aiResp.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI returned no tool call");
    const decision = JSON.parse(call.function.arguments);

    // Optionally open an investigation
    let investigation_id: string | null = null;
    if (auto_open_investigation && decision.open_investigation) {
      const { data: inv } = await supabase
        .from("investigations")
        .insert({
          title: decision.investigation_title || `Auto: ${event.event_type}`,
          description: decision.narrative,
          status: "open",
          priority: decision.severity === "critical" ? "critical" : decision.severity === "high" ? "high" : "medium",
          assigned_to: "autonomous-soc-analyst",
          mitre_tactics: decision.mitre_technique_id ? [decision.mitre_technique_id] : [],
          related_iocs: decision.correlated_ioc_ids ?? [],
          related_events: [event.id],
          findings: decision.narrative,
          timeline: { steps: decision.playbook },
        })
        .select("id")
        .single();
      investigation_id = inv?.id ?? null;
    }

    return new Response(JSON.stringify({ decision, investigation_id, event_id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("autonomous-soc-analyst error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
