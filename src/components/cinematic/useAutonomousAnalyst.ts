import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalystDecision {
  severity: string;
  confidence: number;
  mitre_technique_id: string;
  mitre_technique_name: string;
  correlated_ioc_ids: string[];
  affected_asset_ids: string[];
  open_investigation: boolean;
  investigation_title: string;
  playbook: { step: number; action: string; target: string; rationale: string; auto_executable: boolean }[];
  narrative: string;
}

export interface AnalystRun {
  id: string;
  event_id: string;
  event_type: string;
  event_severity: string;
  decision: AnalystDecision;
  investigation_id: string | null;
  ts: number;
}

interface Options {
  autonomous: boolean;
  /** minimum severity to auto-trigger (e.g. "high") */
  threshold?: "low" | "medium" | "high" | "critical";
}

const sevRank = (s: string) =>
  ({ informational: 0, low: 1, medium: 2, high: 3, critical: 4 }[s as keyof object] ?? 1);

export function useAutonomousAnalyst({ autonomous, threshold = "medium" }: Options) {
  const [runs, setRuns] = useState<AnalystRun[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seen = useRef<Set<string>>(new Set());

  const busyRef = useRef(false);

  const triage = useCallback(async (event_id: string, eventMeta?: { event_type?: string; severity?: string }) => {
    if (seen.current.has(event_id)) return;
    if (busyRef.current) return; // serialize — avoid burst calls
    seen.current.add(event_id);
    busyRef.current = true;
    setBusy(true); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("autonomous-soc-analyst", {
        body: { event_id, auto_open_investigation: autonomous },
      });
      if (error) {
        const msg = error.message || String(error);
        if (/429|rate/i.test(msg)) {
          setError("Rate limited — analyst paused briefly");
          seen.current.delete(event_id); // allow retry later
          await new Promise((r) => setTimeout(r, 30_000));
          return;
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);
      setRuns((prev) => [{
        id: crypto.randomUUID(),
        event_id,
        event_type: eventMeta?.event_type ?? "unknown",
        event_severity: eventMeta?.severity ?? "low",
        decision: data.decision,
        investigation_id: data.investigation_id ?? null,
        ts: Date.now(),
      }, ...prev].slice(0, 25));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [autonomous]);

  // Stable ref so the realtime subscription doesn't tear down on every triage
  const triageRef = useRef(triage);
  useEffect(() => { triageRef.current = triage; }, [triage]);

  // Subscribe to new events; auto-triage when above threshold and autonomous=on.
  useEffect(() => {
    if (!autonomous) return;
    const channel = supabase
      .channel("autonomous-analyst")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "security_events" }, (payload) => {
        const ev = payload.new as { id: string; severity: string; event_type: string };
        if (sevRank(ev.severity) >= sevRank(threshold)) {
          triageRef.current(ev.id, { event_type: ev.event_type, severity: ev.severity });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [autonomous, threshold]);

  return { runs, busy, error, triage };
}
