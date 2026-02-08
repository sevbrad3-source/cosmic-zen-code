import { useState } from "react";
import { Target, Play, Pause, CheckCircle, Clock, AlertTriangle, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Hunt {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "failed";
  hypothesis: string;
  progress: number;
  findings: number;
  dataSourcesCovered: string[];
  startedAt: string;
  analyst: string;
  mitreMapping: string[];
}

const HuntsPage = () => {
  const [selectedHunt, setSelectedHunt] = useState<string | null>("hunt-001");

  const hunts: Hunt[] = [
    {
      id: "hunt-001",
      name: "Lateral Movement Detection",
      status: "active",
      hypothesis: "Adversary using pass-the-hash for lateral movement across domain controllers",
      progress: 67,
      findings: 3,
      dataSourcesCovered: ["Windows Event Logs", "Network Flow", "EDR Telemetry", "AD Audit"],
      startedAt: "2h ago",
      analyst: "Sarah Chen",
      mitreMapping: ["T1550.002", "T1021.002"]
    },
    {
      id: "hunt-002",
      name: "C2 Beacon Pattern Analysis",
      status: "active",
      hypothesis: "Cobalt Strike beaconing via DNS tunneling with jitter patterns",
      progress: 34,
      findings: 1,
      dataSourcesCovered: ["DNS Logs", "Proxy Logs", "Firewall Logs"],
      startedAt: "45m ago",
      analyst: "Mike Torres",
      mitreMapping: ["T1071.004", "T1572"]
    },
    {
      id: "hunt-003",
      name: "Credential Access Hunt",
      status: "completed",
      hypothesis: "LSASS memory dumping via comsvcs.dll or procdump",
      progress: 100,
      findings: 7,
      dataSourcesCovered: ["Sysmon", "EDR", "Memory Forensics", "Process Telemetry"],
      startedAt: "5h ago",
      analyst: "Alex Kim",
      mitreMapping: ["T1003.001"]
    },
    {
      id: "hunt-004",
      name: "Persistence Mechanism Discovery",
      status: "paused",
      hypothesis: "Scheduled tasks or services created for persistence in critical servers",
      progress: 45,
      findings: 2,
      dataSourcesCovered: ["Windows Event Logs", "Registry", "File System"],
      startedAt: "1d ago",
      analyst: "Jordan Lee",
      mitreMapping: ["T1053.005", "T1543.003"]
    },
    {
      id: "hunt-005",
      name: "Data Staging Detection",
      status: "active",
      hypothesis: "Compressed archives being staged in temp directories before exfiltration",
      progress: 22,
      findings: 0,
      dataSourcesCovered: ["File Creation Events", "Process Monitoring"],
      startedAt: "15m ago",
      analyst: "Sarah Chen",
      mitreMapping: ["T1560.001", "T1074.001"]
    }
  ];

  const selectedHuntData = hunts.find(h => h.id === selectedHunt);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">ACTIVE HUNTS</span>
          <Badge className="bg-[hsl(210,100%,25%)] text-[hsl(210,100%,85%)] text-[9px]">
            {hunts.filter(h => h.status === "active").length} Running
          </Badge>
        </div>
        <Button size="sm" className="h-7 text-xs bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)]">
          <Plus className="w-3 h-3 mr-1" /> New Hunt
        </Button>
      </div>

      {/* Hunt List */}
      <div className="space-y-2">
        {hunts.map((hunt) => (
          <div
            key={hunt.id}
            onClick={() => setSelectedHunt(hunt.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedHunt === hunt.id
                ? "bg-[hsl(210,100%,12%)] border-[hsl(210,100%,40%)]"
                : "bg-[hsl(210,100%,7%)] border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[hsl(210,100%,85%)]">{hunt.name}</span>
                  <Badge
                    className={`text-[9px] ${
                      hunt.status === "active" ? "bg-[hsl(120,100%,25%)] text-[hsl(120,100%,85%)]" :
                      hunt.status === "completed" ? "bg-[hsl(210,100%,30%)] text-[hsl(210,100%,85%)]" :
                      hunt.status === "paused" ? "bg-[hsl(45,100%,30%)] text-[hsl(45,100%,90%)]" :
                      "bg-[hsl(0,100%,30%)] text-[hsl(0,100%,85%)]"
                    }`}
                  >
                    {hunt.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-[hsl(210,60%,55%)] leading-relaxed">{hunt.hypothesis}</p>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedHunt === hunt.id ? "rotate-90" : ""} text-[hsl(210,60%,40%)]`} />
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <Progress value={hunt.progress} className="h-1.5 flex-1" />
              <span className="text-[10px] text-[hsl(210,60%,50%)] w-8">{hunt.progress}%</span>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {hunt.findings} findings
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {hunt.startedAt}
                </span>
              </div>
              <span>{hunt.analyst}</span>
            </div>

            {/* Expanded Details */}
            {selectedHunt === hunt.id && (
              <div className="mt-3 pt-3 border-t border-[hsl(210,100%,15%)] space-y-3">
                <div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)] mb-1">DATA SOURCES</div>
                  <div className="flex flex-wrap gap-1">
                    {hunt.dataSourcesCovered.map((ds, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] border-[hsl(210,100%,25%)] text-[hsl(210,100%,70%)]">
                        {ds}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)] mb-1">MITRE MAPPING</div>
                  <div className="flex flex-wrap gap-1">
                    {hunt.mitreMapping.map((t, i) => (
                      <Badge key={i} className="text-[9px] bg-[hsl(270,100%,25%)] text-[hsl(270,100%,85%)]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {hunt.status === "active" ? (
                    <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1 border-[hsl(210,100%,30%)]">
                      <Pause className="w-3 h-3 mr-1" /> Pause
                    </Button>
                  ) : hunt.status === "paused" ? (
                    <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1 border-[hsl(210,100%,30%)]">
                      <Play className="w-3 h-3 mr-1" /> Resume
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1 border-[hsl(210,100%,30%)]">
                    View Details
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

export default HuntsPage;
