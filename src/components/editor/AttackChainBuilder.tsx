import { useState } from "react";
import { Plus, Play, Save, Trash2, ChevronRight, Zap, Target, Shield, Database, Upload, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChainStep {
  id: string;
  phase: string;
  technique: string;
  tool: string;
  status: "pending" | "ready" | "running" | "completed" | "failed";
}

const AttackChainBuilder = () => {
  const [chain, setChain] = useState<ChainStep[]>([
    { id: "1", phase: "Reconnaissance", technique: "T1595 - Active Scanning", tool: "nmap", status: "completed" },
    { id: "2", phase: "Initial Access", technique: "T1190 - Exploit Public App", tool: "metasploit", status: "completed" },
    { id: "3", phase: "Execution", technique: "T1059.001 - PowerShell", tool: "custom", status: "running" },
    { id: "4", phase: "Persistence", technique: "T1053.005 - Scheduled Task", tool: "schtasks", status: "ready" },
    { id: "5", phase: "Privilege Escalation", technique: "T1548.002 - UAC Bypass", tool: "UACME", status: "pending" },
    { id: "6", phase: "Credential Access", technique: "T1003.001 - LSASS Memory", tool: "mimikatz", status: "pending" },
    { id: "7", phase: "Lateral Movement", technique: "T1021.002 - SMB Shares", tool: "psexec", status: "pending" },
    { id: "8", phase: "Exfiltration", technique: "T1048.003 - Over C2", tool: "custom", status: "pending" },
  ]);

  const phases = [
    { name: "Reconnaissance", icon: Target, color: "hsl(210,100%,50%)" },
    { name: "Initial Access", icon: Zap, color: "hsl(30,100%,50%)" },
    { name: "Execution", icon: Play, color: "hsl(45,100%,50%)" },
    { name: "Persistence", icon: Link, color: "hsl(280,100%,50%)" },
    { name: "Privilege Escalation", icon: ChevronRight, color: "hsl(0,100%,50%)" },
    { name: "Credential Access", icon: Database, color: "hsl(330,100%,50%)" },
    { name: "Lateral Movement", icon: ChevronRight, color: "hsl(180,100%,40%)" },
    { name: "Exfiltration", icon: Upload, color: "hsl(120,100%,40%)" },
  ];

  const getPhaseColor = (phase: string) => {
    const p = phases.find((ph) => ph.name === phase);
    return p?.color || "hsl(210,100%,50%)";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[hsl(120,100%,20%)] border-[hsl(120,100%,40%)] text-[hsl(120,100%,70%)]";
      case "running":
        return "bg-[hsl(45,100%,15%)] border-[hsl(45,100%,50%)] text-[hsl(45,100%,70%)] animate-pulse";
      case "ready":
        return "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)] text-[hsl(210,100%,70%)]";
      case "failed":
        return "bg-[hsl(0,100%,15%)] border-[hsl(0,100%,40%)] text-[hsl(0,100%,70%)]";
      default:
        return "bg-[hsl(210,50%,10%)] border-[hsl(210,50%,25%)] text-[hsl(210,50%,50%)]";
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Header */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-panel-bg">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Attack Chain Builder</span>
          <Badge variant="outline" className="text-[10px]">SIMULATION MODE</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs bg-primary hover:bg-primary-hover rounded text-primary-foreground flex items-center gap-1">
            <Play className="w-3 h-3" /> Execute Chain
          </button>
          <button className="px-3 py-1 text-xs bg-sidebar-hover hover:bg-sidebar-active rounded flex items-center gap-1">
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="px-4 py-2 bg-[hsl(45,100%,10%)] border-b border-[hsl(45,100%,30%)] flex items-center gap-2">
        <Shield className="w-4 h-4 text-[hsl(45,100%,60%)]" />
        <span className="text-xs text-[hsl(45,100%,70%)]">
          SAFE SIMULATION - All attack techniques are executed in a controlled VM environment. No actual system compromise occurs.
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Visual Chain */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {chain.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`p-3 rounded border-2 min-w-[120px] cursor-pointer transition-all hover:scale-105 ${getStatusStyle(step.status)}`}
              >
                <div className="text-[10px] font-semibold uppercase" style={{ color: getPhaseColor(step.phase) }}>
                  {step.phase}
                </div>
                <div className="text-xs mt-1 truncate">{step.technique.split(" - ")[1]}</div>
                <div className="text-[10px] text-text-muted mt-1">{step.tool}</div>
              </div>
              {i < chain.length - 1 && (
                <ChevronRight className="w-5 h-5 text-text-muted mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
          <button className="p-3 border-2 border-dashed border-border rounded hover:border-primary transition-colors flex-shrink-0">
            <Plus className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Detailed Step List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Chain Steps</h3>
          {chain.map((step, index) => (
            <div
              key={step.id}
              className="p-3 bg-panel-bg border border-border rounded hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sidebar-active flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: getPhaseColor(step.phase) }}>
                        {step.phase}
                      </span>
                      <span className="text-xs text-text-secondary">{step.technique}</span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">Tool: {step.tool}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] ${getStatusStyle(step.status)}`}>
                    {step.status}
                  </Badge>
                  <button className="p-1 hover:bg-sidebar-hover rounded">
                    <Trash2 className="w-3 h-3 text-text-muted hover:text-[hsl(0,100%,60%)]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Step Panel */}
        <div className="mt-4 p-4 border-2 border-dashed border-border rounded">
          <h4 className="text-xs font-semibold text-text-secondary mb-3">Add New Step</h4>
          <div className="grid grid-cols-4 gap-2">
            {phases.map((phase) => (
              <button
                key={phase.name}
                className="p-2 bg-sidebar-bg hover:bg-sidebar-hover border border-border rounded text-xs text-center transition-colors"
                style={{ borderColor: phase.color }}
              >
                <phase.icon className="w-4 h-4 mx-auto mb-1" style={{ color: phase.color }} />
                {phase.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="h-8 px-4 flex items-center justify-between border-t border-border bg-statusbar-bg text-[10px] text-text-muted">
        <span>{chain.length} steps in chain</span>
        <span>{chain.filter((s) => s.status === "completed").length} completed</span>
        <span>Est. time: 45 min</span>
      </div>
    </div>
  );
};

export default AttackChainBuilder;
