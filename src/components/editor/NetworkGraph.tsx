import { useState, useRef, useEffect, useCallback } from "react";
import { Shield, Server, Database, Laptop, Router, Globe, Wifi, HardDrive, Lock, AlertTriangle, Activity, Gauge, Zap, Eye, EyeOff, ZoomIn, ZoomOut, Maximize2, Radio, Cloud, Monitor, Smartphone, Printer, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Node {
  id: string;
  label: string;
  type: "target" | "router" | "server" | "database" | "workstation" | "internet" | "firewall" | "iot" | "cloud" | "mobile" | "printer" | "camera";
  x: number;
  y: number;
  compromised: boolean;
  beingScanned?: boolean;
  risk: "low" | "medium" | "high" | "critical";
  ip?: string;
  mac?: string;
  os?: string;
  services?: { port: number; service: string; version: string; state: "open" | "filtered" | "closed" }[];
  vulns?: { cve: string; severity: string; description: string }[];
  cpu?: number;
  memory?: number;
  disk?: number;
  bandwidth?: number;
  uptime?: string;
  lastScan?: string;
  zone?: "dmz" | "internal" | "external" | "management";
  connections?: number;
  packets?: { in: number; out: number };
}

interface Edge {
  from: string;
  to: string;
  protocol: string;
  active: boolean;
  encrypted?: boolean;
  bandwidth?: number;
  latency?: number;
}

const NetworkGraph = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 100, h: 650 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [animatedPackets, setAnimatedPackets] = useState<{ id: string; progress: number; from: string; to: string }[]>([]);

  // Simulated packet animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPackets(prev => {
        const updated = prev.map(p => ({ ...p, progress: p.progress + 0.02 })).filter(p => p.progress < 1);
        
        // Add new random packets
        if (Math.random() > 0.7 && updated.length < 8) {
          const activeEdges = edges.filter(e => e.active);
          if (activeEdges.length > 0) {
            const edge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
            updated.push({
              id: Math.random().toString(36),
              progress: 0,
              from: edge.from,
              to: edge.to
            });
          }
        }
        return updated;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nodes: Node[] = [
    // External Zone
    { 
      id: "internet", label: "Internet", type: "internet", x: 50, y: 30, compromised: false, risk: "low",
      ip: "0.0.0.0/0", mac: "N/A", os: "N/A", zone: "external",
      services: [{ port: 0, service: "ANY", version: "*", state: "open" }],
      bandwidth: 10000, uptime: "∞", connections: 847, packets: { in: 245821, out: 189342 }
    },
    // DMZ Zone
    { 
      id: "edge-fw", label: "Edge Firewall", type: "firewall", x: 50, y: 90, compromised: false, risk: "medium",
      ip: "203.0.113.1", mac: "00:1A:2B:3C:4D:5E", os: "pfSense 2.7.2", zone: "dmz",
      services: [
        { port: 22, service: "SSH", version: "OpenSSH 8.9", state: "filtered" },
        { port: 443, service: "HTTPS", version: "nginx 1.24", state: "open" },
        { port: 8443, service: "HTTPS-Mgmt", version: "pfSense", state: "filtered" }
      ],
      vulns: [], cpu: 28, memory: 42, disk: 15, bandwidth: 9500, uptime: "127d 4h 22m", lastScan: "45s ago",
      connections: 234, packets: { in: 189234, out: 167823 }
    },
    { 
      id: "dmz-web", label: "DMZ Web Server", type: "server", x: 20, y: 150, compromised: true, risk: "critical",
      ip: "203.0.113.10", mac: "00:1A:2B:3C:4D:10", os: "Ubuntu 22.04 LTS", zone: "dmz",
      services: [
        { port: 22, service: "SSH", version: "OpenSSH 8.9p1", state: "open" },
        { port: 80, service: "HTTP", version: "Apache 2.4.52", state: "open" },
        { port: 443, service: "HTTPS", version: "Apache 2.4.52", state: "open" },
        { port: 3000, service: "Node.js", version: "18.17.0", state: "open" }
      ],
      vulns: [
        { cve: "CVE-2024-23897", severity: "critical", description: "Apache Path Traversal RCE" },
        { cve: "CVE-2024-1086", severity: "high", description: "Linux Kernel Privilege Escalation" },
        { cve: "CVE-2023-44487", severity: "high", description: "HTTP/2 Rapid Reset Attack" }
      ],
      cpu: 78, memory: 82, disk: 67, bandwidth: 650, uptime: "12d 18h 45m", lastScan: "2m ago",
      connections: 156, packets: { in: 892341, out: 756234 }
    },
    { 
      id: "dmz-mail", label: "Mail Gateway", type: "server", x: 80, y: 150, compromised: true, beingScanned: true, risk: "high",
      ip: "203.0.113.20", mac: "00:1A:2B:3C:4D:20", os: "Debian 12", zone: "dmz",
      services: [
        { port: 25, service: "SMTP", version: "Postfix 3.7.6", state: "open" },
        { port: 143, service: "IMAP", version: "Dovecot 2.3.20", state: "open" },
        { port: 993, service: "IMAPS", version: "Dovecot 2.3.20", state: "open" },
        { port: 587, service: "SUBMISSION", version: "Postfix", state: "open" }
      ],
      vulns: [
        { cve: "CVE-2023-51764", severity: "high", description: "SMTP Smuggling Vulnerability" }
      ],
      cpu: 45, memory: 58, disk: 72, bandwidth: 320, uptime: "45d 3h 12m", lastScan: "1m ago",
      connections: 89, packets: { in: 234567, out: 198234 }
    },
    // Internal Router
    { 
      id: "core-sw", label: "Core Switch", type: "router", x: 50, y: 220, compromised: true, risk: "critical",
      ip: "192.168.1.1", mac: "00:1A:2B:3C:4D:01", os: "Cisco IOS XE 17.9.4", zone: "internal",
      services: [
        { port: 22, service: "SSH", version: "Cisco SSH 2.0", state: "open" },
        { port: 23, service: "Telnet", version: "Cisco", state: "open" },
        { port: 161, service: "SNMP", version: "v2c", state: "open" },
        { port: 443, service: "HTTPS", version: "Cisco Web UI", state: "open" }
      ],
      vulns: [
        { cve: "CVE-2023-20198", severity: "critical", description: "Cisco IOS XE Web UI Privilege Escalation" },
        { cve: "CVE-2023-20273", severity: "high", description: "Cisco IOS XE Command Injection" }
      ],
      cpu: 38, memory: 52, disk: 8, bandwidth: 9800, uptime: "89d 12h 33m", lastScan: "30s ago",
      connections: 512, packets: { in: 45678234, out: 43567123 }
    },
    // Server Segment
    { 
      id: "dc01", label: "Domain Controller", type: "server", x: 20, y: 300, compromised: false, risk: "critical",
      ip: "192.168.1.10", mac: "00:1A:2B:3C:4D:DC", os: "Windows Server 2022", zone: "internal",
      services: [
        { port: 53, service: "DNS", version: "Microsoft DNS", state: "open" },
        { port: 88, service: "Kerberos", version: "Microsoft", state: "open" },
        { port: 135, service: "RPC", version: "Microsoft", state: "open" },
        { port: 389, service: "LDAP", version: "Microsoft AD DS", state: "open" },
        { port: 445, service: "SMB", version: "3.1.1", state: "open" },
        { port: 636, service: "LDAPS", version: "Microsoft AD DS", state: "open" },
        { port: 3389, service: "RDP", version: "10.0", state: "filtered" }
      ],
      vulns: [
        { cve: "CVE-2021-42278", severity: "high", description: "sAMAccountName Spoofing (patched)" },
        { cve: "CVE-2020-1472", severity: "critical", description: "Zerologon (patched)" }
      ],
      cpu: 62, memory: 78, disk: 45, bandwidth: 450, uptime: "32d 7h 15m", lastScan: "1m ago",
      connections: 234, packets: { in: 8923451, out: 7234567 }
    },
    { 
      id: "db01", label: "SQL Database", type: "database", x: 50, y: 300, compromised: false, risk: "critical",
      ip: "192.168.1.20", mac: "00:1A:2B:3C:4D:DB", os: "Ubuntu 22.04 LTS", zone: "internal",
      services: [
        { port: 22, service: "SSH", version: "OpenSSH 8.9", state: "filtered" },
        { port: 3306, service: "MySQL", version: "8.0.35", state: "open" },
        { port: 33060, service: "MySQLX", version: "8.0.35", state: "open" }
      ],
      vulns: [
        { cve: "CVE-2024-20960", severity: "medium", description: "MySQL Server Optimizer DoS" }
      ],
      cpu: 85, memory: 91, disk: 78, bandwidth: 780, uptime: "18d 12h 8m", lastScan: "2m ago",
      connections: 67, packets: { in: 12345678, out: 11234567 }
    },
    { 
      id: "file01", label: "File Server", type: "server", x: 80, y: 300, compromised: false, risk: "high",
      ip: "192.168.1.30", mac: "00:1A:2B:3C:4D:FS", os: "Windows Server 2019", zone: "internal",
      services: [
        { port: 135, service: "RPC", version: "Microsoft", state: "open" },
        { port: 139, service: "NetBIOS", version: "Microsoft", state: "open" },
        { port: 445, service: "SMB", version: "3.0.2", state: "open" },
        { port: 3389, service: "RDP", version: "10.0", state: "filtered" }
      ],
      vulns: [
        { cve: "CVE-2020-0796", severity: "critical", description: "SMBGhost (patched)" }
      ],
      cpu: 35, memory: 48, disk: 89, bandwidth: 560, uptime: "67d 22h 45m", lastScan: "3m ago",
      connections: 123, packets: { in: 5678234, out: 4567123 }
    },
    // Workstations
    { 
      id: "ws01", label: "Admin-PC", type: "workstation", x: 12, y: 380, compromised: false, risk: "high",
      ip: "192.168.1.100", mac: "00:1A:2B:3C:4D:A1", os: "Windows 11 Pro", zone: "internal",
      services: [
        { port: 135, service: "RPC", version: "Microsoft", state: "open" },
        { port: 445, service: "SMB", version: "3.1.1", state: "open" },
        { port: 3389, service: "RDP", version: "10.0", state: "open" }
      ],
      vulns: [
        { cve: "CVE-2024-21351", severity: "high", description: "Windows SmartScreen Bypass" }
      ],
      cpu: 42, memory: 65, disk: 55, bandwidth: 100, uptime: "5d 22h 15m", lastScan: "5m ago",
      connections: 34, packets: { in: 234567, out: 198234 }
    },
    { 
      id: "ws02", label: "Dev-PC", type: "workstation", x: 32, y: 380, compromised: false, risk: "medium",
      ip: "192.168.1.101", mac: "00:1A:2B:3C:4D:A2", os: "Ubuntu 23.10", zone: "internal",
      services: [
        { port: 22, service: "SSH", version: "OpenSSH 9.4", state: "open" },
        { port: 8080, service: "HTTP-Dev", version: "Node.js", state: "open" }
      ],
      vulns: [],
      cpu: 28, memory: 72, disk: 45, bandwidth: 150, uptime: "12d 8h 33m", lastScan: "4m ago",
      connections: 18, packets: { in: 156789, out: 134567 }
    },
    { 
      id: "ws03", label: "Finance-PC", type: "workstation", x: 52, y: 380, compromised: false, risk: "low",
      ip: "192.168.1.102", mac: "00:1A:2B:3C:4D:A3", os: "Windows 11 Enterprise", zone: "internal",
      services: [
        { port: 445, service: "SMB", version: "3.1.1", state: "open" }
      ],
      vulns: [],
      cpu: 15, memory: 45, disk: 32, bandwidth: 80, uptime: "2d 4h 12m", lastScan: "6m ago",
      connections: 8, packets: { in: 45678, out: 34567 }
    },
    { 
      id: "ws04", label: "HR-PC", type: "workstation", x: 72, y: 380, compromised: false, risk: "medium",
      ip: "192.168.1.103", mac: "00:1A:2B:3C:4D:A4", os: "macOS 14.2", zone: "internal",
      services: [
        { port: 22, service: "SSH", version: "OpenSSH 9.4", state: "filtered" },
        { port: 5900, service: "VNC", version: "Apple", state: "filtered" }
      ],
      vulns: [
        { cve: "CVE-2023-42917", severity: "medium", description: "WebKit Memory Corruption" }
      ],
      cpu: 38, memory: 52, disk: 28, bandwidth: 95, uptime: "8d 15h 22m", lastScan: "7m ago",
      connections: 12, packets: { in: 89234, out: 76543 }
    },
    // IoT / OT Devices
    { 
      id: "iot01", label: "IP Camera", type: "camera", x: 88, y: 380, compromised: false, beingScanned: true, risk: "high",
      ip: "192.168.1.200", mac: "00:1A:2B:3C:4D:C1", os: "Embedded Linux", zone: "internal",
      services: [
        { port: 80, service: "HTTP", version: "lighttpd", state: "open" },
        { port: 554, service: "RTSP", version: "1.0", state: "open" },
        { port: 8080, service: "HTTP-Alt", version: "HiSilicon", state: "open" }
      ],
      vulns: [
        { cve: "CVE-2021-36260", severity: "critical", description: "Hikvision Command Injection" }
      ],
      cpu: 65, memory: 78, disk: 5, bandwidth: 25, uptime: "234d 12h 45m", lastScan: "8m ago",
      connections: 3, packets: { in: 567234, out: 8923456 }
    },
    { 
      id: "printer01", label: "HP Printer", type: "printer", x: 12, y: 440, compromised: false, risk: "low",
      ip: "192.168.1.210", mac: "00:1A:2B:3C:4D:P1", os: "HP FutureSmart", zone: "internal",
      services: [
        { port: 80, service: "HTTP", version: "HP EWS", state: "open" },
        { port: 443, service: "HTTPS", version: "HP EWS", state: "open" },
        { port: 9100, service: "JetDirect", version: "HP", state: "open" }
      ],
      vulns: [],
      cpu: 8, memory: 25, disk: 2, bandwidth: 10, uptime: "45d 8h 15m", lastScan: "15m ago",
      connections: 5, packets: { in: 12345, out: 23456 }
    },
    // Cloud Services
    { 
      id: "cloud01", label: "AWS VPC", type: "cloud", x: 32, y: 440, compromised: false, risk: "medium",
      ip: "10.0.0.0/16", mac: "N/A", os: "AWS", zone: "external",
      services: [
        { port: 443, service: "HTTPS", version: "AWS ALB", state: "open" }
      ],
      vulns: [],
      cpu: 45, memory: 62, disk: 35, bandwidth: 5000, uptime: "∞", lastScan: "1m ago",
      connections: 89, packets: { in: 4567890, out: 3456789 }
    },
    // Mobile Devices
    { 
      id: "mobile01", label: "CEO iPhone", type: "mobile", x: 52, y: 440, compromised: false, risk: "high",
      ip: "192.168.1.150", mac: "00:1A:2B:3C:4D:M1", os: "iOS 17.2", zone: "internal",
      services: [],
      vulns: [],
      cpu: 12, memory: 68, disk: 78, bandwidth: 50, uptime: "N/A", lastScan: "N/A",
      connections: 15, packets: { in: 234567, out: 189234 }
    },
    // Management
    { 
      id: "mgmt01", label: "SIEM Server", type: "server", x: 72, y: 440, compromised: false, risk: "medium",
      ip: "192.168.100.10", mac: "00:1A:2B:3C:4D:SM", os: "Ubuntu 22.04 LTS", zone: "management",
      services: [
        { port: 22, service: "SSH", version: "OpenSSH 8.9", state: "filtered" },
        { port: 443, service: "HTTPS", version: "Splunk", state: "open" },
        { port: 8089, service: "Splunk-Mgmt", version: "9.1.2", state: "filtered" },
        { port: 9997, service: "Splunk-Forward", version: "9.1.2", state: "open" }
      ],
      vulns: [],
      cpu: 72, memory: 85, disk: 68, bandwidth: 890, uptime: "45d 12h 33m", lastScan: "2m ago",
      connections: 456, packets: { in: 89234567, out: 12345678 }
    },
  ];

  const edges: Edge[] = [
    { from: "internet", to: "edge-fw", protocol: "HTTPS/443", active: true, encrypted: true, bandwidth: 850, latency: 45 },
    { from: "edge-fw", to: "dmz-web", protocol: "HTTP/80", active: true, encrypted: false, bandwidth: 320, latency: 2 },
    { from: "edge-fw", to: "dmz-mail", protocol: "SMTP/25", active: true, encrypted: false, bandwidth: 45, latency: 3 },
    { from: "dmz-web", to: "core-sw", protocol: "MySQL/3306", active: true, encrypted: true, bandwidth: 120, latency: 1 },
    { from: "dmz-mail", to: "core-sw", protocol: "LDAP/389", active: true, encrypted: false, bandwidth: 15, latency: 2 },
    { from: "core-sw", to: "dc01", protocol: "SMB/445", active: true, encrypted: true, bandwidth: 230, latency: 1 },
    { from: "core-sw", to: "db01", protocol: "MySQL/3306", active: true, encrypted: true, bandwidth: 450, latency: 1 },
    { from: "core-sw", to: "file01", protocol: "SMB/445", active: true, encrypted: true, bandwidth: 180, latency: 1 },
    { from: "dc01", to: "ws01", protocol: "Kerberos/88", active: true, encrypted: true, bandwidth: 5, latency: 1 },
    { from: "dc01", to: "ws02", protocol: "LDAP/389", active: false, encrypted: false, bandwidth: 0, latency: 0 },
    { from: "dc01", to: "ws03", protocol: "Kerberos/88", active: true, encrypted: true, bandwidth: 3, latency: 1 },
    { from: "dc01", to: "ws04", protocol: "LDAP/389", active: true, encrypted: false, bandwidth: 8, latency: 2 },
    { from: "db01", to: "dmz-web", protocol: "MySQL/3306", active: true, encrypted: true, bandwidth: 340, latency: 1 },
    { from: "file01", to: "printer01", protocol: "JetDirect/9100", active: false, encrypted: false, bandwidth: 0, latency: 0 },
    { from: "core-sw", to: "iot01", protocol: "RTSP/554", active: true, encrypted: false, bandwidth: 15, latency: 5 },
    { from: "core-sw", to: "cloud01", protocol: "HTTPS/443", active: true, encrypted: true, bandwidth: 890, latency: 25 },
    { from: "core-sw", to: "mobile01", protocol: "WiFi", active: true, encrypted: true, bandwidth: 45, latency: 8 },
    { from: "core-sw", to: "mgmt01", protocol: "Syslog/514", active: true, encrypted: false, bandwidth: 120, latency: 1 },
  ];

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "internet": return Globe;
      case "router": return Router;
      case "firewall": return Shield;
      case "server": return Server;
      case "database": return Database;
      case "workstation": return Laptop;
      case "cloud": return Cloud;
      case "mobile": return Smartphone;
      case "printer": return Printer;
      case "camera": return Camera;
      case "iot": return Radio;
      default: return Monitor;
    }
  };

  const getZoneColor = (zone?: string) => {
    switch (zone) {
      case "external": return "hsl(220, 60%, 50%)";
      case "dmz": return "hsl(45, 90%, 50%)";
      case "internal": return "hsl(150, 60%, 40%)";
      case "management": return "hsl(280, 60%, 50%)";
      default: return "hsl(0, 0%, 50%)";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "#dc2626";
      case "high": return "#ea580c";
      case "medium": return "#ca8a04";
      default: return "#22c55e";
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="relative w-full h-full bg-[hsl(220,15%,8%)] overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-lg p-1 border border-neutral-800">
        <button 
          onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-neutral-700" />
        <button 
          onClick={() => setShowLabels(!showLabels)}
          className={`w-7 h-7 flex items-center justify-center hover:bg-neutral-700 rounded transition-colors ${showLabels ? "text-primary" : "text-neutral-400"}`}
        >
          {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => setZoom(1)}
          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-neutral-800 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400">{nodes.filter(n => n.compromised).length} Compromised</span>
        </div>
        <div className="w-px h-4 bg-neutral-700" />
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-yellow-400">{nodes.filter(n => n.beingScanned).length} Scanning</span>
        </div>
        <div className="w-px h-4 bg-neutral-700" />
        <div className="text-neutral-400">{nodes.length} Nodes</div>
        <div className="text-neutral-400">{edges.filter(e => e.active).length} Active Links</div>
      </div>

      {/* Main Graph */}
      <svg 
        ref={svgRef}
        className="w-full h-full" 
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w / zoom} ${viewBox.h / zoom}`}
        style={{ background: "radial-gradient(circle at 50% 30%, hsl(220, 20%, 12%) 0%, hsl(220, 15%, 6%) 100%)" }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="link-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(200, 100%, 50%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(160, 100%, 50%)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="link-encrypted" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(280, 100%, 60%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(200, 100%, 60%)" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Zone backgrounds */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(220, 20%, 15%)" strokeWidth="0.2"/>
          </pattern>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

        {/* Zone Labels */}
        <text x="50" y="15" className="fill-blue-400/50 text-[3px] font-mono" textAnchor="middle">EXTERNAL ZONE</text>
        <text x="50" y="70" className="fill-yellow-400/50 text-[3px] font-mono" textAnchor="middle">DMZ</text>
        <text x="50" y="185" className="fill-green-400/50 text-[3px] font-mono" textAnchor="middle">INTERNAL NETWORK</text>
        <text x="72" y="420" className="fill-purple-400/50 text-[3px] font-mono" textAnchor="middle">MGMT</text>

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
                stroke={edge.active ? (edge.encrypted ? "url(#link-encrypted)" : "url(#link-active)") : "hsl(220, 10%, 25%)"}
                strokeWidth={edge.active ? 0.4 : 0.2}
                strokeDasharray={edge.active ? "none" : "1,1"}
                opacity={edge.active ? 0.7 : 0.3}
              />
              {edge.active && showLabels && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 1}
                  className="fill-neutral-500 text-[2px] font-mono"
                  textAnchor="middle"
                >
                  {edge.protocol}
                </text>
              )}
            </g>
          );
        })}

        {/* Animated packets */}
        {animatedPackets.map(packet => {
          const fromNode = nodes.find(n => n.id === packet.from);
          const toNode = nodes.find(n => n.id === packet.to);
          if (!fromNode || !toNode) return null;
          
          const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
          const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;
          
          return (
            <circle
              key={packet.id}
              cx={x}
              cy={y}
              r="0.8"
              fill="hsl(180, 100%, 60%)"
              filter="url(#glow)"
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode === node.id;
          const riskColor = getRiskColor(node.risk);
          const zoneColor = getZoneColor(node.zone);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => setSelectedNode(node.id)}
              className="cursor-pointer"
            >
              {/* Outer glow ring for compromised/scanning */}
              {(node.compromised || node.beingScanned) && (
                <circle
                  r="6"
                  fill="none"
                  stroke={node.compromised ? "#dc2626" : "#3b82f6"}
                  strokeWidth="0.3"
                  opacity="0.5"
                >
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              
              {/* Selection ring */}
              {isSelected && (
                <circle
                  r="5.5"
                  fill="none"
                  stroke="hsl(200, 100%, 60%)"
                  strokeWidth="0.5"
                  filter="url(#glow)"
                />
              )}

              {/* Main node circle */}
              <circle
                r="4"
                fill={node.compromised ? "hsl(0, 70%, 15%)" : "hsl(220, 20%, 12%)"}
                stroke={node.compromised ? riskColor : zoneColor}
                strokeWidth={isSelected ? 0.6 : 0.4}
                filter={node.compromised ? "url(#glow)" : undefined}
              />

              {/* Risk indicator dot */}
              <circle
                cx="3"
                cy="-3"
                r="1"
                fill={riskColor}
                filter="url(#glow)"
              />

              {/* Label */}
              {showLabels && (
                <>
                  <text
                    y="7"
                    className="fill-neutral-300 text-[2.2px] font-medium"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  <text
                    y="9.5"
                    className="fill-neutral-500 text-[1.8px] font-mono"
                    textAnchor="middle"
                  >
                    {node.ip}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Detailed Node Info Panel */}
      {selectedNodeData && (
        <div className="absolute top-12 right-2 bg-black/95 backdrop-blur-sm border border-neutral-800 rounded-lg shadow-2xl w-80 max-h-[75vh] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-900/50">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getRiskColor(selectedNodeData.risk), boxShadow: `0 0 8px ${getRiskColor(selectedNodeData.risk)}` }}
              />
              <h3 className="text-sm font-semibold text-white">{selectedNodeData.label}</h3>
              {selectedNodeData.compromised && (
                <Badge variant="destructive" className="text-[9px] h-4">COMPROMISED</Badge>
              )}
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-neutral-500 hover:text-white text-lg leading-none w-6 h-6 flex items-center justify-center hover:bg-neutral-800 rounded"
            >
              ×
            </button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-8 bg-neutral-900 m-0 rounded-none border-b border-neutral-800">
              <TabsTrigger value="overview" className="text-[10px] data-[state=active]:bg-neutral-800">Overview</TabsTrigger>
              <TabsTrigger value="services" className="text-[10px] data-[state=active]:bg-neutral-800">Services</TabsTrigger>
              <TabsTrigger value="vulns" className="text-[10px] data-[state=active]:bg-neutral-800">Vulns</TabsTrigger>
              <TabsTrigger value="metrics" className="text-[10px] data-[state=active]:bg-neutral-800">Metrics</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-80">
              <TabsContent value="overview" className="p-3 space-y-2 m-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">IP Address</span>
                    <span className="text-xs font-mono text-white">{selectedNodeData.ip}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">MAC Address</span>
                    <span className="text-[10px] font-mono text-neutral-300">{selectedNodeData.mac}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Operating System</span>
                    <span className="text-xs text-neutral-300">{selectedNodeData.os}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Zone</span>
                    <span className="text-xs text-neutral-300 capitalize">{selectedNodeData.zone}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Uptime</span>
                    <span className="text-xs font-mono text-green-400">{selectedNodeData.uptime}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Last Scan</span>
                    <span className="text-xs text-neutral-300">{selectedNodeData.lastScan}</span>
                  </div>
                </div>
                
                <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block mb-1">Network Activity</span>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-green-400">↓ {selectedNodeData.packets?.in?.toLocaleString()} pkts</span>
                    <span className="text-blue-400">↑ {selectedNodeData.packets?.out?.toLocaleString()} pkts</span>
                    <span className="text-neutral-400">{selectedNodeData.connections} conns</span>
                  </div>
                </div>

                {selectedNodeData.compromised && (
                  <button className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3" />
                    Pivot to This Node
                  </button>
                )}
              </TabsContent>

              <TabsContent value="services" className="p-3 space-y-1.5 m-0">
                {selectedNodeData.services?.map((service, idx) => (
                  <div key={idx} className="p-2 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${service.state === "open" ? "bg-green-500" : service.state === "filtered" ? "bg-yellow-500" : "bg-red-500"}`} />
                      <span className="text-xs font-mono text-white">{service.port}</span>
                      <span className="text-xs text-neutral-400">{service.service}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{service.version}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="vulns" className="p-3 space-y-1.5 m-0">
                {selectedNodeData.vulns && selectedNodeData.vulns.length > 0 ? (
                  selectedNodeData.vulns.map((vuln, idx) => (
                    <div key={idx} className="p-2 bg-neutral-900 rounded border border-neutral-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-red-400">{vuln.cve}</span>
                        <Badge 
                          variant={vuln.severity === "critical" ? "destructive" : "outline"}
                          className="text-[9px] h-4"
                        >
                          {vuln.severity}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-neutral-400">{vuln.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-500 text-xs">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No known vulnerabilities
                  </div>
                )}
              </TabsContent>

              <TabsContent value="metrics" className="p-3 space-y-3 m-0">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Gauge className="w-3 h-3" /> CPU
                    </span>
                    <span className="text-xs font-mono text-white">{selectedNodeData.cpu}%</span>
                  </div>
                  <Progress value={selectedNodeData.cpu} className="h-1.5" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> Memory
                    </span>
                    <span className="text-xs font-mono text-white">{selectedNodeData.memory}%</span>
                  </div>
                  <Progress value={selectedNodeData.memory} className="h-1.5" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Database className="w-3 h-3" /> Disk
                    </span>
                    <span className="text-xs font-mono text-white">{selectedNodeData.disk}%</span>
                  </div>
                  <Progress value={selectedNodeData.disk} className="h-1.5" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Bandwidth
                    </span>
                    <span className="text-xs font-mono text-white">{selectedNodeData.bandwidth} Mbps</span>
                  </div>
                  <Progress value={Math.min((selectedNodeData.bandwidth || 0) / 100, 100)} className="h-1.5" />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-black/90 backdrop-blur-sm border border-neutral-800 rounded-lg p-3 text-[10px] space-y-2">
        <div className="font-semibold text-neutral-400 mb-2">RISK LEVELS</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_6px_#dc2626]" />
            <span className="text-neutral-400">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_#ea580c]" />
            <span className="text-neutral-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_6px_#ca8a04]" />
            <span className="text-neutral-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
            <span className="text-neutral-400">Low</span>
          </div>
        </div>
        <div className="border-t border-neutral-800 pt-2 mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-neutral-400">Compromised</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-green-500" />
            <span className="text-neutral-400">Active Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;