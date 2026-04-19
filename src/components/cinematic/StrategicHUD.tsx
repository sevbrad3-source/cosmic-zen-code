import { Activity, Shield, Target, Brain, Zap } from "lucide-react";

interface Props {
  threatLevel: "GREEN" | "YELLOW" | "ORANGE" | "RED" | "BLACK";
  activeIncidents: number;
  iocCount: number;
  assetCount: number;
  autonomous: boolean;
  decisionsToday: number;
}

const levelStyle: Record<Props["threatLevel"], string> = {
  GREEN: "text-success border-success/50 bg-success/10",
  YELLOW: "text-warning border-warning/50 bg-warning/10",
  ORANGE: "text-accent border-accent/50 bg-accent/10",
  RED: "text-danger border-danger/50 bg-danger/10 animate-glow-pulse",
  BLACK: "text-foreground border-foreground bg-foreground/20 animate-glow-pulse",
};

export const StrategicHUD = ({ threatLevel, activeIncidents, iocCount, assetCount, autonomous, decisionsToday }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      <div className={`relative px-3 py-2 rounded-md border ${levelStyle[threatLevel]} overflow-hidden`}>
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="text-[9px] uppercase tracking-widest opacity-80 font-mono">Threat Level</div>
        <div className="text-xl font-bold tracking-wider font-mono text-glow">{threatLevel}</div>
      </div>
      <Stat icon={Activity} label="Active Incidents" value={activeIncidents} accent="warning" />
      <Stat icon={Target} label="Active IOCs" value={iocCount} accent="accent" />
      <Stat icon={Shield} label="Monitored Assets" value={assetCount} accent="primary" />
      <Stat
        icon={Brain}
        label="AI Decisions (24h)"
        value={decisionsToday}
        accent={autonomous ? "success" : "muted"}
        sub={autonomous ? "AUTONOMOUS" : "STANDBY"}
      />
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, accent, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent: string; sub?: string }) => {
  const accentMap: Record<string, string> = {
    warning: "text-warning border-warning/40",
    accent: "text-accent border-accent/40",
    primary: "text-primary border-primary/40",
    success: "text-success border-success/40",
    muted: "text-text-muted border-border",
  };
  return (
    <div className={`relative px-3 py-2 rounded-md border bg-panel-bg/60 backdrop-blur ${accentMap[accent]} overflow-hidden`}>
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="flex items-center justify-between">
        <div className="text-[9px] uppercase tracking-widest text-text-muted font-mono">{label}</div>
        <Icon className="w-3.5 h-3.5 opacity-70" />
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-xl font-bold font-mono">{value}</div>
        {sub && <div className="text-[9px] uppercase tracking-widest opacity-80 font-mono">{sub}</div>}
      </div>
    </div>
  );
};

export default StrategicHUD;
