import { useState } from "react";
import { Database, Plus, Search, Upload, Download, AlertTriangle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const IOCManagerPanel = () => {
  const [filter, setFilter] = useState("all");

  const iocs = [
    { id: 1, type: "IP", value: "192.168.45.23", source: "Threat Hunt", confidence: "high", status: "active", hits: 12 },
    { id: 2, type: "Domain", value: "malware-c2.evil.net", source: "CTI Feed", confidence: "critical", status: "active", hits: 3 },
    { id: 3, type: "Hash", value: "a3b9c8d7e6f5a1b2c3d4e5f6a7b8c9d0", source: "Sandbox", confidence: "high", status: "active", hits: 0 },
    { id: 4, type: "URL", value: "http://evil.com/payload.exe", source: "Manual", confidence: "medium", status: "expired", hits: 45 },
    { id: 5, type: "Email", value: "phishing@attacker.com", source: "Phishing Report", confidence: "high", status: "active", hits: 8 },
    { id: 6, type: "File", value: "suspicious.dll", source: "EDR Alert", confidence: "medium", status: "active", hits: 2 },
  ];

  const feeds = [
    { name: "AlienVault OTX", status: "connected", lastSync: "5 min ago", iocCount: 15420 },
    { name: "Abuse.ch URLhaus", status: "connected", lastSync: "12 min ago", iocCount: 8934 },
    { name: "MISP Community", status: "syncing", lastSync: "syncing...", iocCount: 45678 },
    { name: "Custom TI Feed", status: "error", lastSync: "2 hours ago", iocCount: 234 },
  ];

  const types = ["all", "IP", "Domain", "Hash", "URL", "Email", "File"];

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">IOC MANAGEMENT</span>
        </div>
        <button className="text-xs px-2 py-1 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add IOC
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-2 py-0.5 text-[10px] rounded capitalize ${
              filter === type
                ? "bg-[hsl(210,100%,30%)] text-white"
                : "bg-[hsl(210,100%,12%)] text-[hsl(210,60%,50%)] hover:bg-[hsl(210,100%,18%)]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[hsl(210,60%,40%)]" />
        <input
          type="text"
          placeholder="Search IOCs..."
          className="w-full h-7 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded pl-7 pr-2 text-xs text-[hsl(210,100%,85%)] placeholder:text-[hsl(210,60%,40%)]"
        />
      </div>

      {/* IOC List */}
      <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
        {iocs
          .filter((ioc) => filter === "all" || ioc.type === filter)
          .map((ioc) => (
            <div
              key={ioc.id}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded hover:border-[hsl(210,100%,30%)] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[8px] border-[hsl(210,100%,30%)]">
                    {ioc.type}
                  </Badge>
                  <span className="text-xs font-mono truncate max-w-[140px]">{ioc.value}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[hsl(0,100%,20%)] rounded transition-opacity">
                  <Trash2 className="w-3 h-3 text-[hsl(0,100%,50%)]" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[8px] ${
                      ioc.confidence === "critical"
                        ? "border-[hsl(0,100%,40%)] text-[hsl(0,100%,60%)]"
                        : ioc.confidence === "high"
                        ? "border-[hsl(30,100%,40%)] text-[hsl(30,100%,60%)]"
                        : "border-[hsl(60,100%,35%)] text-[hsl(60,100%,55%)]"
                    }`}
                  >
                    {ioc.confidence}
                  </Badge>
                  <span className="text-[9px] text-[hsl(210,60%,45%)]">{ioc.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  {ioc.status === "active" ? (
                    <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" />
                  ) : (
                    <Clock className="w-3 h-3 text-[hsl(210,60%,40%)]" />
                  )}
                  <span className="text-[9px] text-[hsl(210,60%,45%)]">{ioc.hits} hits</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Threat Intel Feeds */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Intel Feeds</span>
        <div className="space-y-1">
          {feeds.map((feed, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-medium">{feed.name}</div>
                <div className="text-[9px] text-[hsl(210,60%,45%)]">
                  {feed.iocCount.toLocaleString()} IOCs • {feed.lastSync}
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  feed.status === "connected"
                    ? "bg-[hsl(120,100%,45%)]"
                    : feed.status === "syncing"
                    ? "bg-[hsl(210,100%,50%)] animate-pulse"
                    : "bg-[hsl(0,100%,50%)]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Import/Export */}
      <div className="flex gap-2">
        <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,20%)] hover:bg-[hsl(210,100%,25%)] rounded text-white flex items-center justify-center gap-1">
          <Upload className="w-3 h-3" /> Import
        </button>
        <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,20%)] hover:bg-[hsl(210,100%,25%)] rounded text-white flex items-center justify-center gap-1">
          <Download className="w-3 h-3" /> Export
        </button>
      </div>
    </div>
  );
};

export default IOCManagerPanel;
