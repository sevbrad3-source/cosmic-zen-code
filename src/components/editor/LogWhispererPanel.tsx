import { useState, useEffect, useRef } from "react";
import { Search, Filter, Brain, AlertTriangle, Info, AlertCircle, Zap, Clock, Server, FileText, ChevronDown, ChevronRight, Sparkles, Activity, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info" | "debug";
  source: string;
  message: string;
  raw: string;
}

interface AIAnalysis {
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  recommendations: string[];
  patterns: string[];
  relatedCVEs?: string[];
}

const LogWhispererPanel = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate incoming logs
  useEffect(() => {
    const logSources = ["sshd", "nginx", "kernel", "systemd", "docker", "firewalld", "auditd", "mysql"];
    const logMessages = [
      { level: "error" as const, msg: "Failed password for invalid user admin from 192.168.1.105 port 22" },
      { level: "warning" as const, msg: "Connection from 10.10.14.5 port 54321: reverse DNS lookup failed" },
      { level: "error" as const, msg: "segfault at 0000000000000000 ip 00007f8c12345678 sp 00007ffd87654321" },
      { level: "info" as const, msg: "Started Session 1234 of user root" },
      { level: "warning" as const, msg: "Rate limit exceeded for source 203.0.113.45" },
      { level: "error" as const, msg: "Container unhealthy: health check failed after 3 retries" },
      { level: "info" as const, msg: "Firewall: BLOCKED incoming TCP 0.0.0.0:445 from 192.168.1.200" },
      { level: "error" as const, msg: "Access denied for user 'root'@'10.10.10.50' (using password: YES)" },
      { level: "warning" as const, msg: "Out of memory: Killed process 12345 (java)" },
      { level: "debug" as const, msg: "Accepted publickey for deploy from 172.16.0.5 port 38234" }
    ];

    const interval = setInterval(() => {
      const source = logSources[Math.floor(Math.random() * logSources.length)];
      const logInfo = logMessages[Math.floor(Math.random() * logMessages.length)];
      const now = new Date();
      const timestamp = now.toISOString().replace("T", " ").substring(0, 19);
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp,
        level: logInfo.level,
        source,
        message: logInfo.msg,
        raw: `${timestamp} ${source}[${Math.floor(Math.random() * 99999)}]: ${logInfo.msg}`
      };

      setLogs(prev => [...prev.slice(-200), newLog]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const analyzeWithAI = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysis({
        summary: "Detected multiple security anomalies including SSH brute-force attempts from 192.168.1.105, potential container compromise, and SQL injection attempts against MySQL database. Immediate investigation recommended.",
        severity: "high",
        recommendations: [
          "Block IP 192.168.1.105 at firewall level - SSH brute-force source",
          "Review container logs for 'unhealthy' service - possible exploitation",
          "Audit MySQL access logs for user 'root' from suspicious IPs",
          "Enable fail2ban for SSH with aggressive thresholds",
          "Review kernel OOM events - possible DoS or resource exhaustion"
        ],
        patterns: [
          "SSH brute-force pattern: 47 failed attempts in 5 minutes",
          "Repeated MySQL auth failures from internal network",
          "Container health check failures correlate with network anomalies",
          "Firewall blocks increasing from 203.0.113.0/24 subnet"
        ],
        relatedCVEs: ["CVE-2024-23897", "CVE-2023-46604", "CVE-2024-0567"]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleLogExpand = (id: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      case "warning": return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />;
      case "info": return <Info className="w-3.5 h-3.5 text-blue-400" />;
      case "debug": return <Terminal className="w-3.5 h-3.5 text-gray-400" />;
      default: return <Info className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-400";
      case "warning": return "text-yellow-400";
      case "info": return "text-blue-400";
      case "debug": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const sources = ["all", ...new Set(logs.map(l => l.source))];
  const filteredLogs = logs.filter(log => {
    const matchesSource = selectedSource === "all" || log.source === selectedSource;
    const matchesSearch = !searchQuery || log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const errorCount = logs.filter(l => l.level === "error").length;
  const warningCount = logs.filter(l => l.level === "warning").length;

  return (
    <div className="h-full flex flex-col bg-[hsl(220,20%,8%)]">
      {/* Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-[hsl(220,30%,18%)] bg-[hsl(220,25%,10%)]">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-[hsl(220,80%,85%)]">LogWhisperer</span>
          <Badge className="h-4 text-[10px] bg-purple-500/20 text-purple-300">AI-Powered</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="h-4 text-[10px] bg-red-500/20 text-red-400">{errorCount} errors</Badge>
          <Badge className="h-4 text-[10px] bg-yellow-500/20 text-yellow-400">{warningCount} warnings</Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 py-2 flex items-center gap-2 border-b border-[hsl(220,30%,18%)]">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(220,30%,45%)]" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 pl-7 pr-2 bg-[hsl(220,25%,12%)] border border-[hsl(220,30%,20%)] rounded text-xs text-[hsl(220,80%,90%)] placeholder:text-[hsl(220,30%,40%)]"
          />
        </div>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="h-7 px-2 bg-[hsl(220,25%,12%)] border border-[hsl(220,30%,20%)] rounded text-xs text-[hsl(220,80%,85%)]"
        >
          {sources.map(s => (
            <option key={s} value={s}>{s === "all" ? "All Sources" : s}</option>
          ))}
        </select>
        <button
          onClick={analyzeWithAI}
          disabled={isAnalyzing}
          className="h-7 px-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-3.5 h-3.5" />
              AI Analyze
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Log Stream */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="p-2 space-y-0.5 font-mono text-xs">
              {filteredLogs.map((log) => (
                <div key={log.id} className="group">
                  <div 
                    onClick={() => toggleLogExpand(log.id)}
                    className={`flex items-start gap-2 px-2 py-1 rounded cursor-pointer transition-colors ${
                      log.level === "error" ? "bg-red-500/5 hover:bg-red-500/10" :
                      log.level === "warning" ? "bg-yellow-500/5 hover:bg-yellow-500/10" :
                      "hover:bg-[hsl(220,30%,15%)]"
                    }`}
                  >
                    {expandedLogs.has(log.id) ? (
                      <ChevronDown className="w-3 h-3 text-[hsl(220,30%,45%)] mt-0.5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-[hsl(220,30%,45%)] mt-0.5 flex-shrink-0" />
                    )}
                    {getLevelIcon(log.level)}
                    <span className="text-[hsl(220,30%,50%)] flex-shrink-0">{log.timestamp}</span>
                    <span className="text-cyan-400 flex-shrink-0">[{log.source}]</span>
                    <span className={`flex-1 truncate ${getLevelColor(log.level)}`}>{log.message}</span>
                  </div>
                  {expandedLogs.has(log.id) && (
                    <div className="ml-7 px-2 py-2 bg-[hsl(220,25%,10%)] rounded mt-0.5 text-[hsl(220,40%,60%)]">
                      <pre className="whitespace-pre-wrap break-all">{log.raw}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* AI Analysis Panel */}
        {aiAnalysis && (
          <div className="w-80 border-l border-[hsl(220,30%,18%)] flex flex-col bg-[hsl(220,25%,9%)]">
            <div className="h-9 px-3 flex items-center gap-2 border-b border-[hsl(220,30%,18%)] bg-[hsl(220,25%,12%)]">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-[hsl(220,80%,85%)]">AI Analysis</span>
              <Badge className={`ml-auto h-4 text-[10px] ${
                aiAnalysis.severity === "critical" ? "bg-red-500/30 text-red-300" :
                aiAnalysis.severity === "high" ? "bg-orange-500/30 text-orange-300" :
                aiAnalysis.severity === "medium" ? "bg-yellow-500/30 text-yellow-300" :
                "bg-green-500/30 text-green-300"
              }`}>
                {aiAnalysis.severity}
              </Badge>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-[hsl(220,80%,80%)] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Summary
                  </div>
                  <p className="text-xs text-[hsl(220,40%,65%)] leading-relaxed">{aiAnalysis.summary}</p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[hsl(220,80%,80%)] mb-1.5 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Detected Patterns
                  </div>
                  <div className="space-y-1">
                    {aiAnalysis.patterns.map((pattern, i) => (
                      <div key={i} className="text-xs text-[hsl(220,40%,65%)] flex items-start gap-1.5">
                        <span className="text-purple-400">•</span>
                        {pattern}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[hsl(220,80%,80%)] mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Recommendations
                  </div>
                  <div className="space-y-1.5">
                    {aiAnalysis.recommendations.map((rec, i) => (
                      <div key={i} className="text-xs text-[hsl(220,40%,65%)] flex items-start gap-1.5 p-1.5 bg-[hsl(220,30%,12%)] rounded">
                        <span className="text-green-400 flex-shrink-0">{i + 1}.</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                {aiAnalysis.relatedCVEs && aiAnalysis.relatedCVEs.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-[hsl(220,80%,80%)] mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Related CVEs
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.relatedCVEs.map((cve, i) => (
                        <Badge key={i} className="text-[10px] bg-red-500/20 text-red-300">{cve}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogWhispererPanel;
