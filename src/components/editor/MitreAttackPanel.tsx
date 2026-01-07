import { Shield, Target, TrendingUp, Activity, CheckCircle2, Circle, AlertTriangle, Users, Crosshair } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";

// Full MITRE ATT&CK tactics
const MITRE_TACTICS = [
  { id: "TA0001", name: "Initial Access", color: "bg-red-500" },
  { id: "TA0002", name: "Execution", color: "bg-orange-500" },
  { id: "TA0003", name: "Persistence", color: "bg-yellow-500" },
  { id: "TA0004", name: "Privilege Escalation", color: "bg-green-500" },
  { id: "TA0005", name: "Defense Evasion", color: "bg-cyan-500" },
  { id: "TA0006", name: "Credential Access", color: "bg-blue-500" },
  { id: "TA0007", name: "Discovery", color: "bg-purple-500" },
  { id: "TA0008", name: "Lateral Movement", color: "bg-pink-500" },
  { id: "TA0009", name: "Collection", color: "bg-indigo-500" },
  { id: "TA0010", name: "Exfiltration", color: "bg-teal-500" },
  { id: "TA0011", name: "Command and Control", color: "bg-lime-500" },
  { id: "TA0040", name: "Impact", color: "bg-rose-500" },
];

// Common MITRE techniques with tactic mapping
const TECHNIQUE_TACTIC_MAP: Record<string, string> = {
  "T1566": "TA0001", "T1190": "TA0001", "T1133": "TA0001", "T1078": "TA0001",
  "T1059": "TA0002", "T1204": "TA0002", "T1106": "TA0002", "T1053": "TA0002",
  "T1547": "TA0003", "T1543": "TA0003", "T1136": "TA0003", "T1098": "TA0003",
  "T1548": "TA0004", "T1134": "TA0004", "T1068": "TA0004", "T1055": "TA0004",
  "T1027": "TA0005", "T1070": "TA0005", "T1036": "TA0005", "T1140": "TA0005",
  "T1003": "TA0006", "T1110": "TA0006", "T1555": "TA0006", "T1552": "TA0006",
  "T1082": "TA0007", "T1083": "TA0007", "T1016": "TA0007", "T1057": "TA0007",
  "T1021": "TA0008", "T1570": "TA0008", "T1550": "TA0008", "T1072": "TA0008",
  "T1560": "TA0009", "T1123": "TA0009", "T1005": "TA0009", "T1039": "TA0009",
  "T1041": "TA0010", "T1048": "TA0010", "T1567": "TA0010", "T1020": "TA0010",
  "T1071": "TA0011", "T1573": "TA0011", "T1095": "TA0011", "T1105": "TA0011",
  "T1486": "TA0040", "T1489": "TA0040", "T1490": "TA0040", "T1529": "TA0040",
};

const MitreAttackPanel = () => {
  const [activeView, setActiveView] = useState<"matrix" | "actors" | "techniques">("matrix");
  const { actors, loading: actorsLoading } = useThreatActors();
  const { campaigns, loading: campaignsLoading } = useAttackCampaigns();

  // Extract all techniques from actors and campaigns
  const detectedTechniques = useMemo(() => {
    const techniques = new Set<string>();
    
    // From actors' known TTPs
    actors.forEach(actor => {
      actor.known_ttps?.forEach(ttp => {
        if (ttp.startsWith("T")) techniques.add(ttp);
      });
    });
    
    // From campaigns
    campaigns.forEach(campaign => {
      campaign.techniques_used?.forEach(tech => {
        if (tech.startsWith("T")) techniques.add(tech);
      });
    });
    
    return techniques;
  }, [actors, campaigns]);

  // Compute tactic coverage
  const tacticCoverage = useMemo(() => {
    const coverage: Record<string, { detected: Set<string>; total: number }> = {};
    
    MITRE_TACTICS.forEach(tactic => {
      coverage[tactic.id] = { detected: new Set(), total: 0 };
    });

    // Count techniques per tactic
    Object.entries(TECHNIQUE_TACTIC_MAP).forEach(([tech, tacticId]) => {
      if (coverage[tacticId]) {
        coverage[tacticId].total++;
        if (detectedTechniques.has(tech)) {
          coverage[tacticId].detected.add(tech);
        }
      }
    });

    return coverage;
  }, [detectedTechniques]);

  // Actor technique profiles
  const actorProfiles = useMemo(() => {
    return actors.map(actor => {
      const techniques = actor.known_ttps?.filter(t => t.startsWith("T")) || [];
      const tacticsUsed = new Set<string>();
      
      techniques.forEach(tech => {
        const tactic = TECHNIQUE_TACTIC_MAP[tech];
        if (tactic) tacticsUsed.add(tactic);
      });

      // Get linked campaigns
      const linkedCampaigns = campaigns.filter(c => c.threat_actor_id === actor.id);
      linkedCampaigns.forEach(campaign => {
        campaign.techniques_used?.forEach(tech => {
          const tactic = TECHNIQUE_TACTIC_MAP[tech];
          if (tactic) tacticsUsed.add(tactic);
        });
      });

      return {
        actor,
        techniqueCount: techniques.length,
        tacticsUsed: Array.from(tacticsUsed),
        linkedCampaigns: linkedCampaigns.length
      };
    }).filter(p => p.techniqueCount > 0 || p.linkedCampaigns > 0);
  }, [actors, campaigns]);

  const loading = actorsLoading || campaignsLoading;

  return (
    <div className="h-full flex flex-col bg-panel-bg text-text-primary overflow-hidden">
      {/* Safety Banner */}
      <div className="bg-blue-900/20 border-b border-blue-700/50 px-4 py-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-500" />
        <span className="text-xs text-blue-400 font-medium">
          MITRE ATT&CK Coverage from Detected TTPs & Threat Actors
        </span>
      </div>

      {/* Header */}
      <div className="border-b border-panel-border px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold">MITRE ATT&CK Matrix</h2>
          <Badge variant="outline" className="text-xs">
            {detectedTechniques.size} techniques detected
          </Badge>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("matrix")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeView === "matrix"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Tactic Matrix
          </button>
          <button
            onClick={() => setActiveView("actors")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeView === "actors"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Actor Mapping
          </button>
          <button
            onClick={() => setActiveView("techniques")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeView === "techniques"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            All Techniques
          </button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {activeView === "matrix" && (
                <>
                  {/* Overall Stats */}
                  <div className="bg-editor-bg rounded border border-border p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <h3 className="text-sm font-semibold">Coverage Overview</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-sidebar-bg rounded">
                        <div className="text-text-muted">Tactics Covered</div>
                        <div className="text-lg font-semibold text-text-primary">
                          {Object.values(tacticCoverage).filter(t => t.detected.size > 0).length}/{MITRE_TACTICS.length}
                        </div>
                      </div>
                      <div className="p-2 bg-sidebar-bg rounded">
                        <div className="text-text-muted">Techniques</div>
                        <div className="text-lg font-semibold text-green-400">{detectedTechniques.size}</div>
                      </div>
                      <div className="p-2 bg-sidebar-bg rounded">
                        <div className="text-text-muted">Actors Tracked</div>
                        <div className="text-lg font-semibold text-red-400">{actors.filter(a => a.is_active).length}</div>
                      </div>
                      <div className="p-2 bg-sidebar-bg rounded">
                        <div className="text-text-muted">Campaigns</div>
                        <div className="text-lg font-semibold text-purple-400">{campaigns.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Tactic Matrix */}
                  <div className="bg-editor-bg rounded border border-border p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-semibold">Attack Lifecycle Coverage</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {MITRE_TACTICS.map((tactic) => {
                        const coverage = tacticCoverage[tactic.id];
                        const percentage = coverage.total > 0 
                          ? (coverage.detected.size / coverage.total) * 100 
                          : 0;
                        
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
                                {coverage.detected.size}/{coverage.total}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-text-secondary">Coverage</span>
                                <span className="text-text-primary font-medium">{Math.round(percentage)}%</span>
                              </div>
                              <Progress value={percentage} className="h-1.5" />
                            </div>
                            {coverage.detected.size > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {Array.from(coverage.detected).map(tech => (
                                  <Badge key={tech} variant="outline" className="text-xs font-mono bg-green-500/10 border-green-500/30 text-green-400">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {activeView === "actors" && (
                <div className="bg-editor-bg rounded border border-border p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-semibold">Threat Actor TTP Mapping</h3>
                  </div>
                  {actorProfiles.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-8">
                      No threat actors with mapped techniques found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {actorProfiles.map(({ actor, techniqueCount, tacticsUsed, linkedCampaigns }) => (
                        <Card key={actor.id} className="bg-sidebar-bg border-border p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-sm font-medium text-text-primary">{actor.name}</div>
                              <div className="text-xs text-text-muted">
                                {actor.country_of_origin || "Unknown"} • {actor.sophistication || "Unknown"} sophistication
                              </div>
                            </div>
                            <Badge 
                              variant={actor.is_active ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {actor.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-4 text-xs text-text-muted mb-2">
                            <span>{techniqueCount} techniques</span>
                            <span>{tacticsUsed.length} tactics</span>
                            <span>{linkedCampaigns} campaigns</span>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs text-text-secondary">Tactic Coverage:</div>
                            <div className="flex flex-wrap gap-1">
                              {MITRE_TACTICS.map(tactic => {
                                const isUsed = tacticsUsed.includes(tactic.id);
                                return (
                                  <Badge 
                                    key={tactic.id}
                                    variant="outline" 
                                    className={`text-xs ${isUsed ? `${tactic.color} bg-opacity-20 border-current` : 'opacity-30'}`}
                                  >
                                    {tactic.name.split(' ')[0]}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>

                          {actor.known_ttps && actor.known_ttps.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-text-secondary mb-1">Known TTPs:</div>
                              <div className="flex flex-wrap gap-1">
                                {actor.known_ttps.filter(t => t.startsWith("T")).slice(0, 8).map(ttp => (
                                  <Badge key={ttp} variant="outline" className="text-xs font-mono">
                                    {ttp}
                                  </Badge>
                                ))}
                                {actor.known_ttps.filter(t => t.startsWith("T")).length > 8 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{actor.known_ttps.filter(t => t.startsWith("T")).length - 8} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeView === "techniques" && (
                <div className="bg-editor-bg rounded border border-border p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold">All Detected Techniques</h3>
                  </div>
                  {detectedTechniques.size === 0 ? (
                    <p className="text-xs text-text-muted text-center py-8">
                      No techniques detected yet. Add threat actors or campaigns with TTPs.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Array.from(detectedTechniques).sort().map((tech) => {
                        const tacticId = TECHNIQUE_TACTIC_MAP[tech];
                        const tactic = MITRE_TACTICS.find(t => t.id === tacticId);
                        
                        // Find which actors/campaigns use this technique
                        const usedByActors = actors.filter(a => a.known_ttps?.includes(tech));
                        const usedByCampaigns = campaigns.filter(c => c.techniques_used?.includes(tech));
                        
                        return (
                          <Card key={tech} className="bg-sidebar-bg border-border p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium font-mono text-text-primary">{tech}</div>
                                  <div className="text-xs text-text-muted">{tactic?.name || "Unknown Tactic"}</div>
                                </div>
                              </div>
                              {tactic && (
                                <div className={`w-2 h-2 rounded-full ${tactic.color}`} />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {usedByActors.map(actor => (
                                <Badge key={actor.id} variant="outline" className="text-xs bg-red-500/10 border-red-500/30 text-red-400">
                                  <Users className="w-3 h-3 mr-1" />
                                  {actor.name}
                                </Badge>
                              ))}
                              {usedByCampaigns.map(campaign => (
                                <Badge key={campaign.id} variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400">
                                  <Crosshair className="w-3 h-3 mr-1" />
                                  {campaign.name}
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-panel-border px-4 py-2 bg-statusbar-bg">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>MITRE ATT&CK Enterprise v14.1</span>
          <span className="text-green-400">Live Data</span>
        </div>
      </div>
    </div>
  );
};

export default MitreAttackPanel;
