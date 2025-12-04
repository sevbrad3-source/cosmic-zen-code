import { useState } from "react";
import { FileText, Download, Target, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, Users, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const RedTeamReportGenerator = () => {
  const [activeSection, setActiveSection] = useState("executive");

  const sections = [
    { id: "executive", name: "Executive Summary", icon: Building },
    { id: "findings", name: "Technical Findings", icon: AlertTriangle },
    { id: "mitre", name: "MITRE ATT&CK Map", icon: Target },
    { id: "remediation", name: "Remediation", icon: Shield },
    { id: "timeline", name: "Attack Timeline", icon: Clock },
  ];

  const findings = [
    { id: "FIND-001", title: "Domain Admin Compromise", severity: "critical", cvss: 9.8, status: "confirmed" },
    { id: "FIND-002", title: "SQL Injection in Web App", severity: "high", cvss: 8.6, status: "confirmed" },
    { id: "FIND-003", title: "Weak Password Policy", severity: "high", cvss: 7.5, status: "confirmed" },
    { id: "FIND-004", title: "Missing MFA on VPN", severity: "medium", cvss: 6.4, status: "confirmed" },
    { id: "FIND-005", title: "Outdated SSL Certificate", severity: "low", cvss: 3.1, status: "confirmed" },
  ];

  const mitreMap = {
    "Initial Access": ["T1566.001", "T1190"],
    "Execution": ["T1059.001", "T1059.003"],
    "Persistence": ["T1053.005", "T1136.001"],
    "Privilege Escalation": ["T1548.002", "T1068"],
    "Defense Evasion": ["T1070.004", "T1027"],
    "Credential Access": ["T1003.001", "T1558.003"],
    "Lateral Movement": ["T1021.002", "T1021.001"],
    "Exfiltration": ["T1048.003"],
  };

  const remediations = [
    { finding: "FIND-001", priority: "immediate", action: "Reset all domain admin credentials", effort: "4 hours" },
    { finding: "FIND-002", priority: "immediate", action: "Deploy WAF and patch application", effort: "2 days" },
    { finding: "FIND-003", priority: "short-term", action: "Implement strong password policy", effort: "1 week" },
    { finding: "FIND-004", priority: "short-term", action: "Enable MFA for all remote access", effort: "3 days" },
    { finding: "FIND-005", priority: "long-term", action: "Implement certificate automation", effort: "2 weeks" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "hsl(0,100%,50%)";
      case "high": return "hsl(30,100%,50%)";
      case "medium": return "hsl(45,100%,50%)";
      default: return "hsl(210,100%,50%)";
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Header */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-panel-bg">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Red Team Report Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs bg-primary hover:bg-primary-hover rounded text-primary-foreground flex items-center gap-1">
            <Download className="w-3 h-3" /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-48 bg-sidebar-bg border-r border-border p-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full p-2 rounded text-left text-xs flex items-center gap-2 transition-colors ${
                activeSection === section.id
                  ? "bg-sidebar-active text-foreground"
                  : "text-text-secondary hover:bg-sidebar-hover"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === "executive" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold mb-2">Executive Summary</h2>
                <p className="text-sm text-text-secondary">
                  Red Team Assessment conducted from November 15-30, 2024
                </p>
              </div>

              {/* Risk Score */}
              <div className="p-4 bg-panel-bg border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Security Risk</span>
                  <span className="text-2xl font-bold text-[hsl(0,100%,60%)]">HIGH</span>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-xs text-text-muted mt-2">
                  The assessment identified critical vulnerabilities that allowed full domain compromise within 72 hours.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-panel-bg border border-border rounded text-center">
                  <div className="text-2xl font-bold text-[hsl(0,100%,60%)]">5</div>
                  <div className="text-xs text-text-muted">Findings</div>
                </div>
                <div className="p-3 bg-panel-bg border border-border rounded text-center">
                  <div className="text-2xl font-bold text-[hsl(0,100%,60%)]">2</div>
                  <div className="text-xs text-text-muted">Critical</div>
                </div>
                <div className="p-3 bg-panel-bg border border-border rounded text-center">
                  <div className="text-2xl font-bold text-primary">72h</div>
                  <div className="text-xs text-text-muted">Time to Domain Admin</div>
                </div>
                <div className="p-3 bg-panel-bg border border-border rounded text-center">
                  <div className="text-2xl font-bold text-[hsl(45,100%,50%)]">12</div>
                  <div className="text-xs text-text-muted">MITRE Techniques</div>
                </div>
              </div>

              {/* Key Findings Preview */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Key Findings</h3>
                <div className="space-y-2">
                  {findings.slice(0, 3).map((finding) => (
                    <div
                      key={finding.id}
                      className="p-3 bg-panel-bg border border-border rounded flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getSeverityColor(finding.severity) }}
                        />
                        <span className="text-sm">{finding.title}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        CVSS {finding.cvss}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "findings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Technical Findings</h2>
              {findings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 bg-panel-bg border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        style={{ borderColor: getSeverityColor(finding.severity), color: getSeverityColor(finding.severity) }}
                      >
                        {finding.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-mono text-text-muted">{finding.id}</span>
                    </div>
                    <span className="text-sm font-bold">CVSS {finding.cvss}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{finding.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Detailed technical description of the vulnerability and its impact on the organization's security posture.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>Status: {finding.status}</span>
                    <span>Affected: Multiple systems</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "mitre" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">MITRE ATT&CK Mapping</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(mitreMap).map(([tactic, techniques]) => (
                  <div key={tactic} className="p-3 bg-panel-bg border border-border rounded">
                    <h3 className="text-sm font-semibold mb-2 text-primary">{tactic}</h3>
                    <div className="flex flex-wrap gap-1">
                      {techniques.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "remediation" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Remediation Recommendations</h2>
              {remediations.map((rem, i) => (
                <div
                  key={i}
                  className="p-4 bg-panel-bg border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={
                        rem.priority === "immediate"
                          ? "border-[hsl(0,100%,50%)] text-[hsl(0,100%,60%)]"
                          : rem.priority === "short-term"
                          ? "border-[hsl(45,100%,50%)] text-[hsl(45,100%,60%)]"
                          : "border-[hsl(210,100%,50%)] text-[hsl(210,100%,60%)]"
                      }
                    >
                      {rem.priority}
                    </Badge>
                    <span className="text-xs text-text-muted">Est. {rem.effort}</span>
                  </div>
                  <p className="text-sm">{rem.action}</p>
                  <span className="text-xs text-text-muted">Related: {rem.finding}</span>
                </div>
              ))}
            </div>
          )}

          {activeSection === "timeline" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Attack Timeline</h2>
              <div className="relative pl-8 border-l-2 border-border space-y-6">
                {[
                  { time: "Day 1 - 09:00", event: "Initial reconnaissance completed", phase: "Recon" },
                  { time: "Day 1 - 14:30", event: "SQL injection identified in customer portal", phase: "Initial Access" },
                  { time: "Day 2 - 10:15", event: "Web shell deployed on application server", phase: "Execution" },
                  { time: "Day 2 - 16:45", event: "Lateral movement to internal network", phase: "Lateral Movement" },
                  { time: "Day 3 - 11:00", event: "Domain admin credentials obtained", phase: "Credential Access" },
                  { time: "Day 3 - 15:30", event: "Full domain compromise achieved", phase: "Complete" },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-10 w-4 h-4 bg-primary rounded-full" />
                    <div className="text-xs text-text-muted mb-1">{item.time}</div>
                    <div className="text-sm font-medium">{item.event}</div>
                    <Badge variant="outline" className="text-xs mt-1">{item.phase}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedTeamReportGenerator;
