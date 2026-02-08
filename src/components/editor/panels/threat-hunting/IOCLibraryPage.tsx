import { useState } from "react";
import { Search, Plus, Filter, Download, Upload, AlertTriangle, Globe, Hash, Server, FileCode, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface IOC {
  id: string;
  type: "ip" | "domain" | "hash" | "url" | "email" | "file";
  value: string;
  confidence: "critical" | "high" | "medium" | "low";
  source: string;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
  linkedHunts: number;
}

const IOCLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const iocs: IOC[] = [
    { id: "1", type: "ip", value: "192.168.45.23", confidence: "critical", source: "Hunt-001", firstSeen: "2d ago", lastSeen: "1h ago", tags: ["c2", "cobalt-strike"], linkedHunts: 3 },
    { id: "2", type: "hash", value: "a3b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5", confidence: "high", source: "Hunt-003", firstSeen: "5d ago", lastSeen: "2h ago", tags: ["mimikatz", "credential-theft"], linkedHunts: 2 },
    { id: "3", type: "domain", value: "evil-c2.malware.net", confidence: "critical", source: "Hunt-002", firstSeen: "1w ago", lastSeen: "30m ago", tags: ["dns-tunnel", "exfil"], linkedHunts: 4 },
    { id: "4", type: "ip", value: "10.0.0.50", confidence: "medium", source: "Alert-System", firstSeen: "3h ago", lastSeen: "3h ago", tags: ["lateral-movement"], linkedHunts: 1 },
    { id: "5", type: "file", value: "payload.exe", confidence: "critical", source: "Sandbox", firstSeen: "1d ago", lastSeen: "1d ago", tags: ["dropper", "ransomware"], linkedHunts: 2 },
    { id: "6", type: "url", value: "https://malware.site/download.php", confidence: "high", source: "OSINT", firstSeen: "4d ago", lastSeen: "12h ago", tags: ["phishing", "download"], linkedHunts: 1 },
    { id: "7", type: "hash", value: "e8f4a7b2c3d5e6f7a8b9c0d1e2f3a4b5", confidence: "medium", source: "VirusTotal", firstSeen: "2w ago", lastSeen: "5d ago", tags: ["trojan"], linkedHunts: 0 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ip": return <Server className="w-3 h-3" />;
      case "domain": return <Globe className="w-3 h-3" />;
      case "hash": return <Hash className="w-3 h-3" />;
      case "file": return <FileCode className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case "critical": return "bg-[hsl(0,100%,35%)] text-white";
      case "high": return "bg-[hsl(30,100%,35%)] text-white";
      case "medium": return "bg-[hsl(45,100%,35%)] text-black";
      default: return "bg-[hsl(210,60%,30%)] text-white";
    }
  };

  const filteredIOCs = iocs.filter(ioc => {
    const matchesSearch = ioc.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ioc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || ioc.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: iocs.length,
    critical: iocs.filter(i => i.confidence === "critical").length,
    active: iocs.filter(i => i.lastSeen.includes("m") || i.lastSeen.includes("h")).length,
  };

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{stats.total}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Total IOCs</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,12%)] border border-[hsl(0,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,70%)]">{stats.critical}</div>
          <div className="text-[9px] text-[hsl(0,60%,60%)]">Critical</div>
        </div>
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.active}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Active Today</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[hsl(210,60%,40%)]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IOCs..."
            className="h-8 pl-7 text-xs bg-[hsl(210,100%,6%)] border-[hsl(210,100%,20%)]"
          />
        </div>
        <Button size="sm" className="h-8 text-xs bg-[hsl(210,100%,30%)]">
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {["all", "ip", "domain", "hash", "file", "url"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-2 py-1 text-[10px] rounded whitespace-nowrap transition-colors ${
              filterType === type
                ? "bg-[hsl(210,100%,30%)] text-white"
                : "bg-[hsl(210,100%,10%)] text-[hsl(210,60%,55%)] hover:bg-[hsl(210,100%,15%)]"
            }`}
          >
            {type === "all" ? "All Types" : type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* IOC List */}
      <div className="space-y-2">
        {filteredIOCs.map((ioc) => (
          <div
            key={ioc.id}
            className="p-3 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg hover:border-[hsl(210,100%,25%)] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[hsl(210,100%,15%)]">
                  {getTypeIcon(ioc.type)}
                </div>
                <div>
                  <div className="font-mono text-xs text-[hsl(210,100%,85%)]">{ioc.value}</div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)]">Source: {ioc.source}</div>
                </div>
              </div>
              <Badge className={`text-[9px] ${getConfidenceColor(ioc.confidence)}`}>
                {ioc.confidence}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {ioc.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[8px] border-[hsl(210,100%,25%)] text-[hsl(210,100%,65%)]">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  First: {ioc.firstSeen}
                </span>
                <span>Last: {ioc.lastSeen}</span>
              </div>
              <span>{ioc.linkedHunts} linked hunts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] border-[hsl(210,100%,25%)]">
          <Upload className="w-3 h-3 mr-1" /> Import
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] border-[hsl(210,100%,25%)]">
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
      </div>
    </div>
  );
};

export default IOCLibraryPage;
