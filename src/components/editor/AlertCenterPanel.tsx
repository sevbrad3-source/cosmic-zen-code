import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, XCircle, Filter, Volume2, VolumeX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AlertCenterPanel = () => {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "acknowledged">("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const alerts = [
    { id: 1, severity: "critical", title: "Active Ransomware Detected", source: "EDR-01", time: "2 min ago", status: "new", details: "WannaCry variant identified on WS-042" },
    { id: 2, severity: "critical", title: "Data Exfiltration Attempt", source: "DLP-01", time: "5 min ago", status: "investigating", details: "Large data transfer to external IP" },
    { id: 3, severity: "high", title: "Brute Force Attack", source: "SIEM", time: "12 min ago", status: "new", details: "47 failed SSH attempts from 185.234.72.14" },
    { id: 4, severity: "high", title: "Suspicious Process Chain", source: "EDR-02", time: "18 min ago", status: "acknowledged", details: "cmd.exe > powershell.exe > whoami" },
    { id: 5, severity: "medium", title: "Unusual Login Location", source: "IAM", time: "25 min ago", status: "false-positive", details: "VPN login from new country" },
    { id: 6, severity: "medium", title: "Certificate Expiring", source: "PKI", time: "1 hour ago", status: "acknowledged", details: "wildcard.corp.local expires in 7 days" },
  ];

  const stats = {
    critical: alerts.filter(a => a.severity === "critical").length,
    high: alerts.filter(a => a.severity === "high").length,
    medium: alerts.filter(a => a.severity === "medium").length,
    new: alerts.filter(a => a.status === "new").length,
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : filter === "acknowledged" 
      ? alerts.filter(a => a.status === "acknowledged")
      : alerts.filter(a => a.severity === filter);

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">Alert Center</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 hover:bg-[hsl(210,100%,15%)] rounded transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[hsl(210,100%,60%)]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[hsl(210,60%,50%)]" />
              )}
            </button>
            <div className="px-2 py-0.5 bg-red-500/20 rounded text-[9px] text-red-400 animate-pulse">
              {stats.new} New
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
            <div className="text-lg font-bold text-red-400">{stats.critical}</div>
            <div className="text-[9px] text-red-400/70">Critical</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2 text-center">
            <div className="text-lg font-bold text-orange-400">{stats.high}</div>
            <div className="text-[9px] text-orange-400/70">High</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">{stats.medium}</div>
            <div className="text-[9px] text-yellow-400/70">Medium</div>
          </div>
          <div className="bg-[hsl(210,100%,15%)] border border-[hsl(210,100%,25%)] rounded p-2 text-center">
            <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{alerts.length}</div>
            <div className="text-[9px] text-[hsl(210,60%,50%)]">Total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1">
          {(["all", "critical", "high", "medium", "acknowledged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded text-[10px] capitalize transition-colors ${
                filter === f
                  ? "bg-[hsl(210,100%,30%)] text-[hsl(210,100%,90%)]"
                  : "bg-[hsl(210,100%,12%)] text-[hsl(210,60%,60%)] hover:bg-[hsl(210,100%,18%)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-2">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded border transition-colors ${
                alert.severity === "critical"
                  ? "bg-red-500/5 border-red-500/30 hover:border-red-500/50"
                  : alert.severity === "high"
                  ? "bg-orange-500/5 border-orange-500/30 hover:border-orange-500/50"
                  : "bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    alert.severity === "critical" ? "text-red-400" :
                    alert.severity === "high" ? "text-orange-400" :
                    "text-yellow-400"
                  }`} />
                  <div>
                    <div className="text-xs font-medium text-[hsl(210,100%,85%)]">{alert.title}</div>
                    <div className="text-[10px] text-[hsl(210,60%,60%)] mt-0.5">{alert.details}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[hsl(210,60%,50%)]">
                      <span>{alert.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                  alert.status === "new" ? "bg-blue-500/20 text-blue-400" :
                  alert.status === "investigating" ? "bg-purple-500/20 text-purple-400" :
                  alert.status === "acknowledged" ? "bg-green-500/20 text-green-400" :
                  "bg-[hsl(210,100%,15%)] text-[hsl(210,60%,50%)]"
                }`}>{alert.status}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[hsl(210,100%,15%)]">
                <button className="flex-1 py-1 text-[9px] text-[hsl(210,100%,60%)] hover:text-[hsl(210,100%,80%)] hover:bg-[hsl(210,100%,15%)] rounded transition-colors">
                  Acknowledge
                </button>
                <button className="flex-1 py-1 text-[9px] text-[hsl(210,100%,60%)] hover:text-[hsl(210,100%,80%)] hover:bg-[hsl(210,100%,15%)] rounded transition-colors">
                  Investigate
                </button>
                <button className="flex-1 py-1 text-[9px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors">
                  Escalate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default AlertCenterPanel;
