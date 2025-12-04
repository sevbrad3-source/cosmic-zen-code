import { useState } from "react";
import { AlertTriangle, Clock, Users, FileText, CheckCircle, XCircle, Play, Pause, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const IncidentResponsePanel = () => {
  const [activeIncident, setActiveIncident] = useState("INC-001");

  const incidents = [
    {
      id: "INC-001",
      title: "Ransomware Detection - Finance Dept",
      severity: "critical",
      status: "active",
      phase: "containment",
      assignee: "SOC Team A",
      timeElapsed: "2h 34m",
    },
    {
      id: "INC-002",
      title: "Data Exfiltration Attempt",
      severity: "high",
      status: "investigating",
      phase: "identification",
      assignee: "IR Team",
      timeElapsed: "45m",
    },
    {
      id: "INC-003",
      title: "Phishing Campaign Detected",
      severity: "medium",
      status: "contained",
      phase: "eradication",
      assignee: "SOC Team B",
      timeElapsed: "5h 12m",
    },
  ];

  const playbookSteps = [
    { name: "Detection & Triage", status: "completed", time: "15m" },
    { name: "Identification", status: "completed", time: "45m" },
    { name: "Containment", status: "in-progress", time: "1h 30m" },
    { name: "Eradication", status: "pending", time: "-" },
    { name: "Recovery", status: "pending", time: "-" },
    { name: "Lessons Learned", status: "pending", time: "-" },
  ];

  const affectedAssets = [
    { name: "FIN-WKS-001", type: "Workstation", status: "isolated" },
    { name: "FIN-WKS-002", type: "Workstation", status: "isolated" },
    { name: "FIN-SRV-01", type: "File Server", status: "monitoring" },
    { name: "DC01", type: "Domain Controller", status: "secured" },
  ];

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Safety Banner */}
      <div className="bg-[hsl(0,100%,15%)] border border-[hsl(0,100%,30%)] rounded p-2 flex items-center gap-2 animate-pulse">
        <AlertTriangle className="w-4 h-4 text-[hsl(0,100%,60%)]" />
        <span className="text-xs text-[hsl(0,100%,80%)]">ACTIVE INCIDENT - IR Simulation Mode</span>
      </div>

      {/* Active Incidents */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Open Incidents</span>
        <div className="space-y-1">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setActiveIncident(incident.id)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                activeIncident === incident.id
                  ? "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]"
                  : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      incident.severity === "critical"
                        ? "bg-[hsl(0,100%,50%)] animate-pulse"
                        : incident.severity === "high"
                        ? "bg-[hsl(30,100%,50%)]"
                        : "bg-[hsl(60,100%,50%)]"
                    }`}
                  />
                  <span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{incident.id}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[8px] ${
                    incident.status === "active"
                      ? "border-[hsl(0,100%,40%)] text-[hsl(0,100%,60%)]"
                      : incident.status === "investigating"
                      ? "border-[hsl(30,100%,40%)] text-[hsl(30,100%,60%)]"
                      : "border-[hsl(120,100%,35%)] text-[hsl(120,100%,55%)]"
                  }`}
                >
                  {incident.status}
                </Badge>
              </div>
              <div className="text-xs font-medium mt-1">{incident.title}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-[hsl(210,60%,45%)]">{incident.assignee}</span>
                <span className="text-[9px] text-[hsl(210,60%,45%)]">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {incident.timeElapsed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IR Playbook Progress */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Playbook Progress</span>
        <div className="space-y-1">
          {playbookSteps.map((step, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {step.status === "completed" ? (
                  <CheckCircle className="w-4 h-4 text-[hsl(120,100%,45%)]" />
                ) : step.status === "in-progress" ? (
                  <div className="w-4 h-4 border-2 border-[hsl(210,100%,50%)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-4 h-4 border border-[hsl(210,60%,30%)] rounded-full" />
                )}
                <span className={`text-xs ${step.status === "pending" ? "text-[hsl(210,60%,40%)]" : ""}`}>
                  {step.name}
                </span>
              </div>
              <span className="text-[9px] text-[hsl(210,60%,45%)]">{step.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Affected Assets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Affected Assets</span>
        <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded divide-y divide-[hsl(210,100%,15%)]">
          {affectedAssets.map((asset, i) => (
            <div key={i} className="p-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium">{asset.name}</div>
                <div className="text-[9px] text-[hsl(210,60%,45%)]">{asset.type}</div>
              </div>
              <Badge
                variant="outline"
                className={`text-[8px] ${
                  asset.status === "isolated"
                    ? "border-[hsl(0,100%,40%)] text-[hsl(0,100%,60%)]"
                    : asset.status === "monitoring"
                    ? "border-[hsl(60,100%,40%)] text-[hsl(60,100%,60%)]"
                    : "border-[hsl(120,100%,35%)] text-[hsl(120,100%,55%)]"
                }`}
              >
                {asset.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="text-xs py-2 bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)] rounded text-white flex items-center justify-center gap-1">
          <Pause className="w-3 h-3" /> Isolate Host
        </button>
        <button className="text-xs py-2 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white flex items-center justify-center gap-1">
          <FileText className="w-3 h-3" /> Generate Report
        </button>
      </div>
    </div>
  );
};

export default IncidentResponsePanel;
