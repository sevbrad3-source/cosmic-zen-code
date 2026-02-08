import { useState } from "react";
import { BookOpen, Play, CheckCircle, Clock, AlertTriangle, ChevronRight, Plus, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Playbook {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: number;
  avgDuration: string;
  lastUsed: string;
  timesExecuted: number;
  successRate: number;
  automated: boolean;
}

const PlaybooksPage = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);

  const playbooks: Playbook[] = [
    { id: "pb-001", name: "Ransomware Response", category: "Malware", description: "Immediate containment and recovery steps for ransomware incidents", steps: 12, avgDuration: "4h", lastUsed: "2d ago", timesExecuted: 8, successRate: 92, automated: true },
    { id: "pb-002", name: "Phishing Investigation", category: "Email", description: "Analyze and contain phishing campaigns", steps: 8, avgDuration: "1h", lastUsed: "6h ago", timesExecuted: 45, successRate: 98, automated: true },
    { id: "pb-003", name: "Data Breach Response", category: "Data Loss", description: "Complete response workflow for data breach incidents", steps: 18, avgDuration: "24h", lastUsed: "1w ago", timesExecuted: 3, successRate: 100, automated: false },
    { id: "pb-004", name: "Insider Threat Investigation", category: "Insider", description: "Investigation steps for potential insider threats", steps: 15, avgDuration: "8h", lastUsed: "3d ago", timesExecuted: 12, successRate: 85, automated: false },
    { id: "pb-005", name: "DDoS Mitigation", category: "Network", description: "Rapid response for DDoS attacks", steps: 6, avgDuration: "30m", lastUsed: "1d ago", timesExecuted: 22, successRate: 95, automated: true },
    { id: "pb-006", name: "Account Compromise", category: "Identity", description: "Respond to compromised user accounts", steps: 10, avgDuration: "2h", lastUsed: "12h ago", timesExecuted: 67, successRate: 97, automated: true },
  ];

  const playbookSteps = [
    { name: "Initial Triage", status: "completed", automated: true },
    { name: "Scope Assessment", status: "completed", automated: true },
    { name: "Containment Actions", status: "in-progress", automated: false },
    { name: "Evidence Preservation", status: "pending", automated: true },
    { name: "Threat Removal", status: "pending", automated: false },
    { name: "Recovery", status: "pending", automated: false },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{playbooks.length}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Playbooks</div>
        </div>
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{playbooks.filter(p => p.automated).length}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Automated</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">94%</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Avg Success</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">IR PLAYBOOKS</span>
        <Button size="sm" className="h-7 text-xs bg-[hsl(210,100%,30%)]">
          <Plus className="w-3 h-3 mr-1" /> Create
        </Button>
      </div>

      {/* Playbooks List */}
      <div className="space-y-2">
        {playbooks.map((pb) => (
          <div
            key={pb.id}
            onClick={() => setSelectedPlaybook(selectedPlaybook === pb.id ? null : pb.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedPlaybook === pb.id
                ? "bg-[hsl(210,100%,12%)] border-[hsl(210,100%,40%)]"
                : "bg-[hsl(210,100%,7%)] border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[hsl(210,100%,60%)]" />
                <div>
                  <div className="text-sm font-medium text-[hsl(210,100%,85%)]">{pb.name}</div>
                  <div className="text-[10px] text-[hsl(210,60%,50%)]">{pb.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {pb.automated && (
                  <Badge className="text-[9px] bg-[hsl(120,100%,25%)] text-[hsl(120,100%,85%)]">
                    Auto
                  </Badge>
                )}
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedPlaybook === pb.id ? "rotate-90" : ""} text-[hsl(210,60%,40%)]`} />
              </div>
            </div>

            <p className="text-[10px] text-[hsl(210,60%,55%)] mb-2">{pb.description}</p>

            <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
              <div className="flex items-center gap-3">
                <span>{pb.steps} steps</span>
                <span>~{pb.avgDuration}</span>
              </div>
              <span>Used {pb.timesExecuted}x</span>
            </div>

            {/* Expanded View */}
            {selectedPlaybook === pb.id && (
              <div className="mt-3 pt-3 border-t border-[hsl(210,100%,15%)] space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(210,60%,50%)]">Success Rate</span>
                  <span className="text-[hsl(120,100%,55%)]">{pb.successRate}%</span>
                </div>
                <Progress value={pb.successRate} className="h-1.5" />
                
                <div className="text-[10px] text-[hsl(210,60%,50%)]">Steps Preview:</div>
                <div className="space-y-1">
                  {playbookSteps.slice(0, 4).map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      {step.status === "completed" ? (
                        <CheckCircle className="w-3 h-3 text-[hsl(120,100%,45%)]" />
                      ) : step.status === "in-progress" ? (
                        <div className="w-3 h-3 border-2 border-[hsl(210,100%,50%)] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-3 h-3 border border-[hsl(210,60%,30%)] rounded-full" />
                      )}
                      <span className={step.status === "pending" ? "text-[hsl(210,60%,40%)]" : "text-[hsl(210,100%,80%)]"}>
                        {step.name}
                      </span>
                      {step.automated && <Badge variant="outline" className="text-[8px] h-3 px-1">Auto</Badge>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-7 text-[10px] bg-[hsl(210,100%,35%)]">
                    <Play className="w-3 h-3 mr-1" /> Execute
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] border-[hsl(210,100%,30%)]">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaybooksPage;
