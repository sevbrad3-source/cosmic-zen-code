import { useState } from "react";
import { GitBranch, Shield, Target, AlertTriangle, CheckCircle, XCircle, Plus, BarChart3, Layers } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "stride", icon: Shield, label: "STRIDE" },
  { id: "assets", icon: Target, label: "Assets", badge: 4 },
  { id: "threats", icon: AlertTriangle, label: "Threats", badge: 6 },
  { id: "dfd", icon: Layers, label: "Data Flow" },
  { id: "report", icon: BarChart3, label: "Report" },
];

const ThreatModelingPanel = () => {
  const [activeTab, setActiveTab] = useState("stride");
  const [selectedAsset, setSelectedAsset] = useState("web-app");

  const assets = [
    { id: "web-app", name: "Customer Portal", type: "Web Application", risk: "high", threats: 12 },
    { id: "api", name: "REST API Gateway", type: "API Service", risk: "critical", threats: 8 },
    { id: "database", name: "Customer Database", type: "Data Store", risk: "critical", threats: 6 },
    { id: "auth", name: "Auth Service", type: "Identity Provider", risk: "high", threats: 5 },
  ];

  const threats = [
    { id: "T1", category: "Spoofing", description: "Identity spoofing via session hijacking", status: "mitigated", control: "MFA + Session timeout" },
    { id: "T2", category: "Tampering", description: "SQL injection in search parameters", status: "open", control: "Pending WAF rule" },
    { id: "T3", category: "Repudiation", description: "Insufficient logging of admin actions", status: "in-progress", control: "Audit logging implementation" },
    { id: "T4", category: "Info Disclosure", description: "Verbose error messages expose stack traces", status: "mitigated", control: "Custom error handlers" },
    { id: "T5", category: "DoS", description: "Rate limiting not enforced on API", status: "open", control: "Rate limiter pending" },
    { id: "T6", category: "Elevation", description: "IDOR in user profile endpoint", status: "in-progress", control: "Authorization middleware" },
  ];

  const strideCategories = [
    { name: "Spoofing", count: 3, color: "text-purple-400" },
    { name: "Tampering", count: 4, color: "text-red-400" },
    { name: "Repudiation", count: 2, color: "text-orange-400" },
    { name: "Info Disclosure", count: 5, color: "text-yellow-400" },
    { name: "Denial of Service", count: 2, color: "text-cyan-400" },
    { name: "Elevation", count: 3, color: "text-pink-400" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "stride":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">STRIDE Overview</span>
              <Badge className="bg-[hsl(210,100%,20%)] text-[hsl(210,100%,70%)] text-[10px]">STRIDE</Badge>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {strideCategories.map((cat, i) => (
                <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-1.5 text-center">
                  <div className={`text-lg font-bold ${cat.color}`}>{cat.count}</div>
                  <div className="text-[9px] text-[hsl(210,60%,50%)] truncate">{cat.name}</div>
                </div>
              ))}
            </div>
            <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-2">
              <div className="text-[10px] text-[hsl(210,60%,50%)] mb-1">Overall Risk Score</div>
              <div className="text-2xl font-bold text-orange-400">7.4 / 10</div>
              <div className="w-full h-2 bg-[hsl(210,100%,15%)] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" style={{ width: "74%" }} />
              </div>
            </div>
          </div>
        );
      case "assets":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Assets</span>
              <button className="text-[10px] text-[hsl(210,100%,60%)] flex items-center gap-1"><Plus className="w-3 h-3" />Add Asset</button>
            </div>
            {assets.map((asset) => (
              <button key={asset.id} onClick={() => setSelectedAsset(asset.id)} className={`w-full flex items-center justify-between p-2 rounded transition-colors ${selectedAsset === asset.id ? 'bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,35%)]' : 'bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]'}`}>
                <div className="flex items-center gap-2"><Target className={`w-3.5 h-3.5 ${asset.risk === 'critical' ? 'text-red-400' : 'text-orange-400'}`} /><div className="text-left"><div className="text-xs text-[hsl(210,100%,80%)]">{asset.name}</div><div className="text-[10px] text-[hsl(210,60%,50%)]">{asset.type}</div></div></div>
                <Badge className={`h-4 text-[9px] ${asset.risk === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{asset.threats} threats</Badge>
              </button>
            ))}
          </div>
        );
      case "threats":
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Identified Threats</span>
            {threats.map((threat) => (
              <div key={threat.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-start justify-between mb-1"><div className="flex items-center gap-2"><span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{threat.id}</span><Badge className="bg-[hsl(210,100%,20%)] text-[hsl(210,100%,70%)] h-4 text-[9px]">{threat.category}</Badge></div>{threat.status === 'mitigated' && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}{threat.status === 'open' && <XCircle className="w-3.5 h-3.5 text-red-400" />}{threat.status === 'in-progress' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}</div>
                <div className="text-xs text-[hsl(210,100%,80%)] mb-1">{threat.description}</div>
                <div className="text-[10px] text-[hsl(210,60%,50%)]">Control: <span className="text-[hsl(210,100%,70%)]">{threat.control}</span></div>
              </div>
            ))}
          </div>
        );
      case "dfd":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Data Flow Diagram</span>
            <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-4 text-center">
              <Layers className="w-8 h-8 mx-auto text-[hsl(210,60%,50%)] mb-2" />
              <div className="text-xs text-[hsl(210,60%,50%)]">Interactive DFD visualization</div>
              <button className="mt-3 px-3 py-1.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-xs text-white"><GitBranch className="w-3 h-3 inline mr-1" />Generate DFD</button>
            </div>
            <div className="space-y-1">
              {["User → Portal (HTTPS)", "Portal → API (REST)", "API → Database (SQL)", "API → Auth Service (OAuth)"].map((flow, i) => (
                <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded text-[10px] text-[hsl(210,100%,80%)] font-mono">{flow}</div>
              ))}
            </div>
          </div>
        );
      case "report":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Threat Model Report</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center"><div className="text-2xl font-bold text-[hsl(210,100%,70%)]">19</div><div className="text-[9px] text-[hsl(210,60%,50%)]">Total Threats</div></div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-3 text-center"><div className="text-2xl font-bold text-green-400">8</div><div className="text-[9px] text-[hsl(210,60%,50%)]">Mitigated</div></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5"><GitBranch className="w-3.5 h-3.5" />Generate DFD</button>
              <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5"><Target className="w-3.5 h-3.5" />Export Report</button>
            </div>
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

export default ThreatModelingPanel;
