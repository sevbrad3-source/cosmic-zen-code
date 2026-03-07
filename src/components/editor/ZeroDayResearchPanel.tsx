import { useState } from "react";
import { Bug, Cpu, Code, Zap, Search, FileCode, Binary, Shield, Target, Play, Eye, Download, Layers, Activity, Clock, Lock, BarChart3, Crosshair, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "research", icon: Bug, label: "Research", badge: 5 },
  { id: "fuzzing", icon: FlaskConical, label: "Fuzzing", badge: 4 },
  { id: "binary", icon: Binary, label: "Binary Analysis" },
  { id: "exploit", icon: Crosshair, label: "Exploit Dev" },
  { id: "poc", icon: Code, label: "PoC Library", badge: 3 },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

interface VulnerabilityResearch {
  id: string; name: string; type: "memory" | "logic" | "injection" | "crypto" | "race"; target: string; severity: "critical" | "high" | "medium"; status: "researching" | "poc" | "weaponized" | "disclosed"; cvss: number; description: string; technique: string;
}

const ZeroDayResearchPanel = () => {
  const [activeTab, setActiveTab] = useState("research");
  const [selectedResearch, setSelectedResearch] = useState<VulnerabilityResearch | null>(null);

  const researches: VulnerabilityResearch[] = [
    { id: "r1", name: "Heap Buffer Overflow in WebKit", type: "memory", target: "Safari WebKit", severity: "critical", status: "poc", cvss: 9.8, description: "Out-of-bounds write in JavaScript engine during array manipulation", technique: "Heap Feng Shui" },
    { id: "r2", name: "Use-After-Free in Chrome V8", type: "memory", target: "Chrome V8", severity: "critical", status: "researching", cvss: 9.6, description: "UAF condition triggered by garbage collection race", technique: "Type Confusion" },
    { id: "r3", name: "Authentication Bypass in Cisco IOS", type: "logic", target: "Cisco IOS XE", severity: "critical", status: "weaponized", cvss: 10.0, description: "Path traversal leads to unauthorized admin access", technique: "Path Traversal" },
    { id: "r4", name: "SQL Injection in SAP HANA", type: "injection", target: "SAP HANA", severity: "high", status: "poc", cvss: 8.8, description: "Second-order SQL injection via stored procedure", technique: "Blind SQLi" },
    { id: "r5", name: "Race Condition in Linux Kernel", type: "race", target: "Linux Kernel 6.x", severity: "high", status: "researching", cvss: 7.8, description: "TOCTOU race in io_uring subsystem", technique: "Race Window Exploitation" },
  ];

  const fuzzingTargets = [
    { id: "f1", name: "libpng", type: "Image Parser", coverage: 78.4, crashes: 234, uniqueCrashes: 12, executions: 8945623, status: "running" },
    { id: "f2", name: "openssl", type: "TLS Library", coverage: 45.2, crashes: 89, uniqueCrashes: 3, executions: 12456789, status: "running" },
    { id: "f3", name: "ffmpeg", type: "Media Codec", coverage: 34.8, crashes: 567, uniqueCrashes: 45, executions: 3456123, status: "paused" },
    { id: "f4", name: "sqlite3", type: "Database", coverage: 82.1, crashes: 12, uniqueCrashes: 1, executions: 45678234, status: "running" },
  ];

  const pocLibrary = [
    { name: "CVE-2024-21762 — FortiOS RCE", lang: "Python", verified: true },
    { name: "CVE-2024-3400 — PAN-OS Command Injection", lang: "Python", verified: true },
    { name: "CVE-2024-27198 — TeamCity Auth Bypass", lang: "Go", verified: false },
  ];

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = { weaponized: "bg-red-500/20 text-red-400", poc: "bg-orange-500/20 text-orange-400", researching: "bg-blue-500/20 text-blue-400", disclosed: "bg-green-500/20 text-green-400" };
    return map[status] || "bg-gray-500/20 text-gray-400";
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, any> = { memory: Cpu, logic: Code, injection: FileCode, crypto: Lock, race: Activity };
    return map[type] || Bug;
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center"><Bug className="w-4 h-4 text-purple-400" /></div>
          <div>
            <h3 className="text-sm font-semibold">Zero-Day Research Lab</h3>
            <p className="text-xs text-text-muted">Vulnerability Discovery & Analysis</p>
          </div>
        </div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {activeTab === "research" && (
            <div className="flex">
              <div className="w-1/2 border-r border-border pr-2 space-y-2">
                {researches.map((r) => {
                  const TypeIcon = getTypeIcon(r.type);
                  return (
                    <div key={r.id} onClick={() => setSelectedResearch(r)} className={`p-2.5 rounded border cursor-pointer transition-colors ${selectedResearch?.id === r.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"}`}>
                      <div className="flex items-start gap-2 mb-1">
                        <TypeIcon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{r.name}</div>
                          <div className="text-xs text-text-muted">{r.target}</div>
                        </div>
                        <Badge className={`h-4 text-xs ${getStatusColor(r.status)}`}>{r.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="h-4 text-xs font-mono">{r.type}</Badge>
                        <span className="text-xs font-mono text-destructive font-bold">CVSS {r.cvss}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex-1 pl-2">
                {selectedResearch ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">{selectedResearch.name}</h4>
                    <div className="p-2 bg-sidebar-bg rounded border border-border"><div className="text-xs text-text-muted uppercase mb-1">Description</div><div className="text-xs">{selectedResearch.description}</div></div>
                    <div className="p-2 bg-sidebar-bg rounded border border-border"><div className="text-xs text-text-muted uppercase mb-1">Technique</div><div className="text-xs font-mono text-primary">{selectedResearch.technique}</div></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-sidebar-bg rounded border border-border text-center"><div className="text-lg font-bold text-destructive">{selectedResearch.cvss}</div><div className="text-xs text-text-muted">CVSS</div></div>
                      <div className="p-2 bg-sidebar-bg rounded border border-border text-center"><div className="text-lg font-bold text-purple-400">{selectedResearch.severity.toUpperCase()}</div><div className="text-xs text-text-muted">Severity</div></div>
                    </div>
                    <button className="w-full h-7 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs font-medium flex items-center justify-center gap-1"><Eye className="w-3 h-3" />View PoC Code</button>
                  </div>
                ) : <div className="flex items-center justify-center h-32 text-xs text-text-muted">Select a research item</div>}
              </div>
            </div>
          )}

          {activeTab === "fuzzing" && fuzzingTargets.map((t) => (
            <div key={t.id} className="p-3 bg-sidebar-bg rounded border border-border">
              <div className="flex items-center justify-between mb-2">
                <div><div className="text-xs font-semibold">{t.name}</div><div className="text-xs text-text-muted">{t.type}</div></div>
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${t.status === "running" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} /><span className="text-xs text-text-muted">{t.status}</span></div>
              </div>
              <div className="mb-2"><div className="flex justify-between text-xs mb-1"><span className="text-text-muted">Coverage</span><span className="font-mono">{t.coverage}%</span></div><Progress value={t.coverage} className="h-1" /></div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-1.5 bg-editor-bg rounded"><div className="font-mono text-destructive font-bold">{t.crashes}</div><div className="text-text-muted">Crashes</div></div>
                <div className="text-center p-1.5 bg-editor-bg rounded"><div className="font-mono text-orange-400 font-bold">{t.uniqueCrashes}</div><div className="text-text-muted">Unique</div></div>
                <div className="text-center p-1.5 bg-editor-bg rounded"><div className="font-mono text-blue-400 font-bold">{(t.executions / 1000000).toFixed(1)}M</div><div className="text-text-muted">Execs</div></div>
              </div>
            </div>
          ))}

          {activeTab === "binary" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Input placeholder="Load binary for analysis..." className="h-7 text-xs flex-1" /><button className="h-7 px-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">Load</button></div>
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Analysis Tools</div>
                <div className="grid grid-cols-2 gap-2">
                  {[{ icon: Binary, name: "Disassembler" }, { icon: Code, name: "Decompiler" }, { icon: Layers, name: "CFG Analysis" }, { icon: Search, name: "String Search" }, { icon: Shield, name: "ASLR Check" }, { icon: Lock, name: "Crypto Detect" }].map((tool) => (
                    <button key={tool.name} className="h-8 bg-editor-bg hover:bg-sidebar-hover rounded text-xs flex items-center justify-center gap-1.5"><tool.icon className="w-3 h-3" />{tool.name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "exploit" && (
            <div className="space-y-3">
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Exploit Development Pipeline</div>
                {["Trigger Identification", "Root Cause Analysis", "Primitive Construction", "Exploit Stabilization", "Weaponization"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-editor-bg rounded mb-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 2 ? "bg-green-500/20 text-green-400" : "bg-muted text-text-muted"}`}>{i + 1}</div>
                    <span className="text-xs">{step}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Target Environment</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-text-muted">OS:</span><span>Windows 11 23H2</span>
                  <span className="text-text-muted">Arch:</span><span>x86_64</span>
                  <span className="text-text-muted">ASLR:</span><span className="text-green-400">Enabled</span>
                  <span className="text-text-muted">DEP:</span><span className="text-green-400">Enabled</span>
                  <span className="text-text-muted">CFG:</span><span className="text-green-400">Enabled</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "poc" && pocLibrary.map((poc, i) => (
            <div key={i} className="p-2.5 bg-sidebar-bg rounded border border-border flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">{poc.name}</div>
                <div className="text-xs text-text-muted">{poc.lang}</div>
              </div>
              <div className="flex items-center gap-2">
                {poc.verified && <Badge className="h-4 text-xs bg-green-500/20 text-green-400">verified</Badge>}
                <Download className="w-3 h-3 text-text-muted cursor-pointer" />
              </div>
            </div>
          ))}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "Active Research", val: "5" }, { label: "Total Crashes", val: "902" }, { label: "Unique Bugs", val: "61" }, { label: "PoCs Created", val: "3" }].map((s) => (
                <div key={s.label} className="p-2.5 bg-sidebar-bg rounded border border-border text-center">
                  <div className="text-lg font-bold text-purple-400">{s.val}</div>
                  <div className="text-xs text-text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ZeroDayResearchPanel;
