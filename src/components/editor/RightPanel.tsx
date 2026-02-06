import { X, Target, Zap, ShieldAlert, Radio, Crosshair, Users, Brain, Package, Syringe, Wifi, FolderOpen, Cpu, Files, Search, GitBranch, PlayCircle, Bug, Radar, Activity, Signal, UserX, Key, Upload, Antenna } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, lazy, Suspense, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PanelTabNav, { PanelTab } from "./PanelTabNav";

// Lazy load panel components
const NetworkGraph = lazy(() => import("./NetworkGraph"));
const ExploitFlow = lazy(() => import("./ExploitFlow"));
const LogStream = lazy(() => import("./LogStream"));
const CredentialManager = lazy(() => import("./CredentialManager"));
const ReportGenerator = lazy(() => import("./ReportGenerator"));
const CampaignScheduler = lazy(() => import("./CampaignScheduler"));
const CollaborationPanel = lazy(() => import("./CollaborationPanel"));
const AttackTimeline = lazy(() => import("./AttackTimeline"));
const RemediationAdvisor = lazy(() => import("./RemediationAdvisor"));
const ThreatIntelligence = lazy(() => import("./ThreatIntelligence"));
const ReportScheduler = lazy(() => import("./ReportScheduler"));
const ComplianceChecker = lazy(() => import("./ComplianceChecker"));
const AISecurityAdvisor = lazy(() => import("./AISecurityAdvisor"));
const VulnerabilityPrioritizer = lazy(() => import("./VulnerabilityPrioritizer"));
const BeaconManager = lazy(() => import("./BeaconManager"));
const ListenerPanel = lazy(() => import("./ListenerPanel"));
const PayloadBuilder = lazy(() => import("./PayloadBuilder"));
const ProcessInjectionPanel = lazy(() => import("./ProcessInjectionPanel"));
const CovertChannelsPanel = lazy(() => import("./CovertChannelsPanel"));
const LateralMovementPanel = lazy(() => import("./LateralMovementPanel"));
const PostExploitationPanel = lazy(() => import("./PostExploitationPanel"));
const RowhammerPanel = lazy(() => import("./RowhammerPanel"));
const MapboxVisualization = lazy(() => import("./MapboxVisualization"));
const PhysicalSecurityPanel = lazy(() => import("./PhysicalSecurityPanel"));
const MitreAttackPanel = lazy(() => import("./MitreAttackPanel"));
const C2FrameworkPanel = lazy(() => import("./C2FrameworkPanel"));
const PacketCapturePanel = lazy(() => import("./PacketCapturePanel"));
const VulnScannerWorkflow = lazy(() => import("./VulnScannerWorkflow"));
const APTEmulationPanel = lazy(() => import("./APTEmulationPanel"));
const ZeroDayResearchPanel = lazy(() => import("./ZeroDayResearchPanel"));
const ImplantBuilderPanel = lazy(() => import("./ImplantBuilderPanel"));
const SIGINTPanel = lazy(() => import("./SIGINTPanel"));
const SocialEngineeringPanel = lazy(() => import("./SocialEngineeringPanel"));
const WirelessAttackPanel = lazy(() => import("./WirelessAttackPanel"));
const PasswordCrackingPanel = lazy(() => import("./PasswordCrackingPanel"));
const ExfiltratorPanel = lazy(() => import("./ExfiltratorPanel"));

interface RightPanelProps {
  activePanel: string;
  onClose: () => void;
}

// Panel tab categories for Red Team
const panelTabs: PanelTab[] = [
  { id: "recon", icon: Search, label: "Reconnaissance" },
  { id: "exploit", icon: Bug, label: "Exploitation" },
  { id: "payload", icon: Package, label: "Payloads" },
  { id: "c2", icon: Radio, label: "Command & Control" },
  { id: "lateral", icon: Crosshair, label: "Lateral Movement" },
  { id: "persist", icon: Cpu, label: "Persistence" },
  { id: "exfil", icon: Upload, label: "Exfiltration" },
  { id: "intel", icon: Brain, label: "Intelligence" },
  { id: "collab", icon: Users, label: "Collaboration" },
];

// Map active panels to their tab category
const getPanelCategory = (panel: string): string => {
  const categoryMap: Record<string, string> = {
    // Reconnaissance
    "targets": "recon",
    "vuln-scanner": "recon",
    "network": "recon",
    "packet-capture": "recon",
    "wireless-attack": "recon",
    "sigint": "recon",
    // Exploitation
    "exploits": "exploit",
    "exploit-db": "exploit",
    "vulns": "exploit",
    "zero-day": "exploit",
    "rowhammer": "exploit",
    "password-cracking": "exploit",
    // Payloads
    "payloads": "payload",
    "implant-builder": "payload",
    "injection": "payload",
    // C2
    "c2-framework": "c2",
    "beacons": "c2",
    "listeners": "c2",
    "shells": "c2",
    "covert": "c2",
    // Lateral
    "lateral": "lateral",
    "postexploit": "lateral",
    "physical-security": "lateral",
    // Persistence
    "apt-emulation": "persist",
    "mitre-attack": "persist",
    // Exfiltration
    "exfiltrator": "exfil",
    "loot": "exfil",
    "monitor": "exfil",
    // Intel
    "ai-advisor": "intel",
    "threat-intel": "intel",
    "vuln-prioritizer": "intel",
    "social-eng": "intel",
    // Collaboration
    "collab": "collab",
    "pivots": "collab",
    "report-scheduler": "collab",
    "timeline": "collab",
    "remediation": "collab",
    "compliance": "collab",
  };
  return categoryMap[panel] || "recon";
};

const RightPanel = ({ activePanel, onClose }: RightPanelProps) => {
  const [selectedExploit, setSelectedExploit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(() => getPanelCategory(activePanel));

  // Update active tab when panel changes
  useEffect(() => {
    setActiveTab(getPanelCategory(activePanel));
  }, [activePanel]);

  if (!activePanel) return null;

  const getPanelTitle = () => {
    const titles: Record<string, string> = {
      targets: "Target Enumeration",
      exploits: "Exploit Database",
      payloads: "Payload Generator",
      vulns: "Vulnerability Scanner",
      network: "Network Mapper",
      shells: "Active Shells",
      listeners: "Listeners",
      loot: "Credential Vault",
      monitor: "Live Monitoring",
      pivots: "Campaign Scheduler",
      collab: "Team Collaboration",
      timeline: "Attack Timeline",
      remediation: "Remediation Advisor",
      "threat-intel": "Threat Intelligence",
      "report-scheduler": "Report Scheduler",
      compliance: "Compliance Checker",
      "ai-advisor": "AI Security Advisor",
      "vuln-prioritizer": "Vulnerability Prioritizer",
      beacons: "Beacon Manager",
      injection: "Process Injection",
      covert: "Covert Channels",
      lateral: "Lateral Movement",
      postexploit: "Post-Exploitation",
      "physical-security": "Physical Security",
      "mitre-attack": "MITRE ATT&CK",
      "c2-framework": "C2 Framework",
      rowhammer: "Rowhammer Testing",
      geomap: "Geographic Map",
      "exploit-db": "Exploit Database",
      "target-search": "Target Search",
      "version-control": "Version Control",
      "attack-automation": "Attack Automation",
      "packet-capture": "Packet Capture",
      "vuln-scanner": "Vulnerability Scanner",
      "apt-emulation": "APT Emulation",
      "zero-day": "Zero-Day Research",
      "implant-builder": "Implant Builder",
      "sigint": "SIGINT Operations",
      "social-eng": "Social Engineering",
      "wireless-attack": "Wireless Attack Tools",
      "password-cracking": "Password Cracking",
      "exfiltrator": "Data Exfiltration"
    };
    return titles[activePanel] || "Panel";
  };

  const renderInlineContent = () => {
    // Inline content for simple panels
    if (activePanel === "targets") {
      return (
        <div className="p-3 space-y-2">
          <div className="text-xs text-text-muted mb-2">ACTIVE TARGETS (12)</div>
          {[
            { ip: "192.168.1.10", hostname: "web-server-01.corp.local", os: "Ubuntu 20.04 LTS", status: "enumeration", ports: "22,80,443,3306", risk: "high" },
            { ip: "192.168.1.25", hostname: "dc01.corp.local", os: "Windows Server 2019", status: "exploiting", ports: "53,88,135,389,445", risk: "critical" },
            { ip: "192.168.1.50", hostname: "mail.corp.local", os: "CentOS 8", status: "compromised", ports: "25,110,143,465,993", risk: "medium" },
            { ip: "10.10.10.100", hostname: "vpn-gateway", os: "pfSense 2.5", status: "scanning", ports: "500,4500", risk: "high" },
            { ip: "172.16.0.5", hostname: "jenkins.dev.local", os: "Debian 11", status: "vulnerable", ports: "8080,50000", risk: "critical" }
          ].map((target, i) => (
            <div key={i} className="bg-panel-bg rounded p-2.5 border border-border hover:border-primary transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary text-xs font-mono font-semibold">{target.ip}</span>
                    <Badge variant={target.risk === "critical" ? "destructive" : target.risk === "high" ? "default" : "secondary"} className="h-4 text-xs">
                      {target.risk}
                    </Badge>
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5 truncate">{target.hostname}</div>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  target.status === "compromised" ? "bg-red-500 animate-pulse" :
                  target.status === "exploiting" ? "bg-yellow-500 animate-pulse" :
                  target.status === "vulnerable" ? "bg-orange-500" :
                  target.status === "enumeration" ? "bg-blue-500 animate-pulse" :
                  "bg-green-500 animate-pulse"
                }`} />
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="truncate">{target.os}</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-text-muted">Ports: {target.ports}</span>
                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">{target.status}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activePanel === "shells") {
      return (
        <div className="p-3 space-y-2">
          <div className="text-xs text-text-muted mb-2">ACTIVE SESSIONS (5)</div>
          {[
            { id: "SESSION_001", target: "192.168.1.10", user: "www-data", type: "reverse_tcp", uptime: "02:47:33", status: "stable" },
            { id: "SESSION_002", target: "192.168.1.25", user: "root", type: "meterpreter", uptime: "01:15:22", status: "stable" },
            { id: "SESSION_003", target: "10.10.1.5", user: "SYSTEM", type: "smb", uptime: "00:43:11", status: "unstable" },
            { id: "SESSION_004", target: "172.16.0.5", user: "jenkins", type: "webshell", uptime: "03:22:45", status: "stable" },
            { id: "SESSION_005", target: "10.10.2.34", user: "user", type: "ssh", uptime: "00:08:57", status: "interactive" }
          ].map((shell, i) => (
            <div key={i} className="bg-panel-bg rounded p-2.5 border border-border hover:border-primary transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary text-xs font-mono font-semibold">{shell.id}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      shell.status === "stable" ? "bg-green-500" :
                      shell.status === "unstable" ? "bg-yellow-500 animate-pulse" :
                      "bg-blue-500 animate-pulse"
                    }`} />
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">{shell.target} ({shell.user})</div>
                </div>
                <Badge variant="outline" className="h-4 text-xs">{shell.type}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Uptime: {shell.uptime}</span>
                <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                  Interact →
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activePanel === "listeners") {
      return (
        <div className="p-3 space-y-2">
          <button className="w-full h-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-xs font-medium">
            + New Listener
          </button>
          <div className="text-xs text-text-muted mb-2">ACTIVE LISTENERS (8)</div>
          {[
            { port: 4444, type: "TCP", protocol: "reverse_shell", connections: 3, status: "listening" },
            { port: 443, type: "HTTPS", protocol: "meterpreter", connections: 2, status: "listening" },
            { port: 8080, type: "HTTP", protocol: "webshell", connections: 1, status: "listening" },
            { port: 53, type: "DNS", protocol: "c2_tunnel", connections: 0, status: "listening" },
            { port: 1337, type: "TCP", protocol: "bind_shell", connections: 1, status: "listening" }
          ].map((listener, i) => (
            <div key={i} className="bg-panel-bg rounded p-2.5 border border-border">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary text-xs font-mono font-semibold">:{listener.port}</span>
                    <Badge variant="outline" className="h-4 text-xs">{listener.type}</Badge>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">{listener.protocol}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-text-muted">{listener.connections} active connection{listener.connections !== 1 ? 's' : ''}</span>
                <span className="text-green-500">{listener.status}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderLazyPanel = () => {
    switch (activePanel) {
      case "exploits":
        return selectedExploit ? <ExploitFlow /> : <ExploitDatabaseTree onSelect={setSelectedExploit} />;
      case "network":
        return <NetworkGraph />;
      case "loot":
        return <CredentialManager />;
      case "monitor":
        return <LogStream />;
      case "pivots":
        return <CampaignScheduler />;
      case "collab":
        return <CollaborationPanel />;
      case "timeline":
        return <AttackTimeline />;
      case "remediation":
        return <RemediationAdvisor />;
      case "threat-intel":
        return <ThreatIntelligence />;
      case "report-scheduler":
        return <ReportScheduler />;
      case "compliance":
        return <ComplianceChecker />;
      case "ai-advisor":
        return <AISecurityAdvisor />;
      case "vuln-prioritizer":
        return <VulnerabilityPrioritizer />;
      case "beacons":
        return <BeaconManager />;
      case "payloads":
        return <PayloadBuilder />;
      case "injection":
        return <ProcessInjectionPanel />;
      case "covert":
        return <CovertChannelsPanel />;
      case "lateral":
        return <LateralMovementPanel />;
      case "postexploit":
        return <PostExploitationPanel />;
      case "rowhammer":
        return <RowhammerPanel />;
      case "geomap":
        return <MapboxVisualization />;
      case "physical-security":
        return <PhysicalSecurityPanel />;
      case "mitre-attack":
        return <MitreAttackPanel />;
      case "social-eng":
        return <SocialEngineeringPanel />;
      case "packet-capture":
        return <PacketCapturePanel />;
      case "vuln-scanner":
        return <VulnScannerWorkflow />;
      case "apt-emulation":
        return <APTEmulationPanel />;
      case "zero-day":
        return <ZeroDayResearchPanel />;
      case "implant-builder":
        return <ImplantBuilderPanel />;
      case "sigint":
        return <SIGINTPanel />;
      case "c2-framework":
        return <C2FrameworkPanel />;
      case "wireless-attack":
        return <WirelessAttackPanel />;
      case "password-cracking":
        return <PasswordCrackingPanel />;
      case "exfiltrator":
        return <ExfiltratorPanel />;
      default:
        return null;
    }
  };

  const inlineContent = renderInlineContent();

  return (
    <div className="w-96 bg-[hsl(0,100%,6%)] border-l border-[hsl(0,100%,18%)] flex flex-col">
      <div className="h-9 px-3 flex items-center justify-between border-b border-[hsl(0,100%,18%)] bg-[hsl(0,100%,8%)]">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[hsl(0,100%,60%)]" />
          <span className="text-xs uppercase tracking-wide font-semibold text-[hsl(0,100%,75%)]">
            {getPanelTitle()}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center hover:bg-[hsl(0,100%,15%)] rounded transition-colors"
        >
          <X className="w-4 h-4 text-[hsl(0,60%,50%)]" />
        </button>
      </div>
      
      {/* Tab Navigation */}
      <PanelTabNav
        tabs={panelTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="red"
      />
      
      <ScrollArea className="flex-1">
        <Suspense fallback={<div className="p-4 text-xs text-text-secondary">Loading...</div>}>
          {inlineContent || renderLazyPanel()}
        </Suspense>
      </ScrollArea>
    </div>
  );
};

// Exploit Database Tree Component
const ExploitDatabaseTree = ({ onSelect }: { onSelect?: (id: string) => void }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    exploits: true,
    web: true
  });

  const toggleExpand = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const folders = [
    {
      name: "exploits",
      children: [
        {
          name: "web",
          children: [
            "sqli_auth_bypass.py",
            "xss_reflected.js",
            "rce_apache_struts.py"
          ]
        },
        {
          name: "network",
          children: [
            "smb_eternalblue.py",
            "ssh_bruteforce.py",
            "rdp_bluekeep.rb"
          ]
        },
        {
          name: "privilege_escalation",
          children: [
            "sudo_exploit.sh",
            "kernel_exploit_4.15.c",
            "token_impersonation.ps1"
          ]
        }
      ]
    },
    {
      name: "payloads",
      children: [
        {
          name: "reverse_shells",
          children: [
            "tcp_shell.py",
            "powershell_rev.ps1",
            "bash_reverse.sh"
          ]
        },
        {
          name: "webshells",
          children: [
            "php_webshell.php",
            "aspx_shell.aspx"
          ]
        }
      ]
    },
    {
      name: "reconnaissance",
      children: [
        "nmap_scans.sh",
        "subdomain_enum.py",
        "osint_gather.py"
      ]
    }
  ];

  const renderTree = (items: any[], level = 0) => (
    <div>
      {items.map((item, idx) => {
        const isFolder = typeof item === "object";
        const name = isFolder ? item.name : item;
        const isExp = expanded[name];

        return (
          <div key={idx}>
            <button
              onClick={() => {
                if (isFolder) {
                  toggleExpand(name);
                } else if (onSelect) {
                  onSelect(name);
                }
              }}
              className="w-full flex items-center gap-1 px-2 py-0.5 text-xs hover:bg-[hsl(0,100%,12%)] rounded transition-colors text-[hsl(0,100%,85%)]"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
              {isFolder ? (
                <span className="text-[10px] text-[hsl(0,60%,50%)]">{isExp ? "▼" : "▶"}</span>
              ) : (
                <span className="w-3" />
              )}
              <span className={isFolder ? "text-[hsl(0,100%,60%)]" : "text-[hsl(0,60%,70%)]"}>{name}</span>
            </button>
            {isFolder && isExp && item.children && renderTree(item.children, level + 1)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-3 space-y-2">
      <div className="text-xs text-[hsl(0,60%,50%)] mb-2">EXPLOIT DATABASE</div>
      {renderTree(folders)}
    </div>
  );
};

export default RightPanel;
