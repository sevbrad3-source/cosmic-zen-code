import { useState, useEffect, useCallback } from "react";
import { Play, Square, RefreshCw, Target, Shield, AlertTriangle, CheckCircle, Clock, Zap, Activity, Eye, Download, Settings, Filter, Search, ChevronRight, BarChart3, TrendingUp, Crosshair } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScanTarget {
  id: string;
  ip: string;
  hostname: string;
  status: "pending" | "scanning" | "complete" | "error";
  progress: number;
  vulnsFound: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  services: number;
  lastScan?: string;
}

interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  cvss: number;
  host: string;
  port: number;
  service: string;
  description: string;
  solution: string;
  exploitable: boolean;
  timestamp: string;
}

interface ScanEvent {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "error" | "vuln" | "service";
  message: string;
  target?: string;
}

const VulnScannerWorkflow = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [targets, setTargets] = useState<ScanTarget[]>([
    { id: "t1", ip: "192.168.1.10", hostname: "web-server-01", status: "pending", progress: 0, vulnsFound: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, services: 0 },
    { id: "t2", ip: "192.168.1.25", hostname: "dc01.corp.local", status: "pending", progress: 0, vulnsFound: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, services: 0 },
    { id: "t3", ip: "192.168.1.50", hostname: "mail.corp.local", status: "pending", progress: 0, vulnsFound: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, services: 0 },
    { id: "t4", ip: "10.10.10.100", hostname: "jenkins.dev.local", status: "pending", progress: 0, vulnsFound: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, services: 0 },
    { id: "t5", ip: "172.16.0.5", hostname: "file-server-02", status: "pending", progress: 0, vulnsFound: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, services: 0 },
  ]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  const vulnTemplates: Omit<Vulnerability, "id" | "timestamp" | "host" | "port">[] = [
    { cve: "CVE-2024-23897", title: "Jenkins Arbitrary File Read", severity: "critical", cvss: 9.8, service: "Jenkins", description: "Unauthenticated arbitrary file read via CLI", solution: "Update to Jenkins 2.442+ or LTS 2.426.3+", exploitable: true },
    { cve: "CVE-2023-44487", title: "HTTP/2 Rapid Reset Attack", severity: "high", cvss: 7.5, service: "HTTP", description: "DoS vulnerability in HTTP/2 protocol", solution: "Apply vendor patches for HTTP/2 implementation", exploitable: false },
    { cve: "CVE-2023-50164", title: "Apache Struts RCE", severity: "critical", cvss: 9.8, service: "Apache", description: "Path traversal leading to RCE", solution: "Upgrade to Struts 6.3.0.2 or 2.5.33", exploitable: true },
    { cve: "CVE-2020-1472", title: "Zerologon", severity: "critical", cvss: 10.0, service: "Netlogon", description: "Domain controller privilege escalation", solution: "Apply Microsoft security update", exploitable: true },
    { cve: "CVE-2023-20198", title: "Cisco IOS XE Web UI Privilege Escalation", severity: "critical", cvss: 10.0, service: "Cisco IOS XE", description: "Create admin user without authentication", solution: "Disable HTTP Server feature or update firmware", exploitable: true },
    { cve: "CVE-2024-21351", title: "Windows SmartScreen Bypass", severity: "high", cvss: 7.6, service: "Windows", description: "Security feature bypass", solution: "Install latest Windows updates", exploitable: true },
    { cve: "CVE-2023-51764", title: "Postfix SMTP Smuggling", severity: "medium", cvss: 5.3, service: "SMTP", description: "Email spoofing via SMTP smuggling", solution: "Update Postfix configuration", exploitable: false },
    { cve: "CVE-2023-42917", title: "WebKit Memory Corruption", severity: "high", cvss: 8.8, service: "WebKit", description: "Remote code execution via crafted web content", solution: "Update Safari/WebKit to latest version", exploitable: true },
  ];

  const addEvent = useCallback((type: ScanEvent["type"], message: string, target?: string) => {
    const event: ScanEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      type,
      message,
      target
    };
    setEvents(prev => [...prev.slice(-100), event]);
  }, []);

  const addVulnerability = useCallback((template: typeof vulnTemplates[0], host: string) => {
    const vuln: Vulnerability = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      host,
      port: Math.floor(Math.random() * 10000) + 1
    };
    setVulnerabilities(prev => [...prev, vuln]);
    addEvent("vuln", `Found ${vuln.severity.toUpperCase()}: ${vuln.title}`, host);
    return vuln.severity;
  }, [addEvent]);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setTargets(prev => {
        const updated = [...prev];
        let anyActive = false;

        for (const target of updated) {
          if (target.status === "pending") {
            target.status = "scanning";
            target.progress = 0;
            addEvent("info", `Starting scan on ${target.hostname}`, target.ip);
            anyActive = true;
            break;
          } else if (target.status === "scanning") {
            anyActive = true;
            target.progress = Math.min(target.progress + Math.random() * 8, 100);

            // Simulate finding services
            if (target.progress > 20 && target.services === 0) {
              target.services = Math.floor(Math.random() * 8) + 3;
              addEvent("service", `Discovered ${target.services} open ports`, target.ip);
            }

            // Randomly add vulnerabilities
            if (Math.random() > 0.85 && target.progress < 90) {
              const template = vulnTemplates[Math.floor(Math.random() * vulnTemplates.length)];
              const severity = addVulnerability(template, target.ip);
              target.vulnsFound++;
              if (severity === "critical") target.criticalCount++;
              else if (severity === "high") target.highCount++;
              else if (severity === "medium") target.mediumCount++;
              else target.lowCount++;
            }

            if (target.progress >= 100) {
              target.status = "complete";
              target.lastScan = new Date().toLocaleTimeString();
              addEvent("info", `Scan complete: ${target.vulnsFound} vulnerabilities found`, target.ip);
            }
          }
        }

        // Calculate overall progress
        const totalProgress = updated.reduce((sum, t) => sum + (t.status === "complete" ? 100 : t.progress), 0);
        setScanProgress(totalProgress / updated.length);

        if (!anyActive && updated.every(t => t.status === "complete" || t.status === "pending")) {
          if (updated.some(t => t.status === "complete")) {
            setIsScanning(false);
            addEvent("info", "Vulnerability scan completed");
          }
        }

        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isScanning, addEvent, addVulnerability]);

  const startScan = () => {
    setIsScanning(true);
    setTargets(prev => prev.map(t => ({ ...t, status: "pending" as const, progress: 0, vulnsFound: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, services: 0 })));
    setVulnerabilities([]);
    setEvents([]);
    setScanProgress(0);
    addEvent("info", "Initializing vulnerability scan...");
  };

  const stopScan = () => {
    setIsScanning(false);
    addEvent("warning", "Scan stopped by user");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500 bg-red-500/10";
      case "high": return "text-orange-500 bg-orange-500/10";
      case "medium": return "text-yellow-500 bg-yellow-500/10";
      case "low": return "text-blue-500 bg-blue-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const totalVulns = vulnerabilities.length;
  const criticalVulns = vulnerabilities.filter(v => v.severity === "critical").length;
  const highVulns = vulnerabilities.filter(v => v.severity === "high").length;
  const exploitableVulns = vulnerabilities.filter(v => v.exploitable).length;

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      {/* Header */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={isScanning ? stopScan : startScan}
            className={`h-7 px-3 rounded text-xs font-medium flex items-center gap-1.5 ${
              isScanning ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary-hover text-primary-foreground"
            }`}
          >
            {isScanning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isScanning ? "Stop Scan" : "Start Scan"}
          </button>
          <button className="h-7 px-3 bg-sidebar-hover rounded text-xs flex items-center gap-1.5 text-text-secondary hover:text-text-primary">
            <Settings className="w-3 h-3" />
            Configure
          </button>
          <button className="h-7 px-3 bg-sidebar-hover rounded text-xs flex items-center gap-1.5 text-text-secondary hover:text-text-primary">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Overall Progress</span>
            <span className="font-mono">{scanProgress.toFixed(0)}%</span>
          </div>
          <Progress value={scanProgress} className="h-1.5" />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-text-secondary">Critical: <span className="text-red-500 font-mono">{criticalVulns}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-orange-500" />
            <span className="text-text-secondary">High: <span className="text-orange-500 font-mono">{highVulns}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-text-secondary">Exploitable: <span className="text-yellow-500 font-mono">{exploitableVulns}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-text-secondary">Total: <span className="font-mono">{totalVulns}</span></span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="targets" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 h-8 bg-transparent border-b border-border rounded-none justify-start flex-shrink-0">
          <TabsTrigger value="targets" className="text-xs h-6 data-[state=active]:bg-primary/20">Targets</TabsTrigger>
          <TabsTrigger value="vulns" className="text-xs h-6 data-[state=active]:bg-primary/20">Vulnerabilities ({vulnerabilities.length})</TabsTrigger>
          <TabsTrigger value="events" className="text-xs h-6 data-[state=active]:bg-primary/20">Event Log</TabsTrigger>
        </TabsList>

        <TabsContent value="targets" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-2">
            {targets.map((target) => (
              <div key={target.id} className="p-2.5 bg-sidebar-bg rounded border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      target.status === "scanning" ? "bg-blue-500 animate-pulse" :
                      target.status === "complete" ? "bg-green-500" :
                      target.status === "error" ? "bg-red-500" : "bg-gray-500"
                    }`} />
                    <span className="font-mono text-xs">{target.ip}</span>
                    <span className="text-xs text-text-muted">{target.hostname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {target.criticalCount > 0 && <Badge variant="destructive" className="h-4 text-xs">{target.criticalCount} CRIT</Badge>}
                    {target.highCount > 0 && <Badge className="h-4 text-xs bg-orange-500">{target.highCount} HIGH</Badge>}
                    <span className="text-xs text-text-muted">{target.services} ports</span>
                  </div>
                </div>
                <Progress value={target.progress} className="h-1" />
                <div className="flex justify-between mt-1.5 text-xs text-text-muted">
                  <span>{target.status === "complete" ? `Completed ${target.lastScan}` : target.status}</span>
                  <span>{target.vulnsFound} vulns</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vulns" className="flex-1 p-0 mt-0 overflow-hidden flex">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  onClick={() => setSelectedVuln(vuln)}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    selectedVuln?.id === vuln.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge className={`h-4 text-xs ${getSeverityColor(vuln.severity)}`}>{vuln.severity}</Badge>
                        <span className="text-xs font-mono text-text-muted">{vuln.cve}</span>
                        {vuln.exploitable && <Zap className="w-3 h-3 text-yellow-500" />}
                      </div>
                      <div className="text-xs font-medium truncate">{vuln.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{vuln.host}:{vuln.port} • {vuln.service}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-destructive">{vuln.cvss}</div>
                      <div className="text-xs text-text-muted">CVSS</div>
                    </div>
                  </div>
                </div>
              ))}
              {vulnerabilities.length === 0 && (
                <div className="text-center py-8 text-xs text-text-muted">
                  {isScanning ? "Scanning for vulnerabilities..." : "Start a scan to discover vulnerabilities"}
                </div>
              )}
            </div>
          </ScrollArea>
          {selectedVuln && (
            <div className="w-64 border-l border-border p-3 space-y-3 overflow-auto">
              <div>
                <div className="text-xs text-text-muted uppercase mb-1">Details</div>
                <div className="text-xs">{selectedVuln.description}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted uppercase mb-1">Solution</div>
                <div className="text-xs text-green-400">{selectedVuln.solution}</div>
              </div>
              {selectedVuln.exploitable && (
                <button className="w-full h-7 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs font-medium flex items-center justify-center gap-1">
                  <Crosshair className="w-3 h-3" />
                  Attempt Exploit
                </button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="flex-1 p-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-0.5">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-2 text-xs py-0.5">
                  <span className="font-mono text-text-muted w-20 flex-shrink-0">{event.timestamp}</span>
                  <span className={`w-12 flex-shrink-0 ${
                    event.type === "vuln" ? "text-red-500" :
                    event.type === "warning" ? "text-yellow-500" :
                    event.type === "error" ? "text-destructive" :
                    event.type === "service" ? "text-blue-400" : "text-text-muted"
                  }`}>[{event.type.toUpperCase()}]</span>
                  {event.target && <span className="font-mono text-primary flex-shrink-0">{event.target}</span>}
                  <span className="text-text-secondary">{event.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VulnScannerWorkflow;
