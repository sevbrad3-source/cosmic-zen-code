import { useState } from "react";
import { Activity, Plus, Play, Pause, Settings, Shield, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

interface BehavioralRule {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  severity: "critical" | "high" | "medium" | "low";
  detections24h: number;
  falsePositiveRate: number;
  mitreMapping: string[];
  lastTriggered: string;
}

const BehavioralRulesPage = () => {
  const [rules, setRules] = useState<BehavioralRule[]>([
    {
      id: "1",
      name: "Unusual Admin Logon Time",
      description: "Detects administrator account logins outside normal business hours",
      category: "Authentication",
      enabled: true,
      severity: "medium",
      detections24h: 12,
      falsePositiveRate: 8,
      mitreMapping: ["T1078"],
      lastTriggered: "15m ago"
    },
    {
      id: "2",
      name: "Process Injection Pattern",
      description: "Identifies suspicious process injection techniques via CreateRemoteThread or NtMapViewOfSection",
      category: "Defense Evasion",
      enabled: true,
      severity: "critical",
      detections24h: 3,
      falsePositiveRate: 2,
      mitreMapping: ["T1055.001", "T1055.003"],
      lastTriggered: "2h ago"
    },
    {
      id: "3",
      name: "Rapid Failed Auth Attempts",
      description: "Multiple failed authentication attempts from single source within short timeframe",
      category: "Credential Access",
      enabled: true,
      severity: "high",
      detections24h: 47,
      falsePositiveRate: 15,
      mitreMapping: ["T1110.001"],
      lastTriggered: "5m ago"
    },
    {
      id: "4",
      name: "LSASS Memory Access",
      description: "Detects processes accessing LSASS memory for credential dumping",
      category: "Credential Access",
      enabled: true,
      severity: "critical",
      detections24h: 1,
      falsePositiveRate: 1,
      mitreMapping: ["T1003.001"],
      lastTriggered: "1d ago"
    },
    {
      id: "5",
      name: "Lateral Movement Signature",
      description: "SMB session followed by service creation on remote host",
      category: "Lateral Movement",
      enabled: false,
      severity: "high",
      detections24h: 0,
      falsePositiveRate: 5,
      mitreMapping: ["T1021.002", "T1543.003"],
      lastTriggered: "3d ago"
    },
    {
      id: "6",
      name: "Data Staging Detection",
      description: "Large archive file creation in temp directories",
      category: "Collection",
      enabled: true,
      severity: "medium",
      detections24h: 8,
      falsePositiveRate: 25,
      mitreMapping: ["T1074.001", "T1560.001"],
      lastTriggered: "45m ago"
    }
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
    triggeredToday: rules.reduce((acc, r) => acc + r.detections24h, 0),
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
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">{stats.triggeredToday}</div>
          <div className="text-[9px] text-[hsl(30,60%,50%)]">Detections 24h</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">BEHAVIORAL RULES</span>
        </div>
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
                <p className="text-[10px] text-[hsl(210,60%,50%)] leading-relaxed">{rule.description}</p>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => toggleRule(rule.id)}
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[9px] border-[hsl(210,100%,25%)]">
                {rule.category}
              </Badge>
              {rule.mitreMapping.map((m, i) => (
                <Badge key={i} className="text-[8px] bg-[hsl(270,100%,25%)] text-[hsl(270,100%,85%)]">
                  {m}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3 text-[hsl(210,60%,50%)]">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {rule.detections24h} detections
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {rule.falsePositiveRate}% FP rate
                </span>
              </div>
              <span className="text-[hsl(210,60%,45%)]">
                <Clock className="w-3 h-3 inline mr-1" />
                {rule.lastTriggered}
              </span>
            </div>

            {/* False Positive Indicator */}
            <div className="mt-2 pt-2 border-t border-[hsl(210,100%,12%)]">
              <div className="flex items-center justify-between text-[9px] text-[hsl(210,60%,50%)] mb-1">
                <span>Accuracy</span>
                <span>{100 - rule.falsePositiveRate}%</span>
              </div>
              <Progress value={100 - rule.falsePositiveRate} className="h-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BehavioralRulesPage;
