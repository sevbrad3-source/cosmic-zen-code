import { useState, useEffect, useMemo } from "react";
import { 
  Shield, Activity, Users, Target, AlertTriangle, Zap, Database,
  Play, Pause, Settings, Bot, Brain, Radio, Eye, Clock, TrendingUp,
  ChevronDown, ChevronRight, Maximize2, RefreshCw, Bell, Lock, Unlock
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs, useSecurityEvents } from "@/hooks/useSecurityData";
import { useNetworkAssets } from "@/hooks/useNetworkAssets";
import { useInvestigations } from "@/hooks/useInvestigations";
import { format } from "date-fns";

interface AIAction {
  id: string;
  type: "analyze" | "recommend" | "automate" | "alert";
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: Date;
  confidence?: number;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  executions: number;
  lastRun?: Date;
}

const JointOperationsCenter = () => {
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const { assets, compromisedAssets } = useNetworkAssets();
  const { investigations } = useInvestigations();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [selectedView, setSelectedView] = useState("overview");
  const [aiActions, setAiActions] = useState<AIAction[]>([
    { id: "1", type: "analyze", title: "Analyzing network anomalies", description: "AI is correlating unusual traffic patterns with known threat signatures", status: "running", timestamp: new Date(), confidence: 85 },
    { id: "2", type: "recommend", title: "Recommended containment", description: "Isolate subnet 192.168.1.0/24 based on detected lateral movement", status: "pending", timestamp: new Date(Date.now() - 60000), confidence: 92 },
    { id: "3", type: "automate", title: "Auto-blocked malicious IP", description: "Blocked 45.33.32.156 matching APT29 infrastructure", status: "completed", timestamp: new Date(Date.now() - 300000), confidence: 98 },
    { id: "4", type: "alert", title: "Critical: C2 beacon detected", description: "Identified Cobalt Strike beacon communication on host WS-024", status: "completed", timestamp: new Date(Date.now() - 120000), confidence: 94 },
  ]);
  
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    { id: "1", name: "Auto-isolate compromised hosts", trigger: "Malware detection", action: "Network isolation", enabled: true, executions: 12, lastRun: new Date(Date.now() - 3600000) },
    { id: "2", name: "Block known bad IPs", trigger: "IOC match (IP)", action: "Firewall block", enabled: true, executions: 47, lastRun: new Date(Date.now() - 1800000) },
    { id: "3", name: "Escalate critical alerts", trigger: "Severity = Critical", action: "Page SOC lead", enabled: true, executions: 8, lastRun: new Date(Date.now() - 7200000) },
    { id: "4", name: "Collect forensics on detection", trigger: "EDR alert", action: "Memory capture", enabled: false, executions: 3 },
    { id: "5", name: "Auto-enrich IOCs", trigger: "New IOC added", action: "Query TI feeds", enabled: true, executions: 156, lastRun: new Date(Date.now() - 600000) },
  ]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    const activeActors = actors.filter(a => a.is_active).length;
    const activeCampaigns = campaigns.filter(c => c.status === "active").length;
    const criticalIOCs = iocs.filter(i => i.is_active && i.threat_level === "critical").length;
    const criticalEvents = events.filter(e => e.severity === "critical").length;
    const openInvestigations = investigations.filter(i => i.status === "open" || i.status === "in_progress").length;

    // Calculate overall threat level
    const threatScore = Math.min(100, 
      (criticalEvents * 5) + (criticalIOCs * 3) + (activeCampaigns * 10) + (compromisedAssets.length * 8)
    );

    return {
      activeActors,
      activeCampaigns,
      criticalIOCs,
      criticalEvents,
      activeIOCs: iocs.filter(i => i.is_active).length,
      compromisedAssets: compromisedAssets.length,
      totalAssets: assets.length,
      openInvestigations,
      threatScore,
      redTeamActive: campaigns.filter(c => c.status === "active").length > 0,
      blueTeamActive: investigations.filter(i => i.status === "in_progress").length > 0
    };
  }, [actors, campaigns, iocs, events, assets, compromisedAssets, investigations]);

  const getThreatLevel = () => {
    if (metrics.threatScore >= 80) return { level: "CRITICAL", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/50" };
    if (metrics.threatScore >= 60) return { level: "HIGH", color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/50" };
    if (metrics.threatScore >= 40) return { level: "ELEVATED", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/50" };
    return { level: "NORMAL", color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/50" };
  };

  const threatLevel = getThreatLevel();

  const getActionIcon = (type: string) => {
    switch (type) {
      case "analyze": return Brain;
      case "recommend": return Target;
      case "automate": return Zap;
      case "alert": return AlertTriangle;
      default: return Bot;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "running": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="h-full flex flex-col bg-background text-text-primary overflow-hidden">
      {/* Command Bar */}
      <div className="p-3 border-b border-border bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <div className="text-lg font-bold tracking-wide">JOINT OPERATIONS CENTER</div>
                <div className="text-xs text-text-muted">Unified Security Command & Control</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${threatLevel.bg} ${threatLevel.color} ${threatLevel.border} text-sm px-3 py-1`}>
              THREAT LEVEL: {threatLevel.level}
            </Badge>
            
            <Button 
              variant={isAutoMode ? "default" : "outline"} 
              size="sm" 
              className="gap-2"
              onClick={() => setIsAutoMode(!isAutoMode)}
            >
              {isAutoMode ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isAutoMode ? "AUTO MODE" : "MANUAL"}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-text-muted border border-border rounded px-2 py-1">
              <Clock className="w-4 h-4" />
              {format(currentTime, "HH:mm:ss")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Metrics & Status */}
        <div className="w-80 border-r border-border flex flex-col bg-sidebar-bg">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {/* Threat Score */}
              <Card className={`p-4 ${threatLevel.bg} ${threatLevel.border} border`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Threat Score</span>
                  <span className={`text-2xl font-bold ${threatLevel.color}`}>
                    {metrics.threatScore}
                  </span>
                </div>
                <Progress value={metrics.threatScore} className="h-2" />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </Card>

              {/* Team Status */}
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-3 bg-red-500/10 border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-text-muted">Red Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${metrics.redTeamActive ? "bg-red-500 animate-pulse" : "bg-gray-500"}`} />
                    <span className="text-sm font-medium">{metrics.redTeamActive ? "Active" : "Standby"}</span>
                  </div>
                </Card>
                
                <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-text-muted">Blue Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${metrics.blueTeamActive ? "bg-blue-500 animate-pulse" : "bg-gray-500"}`} />
                    <span className="text-sm font-medium">{metrics.blueTeamActive ? "Active" : "Monitoring"}</span>
                  </div>
                </Card>
              </div>

              {/* Key Metrics */}
              <Card className="bg-editor-bg border-border p-3">
                <div className="text-sm font-medium mb-3">Operational Metrics</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-400" />
                      <span className="text-xs">Active Threat Actors</span>
                    </div>
                    <Badge variant="outline">{metrics.activeActors}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-xs">Active Campaigns</span>
                    </div>
                    <Badge variant="outline">{metrics.activeCampaigns}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-orange-400" />
                      <span className="text-xs">Critical IOCs</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{metrics.criticalIOCs}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs">Critical Events</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{metrics.criticalEvents}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs">Compromised Assets</span>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      {metrics.compromisedAssets}/{metrics.totalAssets}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs">Open Investigations</span>
                    </div>
                    <Badge variant="outline">{metrics.openInvestigations}</Badge>
                  </div>
                </div>
              </Card>

              {/* Automation Status */}
              <Card className="bg-editor-bg border-border p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">Automation Status</span>
                  </div>
                  <Badge className={isAutoMode ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400"}>
                    {isAutoMode ? "ENABLED" : "DISABLED"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {automationRules.slice(0, 3).map(rule => (
                    <div key={rule.id} className="flex items-center justify-between text-xs">
                      <span className={rule.enabled ? "text-text-primary" : "text-text-muted"}>
                        {rule.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${rule.enabled ? "bg-green-500" : "bg-gray-500"}`} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - AI Actions & Activity */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={selectedView} onValueChange={setSelectedView} className="flex-1 flex flex-col">
            <div className="border-b border-border px-3 pt-2">
              <TabsList className="bg-sidebar-bg">
                <TabsTrigger value="overview" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Activity className="w-3 h-3" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="ai-actions" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Brain className="w-3 h-3" />
                  AI Actions
                </TabsTrigger>
                <TabsTrigger value="automation" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Zap className="w-3 h-3" />
                  Automation
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bell className="w-3 h-3" />
                  Alerts
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="overview" className="p-4 m-0 space-y-4">
                {/* AI Assistant Summary */}
                <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">AI Security Assistant</div>
                      <div className="text-xs text-text-muted">Continuously analyzing threat landscape</div>
                    </div>
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-sidebar-bg/50 rounded p-3 text-sm">
                    <p className="mb-2">
                      <span className="text-purple-400 font-medium">Current Assessment:</span> Monitoring {metrics.activeCampaigns} active campaign(s) 
                      with {metrics.criticalIOCs} critical indicators. {metrics.compromisedAssets > 0 
                        ? `⚠️ ${metrics.compromisedAssets} asset(s) require immediate attention.` 
                        : "No immediate threats detected."}
                    </p>
                    <p className="text-xs text-text-muted">
                      AI is processing {events.length} security events and correlating {iocs.length} indicators of compromise.
                    </p>
                  </div>
                </Card>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    <span className="text-xs">Launch Hunt</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-xs">Contain Threat</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Eye className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs">New Investigation</span>
                  </Button>
                </div>

                {/* Recent AI Activity */}
                <Card className="bg-editor-bg border-border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold">Recent AI Activity</span>
                  </div>
                  <div className="space-y-3">
                    {aiActions.slice(0, 4).map(action => {
                      const Icon = getActionIcon(action.type);
                      return (
                        <div key={action.id} className="flex items-start gap-3 p-2 rounded bg-sidebar-bg">
                          <Icon className="w-4 h-4 mt-0.5 text-purple-400" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{action.title}</span>
                              <Badge className={`text-xs ${getStatusColor(action.status)}`}>
                                {action.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-muted mt-1">{action.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                              <span>{format(action.timestamp, "HH:mm:ss")}</span>
                              {action.confidence && (
                                <>
                                  <span>•</span>
                                  <span>Confidence: {action.confidence}%</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="ai-actions" className="p-4 m-0 space-y-4">
                <Card className="bg-editor-bg border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-semibold">AI Action Queue</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {aiActions.map(action => {
                      const Icon = getActionIcon(action.type);
                      return (
                        <div key={action.id} className="flex items-start gap-3 p-3 rounded border border-border bg-sidebar-bg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            action.type === "alert" ? "bg-red-500/20" :
                            action.type === "automate" ? "bg-green-500/20" :
                            action.type === "recommend" ? "bg-yellow-500/20" :
                            "bg-blue-500/20"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{action.title}</span>
                              <Badge className={`text-xs ${getStatusColor(action.status)}`}>
                                {action.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-muted">{action.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-text-muted">{format(action.timestamp, "HH:mm:ss")}</span>
                              {action.confidence && (
                                <div className="flex items-center gap-1">
                                  <Progress value={action.confidence} className="w-16 h-1" />
                                  <span className="text-xs text-text-muted">{action.confidence}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="automation" className="p-4 m-0 space-y-4">
                <Card className="bg-editor-bg border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-semibold">Automation Rules</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Settings className="w-3 h-3" />
                      Configure
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {automationRules.map(rule => (
                      <div 
                        key={rule.id} 
                        className={`flex items-center gap-3 p-3 rounded border transition-colors ${
                          rule.enabled 
                            ? "border-green-500/30 bg-green-500/5" 
                            : "border-border bg-sidebar-bg"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleAutomationRule(rule.id)}
                        >
                          {rule.enabled ? (
                            <Unlock className="w-4 h-4 text-green-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{rule.name}</div>
                          <div className="text-xs text-text-muted">
                            Trigger: {rule.trigger} → Action: {rule.action}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-text-muted">{rule.executions} runs</div>
                          {rule.lastRun && (
                            <div className="text-xs text-text-muted">
                              Last: {format(rule.lastRun, "HH:mm")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="p-4 m-0 space-y-4">
                <Card className="bg-editor-bg border-border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-semibold">Active Alerts</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 ml-auto">
                      {metrics.criticalEvents} Critical
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {events.filter(e => e.severity === "critical" || e.severity === "high").slice(0, 8).map(event => (
                      <div 
                        key={event.id} 
                        className={`p-3 rounded border ${
                          event.severity === "critical" 
                            ? "border-red-500/30 bg-red-500/5" 
                            : "border-orange-500/30 bg-orange-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={`w-4 h-4 ${
                            event.severity === "critical" ? "text-red-400" : "text-orange-400"
                          }`} />
                          <span className="text-sm font-medium">{event.event_type}</span>
                          <Badge className={`text-xs ${
                            event.severity === "critical" 
                              ? "bg-red-500/20 text-red-400 border-red-500/30" 
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          }`}>
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-muted">{event.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                          {event.source_ip && <span>Source: {event.source_ip}</span>}
                          {event.destination_ip && <span>→ {event.destination_ip}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default JointOperationsCenter;
