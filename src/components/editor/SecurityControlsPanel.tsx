import { useState } from "react";
import { Lock, Shield, CheckCircle, XCircle, AlertTriangle, Settings, RefreshCw, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SecurityControlsPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState("endpoint");

  const categories = [
    { id: "endpoint", name: "Endpoint", controls: 24, passing: 21 },
    { id: "network", name: "Network", controls: 18, passing: 16 },
    { id: "identity", name: "Identity", controls: 12, passing: 11 },
    { id: "data", name: "Data", controls: 15, passing: 12 },
    { id: "cloud", name: "Cloud", controls: 20, passing: 17 },
  ];

  const controls = [
    { id: "EDR-001", name: "EDR Agent Deployed", status: "passing", coverage: 98, lastCheck: "2 min ago" },
    { id: "EDR-002", name: "Real-time Protection", status: "passing", coverage: 100, lastCheck: "2 min ago" },
    { id: "EDR-003", name: "Behavioral Detection", status: "passing", coverage: 95, lastCheck: "5 min ago" },
    { id: "FW-001", name: "Host Firewall Active", status: "warning", coverage: 87, lastCheck: "3 min ago" },
    { id: "AV-001", name: "Signature Updates", status: "passing", coverage: 100, lastCheck: "1 min ago" },
    { id: "DLP-001", name: "DLP Policy Enforcement", status: "failing", coverage: 72, lastCheck: "10 min ago" },
    { id: "ENC-001", name: "Disk Encryption", status: "passing", coverage: 99, lastCheck: "15 min ago" },
  ];

  const validationTests = [
    { name: "Malware Detection Test", result: "passed", time: "12s" },
    { name: "Ransomware Simulation", result: "passed", time: "45s" },
    { name: "Data Exfil Prevention", result: "failed", time: "23s" },
    { name: "Lateral Movement Block", result: "passed", time: "34s" },
  ];

  const overallScore = 87;

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">SECURITY CONTROLS</span>
        </div>
        <button className="p-1.5 hover:bg-[hsl(210,100%,15%)] rounded">
          <RefreshCw className="w-3 h-3 text-[hsl(210,60%,50%)]" />
        </button>
      </div>

      {/* Overall Score */}
      <div className="p-3 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
        <div className="text-3xl font-bold text-[hsl(120,100%,50%)]">{overallScore}%</div>
        <div className="text-xs text-[hsl(210,60%,50%)]">Control Effectiveness Score</div>
        <Progress value={overallScore} className="h-2 mt-2" />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-1 text-[10px] rounded flex items-center gap-1 ${
              selectedCategory === cat.id
                ? "bg-[hsl(210,100%,30%)] text-white"
                : "bg-[hsl(210,100%,12%)] text-[hsl(210,60%,50%)] hover:bg-[hsl(210,100%,18%)]"
            }`}
          >
            {cat.name}
            <span className="text-[8px] opacity-70">
              {cat.passing}/{cat.controls}
            </span>
          </button>
        ))}
      </div>

      {/* Controls List */}
      <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
        {controls.map((control) => (
          <div
            key={control.id}
            className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded hover:border-[hsl(210,100%,30%)] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {control.status === "passing" ? (
                  <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" />
                ) : control.status === "warning" ? (
                  <AlertTriangle className="w-3 h-3 text-[hsl(45,100%,50%)]" />
                ) : (
                  <XCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />
                )}
                <span className="text-xs">{control.name}</span>
              </div>
              <span className="text-[9px] font-mono text-[hsl(210,60%,45%)]">{control.id}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <Progress value={control.coverage} className="w-16 h-1" />
                <span className="text-[9px] text-[hsl(210,60%,50%)]">{control.coverage}%</span>
              </div>
              <span className="text-[9px] text-[hsl(210,60%,40%)]">{control.lastCheck}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Tests */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">
            Validation Tests
          </span>
          <button className="text-xs px-2 py-0.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded">
            Run All
          </button>
        </div>
        <div className="space-y-1">
          {validationTests.map((test, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {test.result === "passed" ? (
                  <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" />
                ) : (
                  <XCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />
                )}
                <span className="text-xs">{test.name}</span>
              </div>
              <span className="text-[9px] text-[hsl(210,60%,45%)]">{test.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-white flex items-center justify-center gap-1">
          <Eye className="w-3 h-3" /> Audit
        </button>
        <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-white flex items-center justify-center gap-1">
          <Settings className="w-3 h-3" /> Configure
        </button>
      </div>
    </div>
  );
};

export default SecurityControlsPanel;
