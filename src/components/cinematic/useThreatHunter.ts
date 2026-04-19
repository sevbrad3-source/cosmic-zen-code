import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ThreatHunt {
  id: string;
  hypothesis: string;
  rationale: string | null;
  suggested_query: string | null;
  related_technique_ids: string[] | null;
  confidence: number;
  priority: string;
  status: string;
  created_at: string;
}

interface Options {
  autonomous: boolean;
  /** Run a hunt cycle every N seconds when autonomous. 0 = disabled. */
  intervalSec?: number;
}

export function useThreatHunter({ autonomous, intervalSec = 180 }: Options) {
  const [hunts, setHunts] = useState<ThreatHunt[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRun = useRef<number>(0);

  // Initial load + realtime
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("ai_hunts")
        .select("id,hypothesis,rationale,suggested_query,related_technique_ids,confidence,priority,status,created_at")
        .order("created_at", { ascending: false })
        .limit(40);
      if (mounted && data) setHunts(data as ThreatHunt[]);
    })();

    const ch = supabase
      .channel("ai-hunts-stream")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ai_hunts" }, (p) => {
        setHunts((prev) => [p.new as ThreatHunt, ...prev].slice(0, 40));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ai_hunts" }, (p) => {
        const upd = p.new as ThreatHunt;
        setHunts((prev) => prev.map((h) => (h.id === upd.id ? upd : h)));
      })
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  const runCycle = useCallback(async () => {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("autonomous-threat-hunter", { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      lastRun.current = Date.now();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [busy]);

  // Periodic cycles
  useEffect(() => {
    if (!autonomous || intervalSec <= 0) return;
    // initial offset so we don't spam right at boot
    const kick = window.setTimeout(runCycle, 8000);
    const id = window.setInterval(runCycle, intervalSec * 1000);
    return () => { window.clearTimeout(kick); window.clearInterval(id); };
  }, [autonomous, intervalSec, runCycle]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    await supabase.from("ai_hunts").update({ status }).eq("id", id);
  }, []);

  return { hunts, busy, error, runCycle, updateStatus };
}
