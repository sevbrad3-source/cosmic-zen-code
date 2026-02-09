import { useState } from "react";
import { Code, AlertTriangle, CheckCircle, XCircle, Play, FileText, Activity, Zap, Target, Search, Shield, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "rules", icon: Code, label: "Sigma Rules", badge: 3 },
  { id: "editor", icon: FileText, label: "Rule Editor" },
  { id: "testing", icon: Play, label: "Test Results", badge: 1, badgeVariant: "warning" },
  { id: "coverage", icon: Target, label: "MITRE Coverage" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const DetectionEngineeringPanel = () => {
  const [activeTab, setActiveTab] = useState("rules");
  const [selectedRule, setSelectedRule] = useState<string | null>("sigma-001");

  const sigmaRules = [
    { id: "sigma-001", name: "Mimikatz Execution Detection", status: "deployed", coverage: ["T1003.001", "T1003.002"], falsePositiveRate: 2.3, truePositiveRate: 98.7 },
    { id: "sigma-002", name: "Suspicious PowerShell Download", status: "testing", coverage: ["T1059.001", "T1105"], falsePositiveRate: 8.1, truePositiveRate: 94.2 },
    { id: "sigma-003", name: "WMI Persistence Detection", status: "draft", coverage: ["T1546.003"], falsePositiveRate: 0, truePositiveRate: 0 },
    { id: "sigma-004", name: "LSASS Memory Dump Detection", status: "deployed", coverage: ["T1003.001"], falsePositiveRate: 1.2, truePositiveRate: 99.1 },
    { id: "sigma-005", name: "Scheduled Task Creation", status: "testing", coverage: ["T1053.005"], falsePositiveRate: 15.3, truePositiveRate: 88.4 },
  ];

  const sampleSigmaRule = `title: Mimikatz Execution Detection
status: production
description: Detects execution of Mimikatz
references:
  - https://attack.mitre.org/techniques/T1003/
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    - Image|endswith: '\\\\mimikatz.exe'
    - OriginalFileName: 'mimikatz.exe'
    - CommandLine|contains:
      - 'sekurlsa::'
      - 'kerberos::'
      - 'crypto::'
  condition: selection
falsepositives:
  - Security testing
level: critical`;

  const testResults = [
    { name: "Log Source Validation", status: "passed", details: "All required log sources available" },
    { name: "Field Mapping Check", status: "passed", details: "12/12 fields mapped correctly" },
    { name: "False Positive Test", status: "warning", details: "FP rate 2.3% - above 2% threshold" },
    { name: "Performance Benchmark", status: "passed", details: "Avg 0.3ms per event evaluation" },
    { name: "Coverage Analysis", status: "passed", details: "Covers 2 MITRE sub-techniques" },
    { name: "Evasion Resistance", status: "passed", details: "Resists 8/10 known evasion methods" },
  ];

  const mitreTechniques = [
    { id: "T1003", name: "Credential Dumping", covered: true, rules: 3 },
    { id: "T1059", name: "Command Scripting", covered: true, rules: 2 },
    { id: "T1105", name: "Ingress Tool Transfer", covered: true, rules: 1 },
    { id: "T1546", name: "Event Triggered Execution", covered: true, rules: 1 },
    { id: "T1071", name: "Application Layer Protocol", covered: false, rules: 0 },
    { id: "T1082", name: "System Information Discovery", covered: false, rules: 0 },
    { id: "T1083", name: "File and Directory Discovery", covered: false, rules: 0 },
    { id: "T1027", name: "Obfuscated Files", covered: false, rules: 0 },
    { id: "T1053", name: "Scheduled Task/Job", covered: true, rules: 1 },
    { id: "T1055", name: "Process Injection", covered: false, rules: 0 },
    { id: "T1036", name: "Masquerading", covered: false, rules: 0 },
    { id: "T1218", name: "System Binary Proxy Exec", covered: false, rules: 0 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "rules":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Sigma Rule Library</span>
              <button className="text-xs px-2 py-1 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white">+ Create Rule</button>
            </div>
            <div className="space-y-1">
              {sigmaRules.map((rule) => (
                <div key={rule.id} onClick={() => setSelectedRule(rule.id)} className={`p-2 rounded border cursor-pointer transition-all ${selectedRule === rule.id ? "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]" : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[hsl(210,100%,85%)]">{rule.name}</span>
                    <Badge variant="outline" className={`text-[9px] ${rule.status === "deployed" ? "border-[hsl(120,100%,40%)] text-[hsl(120,100%,60%)]" : rule.status === "testing" ? "border-[hsl(60,100%,40%)] text-[hsl(60,100%,60%)]" : "border-[hsl(210,60%,40%)] text-[hsl(210,60%,60%)]"}`}>{rule.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {rule.coverage.map((tech) => (<Badge key={tech} variant="outline" className="text-[8px] border-[hsl(210,100%,30%)]">{tech}</Badge>))}
                  </div>
                  {rule.status !== "draft" && (
                    <div className="flex items-center gap-3 mt-2 text-[10px]">
                      <span className="text-[hsl(120,100%,50%)]">TP: {rule.truePositiveRate}%</span>
                      <span className="text-[hsl(0,100%,50%)]">FP: {rule.falsePositiveRate}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "editor":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Rule Definition</span>
            <div className="bg-[hsl(210,100%,5%)] border border-[hsl(210,100%,18%)] rounded p-2">
              <pre className="text-[9px] font-mono text-[hsl(210,100%,75%)] overflow-x-auto whitespace-pre-wrap">{sampleSigmaRule}</pre>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white flex items-center justify-center gap-1"><Play className="w-3 h-3" /> Test Rule</button>
              <button className="flex-1 text-xs py-1.5 bg-[hsl(120,100%,25%)] hover:bg-[hsl(120,100%,30%)] rounded text-white flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Deploy</button>
            </div>
            <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-2 space-y-1">
              <span className="text-[10px] text-[hsl(210,60%,50%)] uppercase">Rule Metadata</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-[hsl(210,60%,50%)]">Author:</span> <span className="text-[hsl(210,100%,80%)]">SOC Team</span></div>
                <div><span className="text-[hsl(210,60%,50%)]">Created:</span> <span className="text-[hsl(210,100%,80%)]">2024-01-15</span></div>
                <div><span className="text-[hsl(210,60%,50%)]">Modified:</span> <span className="text-[hsl(210,100%,80%)]">2024-03-22</span></div>
                <div><span className="text-[hsl(210,60%,50%)]">Version:</span> <span className="text-[hsl(210,100%,80%)]">2.1</span></div>
              </div>
            </div>
          </div>
        );

      case "testing":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Test Results</span>
              <button className="text-xs px-2 py-1 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white">Re-run All</button>
            </div>
            <div className="space-y-1">
              {testResults.map((test, i) => (
                <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(210,100%,85%)]">{test.name}</span>
                    {test.status === "passed" ? <CheckCircle className="w-4 h-4 text-[hsl(120,100%,50%)]" /> : test.status === "warning" ? <AlertTriangle className="w-4 h-4 text-[hsl(45,100%,50%)]" /> : <XCircle className="w-4 h-4 text-[hsl(0,100%,50%)]" />}
                  </div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)] mt-1">{test.details}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "coverage":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">MITRE ATT&CK Coverage</span>
              <span className="text-[10px] text-[hsl(210,60%,50%)]">{mitreTechniques.filter(t => t.covered).length}/{mitreTechniques.length} covered</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {mitreTechniques.map((tech) => (
                <div key={tech.id} className={`p-2 text-center rounded border ${tech.covered ? "bg-[hsl(120,100%,12%)] border-[hsl(120,100%,25%)] text-[hsl(120,100%,70%)]" : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] text-[hsl(210,60%,50%)]"}`}>
                  <div className="text-[10px] font-mono font-bold">{tech.id}</div>
                  <div className="text-[8px] truncate">{tech.name}</div>
                  {tech.covered && <div className="text-[8px] mt-0.5">{tech.rules} rules</div>}
                </div>
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Detection Analytics</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center">
                <div className="text-2xl font-bold text-[hsl(120,100%,50%)]">98.7%</div>
                <div className="text-[9px] text-[hsl(210,60%,50%)]">Avg True Positive Rate</div>
              </div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center">
                <div className="text-2xl font-bold text-[hsl(45,100%,50%)]">5.2%</div>
                <div className="text-[9px] text-[hsl(210,60%,50%)]">Avg False Positive Rate</div>
              </div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center">
                <div className="text-2xl font-bold text-[hsl(210,100%,70%)]">0.3ms</div>
                <div className="text-[9px] text-[hsl(210,60%,50%)]">Avg Eval Latency</div>
              </div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center">
                <div className="text-2xl font-bold text-[hsl(280,100%,70%)]">42%</div>
                <div className="text-[9px] text-[hsl(210,60%,50%)]">MITRE Coverage</div>
              </div>
            </div>
            <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-2">
              <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase mb-2">Rule Performance (Last 7d)</div>
              {sigmaRules.filter(r => r.status !== "draft").map((rule) => (
                <div key={rule.id} className="flex items-center justify-between py-1 border-b border-[hsl(210,100%,12%)] last:border-0">
                  <span className="text-[10px] text-[hsl(210,100%,80%)] truncate flex-1">{rule.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[hsl(120,100%,50%)]">{rule.truePositiveRate}%</span>
                    <div className="w-16 h-1 bg-[hsl(210,100%,15%)] rounded-full overflow-hidden">
                      <div className="h-full bg-[hsl(120,100%,40%)]" style={{ width: `${rule.truePositiveRate}%` }} />
                    </div>
                  </div>
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
      <ScrollArea className="flex-1">
        <div className="p-3">{renderContent()}</div>
      </ScrollArea>
    </div>
  );
};

export default DetectionEngineeringPanel;
