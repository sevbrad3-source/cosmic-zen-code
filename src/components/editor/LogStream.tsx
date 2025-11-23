import { useState, useEffect, useRef } from "react";
import { Activity, Filter, Pause, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: number;
  timestamp: string;
  severity: "info" | "warning" | "error" | "success";
  source: string;
  message: string;
}

const LogStream = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: "2024-03-15 14:23:01", severity: "info", source: "Scanner", message: "Network scan initiated on 192.168.1.0/24" },
    { id: 2, timestamp: "2024-03-15 14:23:15", severity: "success", source: "Scanner", message: "Open port detected: 192.168.1.100:22 (SSH)" },
    { id: 3, timestamp: "2024-03-15 14:23:32", severity: "warning", source: "Exploit", message: "SSH brute force attempt on 192.168.1.100" },
    { id: 4, timestamp: "2024-03-15 14:24:01", severity: "success", source: "Exploit", message: "SSH credentials found: admin:P@ssw0rd123!" },
    { id: 5, timestamp: "2024-03-15 14:24:15", severity: "info", source: "Shell", message: "Remote shell established on 192.168.1.100" },
    { id: 6, timestamp: "2024-03-15 14:24:45", severity: "error", source: "Exploit", message: "Privilege escalation failed: insufficient permissions" },
  ]);
  
  const [isPaused, setIsPaused] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const sources = ["Scanner", "Exploit", "Shell", "Network", "Database"];
      const severities: Array<"info" | "warning" | "error" | "success"> = ["info", "warning", "error", "success"];
      const messages = [
        "Port scan completed on target",
        "New vulnerability detected",
        "Command execution successful",
        "Connection established",
        "Data exfiltration in progress",
        "Authentication attempt",
        "Payload delivered successfully",
        "Remote access granted",
      ];

      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs(prev => [...prev, newLog].slice(-100));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "text-destructive";
      case "warning": return "text-yellow-500";
      case "success": return "text-green-500";
      case "info": return "text-blue-500";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error": return "bg-destructive text-destructive-foreground";
      case "warning": return "bg-yellow-500 text-black";
      case "success": return "bg-green-500 text-white";
      case "info": return "bg-blue-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesSource = filterSource === "all" || log.source === filterSource;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesSource && matchesSearch;
  });

  const sources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Live Log Stream</h3>
          {!isPaused && (
            <Badge variant="secondary" className="animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPaused(!isPaused)}
            className="gap-2"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-[130px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
            <SelectItem value="warning">Warnings</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 rounded border border-border bg-muted/20" ref={scrollRef}>
        <div className="p-2 font-mono text-xs space-y-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 py-1 px-2 hover:bg-muted/50 rounded transition-colors"
            >
              <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
              <Badge className={`${getSeverityBadge(log.severity)} shrink-0 text-xs`}>
                {log.severity.toUpperCase()}
              </Badge>
              <span className="text-primary shrink-0 min-w-[80px]">[{log.source}]</span>
              <span className={getSeverityColor(log.severity)}>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>Showing {filteredLogs.length} of {logs.length} logs</span>
        <span>Auto-scrolling {isPaused ? "paused" : "enabled"}</span>
      </div>
    </div>
  );
};

export default LogStream;
