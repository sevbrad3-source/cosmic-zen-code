import { useState } from "react";
import { Activity, Shield, AlertTriangle, Eye, Radio, Users, Server, Zap, BarChart3, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "overview", icon: Activity, label: "Overview" },
  { id: "alerts", icon: AlertTriangle, label: "Alerts", badge: 47, badgeVariant: "critical" },
  { id: "investigations", icon: Eye, label: "Investigations", badge: 3 },
  { id: "analysts", icon: Users, label: "Analysts" },
  { id: "metrics", icon: BarChart3, label: "Metrics" },
];

const SOCDashboardPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");

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

  const analysts = [
    { name: "J. Smith", role: "Senior Analyst", status: "online", cases: 3, alerts: 12 },
    { name: "M. Chen", role: "IR Lead", status: "online", cases: 2, alerts: 8 },
    { name: "A. Kumar", role: "Threat Intel", status: "online", cases: 1, alerts: 5 },
    { name: "S. Wilson", role: "SOC Manager", status: "away", cases: 0, alerts: 0 },
    { name: "R. Garcia", role: "Analyst", status: "online", cases: 4, alerts: 15 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((metric, i) => (
                <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg p-2.5">
                  <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">{metric.label}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className={`text-lg font-bold ${metric.status === 'critical' ? 'text-red-400' : 'text-[hsl(210,100%,80%)]'}`}>{metric.value}</span>
                    <span className={`text-[10px] ${metric.change.startsWith('+') ? 'text-green-400' : 'text-[hsl(210,60%,50%)]'}`}>{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5"><Eye className="w-3.5 h-3.5" />View All Alerts</button>
              <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5"><Zap className="w-3.5 h-3.5" />Escalate</button>
            </div>
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Recent Alerts</span><span className="text-[10px] text-[hsl(210,60%,40%)]">Last 24h</span></div>
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2 hover:border-[hsl(210,100%,30%)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center gap-2"><span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{alert.id}</span><Badge variant="outline" className={`h-4 text-[9px] ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[hsl(210,100%,20%)] text-[hsl(210,60%,60%)]'}`}>{alert.severity}</Badge></div><div className="text-xs text-[hsl(210,100%,80%)] mt-0.5 truncate">{alert.title}</div><div className="text-[10px] text-[hsl(210,60%,40%)] mt-0.5">{alert.source}</div></div><span className="text-[9px] text-[hsl(210,60%,40%)]">{alert.time}</span></div>
              </div>
            ))}
          </div>
        );
      case "investigations":
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Active Investigations</span>
            {activeInvestigations.map((inv) => (
              <div key={inv.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{inv.id}</span><span className="text-[10px] text-[hsl(210,60%,50%)]">{inv.analyst}</span></div>
                <div className="text-xs text-[hsl(210,100%,80%)] mb-2">{inv.title}</div>
                <div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-[hsl(210,100%,15%)] rounded-full overflow-hidden"><div className="h-full bg-[hsl(210,100%,50%)] rounded-full" style={{ width: `${inv.progress}%` }} /></div><span className="text-[10px] text-[hsl(210,100%,60%)]">{inv.progress}%</span></div>
              </div>
            ))}
          </div>
        );
      case "analysts":
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">SOC Team</span>
            {analysts.map((analyst, i) => (
              <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${analyst.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div className="flex-1">
                  <div className="text-xs text-[hsl(210,100%,80%)]">{analyst.name}</div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)]">{analyst.role}</div>
                </div>
                <div className="text-right text-[10px] text-[hsl(210,60%,50%)]">
                  <div>{analyst.cases} cases</div>
                  <div>{analyst.alerts} alerts</div>
                </div>
              </div>
            ))}
          </div>
        );
      case "metrics":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">SOC Performance</span>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "MTTD", value: "3m 42s", color: "hsl(120,100%,50%)" }, { label: "MTTR", value: "24m 15s", color: "hsl(210,100%,70%)" }, { label: "Alert Volume", value: "1.2K/day", color: "hsl(45,100%,50%)" }, { label: "Escalation Rate", value: "8.4%", color: "hsl(280,100%,70%)" }].map((m, i) => (
                <div key={i} className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center">
                  <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-[9px] text-[hsl(210,60%,50%)]">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="blue" />
      <ScrollArea className="flex-1"><div className="p-3">{renderContent()}</div></ScrollArea>
    </div>
  );
};

export default SOCDashboardPanel;
