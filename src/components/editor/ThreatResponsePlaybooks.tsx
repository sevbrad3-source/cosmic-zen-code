import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, Play, Pause, Settings, Shield, Ban, Network, 
  AlertTriangle, CheckCircle, Clock, RotateCcw, Terminal,
  Lock, Wifi, Server, Mail
} from "lucide-react";
import { useIOCs } from "@/hooks/useSecurityData";
import { toast } from "sonner";

interface PlaybookAction {
  id: string;
  name: string;
  type: "isolate" | "block" | "disable" | "alert" | "scan" | "backup";
  target: string;
  status: "pending" | "running" | "completed" | "failed";
  duration?: number;
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger: string;
  severity: "critical" | "high" | "medium";
  enabled: boolean;
  actions: PlaybookAction[];
  lastTriggered?: string;
  executionCount: number;
}

interface ExecutionLog {
  id: string;
  playbookId: string;
  playbookName: string;
  triggeredAt: string;
  status: "running" | "completed" | "failed";
  actions: PlaybookAction[];
  triggeredBy: string;
}

export const ThreatResponsePlaybooks = () => {
  const { iocs } = useIOCs();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([
    {
      id: "pb-1",
      name: "Critical IOC Containment",
      description: "Automatically isolate endpoints and block network access when critical IOCs are detected",
      trigger: "Critical IOC Detection",
      severity: "critical",
      enabled: true,
      actions: [
        { id: "a1", name: "Isolate Affected Endpoint", type: "isolate", target: "Source IP", status: "pending" },
        { id: "a2", name: "Block IOC at Firewall", type: "block", target: "IOC Value", status: "pending" },
        { id: "a3", name: "Disable User Account", type: "disable", target: "Associated User", status: "pending" },
        { id: "a4", name: "Alert SOC Team", type: "alert", target: "SOC Channel", status: "pending" },
      ],
      executionCount: 12
    },
    {
      id: "pb-2",
      name: "Ransomware Response",
      description: "Immediate network isolation and backup verification on ransomware indicators",
      trigger: "Ransomware TTP Detection",
      severity: "critical",
      enabled: true,
      actions: [
        { id: "a1", name: "Isolate Entire Subnet", type: "isolate", target: "Affected Subnet", status: "pending" },
        { id: "a2", name: "Block C2 Communications", type: "block", target: "Known C2 IPs", status: "pending" },
        { id: "a3", name: "Verify Backup Integrity", type: "backup", target: "Critical Systems", status: "pending" },
        { id: "a4", name: "Escalate to IR Team", type: "alert", target: "IR Team", status: "pending" },
      ],
      executionCount: 3
    },
    {
      id: "pb-3",
      name: "Lateral Movement Detection",
      description: "Contain lateral movement attempts by isolating compromised hosts",
      trigger: "Lateral Movement Indicators",
      severity: "high",
      enabled: true,
      actions: [
        { id: "a1", name: "Quarantine Source Host", type: "isolate", target: "Source Host", status: "pending" },
        { id: "a2", name: "Block Internal Port Scan", type: "block", target: "Scanning Ports", status: "pending" },
        { id: "a3", name: "Run EDR Scan", type: "scan", target: "Affected Segment", status: "pending" },
      ],
      executionCount: 8
    },
    {
      id: "pb-4",
      name: "Credential Theft Response",
      description: "Reset credentials and audit access when credential theft is detected",
      trigger: "Credential Access TTPs",
      severity: "high",
      enabled: false,
      actions: [
        { id: "a1", name: "Force Password Reset", type: "disable", target: "Compromised Accounts", status: "pending" },
        { id: "a2", name: "Revoke Active Sessions", type: "disable", target: "All User Sessions", status: "pending" },
        { id: "a3", name: "Audit Privileged Access", type: "scan", target: "Admin Accounts", status: "pending" },
      ],
      executionCount: 5
    },
    {
      id: "pb-5",
      name: "Phishing Campaign Response",
      description: "Block malicious URLs and quarantine affected mailboxes",
      trigger: "Phishing IOC Detection",
      severity: "medium",
      enabled: true,
      actions: [
        { id: "a1", name: "Block Phishing URLs", type: "block", target: "Malicious URLs", status: "pending" },
        { id: "a2", name: "Quarantine Emails", type: "isolate", target: "Phishing Emails", status: "pending" },
        { id: "a3", name: "Notify Affected Users", type: "alert", target: "Recipient List", status: "pending" },
      ],
      executionCount: 24
    }
  ]);

  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [activeExecution, setActiveExecution] = useState<ExecutionLog | null>(null);

  // Monitor for critical IOCs and trigger playbooks
  useEffect(() => {
    const criticalIOCs = iocs.filter(ioc => ioc.threat_level === "critical" && ioc.is_active);
    const enabledPlaybook = playbooks.find(p => p.id === "pb-1" && p.enabled);
    
    if (criticalIOCs.length > 0 && enabledPlaybook && !activeExecution) {
      // Auto-trigger simulation (in production, this would be real)
      const recentIOC = criticalIOCs[0];
      const timeSinceDetection = Date.now() - new Date(recentIOC.created_at).getTime();
      
      // Only trigger for IOCs detected in last 30 seconds (for demo)
      if (timeSinceDetection < 30000) {
        triggerPlaybook(enabledPlaybook, `Critical IOC: ${recentIOC.value}`);
      }
    }
  }, [iocs]);

  const triggerPlaybook = (playbook: Playbook, triggeredBy: string) => {
    const execution: ExecutionLog = {
      id: `exec-${Date.now()}`,
      playbookId: playbook.id,
      playbookName: playbook.name,
      triggeredAt: new Date().toISOString(),
      status: "running",
      actions: playbook.actions.map(a => ({ ...a, status: "pending" as const })),
      triggeredBy
    };

    setActiveExecution(execution);
    setExecutionLogs(prev => [execution, ...prev]);
    toast.warning(`🚨 Playbook Triggered: ${playbook.name}`, {
      description: triggeredBy
    });

    // Simulate action execution
    executeActions(execution);
  };

  const executeActions = async (execution: ExecutionLog) => {
    for (let i = 0; i < execution.actions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setActiveExecution(prev => {
        if (!prev) return null;
        const updated = { ...prev };
        updated.actions[i].status = "running";
        return updated;
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = Math.random() > 0.1; // 90% success rate
      
      setActiveExecution(prev => {
        if (!prev) return null;
        const updated = { ...prev };
        updated.actions[i].status = success ? "completed" : "failed";
        updated.actions[i].duration = Math.floor(Math.random() * 5000) + 1000;
        return updated;
      });

      if (success) {
        toast.success(`✓ ${execution.actions[i].name}`);
      } else {
        toast.error(`✗ ${execution.actions[i].name} failed`);
      }
    }

    setActiveExecution(prev => {
      if (!prev) return null;
      const allCompleted = prev.actions.every(a => a.status === "completed");
      return { ...prev, status: allCompleted ? "completed" : "failed" };
    });

    // Update playbook execution count
    setPlaybooks(prev => prev.map(p => 
      p.id === execution.playbookId 
        ? { ...p, executionCount: p.executionCount + 1, lastTriggered: new Date().toISOString() }
        : p
    ));
  };

  const togglePlaybook = (id: string) => {
    setPlaybooks(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const manualTrigger = (playbook: Playbook) => {
    if (activeExecution) {
      toast.error("Another playbook is currently executing");
      return;
    }
    triggerPlaybook(playbook, "Manual Trigger");
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "isolate": return <Wifi className="h-4 w-4" />;
      case "block": return <Ban className="h-4 w-4" />;
      case "disable": return <Lock className="h-4 w-4" />;
      case "alert": return <Mail className="h-4 w-4" />;
      case "scan": return <Server className="h-4 w-4" />;
      case "backup": return <Shield className="h-4 w-4" />;
      default: return <Terminal className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running": return <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const completedActions = activeExecution?.actions.filter(a => a.status === "completed").length || 0;
  const totalActions = activeExecution?.actions.length || 1;
  const progress = (completedActions / totalActions) * 100;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Automated Response Playbooks</h2>
        </div>
        <Badge variant={activeExecution ? "destructive" : "outline"}>
          {activeExecution ? "Executing..." : "Idle"}
        </Badge>
      </div>

      {activeExecution && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <RotateCcw className="h-4 w-4 animate-spin" />
                {activeExecution.playbookName}
              </CardTitle>
              <Badge variant="destructive">LIVE</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Triggered by: {activeExecution.triggeredBy}
            </p>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 gap-2">
              {activeExecution.actions.map(action => (
                <div key={action.id} className="flex items-center gap-2 text-xs p-2 bg-background/50 rounded">
                  {getStatusIcon(action.status)}
                  <span className={action.status === "completed" ? "line-through text-muted-foreground" : ""}>
                    {action.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="playbooks" className="flex-1">
        <TabsList>
          <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>

        <TabsContent value="playbooks" className="flex-1">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-3 pr-4">
              {playbooks.map(playbook => (
                <Card key={playbook.id} className={`bg-card/50 ${!playbook.enabled && "opacity-60"}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <CardTitle className="text-sm">{playbook.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          playbook.severity === "critical" ? "destructive" :
                          playbook.severity === "high" ? "default" : "secondary"
                        }>
                          {playbook.severity}
                        </Badge>
                        <Switch 
                          checked={playbook.enabled}
                          onCheckedChange={() => togglePlaybook(playbook.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{playbook.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Trigger: {playbook.trigger}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        Runs: {playbook.executionCount}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {playbook.actions.map(action => (
                        <Badge key={action.id} variant="outline" className="text-xs">
                          {getActionIcon(action.type)}
                          <span className="ml-1">{action.name}</span>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => manualTrigger(playbook)}
                        disabled={!playbook.enabled || !!activeExecution}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test Run
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-2 pr-4">
              {executionLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No execution history yet</p>
                </div>
              ) : (
                executionLogs.map(log => (
                  <Card key={log.id} className="bg-card/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="font-medium text-sm">{log.playbookName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.triggeredAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.triggeredBy}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {log.actions.map(action => (
                          <Badge 
                            key={action.id} 
                            variant={action.status === "completed" ? "default" : action.status === "failed" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {action.status === "completed" ? "✓" : action.status === "failed" ? "✗" : "○"}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThreatResponsePlaybooks;
