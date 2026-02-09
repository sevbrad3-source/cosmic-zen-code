import { useState } from "react";
import { Network, Shield, Lock, Unlock, AlertTriangle, Wifi, Server, Globe, Activity, Layers, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "segments", icon: Layers, label: "Segments" },
  { id: "firewall", icon: Shield, label: "Firewall Rules" },
  { id: "connections", icon: Activity, label: "Live Connections", badge: 4 },
  { id: "ids", icon: Eye, label: "IDS/IPS" },
];

const NetworkDefensePanel = () => {
  const [activeTab, setActiveTab] = useState("segments");

  const segments = [
    { name: "DMZ", status: "secured", devices: 12, alerts: 0 },
    { name: "Corporate", status: "warning", devices: 847, alerts: 3 },
    { name: "Production", status: "secured", devices: 234, alerts: 0 },
    { name: "Development", status: "isolated", devices: 156, alerts: 1 },
  ];

  const firewallRules = [
    { id: "FW-001", name: "Block External SSH", source: "0.0.0.0/0", dest: "10.0.0.0/8", port: "22", action: "deny", hits: 15420 },
    { id: "FW-002", name: "Allow HTTPS Ingress", source: "0.0.0.0/0", dest: "DMZ", port: "443", action: "allow", hits: 847293 },
    { id: "FW-003", name: "Block C2 IPs", source: "TI-FEED", dest: "*", port: "*", action: "deny", hits: 892 },
    { id: "FW-004", name: "Internal DNS Only", source: "10.0.0.0/8", dest: "10.0.0.53", port: "53", action: "allow", hits: 2847123 },
  ];

  const activeConnections = [
    { source: "10.0.1.45", dest: "52.84.223.15", port: 443, protocol: "HTTPS", bytes: "2.4 MB", status: "normal" },
    { source: "10.0.2.78", dest: "192.168.1.10", port: 445, protocol: "SMB", bytes: "847 KB", status: "suspicious" },
    { source: "10.0.1.23", dest: "8.8.8.8", port: 53, protocol: "DNS", bytes: "12 KB", status: "normal" },
    { source: "10.0.3.12", dest: "185.143.172.x", port: 4444, protocol: "TCP", bytes: "128 KB", status: "blocked" },
  ];

  const idsAlerts = [
    { rule: "ET MALWARE CobaltStrike Beacon", severity: "critical", src: "10.0.2.78", count: 12, action: "alert" },
    { rule: "ET SCAN Nmap SYN Scan", severity: "high", src: "10.0.1.100", count: 847, action: "drop" },
    { rule: "ET POLICY DNS Query to .onion", severity: "medium", src: "10.0.3.45", count: 3, action: "alert" },
    { rule: "ET EXPLOIT Apache Log4j RCE", severity: "critical", src: "external", count: 234, action: "drop" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "segments":
        return (
          <div className="space-y-3">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Network Segments</span>
            <div className="grid grid-cols-2 gap-1.5">
              {segments.map((seg, i) => (
                <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                  <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold text-[hsl(210,100%,80%)]">{seg.name}</span><div className={`w-2 h-2 rounded-full ${seg.status === 'secured' ? 'bg-green-500' : seg.status === 'warning' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`} /></div>
                  <div className="flex items-center justify-between text-[10px]"><span className="text-[hsl(210,60%,50%)]">{seg.devices} devices</span>{seg.alerts > 0 && <Badge className="bg-red-500/20 text-red-400 h-4 text-[9px]">{seg.alerts} alerts</Badge>}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5"><Globe className="w-3.5 h-3.5" />Topology View</button>
              <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5"><Server className="w-3.5 h-3.5" />Segment Manager</button>
            </div>
          </div>
        );
      case "firewall":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Active Rules</span><button className="text-[10px] text-[hsl(210,100%,60%)]">+ Add Rule</button></div>
            {firewallRules.map((rule) => (
              <div key={rule.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2">{rule.action === 'deny' ? <Lock className="w-3 h-3 text-red-400" /> : <Unlock className="w-3 h-3 text-green-400" />}<span className="text-xs text-[hsl(210,100%,80%)]">{rule.name}</span></div><span className="text-[9px] text-[hsl(210,60%,50%)] font-mono">{rule.id}</span></div>
                <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]"><span>{rule.source} → {rule.dest}:{rule.port}</span><span>{rule.hits.toLocaleString()} hits</span></div>
              </div>
            ))}
          </div>
        );
      case "connections":
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Live Connections</span>
            {activeConnections.map((conn, i) => (
              <div key={i} className={`bg-[hsl(210,100%,8%)] border rounded p-2 ${conn.status === 'suspicious' ? 'border-yellow-500/50' : conn.status === 'blocked' ? 'border-red-500/50' : 'border-[hsl(210,100%,15%)]'}`}>
                <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-mono text-[hsl(210,60%,60%)]">{conn.source} → {conn.dest}</span>{conn.status === 'suspicious' && <AlertTriangle className="w-3 h-3 text-yellow-400" />}{conn.status === 'blocked' && <Lock className="w-3 h-3 text-red-400" />}</div>
                <div className="flex items-center justify-between text-[10px]"><span className="text-[hsl(210,60%,50%)]">{conn.protocol}:{conn.port}</span><span className="text-[hsl(210,60%,40%)]">{conn.bytes}</span></div>
              </div>
            ))}
          </div>
        );
      case "ids":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">IDS/IPS Alerts</span>
            {idsAlerts.map((alert, i) => (
              <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[hsl(210,100%,80%)]">{alert.rule}</span>
                  <Badge variant="outline" className={`text-[9px] ${alert.severity === "critical" ? "border-red-500/50 text-red-400" : alert.severity === "high" ? "border-orange-500/50 text-orange-400" : "border-yellow-500/50 text-yellow-400"}`}>{alert.severity}</Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
                  <span>Source: {alert.src}</span><span>{alert.count} hits</span>
                  <Badge className={`text-[9px] ${alert.action === "drop" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>{alert.action}</Badge>
                </div>
              </div>
            ))}
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

export default NetworkDefensePanel;
