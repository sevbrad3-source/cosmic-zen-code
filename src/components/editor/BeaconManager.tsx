import { useState } from "react";
import { Shield, Trash2, Terminal, Activity, Radar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

interface Beacon {
  id: string;
  computer: string;
  ip: string;
  user: string;
  process: string;
  pid: number;
  arch: string;
  lastSeen: string;
  status: "active" | "sleeping" | "lost";
}

const tabs: InnerTab[] = [
  { id: "fleet", icon: Radar, label: "Fleet" },
  { id: "sessions", icon: Terminal, label: "Sessions" },
  { id: "telemetry", icon: Activity, label: "Telemetry" },
];

const BeaconManager = () => {
  const [activeTab, setActiveTab] = useState("fleet");
  const [beacons] = useState<Beacon[]>([
    { id: "beacon_001", computer: "DESKTOP-DEMO01", ip: "192.168.1.105", user: "demo_user", process: "rundll32.exe", pid: 4532, arch: "x64", lastSeen: "2s ago", status: "active" },
    { id: "beacon_002", computer: "WORKSTATION-02", ip: "192.168.1.89", user: "testuser", process: "svchost.exe", pid: 2184, arch: "x86", lastSeen: "45s ago", status: "sleeping" },
  ]);

  const handleInteract = (beacon: Beacon) => toast.info(`Opened session with ${beacon.computer}`);
  const handleRemove = (beacon: Beacon) => toast.info(`Beacon ${beacon.id} terminated`);

  const renderFleet = () => (
    <div className="space-y-2">
      {beacons.map((beacon) => (
        <div key={beacon.id} className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-semibold text-text-primary">{beacon.computer}</div>
              <div className="text-[11px] text-text-muted">{beacon.ip} • {beacon.user}</div>
            </div>
            <Badge variant="outline" className="text-[10px]">{beacon.status}</Badge>
          </div>
          <div className="text-[11px] text-text-muted">{beacon.process} ({beacon.pid}) • {beacon.arch}</div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
            <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px] gap-1.5" onClick={() => handleInteract(beacon)}>
              <Terminal className="w-3 h-3" /> Interact
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px] gap-1.5" onClick={() => handleRemove(beacon)}>
              <Trash2 className="w-3 h-3" /> Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-2">
      {beacons.map((beacon) => (
        <div key={beacon.id} className="bg-surface-elevated border border-border rounded-lg p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono">{beacon.id}</span>
            <span className="text-text-muted">{beacon.lastSeen}</span>
          </div>
          <div className="text-sm mt-1">{beacon.computer}</div>
        </div>
      ))}
    </div>
  );

  const renderTelemetry = () => (
    <div className="space-y-2">
      <div className="bg-surface-elevated border border-border rounded-lg p-3 flex items-center gap-2 text-sm">
        <Shield className="w-4 h-4 text-primary" /> Integrity checks passing
      </div>
      <div className="bg-surface-elevated border border-border rounded-lg p-3 flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-primary" /> Last fleet sync: 7s ago
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1"><div className="p-3">
        {activeTab === "fleet" && renderFleet()}
        {activeTab === "sessions" && renderSessions()}
        {activeTab === "telemetry" && renderTelemetry()}
      </div></ScrollArea>
    </div>
  );
};

export default BeaconManager;
