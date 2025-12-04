import { useState } from "react";
import { Search, Target, Eye, AlertTriangle, Activity, Database, Clock, CheckCircle, XCircle, ChevronRight, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ThreatHuntingPanel = () => {
  const [activeHunt, setActiveHunt] = useState<string | null>("hunt-001");

  const hunts = [
    {
      id: "hunt-001",
      name: "Lateral Movement Detection",
      status: "active",
      hypothesis: "Adversary using pass-the-hash for lateral movement",
      progress: 67,
      findings: 3,
      dataSourcesCovered: ["Windows Event Logs", "Network Flow", "EDR"],
    },
    {
      id: "hunt-002",
      name: "Beacon Pattern Analysis",
      status: "active",
      hypothesis: "C2 beaconing via DNS tunneling",
      progress: 34,
      findings: 1,
      dataSourcesCovered: ["DNS Logs", "Proxy Logs"],
    },
    {
      id: "hunt-003",
      name: "Credential Access Hunt",
      status: "completed",
      hypothesis: "LSASS memory dumping activity",
      progress: 100,
      findings: 7,
      dataSourcesCovered: ["Sysmon", "EDR", "Memory Forensics"],
    },
  ];

  const iocs = [
    { type: "IP", value: "192.168.45.23", confidence: "high", source: "Hunt-001" },
    { type: "Hash", value: "a3b9c8d7e6f5...", confidence: "medium", source: "Hunt-003" },
    { type: "Domain", value: "evil-c2.net", confidence: "high", source: "Hunt-002" },
    { type: "Process", value: "mimikatz.exe", confidence: "critical", source: "Hunt-003" },
  ];

  const behavioralPatterns = [
    { pattern: "Unusual admin logon times", count: 12, severity: "medium" },
    { pattern: "Multiple failed auth attempts", count: 47, severity: "high" },
    { pattern: "Process injection detected", count: 3, severity: "critical" },
    { pattern: "Lateral movement signature", count: 8, severity: "high" },
  ];

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Safety Banner */}
      <div className="bg-[hsl(210,100%,15%)] border border-[hsl(210,100%,30%)] rounded p-2 flex items-center gap-2">
        <Eye className="w-4 h-4 text-[hsl(210,100%,60%)]" />
        <span className="text-xs text-[hsl(210,100%,70%)]">DEFENSIVE SIMULATION - Threat Hunting Training Module</span>
      </div>

      {/* Active Hunts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Active Hunts</span>
          <button className="text-xs px-2 py-1 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white">
            + New Hunt
          </button>
        </div>
        <div className="space-y-2">
          {hunts.map((hunt) => (
            <div
              key={hunt.id}
              onClick={() => setActiveHunt(hunt.id)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                activeHunt === hunt.id
                  ? "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]"
                  : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{hunt.name}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    hunt.status === "active"
                      ? "border-[hsl(120,100%,40%)] text-[hsl(120,100%,60%)]"
                      : "border-[hsl(210,100%,40%)] text-[hsl(210,100%,60%)]"
                  }`}
                >
                  {hunt.status}
                </Badge>
              </div>
              <p className="text-[10px] text-[hsl(210,60%,60%)] mb-2">{hunt.hypothesis}</p>
              <div className="flex items-center gap-2">
                <Progress value={hunt.progress} className="h-1 flex-1" />
                <span className="text-[10px] text-[hsl(210,60%,50%)]">{hunt.progress}%</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-[hsl(210,60%,50%)]">{hunt.findings} findings</span>
                <div className="flex gap-1">
                  {hunt.status === "active" ? (
                    <button className="p-1 hover:bg-[hsl(210,100%,20%)] rounded">
                      <Pause className="w-3 h-3" />
                    </button>
                  ) : (
                    <button className="p-1 hover:bg-[hsl(210,100%,20%)] rounded">
                      <Play className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IOC Tracking */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">IOC Tracking</span>
        <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded divide-y divide-[hsl(210,100%,15%)]">
          {iocs.map((ioc, i) => (
            <div key={i} className="p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] border-[hsl(210,100%,30%)]">
                  {ioc.type}
                </Badge>
                <span className="text-xs font-mono">{ioc.value}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] ${
                  ioc.confidence === "critical"
                    ? "border-[hsl(0,100%,50%)] text-[hsl(0,100%,70%)]"
                    : ioc.confidence === "high"
                    ? "border-[hsl(30,100%,50%)] text-[hsl(30,100%,70%)]"
                    : "border-[hsl(60,100%,40%)] text-[hsl(60,100%,60%)]"
                }`}
              >
                {ioc.confidence}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Analytics */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Behavioral Analytics</span>
        <div className="space-y-1">
          {behavioralPatterns.map((pattern, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Activity
                  className={`w-3 h-3 ${
                    pattern.severity === "critical"
                      ? "text-[hsl(0,100%,60%)]"
                      : pattern.severity === "high"
                      ? "text-[hsl(30,100%,60%)]"
                      : "text-[hsl(60,100%,60%)]"
                  }`}
                />
                <span className="text-xs">{pattern.pattern}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[hsl(210,60%,50%)]">{pattern.count}x</span>
                <ChevronRight className="w-3 h-3 text-[hsl(210,60%,40%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hunt Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">23</div>
          <div className="text-[10px] text-[hsl(210,60%,50%)]">Hosts Analyzed</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">11</div>
          <div className="text-[10px] text-[hsl(210,60%,50%)]">Findings Total</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,60%)]">3</div>
          <div className="text-[10px] text-[hsl(210,60%,50%)]">Critical IOCs</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">89%</div>
          <div className="text-[10px] text-[hsl(210,60%,50%)]">Coverage</div>
        </div>
      </div>
    </div>
  );
};

export default ThreatHuntingPanel;
