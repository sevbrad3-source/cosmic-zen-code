import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, Filter, Download, Info, AlertTriangle, Shield, Target } from "lucide-react";
import { useSecurityEvents } from "@/hooks/useSecurityData";
import { useAttackCampaigns } from "@/hooks/useThreatActors";

interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low" | "none";
  sources: string[];
}

const MITRE_TACTICS = [
  { id: "TA0001", name: "Initial Access", techniques: ["T1566", "T1190", "T1133", "T1078", "T1195", "T1199"] },
  { id: "TA0002", name: "Execution", techniques: ["T1059", "T1203", "T1204", "T1047", "T1053", "T1569"] },
  { id: "TA0003", name: "Persistence", techniques: ["T1547", "T1543", "T1136", "T1098", "T1556", "T1053"] },
  { id: "TA0004", name: "Privilege Escalation", techniques: ["T1548", "T1134", "T1068", "T1055", "T1078", "T1574"] },
  { id: "TA0005", name: "Defense Evasion", techniques: ["T1070", "T1036", "T1027", "T1562", "T1218", "T1112"] },
  { id: "TA0006", name: "Credential Access", techniques: ["T1110", "T1003", "T1558", "T1552", "T1556", "T1539"] },
  { id: "TA0007", name: "Discovery", techniques: ["T1087", "T1082", "T1083", "T1046", "T1135", "T1057"] },
  { id: "TA0008", name: "Lateral Movement", techniques: ["T1021", "T1091", "T1080", "T1534", "T1570", "T1563"] },
  { id: "TA0009", name: "Collection", techniques: ["T1560", "T1123", "T1119", "T1005", "T1039", "T1025"] },
  { id: "TA0010", name: "Exfiltration", techniques: ["T1041", "T1048", "T1567", "T1029", "T1030", "T1537"] },
  { id: "TA0011", name: "Command and Control", techniques: ["T1071", "T1132", "T1001", "T1573", "T1095", "T1571"] },
  { id: "TA0040", name: "Impact", techniques: ["T1485", "T1486", "T1565", "T1491", "T1499", "T1529"] },
];

const TECHNIQUE_NAMES: Record<string, string> = {
  "T1566": "Phishing",
  "T1190": "Exploit Public-Facing Application",
  "T1133": "External Remote Services",
  "T1078": "Valid Accounts",
  "T1195": "Supply Chain Compromise",
  "T1199": "Trusted Relationship",
  "T1059": "Command and Scripting Interpreter",
  "T1203": "Exploitation for Client Execution",
  "T1204": "User Execution",
  "T1047": "Windows Management Instrumentation",
  "T1053": "Scheduled Task/Job",
  "T1569": "System Services",
  "T1547": "Boot or Logon Autostart Execution",
  "T1543": "Create or Modify System Process",
  "T1136": "Create Account",
  "T1098": "Account Manipulation",
  "T1556": "Modify Authentication Process",
  "T1548": "Abuse Elevation Control Mechanism",
  "T1134": "Access Token Manipulation",
  "T1068": "Exploitation for Privilege Escalation",
  "T1055": "Process Injection",
  "T1574": "Hijack Execution Flow",
  "T1070": "Indicator Removal",
  "T1036": "Masquerading",
  "T1027": "Obfuscated Files or Information",
  "T1562": "Impair Defenses",
  "T1218": "System Binary Proxy Execution",
  "T1112": "Modify Registry",
  "T1110": "Brute Force",
  "T1003": "OS Credential Dumping",
  "T1558": "Steal or Forge Kerberos Tickets",
  "T1552": "Unsecured Credentials",
  "T1539": "Steal Web Session Cookie",
  "T1087": "Account Discovery",
  "T1082": "System Information Discovery",
  "T1083": "File and Directory Discovery",
  "T1046": "Network Service Discovery",
  "T1135": "Network Share Discovery",
  "T1057": "Process Discovery",
  "T1021": "Remote Services",
  "T1091": "Replication Through Removable Media",
  "T1080": "Taint Shared Content",
  "T1534": "Internal Spearphishing",
  "T1570": "Lateral Tool Transfer",
  "T1563": "Remote Service Session Hijacking",
  "T1560": "Archive Collected Data",
  "T1123": "Audio Capture",
  "T1119": "Automated Collection",
  "T1005": "Data from Local System",
  "T1039": "Data from Network Shared Drive",
  "T1025": "Data from Removable Media",
  "T1041": "Exfiltration Over C2 Channel",
  "T1048": "Exfiltration Over Alternative Protocol",
  "T1567": "Exfiltration Over Web Service",
  "T1029": "Scheduled Transfer",
  "T1030": "Data Transfer Size Limits",
  "T1537": "Transfer Data to Cloud Account",
  "T1071": "Application Layer Protocol",
  "T1132": "Data Encoding",
  "T1001": "Data Obfuscation",
  "T1573": "Encrypted Channel",
  "T1095": "Non-Application Layer Protocol",
  "T1571": "Non-Standard Port",
  "T1485": "Data Destruction",
  "T1486": "Data Encrypted for Impact",
  "T1565": "Data Manipulation",
  "T1491": "Defacement",
  "T1499": "Endpoint Denial of Service",
  "T1529": "System Shutdown/Reboot",
};

export const MitreHeatmap = () => {
  const { events } = useSecurityEvents();
  const { campaigns } = useAttackCampaigns();
  const [selectedTactic, setSelectedTactic] = useState<string>("all");
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(null);

  // Aggregate technique counts from events and campaigns
  const techniqueData = useMemo(() => {
    const counts = new Map<string, { count: number; sources: string[]; severities: string[] }>();

    // Count from security events
    events.forEach(event => {
      if (event.mitre_technique) {
        const existing = counts.get(event.mitre_technique) || { count: 0, sources: [], severities: [] };
        existing.count++;
        existing.sources.push(`Event: ${event.event_type}`);
        existing.severities.push(event.severity);
        counts.set(event.mitre_technique, existing);
      }
    });

    // Count from campaigns
    campaigns.forEach(campaign => {
      campaign.techniques_used?.forEach(tech => {
        const existing = counts.get(tech) || { count: 0, sources: [], severities: [] };
        existing.count++;
        existing.sources.push(`Campaign: ${campaign.name}`);
        existing.severities.push(campaign.status === "active" ? "critical" : "medium");
        counts.set(tech, existing);
      });
    });

    return counts;
  }, [events, campaigns]);

  const getTechniqueInfo = (techId: string, tacticId: string): MitreTechnique => {
    const data = techniqueData.get(techId) || { count: 0, sources: [], severities: [] };
    let severity: MitreTechnique["severity"] = "none";
    
    if (data.count > 0) {
      if (data.severities.includes("critical") || data.count >= 5) severity = "critical";
      else if (data.severities.includes("high") || data.count >= 3) severity = "high";
      else if (data.count >= 2) severity = "medium";
      else severity = "low";
    }

    return {
      id: techId,
      name: TECHNIQUE_NAMES[techId] || techId,
      tactic: tacticId,
      count: data.count,
      severity,
      sources: data.sources.slice(0, 10)
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600 hover:bg-red-500";
      case "high": return "bg-orange-500 hover:bg-orange-400";
      case "medium": return "bg-yellow-500 hover:bg-yellow-400";
      case "low": return "bg-blue-500 hover:bg-blue-400";
      default: return "bg-muted/30 hover:bg-muted/50";
    }
  };

  const totalDetections = useMemo(() => {
    let total = 0;
    techniqueData.forEach(data => total += data.count);
    return total;
  }, [techniqueData]);

  const uniqueTechniques = useMemo(() => {
    return techniqueData.size;
  }, [techniqueData]);

  const filteredTactics = selectedTactic === "all" 
    ? MITRE_TACTICS 
    : MITRE_TACTICS.filter(t => t.id === selectedTactic);

  const exportHeatmap = () => {
    const data = MITRE_TACTICS.map(tactic => ({
      tactic: tactic.name,
      techniques: tactic.techniques.map(t => ({
        id: t,
        name: TECHNIQUE_NAMES[t],
        detections: techniqueData.get(t)?.count || 0
      }))
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mitre-heatmap-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">MITRE ATT&CK Heatmap</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTactic} onValueChange={setSelectedTactic}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Tactics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tactics</SelectItem>
              {MITRE_TACTICS.map(tactic => (
                <SelectItem key={tactic.id} value={tactic.id}>{tactic.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportHeatmap}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{totalDetections}</p>
            <p className="text-xs text-muted-foreground">Total Detections</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{uniqueTechniques}</p>
            <p className="text-xs text-muted-foreground">Techniques Detected</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-500">
              {Math.round((uniqueTechniques / Object.keys(TECHNIQUE_NAMES).length) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground">Severity:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-600" />
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-muted/30" />
          <span>None</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Heatmap grid */}
        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            <TooltipProvider delayDuration={200}>
              {filteredTactics.map(tactic => (
                <Card key={tactic.id} className="bg-card/30">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {tactic.name}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {tactic.id}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="grid grid-cols-6 gap-1">
                      {tactic.techniques.map(techId => {
                        const tech = getTechniqueInfo(techId, tactic.id);
                        return (
                          <Tooltip key={techId}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSelectedTechnique(tech)}
                                className={`p-2 rounded text-xs font-mono transition-colors ${getSeverityColor(tech.severity)} ${
                                  selectedTechnique?.id === techId ? "ring-2 ring-white" : ""
                                }`}
                              >
                                <div className="truncate">{techId}</div>
                                {tech.count > 0 && (
                                  <div className="text-[10px] font-bold">{tech.count}</div>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="font-medium">{tech.name}</p>
                              <p className="text-xs text-muted-foreground">{techId}</p>
                              <p className="text-xs mt-1">Detections: {tech.count}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TooltipProvider>
          </div>
        </ScrollArea>

        {/* Detail panel */}
        <Card className="w-64 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              {selectedTechnique ? "Technique Details" : "Select Technique"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTechnique ? (
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{selectedTechnique.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedTechnique.id}</p>
                </div>
                
                <Badge variant={
                  selectedTechnique.severity === "critical" ? "destructive" :
                  selectedTechnique.severity === "high" ? "default" :
                  selectedTechnique.severity === "medium" ? "secondary" : "outline"
                }>
                  {selectedTechnique.severity.toUpperCase()}
                </Badge>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Detection Count</p>
                  <p className="text-xl font-bold">{selectedTechnique.count}</p>
                </div>

                {selectedTechnique.sources.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Recent Sources</p>
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {selectedTechnique.sources.map((source, i) => (
                          <p key={i} className="text-xs p-1 bg-muted/30 rounded truncate">
                            {source}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a 
                    href={`https://attack.mitre.org/techniques/${selectedTechnique.id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in MITRE ATT&CK
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click a technique cell to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MitreHeatmap;
