import { useState } from "react";
import { Shield, Plus, Play, Pause, Settings, AlertTriangle, CheckCircle, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface DetectionRule {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  enabled: boolean;
  hits24h: number;
  lastHit: string;
  mitre: string[];
  author: string;
}

const DetectionRulesPage = () => {
  const [rules, setRules] = useState<DetectionRule[]>([
    { id: "1", name: "Mimikatz Execution", description: "Detects Mimikatz execution via command line or process creation", category: "Credential Access", severity: "critical", enabled: true, hits24h: 3, lastHit: "2h ago", mitre: ["T1003.001"], author: "Sigma" },
    { id: "2", name: "Suspicious PowerShell Encoding", description: "PowerShell with Base64 encoded commands", category: "Execution", severity: "high", enabled: true, hits24h: 12, lastHit: "30m ago", mitre: ["T1059.001"], author: "Custom" },
    { id: "3", name: "LSASS Memory Dump", description: "Process accessing LSASS memory", category: "Credential Access", severity: "critical", enabled: true, hits24h: 1, lastHit: "1d ago", mitre: ["T1003.001"], author: "Sigma" },
    { id: "4", name: "Scheduled Task Creation", description: "New scheduled task created via schtasks", category: "Persistence", severity: "medium", enabled: true, hits24h: 5, lastHit: "4h ago", mitre: ["T1053.005"], author: "Custom" },
    { id: "5", name: "Remote Service Installation", description: "Service installed on remote system", category: "Lateral Movement", severity: "high", enabled: false, hits24h: 0, lastHit: "3d ago", mitre: ["T1021.002"], author: "MSTIC" },
    { id: "6", name: "DNS Tunneling Pattern", description: "Unusual DNS query patterns indicating tunneling", category: "Command and Control", severity: "high", enabled: true, hits24h: 8, lastHit: "1h ago", mitre: ["T1071.004"], author: "Custom" },
  ]);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "bg-[hsl(0,100%,35%)] text-white";
      case "high": return "bg-[hsl(30,100%,35%)] text-white";
      case "medium": return "bg-[hsl(45,100%,35%)] text-black";
      default: return "bg-[hsl(210,60%,30%)] text-white";
    }
  };

  const stats = {
    total: rules.length,
    enabled: rules.filter(r => r.enabled).length,
    hits: rules.reduce((acc, r) => acc + r.hits24h, 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{stats.total}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Total Rules</div>
        </div>
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.enabled}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Enabled</div>
        </div>
        <div className="p-2 bg-[hsl(30,100%,10%)] border border-[hsl(30,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">{stats.hits}</div>
          <div className="text-[9px] text-[hsl(30,60%,50%)]">Hits 24h</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">DETECTION RULES</span>
        <Button size="sm" className="h-7 text-xs bg-[hsl(210,100%,30%)]">
          <Plus className="w-3 h-3 mr-1" /> New Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-3 rounded-lg border transition-colors ${
              rule.enabled
                ? "bg-[hsl(210,100%,7%)] border-[hsl(210,100%,18%)]"
                : "bg-[hsl(210,50%,5%)] border-[hsl(210,50%,12%)] opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${rule.enabled ? "text-[hsl(210,100%,85%)]" : "text-[hsl(210,60%,50%)]"}`}>
                    {rule.name}
                  </span>
                  <Badge className={`text-[9px] ${getSeverityColor(rule.severity)}`}>
                    {rule.severity}
                  </Badge>
                </div>
                <p className="text-[10px] text-[hsl(210,60%,50%)]">{rule.description}</p>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[9px] border-[hsl(210,100%,25%)]">{rule.category}</Badge>
              {rule.mitre.map((m, i) => (
                <Badge key={i} className="text-[8px] bg-[hsl(270,100%,25%)]">{m}</Badge>
              ))}
              <Badge variant="outline" className="text-[8px] border-[hsl(210,60%,30%)]">{rule.author}</Badge>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[hsl(210,60%,50%)]">
              <div className="flex items-center gap-3">
                <span>{rule.hits24h} hits today</span>
                <span>Last: {rule.lastHit}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectionRulesPage;
