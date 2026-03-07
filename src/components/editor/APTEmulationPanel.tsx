import { useState } from "react";
import { Skull, Shield, Play, Square, Eye, Target, Zap, Globe, Lock, Users, Clock, Activity, FileText, Download, Settings, BarChart3, Layers, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "groups", icon: Users, label: "Threat Actors", badge: 5 },
  { id: "scenarios", icon: Route, label: "Scenarios", badge: 5 },
  { id: "running", icon: Activity, label: "Active", badgeVariant: "success" as const },
  { id: "killchain", icon: Layers, label: "Kill Chain" },
  { id: "reports", icon: FileText, label: "Reports" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

interface APTGroup {
  id: string; name: string; aliases: string[]; origin: string; targetSectors: string[]; ttps: string[]; tools: string[]; active: boolean; riskLevel: "critical" | "high" | "medium";
}

const APTEmulationPanel = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [selectedGroup, setSelectedGroup] = useState<APTGroup | null>(null);

  const aptGroups: APTGroup[] = [
    { id: "apt29", name: "APT29 (Cozy Bear)", aliases: ["The Dukes", "YTTRIUM"], origin: "Russia (SVR)", targetSectors: ["Government", "Defense", "Energy", "Healthcare"], ttps: ["T1566.001", "T1059.001", "T1055", "T1036", "T1027"], tools: ["SUNBURST", "Cobalt Strike", "TEARDROP", "mimikatz"], active: true, riskLevel: "critical" },
    { id: "apt28", name: "APT28 (Fancy Bear)", aliases: ["Sofacy", "STRONTIUM"], origin: "Russia (GRU)", targetSectors: ["Government", "Military", "Media", "Political"], ttps: ["T1566.002", "T1059.003", "T1547.001", "T1003", "T1048"], tools: ["X-Agent", "Zebrocy", "LoJax", "Seduploader"], active: true, riskLevel: "critical" },
    { id: "apt41", name: "APT41 (Double Dragon)", aliases: ["Winnti", "BARIUM"], origin: "China (MSS)", targetSectors: ["Technology", "Gaming", "Healthcare", "Telecom"], ttps: ["T1195.002", "T1059.001", "T1055.012", "T1574.001", "T1497"], tools: ["ShadowPad", "PlugX", "Winnti", "MESSAGETAP"], active: true, riskLevel: "critical" },
    { id: "lazarus", name: "Lazarus Group", aliases: ["Hidden Cobra", "ZINC"], origin: "North Korea (RGB)", targetSectors: ["Financial", "Crypto", "Defense", "Entertainment"], ttps: ["T1566.001", "T1059.007", "T1055.001", "T1486", "T1565.001"], tools: ["HOPLIGHT", "ELECTRICFISH", "AppleJeus", "FastCash"], active: true, riskLevel: "critical" },
    { id: "apt33", name: "APT33 (Elfin)", aliases: ["Magnallium", "HOLMIUM"], origin: "Iran (IRGC)", targetSectors: ["Aviation", "Energy", "Petrochemical", "Government"], ttps: ["T1566.001", "T1059.001", "T1003.001", "T1070.004", "T1133"], tools: ["TURNEDUP", "NANOCORE", "NETWIRE", "StoneDrill"], active: true, riskLevel: "high" },
  ];

  const scenarios = [
    { id: "s1", name: "Initial Access via Spearphishing", aptGroup: "APT29", phase: "Initial Access", status: "ready", progress: 0, techniques: ["T1566.001", "T1204.002"] },
    { id: "s2", name: "Privilege Escalation Chain", aptGroup: "APT28", phase: "Privilege Escalation", status: "ready", progress: 0, techniques: ["T1055", "T1134", "T1548.002"] },
    { id: "s3", name: "Lateral Movement Campaign", aptGroup: "APT41", phase: "Lateral Movement", status: "ready", progress: 0, techniques: ["T1021.002", "T1021.001", "T1550.002"] },
    { id: "s4", name: "Data Exfiltration Simulation", aptGroup: "Lazarus", phase: "Exfiltration", status: "ready", progress: 0, techniques: ["T1041", "T1567.002", "T1048.003"] },
    { id: "s5", name: "Full Kill Chain Emulation", aptGroup: "APT29", phase: "Full Chain", status: "ready", progress: 0, techniques: ["T1566", "T1059", "T1055", "T1003", "T1041"] },
  ];

  const killChainPhases = [
    { phase: "Reconnaissance", techniques: 3, coverage: 85, status: "mapped" },
    { phase: "Weaponization", techniques: 2, coverage: 70, status: "mapped" },
    { phase: "Delivery", techniques: 4, coverage: 90, status: "mapped" },
    { phase: "Exploitation", techniques: 5, coverage: 75, status: "partial" },
    { phase: "Installation", techniques: 3, coverage: 60, status: "partial" },
    { phase: "Command & Control", techniques: 4, coverage: 95, status: "mapped" },
    { phase: "Actions on Objectives", techniques: 6, coverage: 80, status: "mapped" },
  ];

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = { critical: "bg-red-500/20 text-red-400 border-red-500/30", high: "bg-orange-500/20 text-orange-400 border-orange-500/30", medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return colors[level] || colors.medium;
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center"><Skull className="w-4 h-4 text-destructive" /></div>
          <div>
            <h3 className="text-sm font-semibold">APT Emulation Framework</h3>
            <p className="text-xs text-text-muted">Adversary Behavior Emulation</p>
          </div>
        </div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {activeTab === "groups" && (
            <div className="flex h-full">
              <div className="w-1/2 border-r border-border pr-2 space-y-2">
                {aptGroups.map((group) => (
                  <div key={group.id} onClick={() => setSelectedGroup(group)} className={`p-2.5 rounded border cursor-pointer transition-colors ${selectedGroup?.id === group.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"}`}>
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold">{group.name}</span><Badge className={`h-4 text-xs ${getRiskBadge(group.riskLevel)}`}>{group.riskLevel}</Badge></div>
                    <div className="text-xs text-text-muted mb-1">{group.origin}</div>
                    <div className="flex flex-wrap gap-1">{group.targetSectors.slice(0, 3).map((s) => <Badge key={s} variant="outline" className="h-4 text-xs">{s}</Badge>)}</div>
                  </div>
                ))}
              </div>
              <div className="flex-1 pl-2">
                {selectedGroup ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">{selectedGroup.name}</h4>
                    <div className="text-xs text-text-muted">Aliases: {selectedGroup.aliases.join(", ")}</div>
                    <div><div className="text-xs text-text-muted uppercase mb-1">TTPs</div><div className="flex flex-wrap gap-1">{selectedGroup.ttps.map((t) => <Badge key={t} variant="outline" className="h-5 text-xs font-mono">{t}</Badge>)}</div></div>
                    <div><div className="text-xs text-text-muted uppercase mb-1">Tooling</div><div className="flex flex-wrap gap-1">{selectedGroup.tools.map((t) => <Badge key={t} className="h-5 text-xs bg-destructive/20 text-destructive border-destructive/30">{t}</Badge>)}</div></div>
                    <button className="w-full h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs font-medium flex items-center justify-center gap-1.5"><Play className="w-3 h-3" />Start Emulation</button>
                  </div>
                ) : <div className="flex items-center justify-center h-full text-xs text-text-muted">Select a threat actor</div>}
              </div>
            </div>
          )}

          {activeTab === "scenarios" && scenarios.map((s) => (
            <div key={s.id} className="p-2.5 bg-sidebar-bg rounded border border-border">
              <div className="flex items-center justify-between mb-2">
                <div><div className="text-xs font-semibold">{s.name}</div><div className="text-xs text-text-muted">{s.aptGroup} • {s.phase}</div></div>
                <button className="h-6 px-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs flex items-center gap-1"><Play className="w-3 h-3" />Run</button>
              </div>
              <div className="flex flex-wrap gap-1">{s.techniques.map((t) => <Badge key={t} variant="outline" className="h-4 text-xs font-mono">{t}</Badge>)}</div>
            </div>
          ))}

          {activeTab === "running" && <div className="flex items-center justify-center h-32 text-xs text-text-muted">No active emulations. Start a scenario to begin.</div>}

          {activeTab === "killchain" && killChainPhases.map((phase, i) => (
            <div key={i} className="p-2.5 bg-sidebar-bg rounded border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{phase.phase}</span>
                <Badge className={`h-4 text-xs ${phase.status === "mapped" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{phase.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>{phase.techniques} techniques</span>
                <span>{phase.coverage}% coverage</span>
              </div>
              <Progress value={phase.coverage} className="h-1" />
            </div>
          ))}

          {activeTab === "reports" && (
            <div className="space-y-2">
              {["APT29 Emulation Report — 2024-Q4", "Lateral Movement Assessment", "Full Kill Chain Summary"].map((r, i) => (
                <div key={i} className="p-2.5 bg-sidebar-bg rounded border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-text-muted" /><span className="text-xs">{r}</span></div>
                  <Download className="w-3 h-3 text-text-muted" />
                </div>
              ))}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "Emulations Run", val: "14" }, { label: "Techniques Tested", val: "87" }, { label: "Detection Rate", val: "62%", color: "text-yellow-500" }, { label: "MITRE Coverage", val: "73%" }].map((s) => (
                <div key={s.label} className="p-2.5 bg-sidebar-bg rounded border border-border text-center">
                  <div className={`text-lg font-bold ${s.color || "text-primary"}`}>{s.val}</div>
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

export default APTEmulationPanel;
