import { useState } from "react";
import { Skull, Shield, Play, Square, Eye, AlertTriangle, Target, Zap, Radio, Globe, Lock, Users, Clock, ChevronRight, Activity, FileText, Download, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface APTGroup {
  id: string;
  name: string;
  aliases: string[];
  origin: string;
  targetSectors: string[];
  ttps: string[];
  tools: string[];
  active: boolean;
  riskLevel: "critical" | "high" | "medium";
}

interface EmulationScenario {
  id: string;
  name: string;
  aptGroup: string;
  phase: string;
  status: "ready" | "running" | "complete" | "failed";
  progress: number;
  techniques: string[];
}

const APTEmulationPanel = () => {
  const [activeEmulation, setActiveEmulation] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<APTGroup | null>(null);

  const aptGroups: APTGroup[] = [
    {
      id: "apt29",
      name: "APT29 (Cozy Bear)",
      aliases: ["The Dukes", "Cozy Duke", "YTTRIUM"],
      origin: "Russia (SVR)",
      targetSectors: ["Government", "Defense", "Energy", "Healthcare"],
      ttps: ["T1566.001", "T1059.001", "T1055", "T1036", "T1027"],
      tools: ["SUNBURST", "Cobalt Strike", "TEARDROP", "mimikatz"],
      active: true,
      riskLevel: "critical"
    },
    {
      id: "apt28",
      name: "APT28 (Fancy Bear)",
      aliases: ["Sofacy", "Pawn Storm", "STRONTIUM"],
      origin: "Russia (GRU)",
      targetSectors: ["Government", "Military", "Media", "Political"],
      ttps: ["T1566.002", "T1059.003", "T1547.001", "T1003", "T1048"],
      tools: ["X-Agent", "Zebrocy", "LoJax", "Seduploader"],
      active: true,
      riskLevel: "critical"
    },
    {
      id: "apt41",
      name: "APT41 (Double Dragon)",
      aliases: ["Winnti Group", "BARIUM", "Wicked Panda"],
      origin: "China (MSS)",
      targetSectors: ["Technology", "Gaming", "Healthcare", "Telecom"],
      ttps: ["T1195.002", "T1059.001", "T1055.012", "T1574.001", "T1497"],
      tools: ["ShadowPad", "PlugX", "Winnti", "MESSAGETAP"],
      active: true,
      riskLevel: "critical"
    },
    {
      id: "lazarus",
      name: "Lazarus Group",
      aliases: ["Hidden Cobra", "ZINC", "Guardians of Peace"],
      origin: "North Korea (RGB)",
      targetSectors: ["Financial", "Cryptocurrency", "Defense", "Entertainment"],
      ttps: ["T1566.001", "T1059.007", "T1055.001", "T1486", "T1565.001"],
      tools: ["HOPLIGHT", "ELECTRICFISH", "AppleJeus", "FastCash"],
      active: true,
      riskLevel: "critical"
    },
    {
      id: "apt33",
      name: "APT33 (Elfin)",
      aliases: ["Magnallium", "Refined Kitten", "HOLMIUM"],
      origin: "Iran (IRGC)",
      targetSectors: ["Aviation", "Energy", "Petrochemical", "Government"],
      ttps: ["T1566.001", "T1059.001", "T1003.001", "T1070.004", "T1133"],
      tools: ["TURNEDUP", "NANOCORE", "NETWIRE", "StoneDrill"],
      active: true,
      riskLevel: "high"
    },
  ];

  const scenarios: EmulationScenario[] = [
    { id: "s1", name: "Initial Access via Spearphishing", aptGroup: "APT29", phase: "Initial Access", status: "ready", progress: 0, techniques: ["T1566.001", "T1204.002"] },
    { id: "s2", name: "Privilege Escalation Chain", aptGroup: "APT28", phase: "Privilege Escalation", status: "ready", progress: 0, techniques: ["T1055", "T1134", "T1548.002"] },
    { id: "s3", name: "Lateral Movement Campaign", aptGroup: "APT41", phase: "Lateral Movement", status: "ready", progress: 0, techniques: ["T1021.002", "T1021.001", "T1550.002"] },
    { id: "s4", name: "Data Exfiltration Simulation", aptGroup: "Lazarus", phase: "Exfiltration", status: "ready", progress: 0, techniques: ["T1041", "T1567.002", "T1048.003"] },
    { id: "s5", name: "Full Kill Chain Emulation", aptGroup: "APT29", phase: "Full Chain", status: "ready", progress: 0, techniques: ["T1566", "T1059", "T1055", "T1003", "T1041"] },
  ];

  const getRiskBadge = (level: string) => {
    const colors = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center">
            <Skull className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">APT Emulation Framework</h3>
            <p className="text-xs text-text-muted">Adversary Behavior Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>SIMULATION MODE - All actions are emulated and logged. No actual malicious activity.</span>
        </div>
      </div>

      <Tabs defaultValue="groups" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 h-8 bg-transparent border-b border-border rounded-none justify-start flex-shrink-0">
          <TabsTrigger value="groups" className="text-xs h-6 data-[state=active]:bg-primary/20">Threat Actors</TabsTrigger>
          <TabsTrigger value="scenarios" className="text-xs h-6 data-[state=active]:bg-primary/20">Scenarios</TabsTrigger>
          <TabsTrigger value="running" className="text-xs h-6 data-[state=active]:bg-primary/20">Active Emulations</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="flex-1 p-0 mt-0 overflow-hidden flex">
          <ScrollArea className="w-1/2 border-r border-border">
            <div className="p-2 space-y-2">
              {aptGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-2.5 rounded border cursor-pointer transition-colors ${
                    selectedGroup?.id === group.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{group.name}</span>
                    <Badge className={`h-4 text-xs ${getRiskBadge(group.riskLevel)}`}>{group.riskLevel}</Badge>
                  </div>
                  <div className="text-xs text-text-muted mb-1">{group.origin}</div>
                  <div className="flex flex-wrap gap-1">
                    {group.targetSectors.slice(0, 3).map((sector) => (
                      <Badge key={sector} variant="outline" className="h-4 text-xs">{sector}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex-1 p-3 overflow-auto">
            {selectedGroup ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">{selectedGroup.name}</h4>
                  <div className="text-xs text-text-muted mb-1">Aliases: {selectedGroup.aliases.join(", ")}</div>
                  <div className="text-xs text-text-muted">Attribution: {selectedGroup.origin}</div>
                </div>

                <div>
                  <div className="text-xs text-text-muted uppercase mb-2">Target Sectors</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedGroup.targetSectors.map((sector) => (
                      <Badge key={sector} variant="secondary" className="h-5 text-xs">{sector}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-muted uppercase mb-2">MITRE ATT&CK TTPs</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedGroup.ttps.map((ttp) => (
                      <Badge key={ttp} variant="outline" className="h-5 text-xs font-mono">{ttp}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-muted uppercase mb-2">Known Tooling</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedGroup.tools.map((tool) => (
                      <Badge key={tool} className="h-5 text-xs bg-destructive/20 text-destructive border-destructive/30">{tool}</Badge>
                    ))}
                  </div>
                </div>

                <button className="w-full h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs font-medium flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" />
                  Start {selectedGroup.name.split(' ')[0]} Emulation
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-muted">
                Select a threat actor to view details
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-2">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="p-2.5 bg-sidebar-bg rounded border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-semibold">{scenario.name}</div>
                    <div className="text-xs text-text-muted">{scenario.aptGroup} • {scenario.phase}</div>
                  </div>
                  <button className="h-6 px-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Run
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {scenario.techniques.map((tech) => (
                    <Badge key={tech} variant="outline" className="h-4 text-xs font-mono">{tech}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="running" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="flex items-center justify-center h-full text-xs text-text-muted">
            No active emulations. Start a scenario to begin.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APTEmulationPanel;
