import { useState } from "react";
import { Bug, Cpu, Code, AlertTriangle, Zap, Search, FileCode, Binary, Shield, Target, Play, Eye, Download, ChevronRight, Layers, Activity, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface VulnerabilityResearch {
  id: string;
  name: string;
  type: "memory" | "logic" | "injection" | "crypto" | "race";
  target: string;
  severity: "critical" | "high" | "medium";
  status: "researching" | "poc" | "weaponized" | "disclosed";
  cvss: number;
  description: string;
  technique: string;
}

interface FuzzingTarget {
  id: string;
  name: string;
  type: string;
  coverage: number;
  crashes: number;
  uniqueCrashes: number;
  executions: number;
  status: "running" | "paused" | "stopped";
}

const ZeroDayResearchPanel = () => {
  const [selectedResearch, setSelectedResearch] = useState<VulnerabilityResearch | null>(null);

  const researches: VulnerabilityResearch[] = [
    { id: "r1", name: "Heap Buffer Overflow in WebKit", type: "memory", target: "Safari WebKit", severity: "critical", status: "poc", cvss: 9.8, description: "Out-of-bounds write in JavaScript engine during array manipulation", technique: "Heap Feng Shui" },
    { id: "r2", name: "Use-After-Free in Chrome V8", type: "memory", target: "Chrome V8", severity: "critical", status: "researching", cvss: 9.6, description: "UAF condition triggered by garbage collection race", technique: "Type Confusion" },
    { id: "r3", name: "Authentication Bypass in Cisco IOS", type: "logic", target: "Cisco IOS XE", severity: "critical", status: "weaponized", cvss: 10.0, description: "Path traversal leads to unauthorized admin access", technique: "Path Traversal" },
    { id: "r4", name: "SQL Injection in SAP HANA", type: "injection", target: "SAP HANA", severity: "high", status: "poc", cvss: 8.8, description: "Second-order SQL injection via stored procedure", technique: "Blind SQLi" },
    { id: "r5", name: "Race Condition in Linux Kernel", type: "race", target: "Linux Kernel 6.x", severity: "high", status: "researching", cvss: 7.8, description: "TOCTOU race in io_uring subsystem", technique: "Race Window Exploitation" },
  ];

  const fuzzingTargets: FuzzingTarget[] = [
    { id: "f1", name: "libpng", type: "Image Parser", coverage: 78.4, crashes: 234, uniqueCrashes: 12, executions: 8945623, status: "running" },
    { id: "f2", name: "openssl", type: "TLS Library", coverage: 45.2, crashes: 89, uniqueCrashes: 3, executions: 12456789, status: "running" },
    { id: "f3", name: "ffmpeg", type: "Media Codec", coverage: 34.8, crashes: 567, uniqueCrashes: 45, executions: 3456123, status: "paused" },
    { id: "f4", name: "sqlite3", type: "Database", coverage: 82.1, crashes: 12, uniqueCrashes: 1, executions: 45678234, status: "running" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "weaponized": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "poc": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "researching": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "disclosed": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "memory": return Cpu;
      case "logic": return Code;
      case "injection": return FileCode;
      case "crypto": return Lock;
      case "race": return Activity;
      default: return Bug;
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
            <Bug className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Zero-Day Research Lab</h3>
            <p className="text-xs text-text-muted">Vulnerability Discovery & Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>RESEARCH MODE - Vulnerabilities are simulated for training purposes only.</span>
        </div>
      </div>

      <Tabs defaultValue="research" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 h-8 bg-transparent border-b border-border rounded-none justify-start flex-shrink-0">
          <TabsTrigger value="research" className="text-xs h-6 data-[state=active]:bg-primary/20">Active Research</TabsTrigger>
          <TabsTrigger value="fuzzing" className="text-xs h-6 data-[state=active]:bg-primary/20">Fuzzing Lab</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs h-6 data-[state=active]:bg-primary/20">Binary Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="flex-1 p-0 mt-0 overflow-hidden flex">
          <ScrollArea className="w-1/2 border-r border-border">
            <div className="p-2 space-y-2">
              {researches.map((research) => {
                const TypeIcon = getTypeIcon(research.type);
                return (
                  <div
                    key={research.id}
                    onClick={() => setSelectedResearch(research)}
                    className={`p-2.5 rounded border cursor-pointer transition-colors ${
                      selectedResearch?.id === research.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <TypeIcon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{research.name}</div>
                        <div className="text-xs text-text-muted">{research.target}</div>
                      </div>
                      <Badge className={`h-4 text-xs ${getStatusColor(research.status)}`}>{research.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="h-4 text-xs font-mono">{research.type}</Badge>
                      <span className="text-xs font-mono text-destructive font-bold">CVSS {research.cvss}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex-1 p-3 overflow-auto">
            {selectedResearch ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">{selectedResearch.name}</h4>
                  <div className="text-xs text-text-muted">{selectedResearch.target}</div>
                </div>

                <div className="p-2 bg-sidebar-bg rounded border border-border">
                  <div className="text-xs text-text-muted uppercase mb-1">Description</div>
                  <div className="text-xs">{selectedResearch.description}</div>
                </div>

                <div className="p-2 bg-sidebar-bg rounded border border-border">
                  <div className="text-xs text-text-muted uppercase mb-1">Exploitation Technique</div>
                  <div className="text-xs font-mono text-primary">{selectedResearch.technique}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-sidebar-bg rounded border border-border text-center">
                    <div className="text-lg font-bold text-destructive">{selectedResearch.cvss}</div>
                    <div className="text-xs text-text-muted">CVSS Score</div>
                  </div>
                  <div className="p-2 bg-sidebar-bg rounded border border-border text-center">
                    <div className="text-lg font-bold text-purple-400">{selectedResearch.severity.toUpperCase()}</div>
                    <div className="text-xs text-text-muted">Severity</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full h-7 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs font-medium flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    View PoC Code
                  </button>
                  <button className="w-full h-7 bg-sidebar-hover text-text-primary rounded text-xs font-medium flex items-center justify-center gap-1 hover:bg-sidebar-active">
                    <Download className="w-3 h-3" />
                    Export Analysis
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-muted">
                Select a research item to view details
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="fuzzing" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-2">
            {fuzzingTargets.map((target) => (
              <div key={target.id} className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-semibold">{target.name}</div>
                    <div className="text-xs text-text-muted">{target.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${target.status === "running" ? "bg-green-500 animate-pulse" : target.status === "paused" ? "bg-yellow-500" : "bg-gray-500"}`} />
                    <span className="text-xs text-text-muted">{target.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted">Coverage</span>
                      <span className="font-mono">{target.coverage}%</span>
                    </div>
                    <Progress value={target.coverage} className="h-1" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-1.5 bg-editor-bg rounded">
                      <div className="font-mono text-destructive font-bold">{target.crashes}</div>
                      <div className="text-text-muted">Crashes</div>
                    </div>
                    <div className="text-center p-1.5 bg-editor-bg rounded">
                      <div className="font-mono text-orange-400 font-bold">{target.uniqueCrashes}</div>
                      <div className="text-text-muted">Unique</div>
                    </div>
                    <div className="text-center p-1.5 bg-editor-bg rounded">
                      <div className="font-mono text-blue-400 font-bold">{(target.executions / 1000000).toFixed(1)}M</div>
                      <div className="text-text-muted">Execs</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 p-3 mt-0 overflow-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input placeholder="Load binary for analysis..." className="h-7 text-xs flex-1" />
              <button className="h-7 px-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">Load</button>
            </div>
            
            <div className="p-3 bg-sidebar-bg rounded border border-border">
              <div className="text-xs text-text-muted uppercase mb-2">Analysis Tools</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 bg-editor-bg hover:bg-sidebar-hover rounded text-xs flex items-center justify-center gap-1.5">
                  <Binary className="w-3 h-3" />
                  Disassembler
                </button>
                <button className="h-8 bg-editor-bg hover:bg-sidebar-hover rounded text-xs flex items-center justify-center gap-1.5">
                  <Code className="w-3 h-3" />
                  Decompiler
                </button>
                <button className="h-8 bg-editor-bg hover:bg-sidebar-hover rounded text-xs flex items-center justify-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  CFG Analysis
                </button>
                <button className="h-8 bg-editor-bg hover:bg-sidebar-hover rounded text-xs flex items-center justify-center gap-1.5">
                  <Search className="w-3 h-3" />
                  String Search
                </button>
              </div>
            </div>

            <div className="p-3 bg-sidebar-bg rounded border border-border">
              <div className="text-xs text-text-muted uppercase mb-2">Symbolic Execution</div>
              <div className="text-xs text-text-muted text-center py-4">
                Load a binary to begin symbolic analysis
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ZeroDayResearchPanel;
