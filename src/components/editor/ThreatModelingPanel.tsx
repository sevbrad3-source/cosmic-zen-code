import { GitBranch, Shield, Target, AlertTriangle, CheckCircle, XCircle, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const ThreatModelingPanel = () => {
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

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-sm font-semibold text-[hsl(210,100%,80%)]">Threat Modeling</span>
          </div>
          <Badge className="bg-[hsl(210,100%,20%)] text-[hsl(210,100%,70%)] text-[10px]">STRIDE</Badge>
        </div>

        {/* Safety Banner */}
        <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,25%)] rounded-lg p-2 flex items-start gap-2">
          <Shield className="w-4 h-4 text-[hsl(210,100%,60%)] flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-[hsl(210,60%,60%)]">
            <span className="font-semibold text-[hsl(210,100%,70%)]">TRAINING MODE</span> — Example threat model for learning
          </div>
        </div>

        {/* STRIDE Overview */}
        <div className="grid grid-cols-3 gap-1.5">
          {strideCategories.map((cat, i) => (
            <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-1.5 text-center">
              <div className={`text-lg font-bold ${cat.color}`}>{cat.count}</div>
              <div className="text-[9px] text-[hsl(210,60%,50%)] truncate">{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Assets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Assets</span>
            <button className="text-[10px] text-[hsl(210,100%,60%)] hover:text-[hsl(210,100%,70%)] flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add Asset
            </button>
          </div>
          <div className="space-y-1.5">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset.id)}
                className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                  selectedAsset === asset.id 
                    ? 'bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,35%)]' 
                    : 'bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className={`w-3.5 h-3.5 ${
                    asset.risk === 'critical' ? 'text-red-400' : 'text-orange-400'
                  }`} />
                  <div className="text-left">
                    <div className="text-xs text-[hsl(210,100%,80%)]">{asset.name}</div>
                    <div className="text-[10px] text-[hsl(210,60%,50%)]">{asset.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`h-4 text-[9px] ${
                    asset.risk === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {asset.threats} threats
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Identified Threats */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Identified Threats</span>
          <div className="space-y-1.5">
            {threats.map((threat) => (
              <div key={threat.id} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[hsl(210,60%,50%)]">{threat.id}</span>
                    <Badge className="bg-[hsl(210,100%,20%)] text-[hsl(210,100%,70%)] h-4 text-[9px]">
                      {threat.category}
                    </Badge>
                  </div>
                  {threat.status === 'mitigated' && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                  {threat.status === 'open' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  {threat.status === 'in-progress' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
                </div>
                <div className="text-xs text-[hsl(210,100%,80%)] mb-1">{threat.description}</div>
                <div className="text-[10px] text-[hsl(210,60%,50%)]">
                  Control: <span className="text-[hsl(210,100%,70%)]">{threat.control}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <GitBranch className="w-3.5 h-3.5" />
            Generate DFD
          </button>
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Target className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ThreatModelingPanel;
