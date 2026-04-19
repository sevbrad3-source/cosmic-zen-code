import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, ShieldAlert, Zap } from "lucide-react";

interface TickerEvent {
  id: string;
  severity: string;
  event_type: string;
  source_ip: string | null;
  detected_at: string;
}

const sevIcon = (s: string) => {
  if (s === "critical") return <ShieldAlert className="w-3.5 h-3.5 text-danger" />;
  if (s === "high") return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
  if (s === "medium") return <Zap className="w-3.5 h-3.5 text-accent" />;
  return <Activity className="w-3.5 h-3.5 text-primary" />;
};

const sevBg = (s: string) => {
  if (s === "critical") return "bg-danger/20 border-danger/40";
  if (s === "high") return "bg-warning/15 border-warning/40";
  if (s === "medium") return "bg-accent/15 border-accent/40";
  return "bg-primary/15 border-primary/40";
};

export const ThreatTicker = () => {
  const [events, setEvents] = useState<TickerEvent[]>([]);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("security_events")
      .select("id,severity,event_type,source_ip,detected_at")
      .order("detected_at", { ascending: false })
      .limit(30)
      .then(({ data }) => { if (mounted && data) setEvents(data); });

    const channel = supabase
      .channel("ticker-events")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "security_events" }, (payload) => {
        setEvents((prev) => [payload.new as TickerEvent, ...prev].slice(0, 30));
      })
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  const items = events.length ? events : [
    { id: "p1", severity: "low", event_type: "AWAITING_TELEMETRY", source_ip: null, detected_at: new Date().toISOString() },
  ];
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-primary/20 bg-deep">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="flex animate-ticker gap-2 py-1.5 whitespace-nowrap" style={{ width: "max-content" }}>
        {doubled.map((e, i) => (
          <div key={e.id + "-" + i} className={`flex items-center gap-2 px-3 py-1 rounded border ${sevBg(e.severity)}`}>
            {sevIcon(e.severity)}
            <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/90">{e.event_type}</span>
            {e.source_ip && <span className="font-mono text-[11px] text-text-muted">{e.source_ip}</span>}
            <span className="font-mono text-[10px] text-text-muted">
              {new Date(e.detected_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatTicker;
