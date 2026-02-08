import { useState } from "react";
import { Server, Shield, AlertTriangle, CheckCircle, XCircle, Lock, Unlock, Eye, RefreshCw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  name: string;
  type: "workstation" | "server" | "network" | "database" | "cloud";
  ip: string;
  status: "isolated" | "monitoring" | "secured" | "compromised" | "at-risk";
  criticality: "critical" | "high" | "medium" | "low";
  findings: number;
  lastScan: string;
}

const AffectedAssetsPage = () => {
  const [filter, setFilter] = useState<string>("all");

  const assets: Asset[] = [
    { id: "1", name: "FIN-WKS-001", type: "workstation", ip: "192.168.1.101", status: "isolated", criticality: "high", findings: 5, lastScan: "15m ago" },
    { id: "2", name: "FIN-WKS-002", type: "workstation", ip: "192.168.1.102", status: "isolated", criticality: "medium", findings: 2, lastScan: "12m ago" },
    { id: "3", name: "FIN-WKS-003", type: "workstation", ip: "192.168.1.103", status: "isolated", criticality: "medium", findings: 1, lastScan: "10m ago" },
    { id: "4", name: "FIN-SRV-01", type: "server", ip: "192.168.1.50", status: "monitoring", criticality: "critical", findings: 0, lastScan: "5m ago" },
    { id: "5", name: "DC01", type: "server", ip: "192.168.1.10", status: "secured", criticality: "critical", findings: 0, lastScan: "2m ago" },
    { id: "6", name: "DB-FINANCE", type: "database", ip: "192.168.1.55", status: "at-risk", criticality: "critical", findings: 3, lastScan: "8m ago" },
    { id: "7", name: "MAIL-SRV", type: "server", ip: "192.168.1.30", status: "secured", criticality: "high", findings: 0, lastScan: "3m ago" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "isolated": return <Lock className="w-3 h-3 text-[hsl(0,100%,55%)]" />;
      case "monitoring": return <Eye className="w-3 h-3 text-[hsl(45,100%,55%)]" />;
      case "secured": return <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" />;
      case "compromised": return <XCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />;
      case "at-risk": return <AlertTriangle className="w-3 h-3 text-[hsl(30,100%,55%)]" />;
      default: return <Server className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "isolated": return "bg-[hsl(0,100%,20%)] text-[hsl(0,100%,70%)] border-[hsl(0,100%,35%)]";
      case "monitoring": return "bg-[hsl(45,100%,20%)] text-[hsl(45,100%,70%)] border-[hsl(45,100%,35%)]";
      case "secured": return "bg-[hsl(120,100%,15%)] text-[hsl(120,100%,60%)] border-[hsl(120,100%,30%)]";
      case "compromised": return "bg-[hsl(0,100%,25%)] text-[hsl(0,100%,75%)] border-[hsl(0,100%,40%)]";
      case "at-risk": return "bg-[hsl(30,100%,20%)] text-[hsl(30,100%,70%)] border-[hsl(30,100%,35%)]";
      default: return "bg-[hsl(210,60%,25%)] text-[hsl(210,60%,75%)]";
    }
  };

  const getCriticalityColor = (crit: string) => {
    switch (crit) {
      case "critical": return "text-[hsl(0,100%,60%)]";
      case "high": return "text-[hsl(30,100%,60%)]";
      case "medium": return "text-[hsl(45,100%,60%)]";
      default: return "text-[hsl(210,60%,60%)]";
    }
  };

  const stats = {
    isolated: assets.filter(a => a.status === "isolated").length,
    monitoring: assets.filter(a => a.status === "monitoring").length,
    atRisk: assets.filter(a => a.status === "at-risk" || a.status === "compromised").length,
    secured: assets.filter(a => a.status === "secured").length,
  };

  const filteredAssets = filter === "all" ? assets : assets.filter(a => a.status === filter);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,25%)] rounded-lg text-center cursor-pointer" onClick={() => setFilter(filter === "isolated" ? "all" : "isolated")}>
          <div className="text-lg font-bold text-[hsl(0,100%,60%)]">{stats.isolated}</div>
          <div className="text-[9px] text-[hsl(0,60%,55%)]">Isolated</div>
        </div>
        <div className="p-2 bg-[hsl(45,100%,10%)] border border-[hsl(45,100%,25%)] rounded-lg text-center cursor-pointer" onClick={() => setFilter(filter === "monitoring" ? "all" : "monitoring")}>
          <div className="text-lg font-bold text-[hsl(45,100%,55%)]">{stats.monitoring}</div>
          <div className="text-[9px] text-[hsl(45,60%,50%)]">Monitoring</div>
        </div>
        <div className="p-2 bg-[hsl(30,100%,10%)] border border-[hsl(30,100%,25%)] rounded-lg text-center cursor-pointer" onClick={() => setFilter(filter === "at-risk" ? "all" : "at-risk")}>
          <div className="text-lg font-bold text-[hsl(30,100%,55%)]">{stats.atRisk}</div>
          <div className="text-[9px] text-[hsl(30,60%,50%)]">At Risk</div>
        </div>
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center cursor-pointer" onClick={() => setFilter(filter === "secured" ? "all" : "secured")}>
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.secured}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Secured</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">AFFECTED ASSETS</span>
          {filter !== "all" && (
            <Badge variant="outline" className="text-[9px] cursor-pointer" onClick={() => setFilter("all")}>
              {filter} ×
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" className="h-6 text-[10px] border-[hsl(210,100%,25%)]">
          <RefreshCw className="w-3 h-3 mr-1" /> Scan All
        </Button>
      </div>

      {/* Assets List */}
      <div className="space-y-2">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="p-3 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg hover:border-[hsl(210,100%,25%)] transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(asset.status)}
                <div>
                  <div className="text-sm font-medium text-[hsl(210,100%,85%)]">{asset.name}</div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)] font-mono">{asset.ip}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className={`text-[9px] ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3 text-[hsl(210,60%,50%)]">
                <span className="capitalize">{asset.type}</span>
                <span className={getCriticalityColor(asset.criticality)}>{asset.criticality}</span>
              </div>
              <div className="flex items-center gap-2">
                {asset.findings > 0 && (
                  <Badge className="text-[9px] bg-[hsl(30,100%,30%)]">{asset.findings} findings</Badge>
                )}
                <span className="text-[hsl(210,60%,45%)]">Scanned {asset.lastScan}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 mt-2 pt-2 border-t border-[hsl(210,100%,12%)]">
              {asset.status === "isolated" ? (
                <Button size="sm" variant="outline" className="flex-1 h-6 text-[9px] border-[hsl(120,100%,25%)] text-[hsl(120,100%,60%)]">
                  <Unlock className="w-3 h-3 mr-1" /> Release
                </Button>
              ) : asset.status !== "secured" ? (
                <Button size="sm" variant="outline" className="flex-1 h-6 text-[9px] border-[hsl(0,100%,30%)] text-[hsl(0,100%,65%)]">
                  <Lock className="w-3 h-3 mr-1" /> Isolate
                </Button>
              ) : null}
              <Button size="sm" variant="outline" className="flex-1 h-6 text-[9px] border-[hsl(210,100%,25%)]">
                <Eye className="w-3 h-3 mr-1" /> Investigate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffectedAssetsPage;
