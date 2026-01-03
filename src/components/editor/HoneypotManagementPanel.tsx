import { useState } from "react";
import { Bug, Server, AlertTriangle, Play, Pause, Settings, Eye, Activity, Network, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Honeypot {
  id: string;
  name: string;
  type: "ssh" | "http" | "smb" | "ftp" | "rdp" | "mysql" | "custom";
  status: "active" | "paused" | "compromised";
  ip: string;
  port: number;
  interactions: number;
  attackers: number;
  lastActivity: string;
  capturedCreds: number;
  profile: string;
}

const HoneypotManagementPanel = () => {
  const [honeypots] = useState<Honeypot[]>([
    { id: "1", name: "SSH-Trap-01", type: "ssh", status: "active", ip: "10.0.50.10", port: 22, interactions: 1247, attackers: 89, lastActivity: "2s ago", capturedCreds: 156, profile: "Ubuntu 20.04" },
    { id: "2", name: "Web-Decoy-01", type: "http", status: "compromised", ip: "10.0.50.20", port: 80, interactions: 3421, attackers: 234, lastActivity: "15s ago", capturedCreds: 0, profile: "Apache 2.4" },
    { id: "3", name: "SMB-Trap-01", type: "smb", status: "active", ip: "10.0.50.30", port: 445, interactions: 567, attackers: 45, lastActivity: "1m ago", capturedCreds: 23, profile: "Windows Server" },
    { id: "4", name: "RDP-Decoy-01", type: "rdp", status: "paused", ip: "10.0.50.40", port: 3389, interactions: 234, attackers: 12, lastActivity: "5m ago", capturedCreds: 8, profile: "Win10 Workstation" },
    { id: "5", name: "MySQL-Trap-01", type: "mysql", status: "active", ip: "10.0.50.50", port: 3306, interactions: 892, attackers: 67, lastActivity: "30s ago", capturedCreds: 45, profile: "MySQL 8.0" },
  ]);

  const [recentAttacks] = useState([
    { time: "00:02:34", source: "185.234.67.12", target: "SSH-Trap-01", action: "Brute Force", details: "45 login attempts" },
    { time: "00:01:56", source: "91.134.23.89", target: "Web-Decoy-01", action: "SQL Injection", details: "UNION-based attack" },
    { time: "00:01:23", source: "45.89.234.12", target: "SMB-Trap-01", action: "EternalBlue", details: "CVE-2017-0144" },
    { time: "00:00:45", source: "103.45.67.234", target: "MySQL-Trap-01", action: "Auth Bypass", details: "Empty password test" },
  ]);

  const getTypeColor = (type: Honeypot["type"]) => {
    const colors = {
      ssh: "hsl(280,100%,60%)",
      http: "hsl(200,100%,60%)",
      smb: "hsl(30,100%,60%)",
      ftp: "hsl(120,100%,50%)",
      rdp: "hsl(0,100%,60%)",
      mysql: "hsl(180,100%,50%)",
      custom: "hsl(60,100%,50%)",
    };
    return colors[type];
  };

  const getStatusBadge = (status: Honeypot["status"]) => {
    if (status === "active") return <Badge className="bg-[hsl(120,100%,25%)] text-[hsl(120,100%,70%)] text-[8px]">Active</Badge>;
    if (status === "compromised") return <Badge className="bg-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)] text-[8px] animate-pulse">Compromised</Badge>;
    return <Badge className="bg-[hsl(210,30%,25%)] text-[hsl(210,60%,60%)] text-[8px]">Paused</Badge>;
  };

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-[hsl(280,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">HONEYPOT MANAGEMENT</span>
        </div>
        <button className="text-xs px-2 py-1 bg-[hsl(280,100%,30%)] hover:bg-[hsl(280,100%,40%)] rounded text-white flex items-center gap-1">
          <Plus className="w-3 h-3" /> Deploy
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,60%)]">5</div>
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Deployed</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,60%)]">447</div>
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Attackers</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(280,100%,60%)]">232</div>
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Credentials</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">6.3K</div>
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Events</div>
        </div>
      </div>

      {/* Honeypot List */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Active Honeypots</span>
        <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin">
          {honeypots.map((hp) => (
            <div key={hp.id} className={`p-2 bg-[hsl(210,100%,8%)] border rounded ${hp.status === "compromised" ? "border-[hsl(0,100%,40%)] animate-pulse" : "border-[hsl(210,100%,18%)]"} hover:border-[hsl(210,100%,30%)]`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getTypeColor(hp.type) }} />
                  <span className="text-xs font-medium">{hp.name}</span>
                  {getStatusBadge(hp.status)}
                </div>
                <div className="flex items-center gap-1">
                  {hp.status === "active" ? (
                    <button className="p-1 hover:bg-[hsl(210,100%,18%)] rounded"><Pause className="w-3 h-3 text-[hsl(210,60%,50%)]" /></button>
                  ) : (
                    <button className="p-1 hover:bg-[hsl(210,100%,18%)] rounded"><Play className="w-3 h-3 text-[hsl(120,100%,50%)]" /></button>
                  )}
                  <button className="p-1 hover:bg-[hsl(210,100%,18%)] rounded"><Settings className="w-3 h-3 text-[hsl(210,60%,50%)]" /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[9px]">
                <div>
                  <span className="text-[hsl(210,60%,45%)]">IP:</span> {hp.ip}:{hp.port}
                </div>
                <div>
                  <span className="text-[hsl(210,60%,45%)]">Attackers:</span> {hp.attackers}
                </div>
                <div>
                  <span className="text-[hsl(210,60%,45%)]">Creds:</span> {hp.capturedCreds}
                </div>
              </div>
              <div className="mt-1 text-[8px] text-[hsl(210,60%,40%)]">
                {hp.profile} • {hp.interactions.toLocaleString()} interactions • {hp.lastActivity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attacks */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Live Attack Feed</span>
        <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin">
          {recentAttacks.map((attack, i) => (
            <div key={i} className="p-1.5 bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded flex items-center gap-2">
              <span className="text-[9px] font-mono text-[hsl(210,60%,45%)]">{attack.time}</span>
              <AlertTriangle className="w-3 h-3 text-[hsl(30,100%,50%)]" />
              <div className="flex-1 text-[9px]">
                <span className="text-[hsl(0,100%,60%)]">{attack.source}</span>
                <span className="text-[hsl(210,60%,45%)]"> → </span>
                <span className="text-[hsl(120,100%,60%)]">{attack.target}</span>
              </div>
              <Badge className="bg-[hsl(30,100%,20%)] text-[hsl(30,100%,70%)] text-[7px]">{attack.action}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Heatmap */}
      <div className="p-2 bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded">
        <div className="text-[10px] font-semibold text-[hsl(210,60%,50%)] mb-2">Attack Intensity (24h)</div>
        <div className="flex gap-0.5 h-4">
          {Array.from({ length: 24 }).map((_, i) => {
            const intensity = Math.random();
            return (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  backgroundColor: `hsl(0, 100%, ${15 + intensity * 40}%)`,
                  opacity: 0.3 + intensity * 0.7,
                }}
                title={`${23 - i}:00 - ${Math.floor(intensity * 100)} attacks`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-[hsl(210,60%,40%)] mt-1">
          <span>24h ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};

export default HoneypotManagementPanel;
