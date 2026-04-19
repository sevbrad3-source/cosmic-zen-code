import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HoloGlobe from "./HoloGlobe";
import StrategicHUD from "./StrategicHUD";
import { Activity, ShieldAlert, Brain, Radio, Target, Zap } from "lucide-react";
import { AnalystRun } from "./useAutonomousAnalyst";

interface Props {
  autonomous: boolean;
  decisionsToday: number;
  runs: AnalystRun[];
}

export const CinematicHome = ({ autonomous, decisionsToday, runs }: Props) => {
  const [counts, setCounts] = useState({ events: 0, criticals: 0, iocs: 0, assets: 0, openInv: 0 });
  const [recent, setRecent] = useState<{ id: string; severity: string; event_type: string; source_ip: string | null; detected_at: string }[]>([]);
  const [pings, setPings] = useState<{ lat: number; lon: number; intensity: number; t: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [{ count: events }, { count: criticals }, { count: iocs }, { count: assets }, { count: openInv }, { data: latest }] = await Promise.all([
        supabase.from("security_events").select("*", { count: "exact", head: true }),
        supabase.from("security_events").select("*", { count: "exact", head: true }).eq("severity", "critical"),
        supabase.from("iocs").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("network_assets").select("*", { count: "exact", head: true }),
        supabase.from("investigations").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("security_events").select("id,severity,event_type,source_ip,detected_at").order("detected_at", { ascending: false }).limit(8),
      ]);
      if (!mounted) return;
      setCounts({ events: events ?? 0, criticals: criticals ?? 0, iocs: iocs ?? 0, assets: assets ?? 0, openInv: openInv ?? 0 });
      if (latest) setRecent(latest);
    };
    load();

    const ch = supabase.channel("cinematic-home")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "security_events" }, (p) => {
        const ev = p.new as { id: string; severity: string; event_type: string; source_ip: string | null; detected_at: string };
        setRecent((prev) => [ev, ...prev].slice(0, 8));
        setCounts((c) => ({ ...c, events: c.events + 1, criticals: c.criticals + (ev.severity === "critical" ? 1 : 0) }));
        // Drop a ping at a pseudo-random globe location keyed by event id
        let h = 0; for (let i = 0; i < ev.id.length; i++) h = (h * 31 + ev.id.charCodeAt(i)) >>> 0;
        const lat = ((h % 140) - 70);
        const lon = (((h >>> 7) % 360) - 180);
        const intensity = ev.severity === "critical" ? 1 : ev.severity === "high" ? 0.7 : 0.4;
        setPings((prev) => [...prev.slice(-30), { lat, lon, intensity, t: performance.now() }]);
      })
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  const threatLevel = useMemo<"GREEN" | "YELLOW" | "ORANGE" | "RED" | "BLACK">(() => {
    if (counts.criticals >= 5 || counts.openInv >= 10) return "BLACK";
    if (counts.criticals >= 2) return "RED";
    if (counts.criticals >= 1 || counts.openInv >= 3) return "ORANGE";
    if (counts.events > 50) return "YELLOW";
    return "GREEN";
  }, [counts]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-deep">
      {/* Backdrop grid + scan line */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
      </div>

      <div className="relative z-10 h-full flex flex-col p-4 gap-4 overflow-y-auto scrollbar-thin">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-mono">Joint Cyber Command • Sector 7</div>
            <h1 className="text-3xl font-bold tracking-wider text-glow text-foreground">COMMAND CENTER</h1>
          </div>
          <div className="text-right font-mono">
            <div className="text-[10px] uppercase tracking-widest text-text-muted">UTC</div>
            <div className="text-xl text-glow text-primary">{new Date().toUTCString().slice(17, 25)}</div>
          </div>
        </div>

        <StrategicHUD
          threatLevel={threatLevel}
          activeIncidents={counts.openInv}
          iocCount={counts.iocs}
          assetCount={counts.assets}
          autonomous={autonomous}
          decisionsToday={decisionsToday}
        />

        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Globe panel */}
          <div className="col-span-12 lg:col-span-7 relative rounded-lg border border-primary/30 bg-panel-bg/40 backdrop-blur overflow-hidden ring-glow">
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary/90">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Threat Telemetry
              </div>
              <div className="text-[10px] font-mono text-text-muted">{recent.length} events / 8</div>
            </div>
            <HoloGlobe pings={pings} className="w-full h-full" />
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 z-10">
              <Mini label="EVENTS" value={counts.events} />
              <Mini label="CRITICALS" value={counts.criticals} highlight />
              <Mini label="OPEN INV" value={counts.openInv} />
            </div>
          </div>

          {/* Live feeds */}
          <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-4 min-h-0">
            <div className="rounded-lg border border-primary/30 bg-panel-bg/60 backdrop-blur overflow-hidden flex flex-col">
              <div className="px-3 py-2 border-b border-primary/20 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-primary">Event Stream</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/30">
                {recent.length === 0 && <div className="p-4 text-xs text-text-muted">Awaiting telemetry…</div>}
                {recent.map((e) => (
                  <div key={e.id} className="px-3 py-1.5 text-[11px] font-mono flex items-center gap-2 hover:bg-primary/5">
                    <span className={`w-1.5 h-1.5 rounded-full ${e.severity === "critical" ? "bg-danger animate-glow-pulse" : e.severity === "high" ? "bg-warning" : "bg-primary"}`} />
                    <span className="text-foreground/90 truncate flex-1">{e.event_type}</span>
                    <span className="text-text-muted">{e.source_ip ?? "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-accent/30 bg-panel-bg/60 backdrop-blur overflow-hidden flex flex-col">
              <div className="px-3 py-2 border-b border-accent/20 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-accent">Recent AI Decisions</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/30">
                {runs.length === 0 ? (
                  <div className="p-4 text-xs text-text-muted">
                    {autonomous ? "Autonomous analyst is online. Waiting for qualifying events." : "Analyst on standby. Enable AUTO in the dock to operate hands-free."}
                  </div>
                ) : (
                  runs.slice(0, 8).map((r) => (
                    <div key={r.id} className="px-3 py-2 text-[11px]">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${
                          r.decision.severity === "critical" ? "text-danger border-danger/50 bg-danger/10"
                          : r.decision.severity === "high" ? "text-warning border-warning/50 bg-warning/10"
                          : "text-primary border-primary/40 bg-primary/10"
                        }`}>{r.decision.severity}</span>
                        <span className="text-text-muted font-mono truncate">{r.decision.mitre_technique_id}</span>
                      </div>
                      <div className="text-foreground/90 line-clamp-2">{r.decision.narrative}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] uppercase tracking-[0.3em] text-text-muted font-mono">
          Press <kbd className="px-1.5 py-0.5 border border-primary/40 rounded text-primary">⌘K</kbd> to open the Command Palette
        </div>
      </div>
    </div>
  );
};

const Mini = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`px-2 py-1.5 rounded border backdrop-blur bg-background/60 ${highlight ? "border-danger/50" : "border-primary/30"}`}>
    <div className="text-[9px] uppercase tracking-widest text-text-muted font-mono">{label}</div>
    <div className={`text-lg font-bold font-mono ${highlight ? "text-danger text-glow" : "text-primary text-glow"}`}>{value}</div>
  </div>
);

export default CinematicHome;
