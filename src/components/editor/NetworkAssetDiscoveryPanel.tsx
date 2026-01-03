import { useState } from "react";
import { Server, Search, AlertTriangle, Shield, RefreshCw, Plus, Wifi, Monitor, Router, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useNetworkAssets } from "@/hooks/useNetworkAssets";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const NetworkAssetDiscoveryPanel = () => {
  const { 
    assets, 
    loading, 
    discoverAsset, 
    correlateVulnerabilities, 
    assetsByZone, 
    compromisedAssets 
  } = useNetworkAssets();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [ipRange, setIpRange] = useState("192.168.1");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"assets" | "vulns" | "zones">("assets");

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "server": return <Server className="w-4 h-4" />;
      case "workstation": return <Monitor className="w-4 h-4" />;
      case "router": case "switch": return <Router className="w-4 h-4" />;
      case "firewall": return <Shield className="w-4 h-4" />;
      default: return <HardDrive className="w-4 h-4" />;
    }
  };

  const getRiskColor = (score: number | null) => {
    if (!score) return "bg-slate-500";
    if (score >= 70) return "bg-red-500";
    if (score >= 40) return "bg-amber-500";
    if (score >= 20) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setScanProgress(0);

    const totalHosts = 10;
    for (let i = 1; i <= totalHosts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setScanProgress((i / totalHosts) * 100);
      
      if (Math.random() > 0.5) {
        const ip = `${ipRange}.${Math.floor(Math.random() * 254) + 1}`;
        await discoverAsset(ip);
      }
    }

    setScanning(false);
    toast.success("Network scan complete");
  };

  const handleQuickDiscover = async () => {
    const ip = `${ipRange}.${Math.floor(Math.random() * 254) + 1}`;
    const { error } = await discoverAsset(ip);
    if (error) {
      toast.error("Failed to discover asset");
    } else {
      toast.success(`Discovered asset at ${ip}`);
    }
  };

  const selectedAssetData = assets.find((a) => a.id === selectedAsset);

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-[hsl(210,100%,15%)] rounded w-1/2" />
        <div className="h-32 bg-[hsl(210,100%,12%)] rounded" />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-[hsl(210,100%,85%)]">Network Discovery</span>
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
            {assets.length} Assets
          </Badge>
        </div>
      </div>

      {/* Scan Controls */}
      <div className="p-3 bg-[hsl(210,100%,10%)] rounded border border-[hsl(210,100%,18%)] space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="IP Range (e.g., 192.168.1)"
            value={ipRange}
            onChange={(e) => setIpRange(e.target.value)}
            className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]"
          />
          <Button 
            size="sm" 
            className="h-8 text-xs"
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Search className="w-3 h-3 mr-1" />}
            Scan
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 text-xs"
            onClick={handleQuickDiscover}
            disabled={scanning}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {scanning && (
          <div className="space-y-1">
            <Progress value={scanProgress} className="h-1.5" />
            <span className="text-xs text-[hsl(210,60%,50%)]">Scanning network... {Math.round(scanProgress)}%</span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,10%)] rounded border border-[hsl(210,100%,18%)]">
          <div className="text-lg font-bold text-[hsl(210,100%,85%)]">{assets.length}</div>
          <div className="text-xs text-[hsl(210,60%,50%)]">Total Assets</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] rounded border border-red-500/30">
          <div className="text-lg font-bold text-red-400">{compromisedAssets.length}</div>
          <div className="text-xs text-[hsl(210,60%,50%)]">Compromised</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] rounded border border-amber-500/30">
          <div className="text-lg font-bold text-amber-400">{correlateVulnerabilities.length}</div>
          <div className="text-xs text-[hsl(210,60%,50%)]">Unique Vulns</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-[hsl(210,100%,8%)] rounded">
        {["assets", "vulns", "zones"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors ${
              activeTab === tab
                ? "bg-[hsl(210,100%,20%)] text-[hsl(210,100%,85%)]"
                : "text-[hsl(210,60%,50%)] hover:text-[hsl(210,100%,75%)]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-380px)]">
        {activeTab === "assets" && (
          <div className="space-y-2">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                className={`p-3 bg-[hsl(210,100%,10%)] rounded border transition-colors cursor-pointer ${
                  selectedAsset === asset.id 
                    ? "border-green-500/50 bg-green-500/5" 
                    : "border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,25%)]"
                }`}
                onClick={() => setSelectedAsset(asset.id === selectedAsset ? null : asset.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${asset.is_compromised ? "bg-red-500/20 text-red-400" : "bg-[hsl(210,100%,15%)] text-[hsl(210,60%,60%)]"}`}>
                      {getAssetIcon(asset.asset_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[hsl(210,100%,85%)]">
                          {asset.hostname || asset.ip_address}
                        </span>
                        {asset.is_compromised && (
                          <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                            COMPROMISED
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-[hsl(210,60%,50%)]">{asset.ip_address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white ${getRiskColor(asset.risk_score)}`}>
                      {asset.risk_score}
                    </div>
                  </div>
                </div>

                {selectedAsset === asset.id && (
                  <div className="mt-3 pt-3 border-t border-[hsl(210,100%,18%)] space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[hsl(210,60%,50%)]">Type:</span>
                        <span className="ml-1 text-[hsl(210,100%,85%)]">{asset.asset_type}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(210,60%,50%)]">Zone:</span>
                        <span className="ml-1 text-[hsl(210,100%,85%)]">{asset.zone || "Unknown"}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(210,60%,50%)]">OS:</span>
                        <span className="ml-1 text-[hsl(210,100%,85%)]">{asset.operating_system || "Unknown"}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(210,60%,50%)]">MAC:</span>
                        <span className="ml-1 text-[hsl(210,100%,85%)] font-mono">{asset.mac_address || "N/A"}</span>
                      </div>
                    </div>

                    {/* Services */}
                    {asset.services && (asset.services as any[]).length > 0 && (
                      <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                        <span className="text-xs font-medium text-[hsl(210,100%,75%)]">Open Services</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(asset.services as any[]).map((svc, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                              {svc.port}/{svc.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vulnerabilities */}
                    {asset.vulnerabilities && (asset.vulnerabilities as any[]).length > 0 && (
                      <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span className="text-xs font-medium text-[hsl(210,100%,75%)]">Vulnerabilities</span>
                        </div>
                        <div className="space-y-1">
                          {(asset.vulnerabilities as any[]).map((vuln, idx) => (
                            <div key={idx} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,6%)] rounded">
                              <div>
                                <span className="text-xs font-mono text-[hsl(210,100%,85%)]">{vuln.cve}</span>
                                <p className="text-xs text-[hsl(210,60%,50%)]">{vuln.description}</p>
                              </div>
                              <Badge className={`text-xs ${getSeverityColor(vuln.severity)}`}>
                                {vuln.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {asset.last_scan && (
                      <div className="text-xs text-[hsl(210,60%,50%)]">
                        Last scanned: {formatDistanceToNow(new Date(asset.last_scan), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "vulns" && (
          <div className="space-y-2">
            {correlateVulnerabilities.map((vuln) => (
              <div key={vuln.cve} className="p-3 bg-[hsl(210,100%,10%)] rounded border border-[hsl(210,100%,18%)]">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-mono font-medium text-[hsl(210,100%,85%)]">{vuln.cve}</span>
                  <Badge className={`text-xs ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity}
                  </Badge>
                </div>
                <div className="text-xs text-[hsl(210,60%,50%)] mb-2">
                  Affects {vuln.count} asset{vuln.count > 1 ? "s" : ""}
                </div>
                <div className="flex flex-wrap gap-1">
                  {vuln.assets.slice(0, 5).map((asset, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {asset}
                    </Badge>
                  ))}
                  {vuln.assets.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{vuln.assets.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {correlateVulnerabilities.length === 0 && (
              <div className="text-center py-8 text-[hsl(210,60%,50%)]">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No vulnerabilities detected</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "zones" && (
          <div className="space-y-2">
            {Array.from(assetsByZone.entries()).map(([zone, zoneAssets]) => (
              <div key={zone} className="p-3 bg-[hsl(210,100%,10%)] rounded border border-[hsl(210,100%,18%)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[hsl(210,100%,85%)]">{zone}</span>
                  <Badge variant="outline" className="text-xs">
                    {zoneAssets.length} assets
                  </Badge>
                </div>
                <div className="space-y-1">
                  {zoneAssets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center gap-2 p-1.5 bg-[hsl(210,100%,8%)] rounded">
                      {getAssetIcon(asset.asset_type)}
                      <span className="text-xs text-[hsl(210,100%,85%)]">{asset.hostname || asset.ip_address}</span>
                      {asset.is_compromised && (
                        <AlertTriangle className="w-3 h-3 text-red-400 ml-auto" />
                      )}
                    </div>
                  ))}
                  {zoneAssets.length > 3 && (
                    <div className="text-xs text-[hsl(210,60%,50%)] text-center">
                      +{zoneAssets.length - 3} more assets
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NetworkAssetDiscoveryPanel;
