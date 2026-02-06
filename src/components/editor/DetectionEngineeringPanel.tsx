import { useState } from "react";
import { Code, AlertTriangle, CheckCircle, XCircle, Play, FileText, Activity, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DetectionEngineeringPanel = () => {
  const [selectedRule, setSelectedRule] = useState<string | null>("sigma-001");

  const sigmaRules = [
    {
      id: "sigma-001",
      name: "Mimikatz Execution Detection",
      status: "deployed",
      coverage: ["T1003.001", "T1003.002"],
      falsePositiveRate: 2.3,
      truePositiveRate: 98.7,
    },
    {
      id: "sigma-002",
      name: "Suspicious PowerShell Download",
      status: "testing",
      coverage: ["T1059.001", "T1105"],
      falsePositiveRate: 8.1,
      truePositiveRate: 94.2,
    },
    {
      id: "sigma-003",
      name: "WMI Persistence Detection",
      status: "draft",
      coverage: ["T1546.003"],
      falsePositiveRate: 0,
      truePositiveRate: 0,
    },
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
    - Image|endswith: '\\mimikatz.exe'
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
    { name: "Log Source Validation", status: "passed" },
    { name: "Field Mapping Check", status: "passed" },
    { name: "False Positive Test", status: "warning" },
    { name: "Performance Benchmark", status: "passed" },
    { name: "Coverage Analysis", status: "passed" },
  ];

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Code className="w-4 h-4 text-[hsl(210,100%,60%)]" />
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">Detection Engineering</span>
      </div>

      {/* Rule Library */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Sigma Rules</span>
          <button className="text-xs px-2 py-1 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white">
            + Create Rule
          </button>
        </div>
        <div className="space-y-1">
          {sigmaRules.map((rule) => (
            <div
              key={rule.id}
              onClick={() => setSelectedRule(rule.id)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                selectedRule === rule.id
                  ? "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]"
                  : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{rule.name}</span>
                <Badge
                  variant="outline"
                  className={`text-[9px] ${
                    rule.status === "deployed"
                      ? "border-[hsl(120,100%,40%)] text-[hsl(120,100%,60%)]"
                      : rule.status === "testing"
                      ? "border-[hsl(60,100%,40%)] text-[hsl(60,100%,60%)]"
                      : "border-[hsl(210,60%,40%)] text-[hsl(210,60%,60%)]"
                  }`}
                >
                  {rule.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {rule.coverage.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-[8px] border-[hsl(210,100%,30%)]">
                    {tech}
                  </Badge>
                ))}
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

      {/* Rule Editor Preview */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Rule Definition</span>
        <div className="bg-[hsl(210,100%,5%)] border border-[hsl(210,100%,18%)] rounded p-2">
          <pre className="text-[9px] font-mono text-[hsl(210,100%,75%)] overflow-x-auto whitespace-pre-wrap">
            {sampleSigmaRule}
          </pre>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white flex items-center justify-center gap-1">
            <Play className="w-3 h-3" /> Test Rule
          </button>
          <button className="flex-1 text-xs py-1.5 bg-[hsl(120,100%,25%)] hover:bg-[hsl(120,100%,30%)] rounded text-white flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" /> Deploy
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Test Results</span>
        <div className="space-y-1">
          {testResults.map((test, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between"
            >
              <span className="text-xs">{test.name}</span>
              {test.status === "passed" ? (
                <CheckCircle className="w-4 h-4 text-[hsl(120,100%,50%)]" />
              ) : test.status === "warning" ? (
                <AlertTriangle className="w-4 h-4 text-[hsl(45,100%,50%)]" />
              ) : (
                <XCircle className="w-4 h-4 text-[hsl(0,100%,50%)]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Matrix */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">MITRE Coverage</span>
        <div className="grid grid-cols-4 gap-1">
          {["T1003", "T1059", "T1105", "T1546", "T1071", "T1082", "T1083", "T1027"].map((tech, i) => (
            <div
              key={tech}
              className={`p-1.5 text-center rounded text-[9px] ${
                i < 4
                  ? "bg-[hsl(120,100%,20%)] text-[hsl(120,100%,70%)]"
                  : "bg-[hsl(210,100%,12%)] text-[hsl(210,60%,50%)]"
              }`}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetectionEngineeringPanel;
