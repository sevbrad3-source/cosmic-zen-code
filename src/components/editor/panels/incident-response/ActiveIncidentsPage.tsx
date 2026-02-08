import { useState } from "react";
import { AlertTriangle, Clock, Users, CheckCircle, XCircle, Play, RotateCcw, Shield, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "investigating" | "contained" | "eradicated" | "closed";
  phase: string;
  assignee: string;
  timeElapsed: string;
  impactedAssets: number;
  lastUpdate: string;
}

const ActiveIncidentsPage = () => {
  const [selectedIncident, setSelectedIncident] = useState<string>("INC-001");

  const incidents: Incident[] = [
    { id: "INC-001", title: "Ransomware Detection - Finance Dept", severity: "critical", status: "active", phase: "Containment", assignee: "SOC Team A", timeElapsed: "2h 34m", impactedAssets: 12, lastUpdate: "5m ago" },
    { id: "INC-002", title: "Data Exfiltration Attempt", severity: "high", status: "investigating", phase: "Identification", assignee: "IR Team", timeElapsed: "45m", impactedAssets: 3, lastUpdate: "2m ago" },
    { id: "INC-003", title: "Phishing Campaign Detected", severity: "medium", status: "contained", phase: "Eradication", assignee: "SOC Team B", timeElapsed: "5h 12m", impactedAssets: 28, lastUpdate: "15m ago" },
    { id: "INC-004", title: "Unauthorized Access - DB Server", severity: "high", status: "investigating", phase: "Identification", assignee: "DB Team", timeElapsed: "1h 20m", impactedAssets: 1, lastUpdate: "8m ago" },
    { id: "INC-005", title: "Malware Infection - Endpoint", severity: "medium", status: "eradicated", phase: "Recovery", assignee: "SOC Team A", timeElapsed: "8h 45m", impactedAssets: 1, lastUpdate: "1h ago" },
  ];

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "bg-[hsl(0,100%,35%)] text-white animate-pulse";
      case "high": return "bg-[hsl(30,100%,35%)] text-white";
      case "medium": return "bg-[hsl(45,100%,35%)] text-black";
      default: return "bg-[hsl(210,60%,35%)] text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-[hsl(0,100%,60%)] border-[hsl(0,100%,40%)]";
      case "investigating": return "text-[hsl(45,100%,60%)] border-[hsl(45,100%,40%)]";
      case "contained": return "text-[hsl(210,100%,60%)] border-[hsl(210,100%,40%)]";
      case "eradicated": return "text-[hsl(120,100%,50%)] border-[hsl(120,100%,35%)]";
      default: return "text-[hsl(210,60%,50%)] border-[hsl(210,60%,30%)]";
    }
  };

  const stats = {
    critical: incidents.filter(i => i.severity === "critical" && i.status !== "closed").length,
    high: incidents.filter(i => i.severity === "high" && i.status !== "closed").length,
    active: incidents.filter(i => i.status === "active" || i.status === "investigating").length,
    totalAssets: incidents.reduce((acc, i) => acc + i.impactedAssets, 0),
  };

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      {stats.critical > 0 && (
        <div className="bg-[hsl(0,100%,12%)] border border-[hsl(0,100%,30%)] rounded-lg p-2 flex items-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-[hsl(0,100%,60%)]" />
          <span className="text-xs text-[hsl(0,100%,80%)] font-medium">
            {stats.critical} CRITICAL INCIDENT{stats.critical > 1 ? "S" : ""} REQUIRE IMMEDIATE ATTENTION
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,65%)]">{stats.critical}</div>
          <div className="text-[9px] text-[hsl(0,60%,55%)]">Critical</div>
        </div>
        <div className="p-2 bg-[hsl(30,100%,10%)] border border-[hsl(30,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">{stats.high}</div>
          <div className="text-[9px] text-[hsl(30,60%,50%)]">High</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{stats.active}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Active</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{stats.totalAssets}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Assets</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">OPEN INCIDENTS</span>
        <Button size="sm" className="h-7 text-xs bg-[hsl(210,100%,30%)]">
          <Plus className="w-3 h-3 mr-1" /> New Incident
        </Button>
      </div>

      {/* Incidents List */}
      <div className="space-y-2">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => setSelectedIncident(incident.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedIncident === incident.id
                ? "bg-[hsl(210,100%,12%)] border-[hsl(210,100%,40%)]"
                : "bg-[hsl(210,100%,7%)] border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  incident.severity === "critical" ? "bg-[hsl(0,100%,50%)] animate-pulse" :
                  incident.severity === "high" ? "bg-[hsl(30,100%,50%)]" :
                  "bg-[hsl(45,100%,50%)]"
                }`} />
                <span className="text-[10px] font-mono text-[hsl(210,60%,55%)]">{incident.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={`text-[9px] ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </Badge>
                <Badge variant="outline" className={`text-[9px] ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </Badge>
              </div>
            </div>

            <div className="text-sm font-medium text-[hsl(210,100%,85%)] mb-2">{incident.title}</div>

            <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {incident.phase}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {incident.timeElapsed}
                </span>
              </div>
              <span>{incident.assignee}</span>
            </div>

            {/* Expanded View */}
            {selectedIncident === incident.id && (
              <div className="mt-3 pt-3 border-t border-[hsl(210,100%,15%)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[hsl(210,60%,50%)]">
                    {incident.impactedAssets} impacted assets • Updated {incident.lastUpdate}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] border-[hsl(210,100%,30%)]">
                    <Play className="w-3 h-3 mr-1" /> Escalate
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] border-[hsl(210,100%,30%)]">
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

export default ActiveIncidentsPage;
