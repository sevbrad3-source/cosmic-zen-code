import { useState } from "react";
import { Lock, Shield, CheckCircle, XCircle, AlertTriangle, Settings, RefreshCw, Eye, Server, Cloud, Cpu, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "overview", icon: Shield, label: "Overview" },
  { id: "controls", icon: Lock, label: "Controls", badge: 3, badgeVariant: "warning" },
  { id: "validation", icon: CheckCircle, label: "Validation" },
  { id: "config", icon: Settings, label: "Configuration" },
];

const SecurityControlsPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
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
    { id: "FW-001", name: "Host Firewall Active", status: "warning", coverage: 87, lastCheck: "3 min ago" },
    { id: "DLP-001", name: "DLP Policy Enforcement", status: "failing", coverage: 72, lastCheck: "10 min ago" },
    { id: "ENC-001", name: "Disk Encryption", status: "passing", coverage: 99, lastCheck: "15 min ago" },
  ];

  const validationTests = [
    { name: "Malware Detection Test", result: "passed", time: "12s" },
    { name: "Ransomware Simulation", result: "passed", time: "45s" },
    { name: "Data Exfil Prevention", result: "failed", time: "23s" },
    { name: "Lateral Movement Block", result: "passed", time: "34s" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="p-3 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
              <div className="text-3xl font-bold text-[hsl(120,100%,50%)]">87%</div>
              <div className="text-xs text-[hsl(210,60%,50%)]">Control Effectiveness Score</div>
              <Progress value={87} className="h-2 mt-2" />
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setActiveTab("controls"); }} className="px-2 py-1 text-[10px] rounded flex items-center gap-1 bg-[hsl(210,100%,12%)] text-[hsl(210,60%,50%)] hover:bg-[hsl(210,100%,18%)]">
                  {cat.name} <span className="text-[8px] opacity-70">{cat.passing}/{cat.controls}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-white flex items-center justify-center gap-1"><Eye className="w-3 h-3" /> Audit</button>
              <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-white flex items-center justify-center gap-1"><Settings className="w-3 h-3" /> Configure</button>
            </div>
          </div>
        );
      case "controls":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">{selectedCategory} Controls</span>
              <button className="p-1.5 hover:bg-[hsl(210,100%,15%)] rounded"><RefreshCw className="w-3 h-3 text-[hsl(210,60%,50%)]" /></button>
            </div>
            {controls.map((control) => (
              <div key={control.id} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{control.status === "passing" ? <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" /> : control.status === "warning" ? <AlertTriangle className="w-3 h-3 text-[hsl(45,100%,50%)]" /> : <XCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />}<span className="text-xs text-[hsl(210,100%,85%)]">{control.name}</span></div>
                  <span className="text-[9px] font-mono text-[hsl(210,60%,45%)]">{control.id}</span>
                </div>
                <div className="flex items-center justify-between mt-1"><div className="flex items-center gap-2"><Progress value={control.coverage} className="w-16 h-1" /><span className="text-[9px] text-[hsl(210,60%,50%)]">{control.coverage}%</span></div><span className="text-[9px] text-[hsl(210,60%,40%)]">{control.lastCheck}</span></div>
              </div>
            ))}
          </div>
        );
      case "validation":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Validation Tests</span><button className="text-xs px-2 py-0.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white">Run All</button></div>
            {validationTests.map((test, i) => (
              <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between">
                <div className="flex items-center gap-2">{test.result === "passed" ? <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" /> : <XCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />}<span className="text-xs text-[hsl(210,100%,85%)]">{test.name}</span></div>
                <span className="text-[9px] text-[hsl(210,60%,45%)]">{test.time}</span>
              </div>
            ))}
          </div>
        );
      case "config":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Security Policies</span>
            {["Enforce MFA on all admin accounts", "Block USB storage devices", "Require disk encryption", "Auto-patch critical vulnerabilities", "Enable EDR on all endpoints"].map((policy, i) => (
              <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between">
                <span className="text-[10px] text-[hsl(210,100%,80%)]">{policy}</span>
                <div className="w-8 h-4 bg-[hsl(120,100%,30%)] rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="blue" />
      <ScrollArea className="flex-1"><div className="p-3">{renderContent()}</div></ScrollArea>
    </div>
  );
};

export default SecurityControlsPanel;
