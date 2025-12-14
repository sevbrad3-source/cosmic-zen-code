import { Network, Shield, Lock, Unlock, AlertTriangle, Wifi, Server, Globe, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const NetworkDefensePanel = () => {
  const firewallRules = [
    { id: "FW-001", name: "Block External SSH", source: "0.0.0.0/0", dest: "10.0.0.0/8", port: "22", action: "deny", hits: 15420 },
    { id: "FW-002", name: "Allow HTTPS Ingress", source: "0.0.0.0/0", dest: "DMZ", port: "443", action: "allow", hits: 847293 },
    { id: "FW-003", name: "Block C2 IPs", source: "TI-FEED", dest: "*", port: "*", action: "deny", hits: 892 },
    { id: "FW-004", name: "Internal DNS Only", source: "10.0.0.0/8", dest: "10.0.0.53", port: "53", action: "allow", hits: 2847123 },
  ];

  const segments = [
    { name: "DMZ", status: "secured", devices: 12, alerts: 0 },
    { name: "Corporate", status: "warning", devices: 847, alerts: 3 },
    { name: "Production", status: "secured", devices: 234, alerts: 0 },
    { name: "Development", status: "isolated", devices: 156, alerts: 1 },
  ];

  const activeConnections = [
    { source: "10.0.1.45", dest: "52.84.223.15", port: 443, protocol: "HTTPS", bytes: "2.4 MB", status: "normal" },
    { source: "10.0.2.78", dest: "192.168.1.10", port: 445, protocol: "SMB", bytes: "847 KB", status: "suspicious" },
    { source: "10.0.1.23", dest: "8.8.8.8", port: 53, protocol: "DNS", bytes: "12 KB", status: "normal" },
    { source: "10.0.3.12", dest: "185.143.172.x", port: 4444, protocol: "TCP", bytes: "128 KB", status: "blocked" },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-sm font-semibold text-[hsl(210,100%,80%)]">Network Defense</span>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
            <Activity className="w-2.5 h-2.5 mr-1" />
            MONITORING
          </Badge>
        </div>

        {/* Safety Banner */}
        <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,25%)] rounded-lg p-2 flex items-start gap-2">
          <Shield className="w-4 h-4 text-[hsl(210,100%,60%)] flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-[hsl(210,60%,60%)]">
            <span className="font-semibold text-[hsl(210,100%,70%)]">SIMULATION</span> — Network defense training environment
          </div>
        </div>

        {/* Network Segments */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Network Segments</span>
          <div className="grid grid-cols-2 gap-1.5">
            {segments.map((seg, i) => (
              <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[hsl(210,100%,80%)]">{seg.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    seg.status === 'secured' ? 'bg-green-500' :
                    seg.status === 'warning' ? 'bg-yellow-500 animate-pulse' :
                    'bg-blue-500'
                  }`} />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(210,60%,50%)]">{seg.devices} devices</span>
                  {seg.alerts > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 h-4 text-[9px]">{seg.alerts} alerts</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Firewall Rules */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Active Rules</span>
            <button className="text-[10px] text-[hsl(210,100%,60%)] hover:text-[hsl(210,100%,70%)]">+ Add Rule</button>
          </div>
          <div className="space-y-1.5">
            {firewallRules.map((rule) => (
              <div key={rule.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {rule.action === 'deny' ? (
                      <Lock className="w-3 h-3 text-red-400" />
                    ) : (
                      <Unlock className="w-3 h-3 text-green-400" />
                    )}
                    <span className="text-xs text-[hsl(210,100%,80%)]">{rule.name}</span>
                  </div>
                  <span className="text-[9px] text-[hsl(210,60%,50%)] font-mono">{rule.id}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
                  <span>{rule.source} → {rule.dest}:{rule.port}</span>
                  <span className="text-[hsl(210,60%,40%)]">{rule.hits.toLocaleString()} hits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Connections */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Live Connections</span>
          <div className="space-y-1.5">
            {activeConnections.map((conn, i) => (
              <div key={i} className={`bg-[hsl(210,100%,8%)] border rounded p-2 ${
                conn.status === 'suspicious' ? 'border-yellow-500/50' :
                conn.status === 'blocked' ? 'border-red-500/50' :
                'border-[hsl(210,100%,15%)]'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[hsl(210,60%,60%)]">
                    {conn.source} → {conn.dest}
                  </span>
                  {conn.status === 'suspicious' && <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                  {conn.status === 'blocked' && <Lock className="w-3 h-3 text-red-400" />}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(210,60%,50%)]">{conn.protocol}:{conn.port}</span>
                  <span className="text-[hsl(210,60%,40%)]">{conn.bytes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Globe className="w-3.5 h-3.5" />
            Topology View
          </button>
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Server className="w-3.5 h-3.5" />
            Segment Manager
          </button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default NetworkDefensePanel;
