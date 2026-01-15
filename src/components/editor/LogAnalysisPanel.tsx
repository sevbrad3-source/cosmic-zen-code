import { useState } from "react";
import { FileSearch, Filter, Search, AlertTriangle, Clock, Server, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const LogAnalysisPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

  const logSources = [
    { id: "all", name: "All Sources", count: 2847 },
    { id: "windows", name: "Windows Events", count: 1523 },
    { id: "linux", name: "Linux Syslog", count: 892 },
    { id: "firewall", name: "Firewall Logs", count: 342 },
    { id: "proxy", name: "Proxy Logs", count: 90 },
  ];

  const logs = [
    { time: "03:24:17.432", source: "DC01", level: "CRITICAL", event: "4625", message: "Failed login attempt - admin@corp.local", count: 47 },
    { time: "03:24:18.891", source: "WEB01", level: "ERROR", event: "500", message: "HTTP 500 - /api/auth POST - SQL injection attempt", count: 1 },
    { time: "03:24:19.123", source: "FW01", level: "WARNING", event: "DENY", message: "Blocked outbound to 185.234.72.0/24 (known C2)", count: 23 },
    { time: "03:24:20.456", source: "MAIL01", level: "INFO", event: "1000", message: "Email received from external domain", count: 156 },
    { time: "03:24:21.789", source: "DC01", level: "CRITICAL", event: "4688", message: "Process created: powershell.exe -enc base64...", count: 1 },
    { time: "03:24:22.012", source: "PROXY01", level: "WARNING", event: "403", message: "Blocked access to pastebin.com/raw/xyz", count: 3 },
  ];

  const anomalies = [
    { type: "Brute Force", description: "47 failed logins in 5 seconds", confidence: 98 },
    { type: "Data Exfil", description: "Unusual DNS query volume", confidence: 87 },
    { type: "Lateral Movement", description: "PsExec execution pattern", confidence: 92 },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">Log Analysis</span>
          </div>
          <div className="px-2 py-0.5 bg-[hsl(210,100%,20%)] rounded text-[9px] text-[hsl(210,100%,60%)]">
            2,847 Events
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[hsl(210,60%,40%)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs... (regex supported)"
            className="w-full bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded px-7 py-1.5 text-xs text-[hsl(210,100%,85%)] placeholder-[hsl(210,60%,40%)] focus:outline-none focus:border-[hsl(210,100%,40%)]"
          />
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[hsl(210,60%,40%)] cursor-pointer hover:text-[hsl(210,100%,60%)]" />
        </div>

        {/* Sources */}
        <div className="flex flex-wrap gap-1">
          {logSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                selectedSource === source.id
                  ? "bg-[hsl(210,100%,30%)] text-[hsl(210,100%,90%)]"
                  : "bg-[hsl(210,100%,12%)] text-[hsl(210,60%,60%)] hover:bg-[hsl(210,100%,18%)]"
              }`}
            >
              {source.name} ({source.count})
            </button>
          ))}
        </div>

        {/* Anomaly Detection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Detected Anomalies</span>
          </div>
          <div className="space-y-1">
            {anomalies.map((anomaly, i) => (
              <div key={i} className="bg-orange-500/10 border border-orange-500/30 rounded p-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-medium text-orange-400">{anomaly.type}</div>
                  <div className="text-[9px] text-[hsl(210,60%,60%)]">{anomaly.description}</div>
                </div>
                <div className="text-[10px] font-mono text-orange-400">{anomaly.confidence}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Log Stream */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[hsl(210,100%,50%)]" />
              <span className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Log Stream</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-green-400">Live</span>
            </div>
          </div>
          <div className="bg-[hsl(210,100%,6%)] rounded border border-[hsl(210,100%,15%)] overflow-hidden">
            <div className="space-y-px">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 px-2 py-1.5 hover:bg-[hsl(210,100%,10%)] font-mono text-[10px]">
                  <span className="text-[hsl(210,60%,45%)] flex-shrink-0">{log.time}</span>
                  <span className="text-[hsl(210,100%,60%)] flex-shrink-0 w-16">{log.source}</span>
                  <span className={`flex-shrink-0 w-16 ${
                    log.level === "CRITICAL" ? "text-red-400" :
                    log.level === "ERROR" ? "text-red-400" :
                    log.level === "WARNING" ? "text-yellow-400" :
                    "text-[hsl(210,60%,50%)]"
                  }`}>{log.level}</span>
                  <span className="text-[hsl(210,100%,75%)] truncate flex-1">{log.message}</span>
                  {log.count > 1 && (
                    <span className="text-[9px] px-1 py-0.5 bg-[hsl(210,100%,20%)] rounded text-[hsl(210,100%,60%)]">×{log.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-[10px] text-[hsl(210,100%,85%)] transition-colors">
            <Server className="w-3 h-3" />
            Correlate Events
          </button>
          <button className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-[10px] text-[hsl(210,100%,70%)] transition-colors">
            <Filter className="w-3 h-3" />
            Create Rule
          </button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default LogAnalysisPanel;
