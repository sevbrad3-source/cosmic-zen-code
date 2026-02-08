import { useState } from "react";
import { Activity, CheckCircle, Clock, Wifi, WifiOff, Terminal, MoreVertical, Trash2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Agent {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  user: string;
  status: "active" | "idle" | "sleeping" | "dead";
  lastCheckin: string;
  jitter: string;
  sleep: string;
  integrity: "high" | "medium" | "system";
  architecture: string;
  pid: number;
}

const AgentsPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents: Agent[] = [
    { id: "AGENT-4F2A", hostname: "WEB-SERVER-01", ip: "192.168.1.10", os: "Ubuntu 20.04", user: "www-data", status: "active", lastCheckin: "2s ago", jitter: "30%", sleep: "5s", integrity: "medium", architecture: "x64", pid: 1234 },
    { id: "AGENT-7B91", hostname: "DC01", ip: "192.168.1.25", os: "Windows Server 2019", user: "SYSTEM", status: "active", lastCheckin: "8s ago", jitter: "50%", sleep: "10s", integrity: "system", architecture: "x64", pid: 4567 },
    { id: "AGENT-C3E8", hostname: "MAIL-SERVER", ip: "192.168.1.50", os: "CentOS 8", user: "root", status: "idle", lastCheckin: "45s ago", jitter: "20%", sleep: "15s", integrity: "high", architecture: "x64", pid: 8901 },
    { id: "AGENT-9D4C", hostname: "WORKSTATION-42", ip: "192.168.1.105", os: "Windows 10", user: "jsmith", status: "active", lastCheckin: "3s ago", jitter: "40%", sleep: "8s", integrity: "medium", architecture: "x64", pid: 2345 },
    { id: "AGENT-2E7F", hostname: "DB-PRIMARY", ip: "192.168.1.30", os: "Windows Server 2016", user: "sqlsvc", status: "sleeping", lastCheckin: "2m ago", jitter: "60%", sleep: "30s", integrity: "high", architecture: "x64", pid: 6789 },
    { id: "AGENT-8A3B", hostname: "DEV-WKS-01", ip: "192.168.1.150", os: "macOS 13", user: "developer", status: "dead", lastCheckin: "1h ago", jitter: "25%", sleep: "10s", integrity: "medium", architecture: "arm64", pid: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[hsl(120,100%,25%)] text-[hsl(120,100%,75%)]";
      case "idle": return "bg-[hsl(45,100%,25%)] text-[hsl(45,100%,75%)]";
      case "sleeping": return "bg-[hsl(210,100%,25%)] text-[hsl(210,100%,75%)]";
      case "dead": return "bg-[hsl(0,100%,25%)] text-[hsl(0,100%,75%)]";
      default: return "bg-[hsl(210,60%,25%)]";
    }
  };

  const getIntegrityColor = (integrity: string) => {
    switch (integrity) {
      case "system": return "text-[hsl(0,100%,60%)]";
      case "high": return "text-[hsl(30,100%,60%)]";
      default: return "text-[hsl(210,100%,60%)]";
    }
  };

  const stats = {
    active: agents.filter(a => a.status === "active").length,
    idle: agents.filter(a => a.status === "idle" || a.status === "sleeping").length,
    dead: agents.filter(a => a.status === "dead").length,
    total: agents.length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.active}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Active</div>
        </div>
        <div className="p-2 bg-[hsl(45,100%,8%)] border border-[hsl(45,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(45,100%,55%)]">{stats.idle}</div>
          <div className="text-[9px] text-[hsl(45,60%,50%)]">Idle</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,55%)]">{stats.dead}</div>
          <div className="text-[9px] text-[hsl(0,60%,50%)]">Dead</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,70%)]">{stats.total}</div>
          <div className="text-[9px] text-[hsl(0,60%,50%)]">Total</div>
        </div>
      </div>

      {/* Agents List */}
      <div className="space-y-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedAgent === agent.id
                ? "bg-[hsl(0,100%,12%)] border-[hsl(0,100%,35%)]"
                : "bg-[hsl(0,100%,7%)] border-[hsl(0,100%,18%)] hover:border-[hsl(0,100%,28%)]"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {agent.status === "active" ? (
                  <Wifi className="w-4 h-4 text-[hsl(120,100%,50%)]" />
                ) : agent.status === "dead" ? (
                  <WifiOff className="w-4 h-4 text-[hsl(0,100%,50%)]" />
                ) : (
                  <Activity className="w-4 h-4 text-[hsl(45,100%,55%)]" />
                )}
                <div>
                  <div className="text-sm font-medium text-[hsl(0,100%,85%)]">{agent.hostname}</div>
                  <div className="text-[10px] text-[hsl(0,60%,50%)] font-mono">{agent.id}</div>
                </div>
              </div>
              <Badge className={`text-[9px] ${getStatusColor(agent.status)}`}>
                {agent.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
              <div>
                <div className="text-[hsl(0,60%,45%)]">IP</div>
                <div className="text-[hsl(0,100%,75%)] font-mono">{agent.ip}</div>
              </div>
              <div>
                <div className="text-[hsl(0,60%,45%)]">User</div>
                <div className={`font-mono ${getIntegrityColor(agent.integrity)}`}>{agent.user}</div>
              </div>
              <div>
                <div className="text-[hsl(0,60%,45%)]">Last Seen</div>
                <div className="text-[hsl(0,100%,75%)]">{agent.lastCheckin}</div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedAgent === agent.id && (
              <div className="mt-3 pt-3 border-t border-[hsl(0,100%,15%)] space-y-3">
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div className="p-2 bg-[hsl(0,100%,10%)] rounded">
                    <div className="text-[hsl(0,60%,50%)]">OS</div>
                    <div className="text-[hsl(0,100%,80%)]">{agent.os}</div>
                  </div>
                  <div className="p-2 bg-[hsl(0,100%,10%)] rounded">
                    <div className="text-[hsl(0,60%,50%)]">Arch</div>
                    <div className="text-[hsl(0,100%,80%)]">{agent.architecture}</div>
                  </div>
                  <div className="p-2 bg-[hsl(0,100%,10%)] rounded">
                    <div className="text-[hsl(0,60%,50%)]">Sleep</div>
                    <div className="text-[hsl(0,100%,80%)]">{agent.sleep}</div>
                  </div>
                  <div className="p-2 bg-[hsl(0,100%,10%)] rounded">
                    <div className="text-[hsl(0,60%,50%)]">Jitter</div>
                    <div className="text-[hsl(0,100%,80%)]">{agent.jitter}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-7 text-[10px] bg-[hsl(0,100%,30%)]">
                    <Terminal className="w-3 h-3 mr-1" /> Interact
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] border-[hsl(0,100%,25%)]">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] border-[hsl(0,100%,25%)] text-[hsl(0,100%,60%)]">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsPage;
