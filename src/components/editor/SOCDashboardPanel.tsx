import { Activity, Shield, AlertTriangle, Eye, Radio, Users, Server, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const SOCDashboardPanel = () => {
  const metrics = [
    { label: "Active Alerts", value: 47, change: "+12", status: "critical" },
    { label: "Events/sec", value: "2.4K", change: "+340", status: "normal" },
    { label: "Monitored Assets", value: 1284, change: "+5", status: "normal" },
    { label: "Active Analysts", value: 8, change: "0", status: "normal" },
  ];

  const recentAlerts = [
    { id: "ALT-4821", title: "Brute Force Attack Detected", severity: "critical", source: "192.168.1.50", time: "2 min ago" },
    { id: "ALT-4820", title: "Anomalous Outbound Traffic", severity: "high", source: "10.0.0.25", time: "5 min ago" },
    { id: "ALT-4819", title: "Failed Login Attempts (15)", severity: "medium", source: "172.16.0.10", time: "8 min ago" },
    { id: "ALT-4818", title: "Suspicious PowerShell Execution", severity: "high", source: "DC-01", time: "12 min ago" },
    { id: "ALT-4817", title: "New Service Installed", severity: "low", source: "WS-042", time: "15 min ago" },
  ];

  const activeInvestigations = [
    { id: "INV-0847", title: "APT29 Campaign Investigation", analyst: "J. Smith", progress: 65 },
    { id: "INV-0846", title: "Data Exfiltration Attempt", analyst: "M. Chen", progress: 40 },
    { id: "INV-0845", title: "Ransomware Precursor Activity", analyst: "A. Kumar", progress: 85 },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-sm font-semibold text-[hsl(210,100%,80%)]">SOC Dashboard</span>
          </div>
          <Badge className="bg-[hsl(210,100%,20%)] text-[hsl(210,100%,70%)] text-[10px]">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
            LIVE
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg p-2.5">
              <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">{metric.label}</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-lg font-bold ${metric.status === 'critical' ? 'text-red-400' : 'text-[hsl(210,100%,80%)]'}`}>
                  {metric.value}
                </span>
                <span className={`text-[10px] ${metric.change.startsWith('+') ? 'text-green-400' : 'text-[hsl(210,60%,50%)]'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Recent Alerts</span>
            <span className="text-[10px] text-[hsl(210,60%,40%)]">Last 24h</span>
          </div>
          <div className="space-y-1.5">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2 hover:border-[hsl(210,100%,30%)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{alert.id}</span>
                      <Badge 
                        variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                        className={`h-4 text-[9px] ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-[hsl(210,100%,20%)] text-[hsl(210,60%,60%)]'
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-[hsl(210,100%,80%)] mt-0.5 truncate">{alert.title}</div>
                    <div className="text-[10px] text-[hsl(210,60%,40%)] mt-0.5">{alert.source}</div>
                  </div>
                  <span className="text-[9px] text-[hsl(210,60%,40%)]">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Investigations */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Active Investigations</span>
          <div className="space-y-1.5">
            {activeInvestigations.map((inv) => (
              <div key={inv.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{inv.id}</span>
                  <span className="text-[10px] text-[hsl(210,60%,50%)]">{inv.analyst}</span>
                </div>
                <div className="text-xs text-[hsl(210,100%,80%)] mb-2">{inv.title}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[hsl(210,100%,15%)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[hsl(210,100%,50%)] rounded-full transition-all"
                      style={{ width: `${inv.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[hsl(210,100%,60%)]">{inv.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            View All Alerts
          </button>
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Zap className="w-3.5 h-3.5" />
            Escalate
          </button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SOCDashboardPanel;
