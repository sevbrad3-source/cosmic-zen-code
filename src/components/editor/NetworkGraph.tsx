import { useState } from "react";
import { Shield, Server, Database, Laptop, Router, Globe, Wifi, HardDrive, Lock, AlertTriangle, Activity, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Node {
  id: string;
  label: string;
  type: "target" | "router" | "server" | "database" | "workstation" | "internet";
  x: number;
  y: number;
  compromised: boolean;
  risk: "low" | "medium" | "high" | "critical";
  ip?: string;
  os?: string;
  services?: string[];
  vulns?: string[];
  cpu?: number;
  memory?: number;
  bandwidth?: number;
  uptime?: string;
  lastScan?: string;
}

interface Edge {
  from: string;
  to: string;
  protocol: string;
  active: boolean;
}

const NetworkGraph = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: Node[] = [
    { 
      id: "internet", label: "Internet", type: "internet", x: 50, y: 50, compromised: false, risk: "low",
      ip: "0.0.0.0/0", os: "N/A", services: ["ANY"], bandwidth: 1000, uptime: "∞"
    },
    { 
      id: "firewall", label: "Firewall", type: "router", x: 50, y: 150, compromised: false, risk: "medium",
      ip: "203.0.113.1", os: "pfSense 2.7.0", services: ["HTTP", "HTTPS", "SSH"], 
      vulns: [], cpu: 35, memory: 45, bandwidth: 800, uptime: "45d 3h", lastScan: "2m ago"
    },
    { 
      id: "dmz-web", label: "Web Server", type: "server", x: 20, y: 250, compromised: true, risk: "critical",
      ip: "203.0.113.10", os: "Ubuntu 20.04", services: ["HTTP:80", "HTTPS:443", "SSH:22"],
      vulns: ["CVE-2024-1234 (Apache 2.4.41)", "Weak SSL Config"], cpu: 78, memory: 82, bandwidth: 650, 
      uptime: "12d 18h", lastScan: "5m ago"
    },
    { 
      id: "dmz-mail", label: "Mail Server", type: "server", x: 80, y: 250, compromised: true, risk: "high",
      ip: "203.0.113.20", os: "Debian 11", services: ["SMTP:25", "IMAP:993", "POP3:995"],
      vulns: ["Dovecot 2.3.13 - Auth Bypass"], cpu: 42, memory: 55, bandwidth: 320, 
      uptime: "8d 5h", lastScan: "3m ago"
    },
    { 
      id: "router", label: "Internal Router", type: "router", x: 50, y: 350, compromised: true, risk: "high",
      ip: "192.168.1.1", os: "Cisco IOS 15.2", services: ["Telnet:23", "SSH:22", "SNMP:161"],
      vulns: ["Default Credentials", "SNMP Community String Exposed"], cpu: 55, memory: 62, bandwidth: 900,
      uptime: "120d 15h", lastScan: "1m ago"
    },
    { 
      id: "dc", label: "Domain Controller", type: "server", x: 30, y: 450, compromised: false, risk: "critical",
      ip: "192.168.1.10", os: "Windows Server 2019", services: ["LDAP:389", "Kerberos:88", "SMB:445", "RDP:3389"],
      vulns: ["PrintNightmare Patched", "ZeroLogon Patched"], cpu: 68, memory: 74, bandwidth: 450,
      uptime: "32d 7h", lastScan: "2m ago"
    },
    { 
      id: "db", label: "Database", type: "database", x: 70, y: 450, compromised: false, risk: "critical",
      ip: "192.168.1.20", os: "Ubuntu 22.04", services: ["MySQL:3306", "SSH:22"],
      vulns: ["MySQL 8.0.28 - Auth Plugin Issue"], cpu: 85, memory: 91, bandwidth: 750,
      uptime: "18d 12h", lastScan: "4m ago"
    },
    { 
      id: "ws1", label: "Workstation-01", type: "workstation", x: 15, y: 550, compromised: false, risk: "medium",
      ip: "192.168.1.100", os: "Windows 10 Pro", services: ["RDP:3389", "SMB:445"],
      vulns: ["KB5012170 Missing"], cpu: 28, memory: 45, bandwidth: 100, uptime: "5d 22h", lastScan: "6m ago"
    },
    { 
      id: "ws2", label: "Workstation-02", type: "workstation", x: 45, y: 550, compromised: false, risk: "low",
      ip: "192.168.1.101", os: "Windows 11 Pro", services: ["RDP:3389", "SMB:445"],
      vulns: [], cpu: 15, memory: 32, bandwidth: 95, uptime: "2d 8h", lastScan: "7m ago"
    },
    { 
      id: "ws3", label: "Workstation-03", type: "workstation", x: 75, y: 550, compromised: false, risk: "medium",
      ip: "192.168.1.102", os: "macOS 13.2", services: ["SSH:22", "AFP:548", "VNC:5900"],
      vulns: ["Outdated Safari 16.3"], cpu: 42, memory: 58, bandwidth: 120, uptime: "15d 3h", lastScan: "5m ago"
    },
  ];

  const edges: Edge[] = [
    { from: "internet", to: "firewall", protocol: "HTTPS", active: true },
    { from: "firewall", to: "dmz-web", protocol: "HTTP", active: true },
    { from: "firewall", to: "dmz-mail", protocol: "SMTP", active: true },
    { from: "dmz-web", to: "router", protocol: "SSH", active: true },
    { from: "dmz-mail", to: "router", protocol: "SSH", active: false },
    { from: "router", to: "dc", protocol: "SMB", active: true },
    { from: "router", to: "db", protocol: "MySQL", active: true },
    { from: "dc", to: "ws1", protocol: "RDP", active: false },
    { from: "dc", to: "ws2", protocol: "RDP", active: false },
    { from: "dc", to: "ws3", protocol: "RDP", active: false },
    { from: "db", to: "dmz-web", protocol: "MySQL", active: true },
  ];

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "internet": return Globe;
      case "router": return Router;
      case "server": return Server;
      case "database": return Database;
      case "workstation": return Laptop;
      default: return Shield;
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="relative w-full h-full bg-panel-bg">
      <svg className="w-full h-full" viewBox="0 0 100 600">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            className="fill-border"
          >
            <polygon points="0 0, 10 3, 0 6" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            className="fill-primary"
          >
            <polygon points="0 0, 10 3, 0 6" />
          </marker>
        </defs>

        {/* Draw edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <g key={i}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={edge.active ? "stroke-primary" : "stroke-border"}
                strokeWidth="0.3"
                markerEnd={edge.active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              />
              {edge.active && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2}
                  className="fill-text-muted text-[2px] font-mono"
                  textAnchor="middle"
                >
                  {edge.protocol}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => setSelectedNode(node.id)}
              className="cursor-pointer"
            >
              <circle
                r="4"
                className={`
                  ${isSelected ? "fill-primary stroke-primary" : "fill-panel-bg stroke-border"}
                  ${node.compromised ? "stroke-red-500 fill-red-500/20" : ""}
                  transition-all hover:stroke-primary
                `}
                strokeWidth="0.5"
              />
              {node.compromised && (
                <circle
                  r="4.5"
                  className="fill-none stroke-red-500 animate-ping"
                  strokeWidth="0.3"
                  opacity="0.5"
                />
              )}
              <text
                y="6"
                className="fill-text-secondary text-[2.5px] font-mono"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detailed Node Info Panel */}
      {selectedNodeData && (
        <div className="absolute top-2 right-2 bg-sidebar-bg border border-border rounded shadow-lg w-96 max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border bg-surface-elevated">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-text-primary">{selectedNodeData.label}</h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-text-muted hover:text-text-primary text-lg leading-none"
            >
              ×
            </button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-8 bg-surface m-0 rounded-none">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-96">
              <TabsContent value="overview" className="p-3 space-y-3 m-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                    <span className="text-xs text-text-muted">IP Address</span>
                    <span className="text-xs font-mono text-text-primary">{selectedNodeData.ip}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                    <span className="text-xs text-text-muted">Operating System</span>
                    <span className="text-xs text-text-secondary">{selectedNodeData.os}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                    <span className="text-xs text-text-muted">Status</span>
                    <Badge variant={selectedNodeData.compromised ? "destructive" : "outline"} className="text-[10px]">
                      {selectedNodeData.compromised ? "COMPROMISED" : "SECURE"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                    <span className="text-xs text-text-muted">Risk Level</span>
                    <Badge 
                      variant={selectedNodeData.risk === "critical" || selectedNodeData.risk === "high" ? "destructive" : "outline"}
                      className="text-[10px]"
                    >
                      {selectedNodeData.risk.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                    <span className="text-xs text-text-muted">Uptime</span>
                    <span className="text-xs font-mono text-text-secondary">{selectedNodeData.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                    <span className="text-xs text-text-muted">Last Scan</span>
                    <span className="text-xs text-text-secondary">{selectedNodeData.lastScan}</span>
                  </div>
                </div>

                {selectedNodeData.vulns && selectedNodeData.vulns.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-status-warning" />
                      Vulnerabilities
                    </div>
                    {selectedNodeData.vulns.map((vuln, idx) => (
                      <div key={idx} className="p-2 bg-status-warning/10 border border-status-warning/30 rounded">
                        <div className="text-[11px] text-text-primary">{vuln}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedNodeData.compromised && (
                  <button className="w-full py-2 px-3 bg-accent text-accent-foreground rounded text-xs font-medium hover:opacity-90 transition-opacity">
                    Pivot to This Node
                  </button>
                )}
              </TabsContent>

              <TabsContent value="services" className="p-3 space-y-2 m-0">
                <div className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-accent" />
                  Active Services
                </div>
                {selectedNodeData.services?.map((service, idx) => (
                  <div key={idx} className="p-2 bg-surface rounded border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3 h-3 text-accent" />
                      <span className="text-xs font-mono text-text-primary">{service}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px]">OPEN</Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="metrics" className="p-3 space-y-3 m-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3 h-3 text-text-muted" />
                      <span className="text-xs text-text-muted">CPU Usage</span>
                    </div>
                    <span className="text-xs font-mono text-text-primary">{selectedNodeData.cpu}%</span>
                  </div>
                  <Progress value={selectedNodeData.cpu} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3 h-3 text-text-muted" />
                      <span className="text-xs text-text-muted">Memory Usage</span>
                    </div>
                    <span className="text-xs font-mono text-text-primary">{selectedNodeData.memory}%</span>
                  </div>
                  <Progress value={selectedNodeData.memory} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-text-muted" />
                      <span className="text-xs text-text-muted">Bandwidth</span>
                    </div>
                    <span className="text-xs font-mono text-text-primary">{selectedNodeData.bandwidth} Mbps</span>
                  </div>
                  <Progress value={(selectedNodeData.bandwidth || 0) / 10} className="h-2" />
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-[10px] text-text-muted space-y-1">
                    <div>Network Latency: 12ms</div>
                    <div>Packet Loss: 0.1%</div>
                    <div>Open Connections: 47</div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-sidebar-bg border border-border rounded p-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-text-muted">Compromised</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-text-muted">Active Connection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-border bg-panel-bg" />
          <span className="text-text-muted">Secure</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
