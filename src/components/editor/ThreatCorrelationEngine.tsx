import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link2, Zap, AlertTriangle, Shield, Target, Users, 
  RefreshCw, ChevronRight, CheckCircle, Clock, Network
} from "lucide-react";
import { useSecurityEvents, useIOCs } from "@/hooks/useSecurityData";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { toast } from "sonner";

interface Correlation {
  id: string;
  type: "ioc-event" | "ioc-actor" | "event-campaign" | "actor-campaign" | "ioc-ioc";
  confidence: number;
  entities: {
    type: string;
    id: string;
    name: string;
  }[];
  reason: string;
  timestamp: string;
  isNew: boolean;
}

interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  matches: number;
}

export const ThreatCorrelationEngine = () => {
  const { events } = useSecurityEvents();
  const { iocs } = useIOCs();
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const [rules] = useState<CorrelationRule[]>([
    { id: "r1", name: "IP Address Match", description: "Links IOCs to events with matching IP addresses", enabled: true, matches: 0 },
    { id: "r2", name: "Domain Association", description: "Correlates domain IOCs with network events", enabled: true, matches: 0 },
    { id: "r3", name: "MITRE Technique Match", description: "Links events and campaigns using same techniques", enabled: true, matches: 0 },
    { id: "r4", name: "Temporal Proximity", description: "Groups events occurring within 5 minutes of IOC detection", enabled: true, matches: 0 },
    { id: "r5", name: "Actor TTP Fingerprint", description: "Associates events matching known actor TTPs", enabled: true, matches: 0 },
    { id: "r6", name: "Hash Correlation", description: "Links file hash IOCs across multiple detections", enabled: true, matches: 0 },
  ]);

  // Run correlation engine
  const runCorrelation = async () => {
    setIsRunning(true);
    setProgress(0);
    const newCorrelations: Correlation[] = [];

    // Step 1: Correlate IOCs with Events (IP matching)
    setProgress(10);
    await new Promise(r => setTimeout(r, 300));
    
    iocs.forEach(ioc => {
      if (ioc.ioc_type === "ip") {
        events.forEach(event => {
          if (event.source_ip === ioc.value || event.destination_ip === ioc.value) {
            newCorrelations.push({
              id: `corr-${ioc.id}-${event.id}`,
              type: "ioc-event",
              confidence: 95,
              entities: [
                { type: "IOC", id: ioc.id, name: ioc.value },
                { type: "Event", id: event.id, name: event.event_type }
              ],
              reason: `IP address ${ioc.value} matches event ${event.source_ip === ioc.value ? "source" : "destination"}`,
              timestamp: new Date().toISOString(),
              isNew: true
            });
          }
        });
      }
    });

    // Step 2: Correlate Events with Campaigns (MITRE technique)
    setProgress(30);
    await new Promise(r => setTimeout(r, 300));
    
    events.forEach(event => {
      if (event.mitre_technique) {
        campaigns.forEach(campaign => {
          if (campaign.techniques_used?.includes(event.mitre_technique!)) {
            const existingCorr = newCorrelations.find(
              c => c.entities.some(e => e.id === event.id) && c.entities.some(e => e.id === campaign.id)
            );
            if (!existingCorr) {
              newCorrelations.push({
                id: `corr-${event.id}-${campaign.id}`,
                type: "event-campaign",
                confidence: 75,
                entities: [
                  { type: "Event", id: event.id, name: event.event_type },
                  { type: "Campaign", id: campaign.id, name: campaign.name }
                ],
                reason: `Event uses technique ${event.mitre_technique} associated with campaign`,
                timestamp: new Date().toISOString(),
                isNew: true
              });
            }
          }
        });
      }
    });

    // Step 3: Correlate Actors with Campaigns
    setProgress(50);
    await new Promise(r => setTimeout(r, 300));
    
    actors.forEach(actor => {
      campaigns.forEach(campaign => {
        if (campaign.threat_actor_id === actor.id) {
          newCorrelations.push({
            id: `corr-${actor.id}-${campaign.id}`,
            type: "actor-campaign",
            confidence: 100,
            entities: [
              { type: "Actor", id: actor.id, name: actor.name },
              { type: "Campaign", id: campaign.id, name: campaign.name }
            ],
            reason: "Direct attribution - campaign owned by threat actor",
            timestamp: new Date().toISOString(),
            isNew: true
          });
        }
      });
    });

    // Step 4: Correlate IOCs with Actors (related_iocs)
    setProgress(70);
    await new Promise(r => setTimeout(r, 300));
    
    actors.forEach(actor => {
      actor.related_iocs?.forEach(iocId => {
        const ioc = iocs.find(i => i.id === iocId);
        if (ioc) {
          newCorrelations.push({
            id: `corr-${actor.id}-${ioc.id}`,
            type: "ioc-actor",
            confidence: 85,
            entities: [
              { type: "Actor", id: actor.id, name: actor.name },
              { type: "IOC", id: ioc.id, name: ioc.value }
            ],
            reason: `IOC linked to threat actor infrastructure`,
            timestamp: new Date().toISOString(),
            isNew: true
          });
        }
      });
    });

    // Step 5: Correlate similar IOCs (same type, temporal proximity)
    setProgress(90);
    await new Promise(r => setTimeout(r, 300));
    
    const iocsByType = new Map<string, typeof iocs>();
    iocs.forEach(ioc => {
      const existing = iocsByType.get(ioc.ioc_type) || [];
      existing.push(ioc);
      iocsByType.set(ioc.ioc_type, existing);
    });

    iocsByType.forEach((typeIOCs, type) => {
      if (typeIOCs.length > 1) {
        for (let i = 0; i < typeIOCs.length - 1; i++) {
          const ioc1 = typeIOCs[i];
          const ioc2 = typeIOCs[i + 1];
          const timeDiff = Math.abs(
            new Date(ioc1.created_at).getTime() - new Date(ioc2.created_at).getTime()
          );
          // Within 1 hour
          if (timeDiff < 3600000) {
            newCorrelations.push({
              id: `corr-${ioc1.id}-${ioc2.id}`,
              type: "ioc-ioc",
              confidence: 60,
              entities: [
                { type: "IOC", id: ioc1.id, name: ioc1.value },
                { type: "IOC", id: ioc2.id, name: ioc2.value }
              ],
              reason: `Both ${type} IOCs detected within 1 hour - possible related campaign`,
              timestamp: new Date().toISOString(),
              isNew: true
            });
          }
        }
      }
    });

    setProgress(100);
    await new Promise(r => setTimeout(r, 200));
    
    setCorrelations(prev => {
      // Mark old correlations as not new
      const updated = prev.map(c => ({ ...c, isNew: false }));
      // Add new correlations, avoiding duplicates
      newCorrelations.forEach(nc => {
        if (!updated.some(c => c.id === nc.id)) {
          updated.unshift(nc);
        }
      });
      return updated.slice(0, 100); // Keep last 100
    });
    
    setIsRunning(false);
    setLastRun(new Date().toISOString());
    toast.success(`Correlation complete: ${newCorrelations.length} relationships found`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "IOC": return <Shield className="h-3 w-3" />;
      case "Event": return <Zap className="h-3 w-3" />;
      case "Campaign": return <Target className="h-3 w-3" />;
      case "Actor": return <Users className="h-3 w-3" />;
      default: return <Network className="h-3 w-3" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-500";
    if (confidence >= 70) return "text-yellow-500";
    if (confidence >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const stats = useMemo(() => ({
    total: correlations.length,
    highConfidence: correlations.filter(c => c.confidence >= 80).length,
    newToday: correlations.filter(c => c.isNew).length,
    byType: {
      "ioc-event": correlations.filter(c => c.type === "ioc-event").length,
      "ioc-actor": correlations.filter(c => c.type === "ioc-actor").length,
      "event-campaign": correlations.filter(c => c.type === "event-campaign").length,
      "actor-campaign": correlations.filter(c => c.type === "actor-campaign").length,
      "ioc-ioc": correlations.filter(c => c.type === "ioc-ioc").length,
    }
  }), [correlations]);

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Threat Correlation Engine</h2>
        </div>
        <div className="flex items-center gap-2">
          {lastRun && (
            <span className="text-xs text-muted-foreground">
              Last run: {new Date(lastRun).toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={runCorrelation} 
            disabled={isRunning}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm">Analyzing threat data...</p>
                <Progress value={progress} className="h-1 mt-1" />
              </div>
              <span className="text-sm font-mono">{progress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-card/50">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Links</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-green-500">{stats.highConfidence}</p>
            <p className="text-xs text-muted-foreground">High Confidence</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-blue-500">{stats.newToday}</p>
            <p className="text-xs text-muted-foreground">New Links</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{rules.filter(r => r.enabled).length}</p>
            <p className="text-xs text-muted-foreground">Active Rules</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="correlations" className="flex-1">
        <TabsList>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="correlations" className="flex-1">
          <ScrollArea className="h-[calc(100vh-380px)]">
            {correlations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Link2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No correlations yet</p>
                <p className="text-sm">Click "Run Analysis" to discover relationships</p>
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {correlations.map(corr => (
                  <Card 
                    key={corr.id} 
                    className={`bg-card/50 ${corr.isNew ? "border-primary/50" : ""}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          {corr.entities.map((entity, i) => (
                            <div key={entity.id} className="flex items-center gap-1">
                              {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                              <Badge variant="outline" className="text-xs whitespace-nowrap">
                                {getTypeIcon(entity.type)}
                                <span className="ml-1 max-w-[100px] truncate">{entity.name}</span>
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {corr.isNew && (
                            <Badge variant="default" className="text-xs">NEW</Badge>
                          )}
                          <span className={`text-sm font-bold ${getConfidenceColor(corr.confidence)}`}>
                            {corr.confidence}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{corr.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="rules">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-2 pr-4">
              {rules.map(rule => (
                <Card key={rule.id} className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rule.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{rule.matches} matches</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThreatCorrelationEngine;
