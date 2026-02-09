import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, XCircle, Filter, Volume2, VolumeX, BarChart3, Settings, List } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "alerts", icon: Bell, label: "Active Alerts", badge: 6, badgeVariant: "critical" },
  { id: "rules", icon: Filter, label: "Alert Rules" },
  { id: "escalation", icon: AlertTriangle, label: "Escalation" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const AlertCenterPanel = () => {
  const [activeTab, setActiveTab] = useState("alerts");
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

  const stats = { critical: alerts.filter(a => a.severity === "critical").length, high: alerts.filter(a => a.severity === "high").length, medium: alerts.filter(a => a.severity === "medium").length, new: alerts.filter(a => a.status === "new").length };
  const filteredAlerts = filter === "all" ? alerts : filter === "acknowledged" ? alerts.filter(a => a.status === "acknowledged") : alerts.filter(a => a.severity === filter);

  const escalationPolicies = [
    { name: "Critical Alert → SOC Lead", delay: "Immediate", channel: "PagerDuty + Slack" },
    { name: "High Alert (unack 15m) → Analyst", delay: "15 min", channel: "Slack" },
    { name: "P1 Incident → CISO", delay: "30 min", channel: "Phone + Email" },
    { name: "Data Breach → Legal", delay: "1 hour", channel: "Email" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "alerts":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1 hover:bg-[hsl(210,100%,15%)] rounded transition-colors">
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[hsl(210,100%,60%)]" /> : <VolumeX className="w-3.5 h-3.5 text-[hsl(210,60%,50%)]" />}
              </button>
              <div className="px-2 py-0.5 bg-red-500/20 rounded text-[9px] text-red-400 animate-pulse">{stats.new} New</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center"><div className="text-lg font-bold text-red-400">{stats.critical}</div><div className="text-[9px] text-red-400/70">Critical</div></div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2 text-center"><div className="text-lg font-bold text-orange-400">{stats.high}</div><div className="text-[9px] text-orange-400/70">High</div></div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-center"><div className="text-lg font-bold text-yellow-400">{stats.medium}</div><div className="text-[9px] text-yellow-400/70">Medium</div></div>
              <div className="bg-[hsl(210,100%,15%)] border border-[hsl(210,100%,25%)] rounded p-2 text-center"><div className="text-lg font-bold text-[hsl(210,100%,70%)]">{alerts.length}</div><div className="text-[9px] text-[hsl(210,60%,50%)]">Total</div></div>
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all", "critical", "high", "medium", "acknowledged"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 rounded text-[10px] capitalize transition-colors ${filter === f ? "bg-[hsl(210,100%,30%)] text-[hsl(210,100%,90%)]" : "bg-[hsl(210,100%,12%)] text-[hsl(210,60%,60%)] hover:bg-[hsl(210,100%,18%)]"}`}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded border transition-colors ${alert.severity === "critical" ? "bg-red-500/5 border-red-500/30" : alert.severity === "high" ? "bg-orange-500/5 border-orange-500/30" : "bg-yellow-500/5 border-yellow-500/30"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.severity === "critical" ? "text-red-400" : alert.severity === "high" ? "text-orange-400" : "text-yellow-400"}`} />
                      <div>
                        <div className="text-xs font-medium text-[hsl(210,100%,85%)]">{alert.title}</div>
                        <div className="text-[10px] text-[hsl(210,60%,60%)] mt-0.5">{alert.details}</div>
                        <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[hsl(210,60%,50%)]"><span>{alert.source}</span><span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{alert.time}</span></div>
                      </div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 ${alert.status === "new" ? "bg-blue-500/20 text-blue-400" : alert.status === "investigating" ? "bg-purple-500/20 text-purple-400" : alert.status === "acknowledged" ? "bg-green-500/20 text-green-400" : "bg-[hsl(210,100%,15%)] text-[hsl(210,60%,50%)]"}`}>{alert.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[hsl(210,100%,15%)]">
                    <button className="flex-1 py-1 text-[9px] text-[hsl(210,100%,60%)] hover:bg-[hsl(210,100%,15%)] rounded">Acknowledge</button>
                    <button className="flex-1 py-1 text-[9px] text-[hsl(210,100%,60%)] hover:bg-[hsl(210,100%,15%)] rounded">Investigate</button>
                    <button className="flex-1 py-1 text-[9px] text-red-400 hover:bg-red-500/10 rounded">Escalate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "rules":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Alert Rules</span>
              <button className="text-xs px-2 py-1 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white">+ New Rule</button>
            </div>
            {["EDR Critical Detection → P1 Alert", "DLP Data Exfil Attempt → P1 Alert", "Failed Auth > 10/min → P2 Alert", "Suspicious Process Chain → P2 Alert", "New External Connection → P3 Alert"].map((rule, i) => (
              <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between">
                <span className="text-[10px] text-[hsl(210,100%,80%)]">{rule}</span>
                <div className="w-8 h-4 bg-[hsl(120,100%,30%)] rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
              </div>
            ))}
          </div>
        );
      case "escalation":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Escalation Policies</span>
            {escalationPolicies.map((policy, i) => (
              <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
                <div className="text-xs text-[hsl(210,100%,85%)] font-medium">{policy.name}</div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[hsl(210,60%,50%)]">
                  <span>Delay: {policy.delay}</span><span>Via: {policy.channel}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Alert Analytics (30d)</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center"><div className="text-2xl font-bold text-[hsl(210,100%,70%)]">1,247</div><div className="text-[9px] text-[hsl(210,60%,50%)]">Total Alerts</div></div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center"><div className="text-2xl font-bold text-[hsl(120,100%,50%)]">4m 12s</div><div className="text-[9px] text-[hsl(210,60%,50%)]">Avg Response Time</div></div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center"><div className="text-2xl font-bold text-[hsl(45,100%,50%)]">12%</div><div className="text-[9px] text-[hsl(210,60%,50%)]">False Positive Rate</div></div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center"><div className="text-2xl font-bold text-red-400">3</div><div className="text-[9px] text-[hsl(210,60%,50%)]">Active Escalations</div></div>
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

export default AlertCenterPanel;
