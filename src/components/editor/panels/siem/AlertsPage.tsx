import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Eye, XCircle, Filter, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  rule: string;
  source: string;
  count: number;
  time: string;
  status: "new" | "acknowledged" | "investigating" | "resolved" | "false-positive";
  assignee?: string;
}

const AlertsPage = () => {
  const [filter, setFilter] = useState<string>("all");

  const alerts: Alert[] = [
    { id: "ALT-001", severity: "critical", rule: "Mimikatz Detection", source: "DC01", count: 3, time: "2 min ago", status: "new" },
    { id: "ALT-002", severity: "critical", rule: "Ransomware Behavior", source: "FIN-WKS-01", count: 1, time: "5 min ago", status: "investigating", assignee: "Sarah C." },
    { id: "ALT-003", severity: "high", rule: "Brute Force Attempt", source: "WEB-01", count: 47, time: "8 min ago", status: "acknowledged" },
    { id: "ALT-004", severity: "high", rule: "Suspicious PowerShell", source: "DEV-WKS-15", count: 5, time: "12 min ago", status: "new" },
    { id: "ALT-005", severity: "medium", rule: "Suspicious DNS Query", source: "WKS-15", count: 12, time: "15 min ago", status: "new" },
    { id: "ALT-006", severity: "medium", rule: "New Service Installed", source: "SRV-03", count: 1, time: "22 min ago", status: "false-positive" },
    { id: "ALT-007", severity: "low", rule: "Failed Logon Attempt", source: "DC01", count: 2, time: "30 min ago", status: "resolved" },
  ];

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "bg-[hsl(0,100%,35%)] text-white";
      case "high": return "bg-[hsl(30,100%,35%)] text-white";
      case "medium": return "bg-[hsl(45,100%,35%)] text-black";
      default: return "bg-[hsl(210,60%,30%)] text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <AlertTriangle className="w-3 h-3 text-[hsl(0,100%,60%)]" />;
      case "acknowledged": return <Eye className="w-3 h-3 text-[hsl(45,100%,55%)]" />;
      case "investigating": return <Clock className="w-3 h-3 text-[hsl(210,100%,60%)]" />;
      case "resolved": return <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" />;
      case "false-positive": return <XCircle className="w-3 h-3 text-[hsl(210,60%,50%)]" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const stats = {
    critical: alerts.filter(a => a.severity === "critical" && a.status !== "resolved").length,
    high: alerts.filter(a => a.severity === "high" && a.status !== "resolved").length,
    new: alerts.filter(a => a.status === "new").length,
    total: alerts.filter(a => a.status !== "resolved" && a.status !== "false-positive").length,
  };

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,25%)] rounded-lg text-center cursor-pointer" onClick={() => setFilter(filter === "critical" ? "all" : "critical")}>
          <div className="text-lg font-bold text-[hsl(0,100%,60%)]">{stats.critical}</div>
          <div className="text-[9px] text-[hsl(0,60%,55%)]">Critical</div>
        </div>
        <div className="p-2 bg-[hsl(30,100%,10%)] border border-[hsl(30,100%,25%)] rounded-lg text-center cursor-pointer" onClick={() => setFilter(filter === "high" ? "all" : "high")}>
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">{stats.high}</div>
          <div className="text-[9px] text-[hsl(30,60%,50%)]">High</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{stats.new}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">New</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{stats.total}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Open</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">ACTIVE ALERTS</span>
          {filter !== "all" && (
            <Badge variant="outline" className="text-[9px] cursor-pointer" onClick={() => setFilter("all")}>
              {filter} ×
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" className="h-6 text-[10px] border-[hsl(210,100%,25%)]">
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg hover:border-[hsl(210,100%,25%)] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  alert.severity === "critical" ? "bg-[hsl(0,100%,50%)] animate-pulse" :
                  alert.severity === "high" ? "bg-[hsl(30,100%,50%)]" :
                  alert.severity === "medium" ? "bg-[hsl(45,100%,50%)]" :
                  "bg-[hsl(210,60%,50%)]"
                }`} />
                <span className="text-sm font-medium text-[hsl(210,100%,85%)]">{alert.rule}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={`text-[9px] ${getSeverityColor(alert.severity)}`}>
                  x{alert.count}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3 text-[hsl(210,60%,50%)]">
                <span>{alert.source}</span>
                <span className="flex items-center gap-1">
                  {getStatusIcon(alert.status)}
                  {alert.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {alert.assignee && <span className="text-[hsl(210,100%,65%)]">{alert.assignee}</span>}
                <span className="text-[hsl(210,60%,45%)]">{alert.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
