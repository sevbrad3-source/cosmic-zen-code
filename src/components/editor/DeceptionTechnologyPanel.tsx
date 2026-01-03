import { useState } from "react";
import { Eye, Target, Network, Shield, AlertTriangle, Activity, Layers, Plus, Zap, Copy, FileText, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Decoy {
  id: string;
  name: string;
  type: "breadcrumb" | "document" | "credential" | "service" | "data";
  location: string;
  triggered: boolean;
  triggerCount: number;
  lastTriggered: string | null;
  attractiveness: number;
}

interface BreadcrumbTrail {
  id: string;
  name: string;
  steps: string[];
  completed: number;
  active: boolean;
}

const DeceptionTechnologyPanel = () => {
  const [decoys] = useState<Decoy[]>([
    { id: "1", name: "fake_passwords.xlsx", type: "document", location: "\\\\FILESERVER\\Finance", triggered: true, triggerCount: 3, lastTriggered: "2m ago", attractiveness: 95 },
    { id: "2", name: "admin_backup.rdp", type: "credential", location: "C:\\Users\\Admin\\Desktop", triggered: true, triggerCount: 1, lastTriggered: "15m ago", attractiveness: 88 },
    { id: "3", name: "VPN-Config.ovpn", type: "credential", location: "\\\\DC01\\SYSVOL", triggered: false, triggerCount: 0, lastTriggered: null, attractiveness: 92 },
    { id: "4", name: "SSH_Keys", type: "breadcrumb", location: "/home/dev/.ssh/", triggered: true, triggerCount: 5, lastTriggered: "1h ago", attractiveness: 85 },
    { id: "5", name: "customer_db.sql", type: "data", location: "\\\\DBSERVER\\Backups", triggered: false, triggerCount: 0, lastTriggered: null, attractiveness: 98 },
    { id: "6", name: "secret-api-service", type: "service", location: "192.168.1.200:8443", triggered: true, triggerCount: 12, lastTriggered: "5m ago", attractiveness: 78 },
  ]);

  const [trails] = useState<BreadcrumbTrail[]>([
    { id: "1", name: "Lateral Movement Path", steps: ["Workstation", "File Server", "Domain Controller", "Database"], completed: 2, active: true },
    { id: "2", name: "Data Exfil Route", steps: ["Documents", "Staging Server", "External C2"], completed: 1, active: true },
    { id: "3", name: "Privilege Escalation", steps: ["User Creds", "Admin Hash", "Domain Admin"], completed: 0, active: false },
  ]);

  const getTypeIcon = (type: Decoy["type"]) => {
    const icons = {
      breadcrumb: <Network className="w-3 h-3" />,
      document: <FileText className="w-3 h-3" />,
      credential: <Copy className="w-3 h-3" />,
      service: <Zap className="w-3 h-3" />,
      data: <Database className="w-3 h-3" />,
    };
    return icons[type];
  };

  const getTypeColor = (type: Decoy["type"]) => {
    const colors = {
      breadcrumb: "hsl(280,100%,60%)",
      document: "hsl(200,100%,60%)",
      credential: "hsl(30,100%,60%)",
      service: "hsl(120,100%,50%)",
      data: "hsl(0,100%,60%)",
    };
    return colors[type];
  };

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[hsl(280,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">DECEPTION TECHNOLOGY</span>
        </div>
        <button className="text-xs px-2 py-1 bg-[hsl(280,100%,30%)] hover:bg-[hsl(280,100%,40%)] rounded text-white flex items-center gap-1">
          <Plus className="w-3 h-3" /> New Decoy
        </button>
      </div>

      {/* Deception Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-[hsl(0,100%,60%)]" />
            <span className="text-[9px] text-[hsl(210,60%,50%)]">Triggered</span>
          </div>
          <div className="text-xl font-bold text-[hsl(0,100%,60%)]">21</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
          <div className="flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-[hsl(280,100%,60%)]" />
            <span className="text-[9px] text-[hsl(210,60%,50%)]">Active</span>
          </div>
          <div className="text-xl font-bold text-[hsl(280,100%,60%)]">156</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
          <div className="flex items-center gap-1 mb-1">
            <Activity className="w-3 h-3 text-[hsl(120,100%,50%)]" />
            <span className="text-[9px] text-[hsl(210,60%,50%)]">Coverage</span>
          </div>
          <div className="text-xl font-bold text-[hsl(120,100%,50%)]">89%</div>
        </div>
      </div>

      {/* Active Decoys */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Active Decoys</span>
        <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin">
          {decoys.map((decoy) => (
            <div
              key={decoy.id}
              className={`p-2 bg-[hsl(210,100%,8%)] border rounded transition-all ${
                decoy.triggered ? "border-[hsl(0,100%,40%)]" : "border-[hsl(210,100%,18%)]"
              } hover:border-[hsl(210,100%,30%)]`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded" style={{ backgroundColor: `${getTypeColor(decoy.type)}20`, color: getTypeColor(decoy.type) }}>
                    {getTypeIcon(decoy.type)}
                  </div>
                  <span className="text-xs font-medium">{decoy.name}</span>
                </div>
                {decoy.triggered && (
                  <Badge className="bg-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)] text-[8px] animate-pulse">
                    TRIGGERED
                  </Badge>
                )}
              </div>
              <div className="text-[9px] text-[hsl(210,60%,45%)] truncate mb-1">{decoy.location}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[8px]">
                  <span>
                    <span className="text-[hsl(210,60%,40%)]">Hits:</span> {decoy.triggerCount}
                  </span>
                  {decoy.lastTriggered && (
                    <span className="text-[hsl(0,100%,60%)]">{decoy.lastTriggered}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-[hsl(210,60%,40%)]">Lure:</span>
                  <Progress value={decoy.attractiveness} className="w-12 h-1" />
                  <span className="text-[8px]">{decoy.attractiveness}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breadcrumb Trails */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Breadcrumb Trails</span>
        <div className="space-y-2">
          {trails.map((trail) => (
            <div key={trail.id} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{trail.name}</span>
                <Badge className={trail.active ? "bg-[hsl(120,100%,25%)] text-[hsl(120,100%,70%)] text-[8px]" : "bg-[hsl(210,30%,25%)] text-[hsl(210,60%,60%)] text-[8px]"}>
                  {trail.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {trail.steps.map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${i < trail.completed ? "bg-[hsl(0,100%,30%)] text-[hsl(0,100%,80%)]" : "bg-[hsl(210,100%,15%)] text-[hsl(210,60%,50%)]"}`}>
                      {step}
                    </div>
                    {i < trail.steps.length - 1 && <div className={`w-3 h-0.5 ${i < trail.completed ? "bg-[hsl(0,100%,50%)]" : "bg-[hsl(210,100%,20%)]"}`} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attacker Behavior */}
      <div className="p-2 bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded">
        <div className="text-[10px] font-semibold text-[hsl(210,60%,50%)] mb-2">Attacker Behavior Map</div>
        <div className="grid grid-cols-5 gap-1">
          {["Recon", "Access", "Discovery", "Lateral", "Exfil"].map((phase, i) => {
            const activity = [45, 78, 92, 34, 12][i];
            return (
              <div key={phase} className="text-center">
                <div
                  className="h-8 rounded-sm flex items-end justify-center"
                  style={{ backgroundColor: `hsl(0, 100%, ${15 + (activity / 100) * 35}%)` }}
                >
                  <span className="text-[8px] text-white/80 mb-0.5">{activity}%</span>
                </div>
                <span className="text-[7px] text-[hsl(210,60%,45%)]">{phase}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeceptionTechnologyPanel;
