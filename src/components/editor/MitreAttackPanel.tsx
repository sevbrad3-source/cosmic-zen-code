import { Shield, Target, TrendingUp, Activity, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const MitreAttackPanel = () => {
  const [activeView, setActiveView] = useState<"tactics" | "techniques" | "adversary">("tactics");

  const tactics = [
    { id: "TA0001", name: "Initial Access", techniques: 9, covered: 7, color: "bg-red-500" },
    { id: "TA0002", name: "Execution", techniques: 12, covered: 10, color: "bg-orange-500" },
    { id: "TA0003", name: "Persistence", techniques: 19, covered: 12, color: "bg-yellow-500" },
    { id: "TA0004", name: "Privilege Escalation", techniques: 13, covered: 8, color: "bg-green-500" },
    { id: "TA0005", name: "Defense Evasion", techniques: 42, covered: 18, color: "bg-cyan-500" },
    { id: "TA0006", name: "Credential Access", techniques: 17, covered: 11, color: "bg-blue-500" },
    { id: "TA0007", name: "Discovery", techniques: 29, covered: 22, color: "bg-purple-500" },
    { id: "TA0008", name: "Lateral Movement", techniques: 9, covered: 6, color: "bg-pink-500" },
    { id: "TA0009", name: "Collection", techniques: 17, covered: 9, color: "bg-indigo-500" },
    { id: "TA0010", name: "Exfiltration", techniques: 9, covered: 5, color: "bg-teal-500" },
    { id: "TA0011", name: "Command and Control", techniques: 16, covered: 12, color: "bg-lime-500" },
    { id: "TA0040", name: "Impact", techniques: 13, covered: 7, color: "bg-rose-500" },
  ];

  const techniques = [
    { id: "T1566", name: "Phishing", tactic: "Initial Access", status: "tested", difficulty: "medium" },
    { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution", status: "tested", difficulty: "easy" },
    { id: "T1547", name: "Boot or Logon Autostart Execution", tactic: "Persistence", status: "covered", difficulty: "medium" },
    { id: "T1548", name: "Abuse Elevation Control Mechanism", tactic: "Privilege Escalation", status: "tested", difficulty: "hard" },
    { id: "T1055", name: "Process Injection", tactic: "Defense Evasion", status: "tested", difficulty: "hard" },
    { id: "T1003", name: "OS Credential Dumping", tactic: "Credential Access", status: "tested", difficulty: "medium" },
    { id: "T1082", name: "System Information Discovery", tactic: "Discovery", status: "covered", difficulty: "easy" },
    { id: "T1021", name: "Remote Services", tactic: "Lateral Movement", status: "tested", difficulty: "medium" },
  ];

  const adversaryProfiles = [
    { 
      name: "APT28 (Fancy Bear)", 
      country: "Russia",
      sophistication: "Advanced",
      tactics: ["TA0001", "TA0002", "TA0005", "TA0006", "TA0011"],
      coverage: 78
    },
    { 
      name: "APT29 (Cozy Bear)", 
      country: "Russia",
      sophistication: "Advanced",
      tactics: ["TA0001", "TA0003", "TA0005", "TA0006", "TA0009"],
      coverage: 72
    },
    { 
      name: "Lazarus Group", 
      country: "North Korea",
      sophistication: "Advanced",
      tactics: ["TA0001", "TA0002", "TA0006", "TA0009", "TA0010"],
      coverage: 65
    },
    { 
      name: "APT41", 
      country: "China",
      sophistication: "Advanced",
      tactics: ["TA0001", "TA0003", "TA0004", "TA0006", "TA0008"],
      coverage: 82
    },
  ];

  return (
    <div className="h-full flex flex-col bg-panel-bg text-text-primary overflow-hidden">
      {/* Safety Banner */}
      <div className="bg-blue-900/20 border-b border-blue-700/50 px-4 py-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-500" />
        <span className="text-xs text-blue-400 font-medium">
          EDUCATIONAL FRAMEWORK: MITRE ATT&CK Technique Mapping and Adversary Emulation Training
        </span>
      </div>

      {/* Header */}
      <div className="border-b border-panel-border px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold">MITRE ATT&CK Framework</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("tactics")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeView === "tactics"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Tactics Overview
          </button>
          <button
            onClick={() => setActiveView("techniques")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeView === "techniques"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Technique Coverage
          </button>
          <button
            onClick={() => setActiveView("adversary")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeView === "adversary"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Adversary Emulation
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {activeView === "tactics" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">Attack Lifecycle Coverage</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {tactics.map((tactic) => {
                  const coverage = (tactic.covered / tactic.techniques) * 100;
                  return (
                    <Card key={tactic.id} className="bg-sidebar-bg border-border p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tactic.color}`} />
                          <div>
                            <div className="text-sm font-medium text-text-primary">{tactic.name}</div>
                            <div className="text-xs text-text-muted">{tactic.id}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tactic.covered}/{tactic.techniques}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Coverage</span>
                          <span className="text-text-primary font-medium">{Math.round(coverage)}%</span>
                        </div>
                        <Progress value={coverage} className="h-1.5" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold">Overall Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Total Techniques</div>
                  <div className="text-lg font-semibold text-text-primary">205</div>
                </div>
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Covered</div>
                  <div className="text-lg font-semibold text-green-400">127</div>
                </div>
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Tested</div>
                  <div className="text-lg font-semibold text-blue-400">89</div>
                </div>
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Coverage</div>
                  <div className="text-lg font-semibold text-purple-400">62%</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "techniques" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold">Technique Implementation Status</h3>
              </div>
              <div className="space-y-2">
                {techniques.map((tech) => (
                  <Card key={tech.id} className="bg-sidebar-bg border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        {tech.status === "tested" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-blue-400 mt-0.5" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-text-primary">{tech.name}</div>
                          <div className="text-xs text-text-muted">{tech.id} • {tech.tactic}</div>
                        </div>
                      </div>
                      <Badge 
                        variant={tech.status === "tested" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {tech.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-text-secondary">Difficulty: {tech.difficulty}</span>
                      <button className="px-2 py-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                        View Details
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <h3 className="text-sm font-semibold mb-2">Legend</h3>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-text-secondary">Tested: Actively simulated and validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 text-blue-400" />
                  <span className="text-text-secondary">Covered: Documentation exists, not tested</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "adversary" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold">Threat Actor Emulation Plans</h3>
              </div>
              <div className="space-y-3">
                {adversaryProfiles.map((adversary, idx) => (
                  <Card key={idx} className="bg-sidebar-bg border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{adversary.name}</div>
                        <div className="text-xs text-text-muted">{adversary.country} • {adversary.sophistication}</div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {adversary.coverage}% match
                      </Badge>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="text-xs text-text-secondary">Primary Tactics:</div>
                      <div className="flex flex-wrap gap-1">
                        {adversary.tactics.map((tacticId) => {
                          const tactic = tactics.find(t => t.id === tacticId);
                          return (
                            <Badge key={tacticId} variant="outline" className="text-xs">
                              {tactic?.name}
                            </Badge>
                          );
                        })}
                      </div>
                      <Progress value={adversary.coverage} className="h-1.5 mt-2" />
                      <button className="w-full mt-2 px-2 py-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                        Load Emulation Plan
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <h3 className="text-sm font-semibold mb-2">Campaign Planning</h3>
              <div className="space-y-2 text-xs">
                <button className="w-full p-2 bg-sidebar-bg hover:bg-sidebar-hover rounded text-left text-text-primary">
                  Create Custom Adversary Profile
                </button>
                <button className="w-full p-2 bg-sidebar-bg hover:bg-sidebar-hover rounded text-left text-text-primary">
                  Import MITRE Navigator Layer
                </button>
                <button className="w-full p-2 bg-sidebar-bg hover:bg-sidebar-hover rounded text-left text-text-primary">
                  Generate Gap Analysis Report
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-panel-border px-4 py-2 bg-statusbar-bg">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>MITRE ATT&CK Enterprise v14.1</span>
          <span className="text-blue-400">Framework Loaded</span>
        </div>
      </div>
    </div>
  );
};

export default MitreAttackPanel;