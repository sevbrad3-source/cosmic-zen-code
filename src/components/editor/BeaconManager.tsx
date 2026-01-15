import { Shield, Trash2, Terminal, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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

const BeaconManager = () => {
  const [beacons] = useState<Beacon[]>([
    {
      id: "beacon_001",
      computer: "DESKTOP-DEMO01",
      ip: "192.168.1.105",
      user: "demo_user",
      process: "rundll32.exe",
      pid: 4532,
      arch: "x64",
      lastSeen: "2s ago",
      status: "active"
    },
    {
      id: "beacon_002",
      computer: "WORKSTATION-02",
      ip: "192.168.1.89",
      user: "testuser",
      process: "svchost.exe",
      pid: 2184,
      arch: "x86",
      lastSeen: "45s ago",
      status: "sleeping"
    }
  ]);

  const handleInteract = (beacon: Beacon) => {
    toast.info("🎮 SIMULATION MODE", {
      description: `Mock interaction with ${beacon.computer}. This is a safe training environment.`
    });
  };

  const handleRemove = (beacon: Beacon) => {
    toast.info("Beacon removed", {
      description: `Beacon ${beacon.id} has been terminated.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-status-success";
      case "sleeping": return "text-status-warning";
      case "lost": return "text-status-error";
      default: return "text-text-muted";
    }
  };

  return (
    <div className="p-3 space-y-3">
      <div className="text-xs text-text-muted mb-2">ACTIVE BEACONS ({beacons.length})</div>
      
      {beacons.map((beacon) => (
        <div key={beacon.id} className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2 hover:border-accent/50 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-mono text-xs font-semibold text-text-primary truncate">
                  {beacon.computer}
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusColor(beacon.status)}`}>
                  {beacon.status}
                </Badge>
              </div>
              <div className="text-[11px] text-text-muted space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">IP:</span>
                  <span className="font-mono">{beacon.ip}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">User:</span>
                  <span className="font-mono">{beacon.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Process:</span>
                  <span className="font-mono">{beacon.process} ({beacon.pid})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Arch:</span>
                  <span className="font-mono">{beacon.arch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Last:</span>
                  <span>{beacon.lastSeen}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-[11px] gap-1.5"
              onClick={() => handleInteract(beacon)}
            >
              <Terminal className="w-3 h-3" />
              Interact
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-[11px] gap-1.5"
              onClick={() => handleRemove(beacon)}
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </Button>
          </div>

          {/* Simulation Indicator */}
          <div className="pt-1.5 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-[10px] text-status-info">
              <AlertTriangle className="w-3 h-3" />
              <span>Simulated beacon for training</span>
            </div>
          </div>
        </div>
      ))}

      {beacons.length === 0 && (
        <div className="text-center py-8 text-xs text-text-muted">
          No active beacons (simulation)
        </div>
      )}
    </div>
  );
};

export default BeaconManager;
