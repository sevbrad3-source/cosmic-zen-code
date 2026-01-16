import { useState, useMemo } from "react";
import { 
  Calculator, TrendingUp, Shield, AlertTriangle, Target,
  Zap, Users, Database, Wifi, RefreshCw, ChevronRight, Activity
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs, useSecurityEvents } from "@/hooks/useSecurityData";
import { useNetworkAssets } from "@/hooks/useNetworkAssets";

interface ThreatScore {
  id: string;
  name: string;
  type: "actor" | "campaign" | "ioc" | "asset";
  score: number;
  breakdown: {
    severity: number;
    sophistication: number;
    assetCriticality: number;
    activeStatus: number;
    historical: number;
  };
  trend: "rising" | "stable" | "falling";
  lastUpdated: Date;
}

const ThreatScoringPanel = () => {
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const { assets, compromisedAssets } = useNetworkAssets();
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedScore, setSelectedScore] = useState<ThreatScore | null>(null);

  // Calculate threat scores for all entities
  const threatScores = useMemo(() => {
    const scores: ThreatScore[] = [];

    // Score threat actors
    actors.forEach(actor => {
      const sophisticationMap: Record<string, number> = {
        "advanced": 90, "intermediate": 60, "basic": 30, "unknown": 50
      };
      const sophScore = sophisticationMap[actor.sophistication || "unknown"];
      
      const linkedCampaigns = campaigns.filter(c => c.threat_actor_id === actor.id);
      const activeCampaigns = linkedCampaigns.filter(c => c.status === "active").length;
      
      const severity = Math.min(100, activeCampaigns * 25 + (actor.is_active ? 30 : 0));
      const historical = Math.min(100, (actor.known_ttps?.length || 0) * 10);
      const assetCriticality = compromisedAssets.length > 0 ? 70 : 20;

      const totalScore = Math.round(
        severity * 0.3 + sophScore * 0.25 + assetCriticality * 0.2 + 
        (actor.is_active ? 50 : 0) * 0.15 + historical * 0.1
      );

      scores.push({
        id: actor.id,
        name: actor.name,
        type: "actor",
        score: totalScore,
        breakdown: {
          severity,
          sophistication: sophScore,
          assetCriticality,
          activeStatus: actor.is_active ? 100 : 0,
          historical
        },
        trend: actor.is_active ? "rising" : "stable",
        lastUpdated: new Date()
      });
    });

    // Score IOCs
    iocs.forEach(ioc => {
      const threatLevelMap: Record<string, number> = {
        "critical": 95, "high": 75, "medium": 50, "low": 25, "info": 10
      };
      const severity = threatLevelMap[ioc.threat_level] || 50;
      const activeStatus = ioc.is_active ? 100 : 20;
      
      // Check if IOC matches any assets
      const matchingAssets = assets.filter(a => 
        a.ip_address === ioc.value || a.is_compromised
      );
      const assetCriticality = Math.min(100, matchingAssets.length * 30);

      const totalScore = Math.round(
        severity * 0.35 + activeStatus * 0.25 + assetCriticality * 0.25 + 
        ((ioc.tags?.length || 0) * 5) * 0.15
      );

      scores.push({
        id: ioc.id,
        name: ioc.value,
        type: "ioc",
        score: totalScore,
        breakdown: {
          severity,
          sophistication: 50,
          assetCriticality,
          activeStatus,
          historical: (ioc.tags?.length || 0) * 10
        },
        trend: ioc.is_active ? "rising" : "falling",
        lastUpdated: new Date()
      });
    });

    // Score campaigns
    campaigns.forEach(camp => {
      const statusMap: Record<string, number> = {
        "active": 90, "planned": 60, "completed": 30, "archived": 10
      };
      const activeStatus = statusMap[camp.status] || 50;
      const severity = Math.min(100, (camp.techniques_used?.length || 0) * 15);
      const sophistication = Math.min(100, (camp.tools_used?.length || 0) * 20);

      const totalScore = Math.round(
        severity * 0.3 + sophistication * 0.25 + activeStatus * 0.3 + 
        ((camp.objectives?.length || 0) * 15) * 0.15
      );

      scores.push({
        id: camp.id,
        name: camp.name,
        type: "campaign",
        score: totalScore,
        breakdown: {
          severity,
          sophistication,
          assetCriticality: 50,
          activeStatus,
          historical: (camp.techniques_used?.length || 0) * 8
        },
        trend: camp.status === "active" ? "rising" : "stable",
        lastUpdated: new Date()
      });
    });

    // Sort by score descending
    return scores.sort((a, b) => b.score - a.score);
  }, [actors, campaigns, iocs, assets, compromisedAssets]);

  // Overall risk metrics
  const overallMetrics = useMemo(() => {
    const avgScore = threatScores.length > 0 
      ? Math.round(threatScores.reduce((sum, s) => sum + s.score, 0) / threatScores.length)
      : 0;
    const criticalCount = threatScores.filter(s => s.score >= 80).length;
    const highCount = threatScores.filter(s => s.score >= 60 && s.score < 80).length;
    const risingCount = threatScores.filter(s => s.trend === "rising").length;

    return { avgScore, criticalCount, highCount, risingCount };
  }, [threatScores]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-red-500/20 border-red-500/30";
    if (score >= 60) return "bg-orange-500/20 border-orange-500/30";
    if (score >= 40) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-green-500/20 border-green-500/30";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "actor": return Users;
      case "campaign": return Target;
      case "ioc": return Database;
      case "asset": return Wifi;
      default: return Shield;
    }
  };

  const recalculateScores = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 2000);
  };

  return (
    <div className="h-full flex flex-col text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-semibold">Automated Threat Scoring</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs gap-1"
            onClick={recalculateScores}
            disabled={isCalculating}
          >
            <RefreshCw className={`w-3 h-3 ${isCalculating ? "animate-spin" : ""}`} />
            Recalculate
          </Button>
        </div>
        <p className="text-xs text-text-muted">Risk scoring based on IOC severity, actor sophistication, and asset criticality</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Overall Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-text-muted">Avg. Threat Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(overallMetrics.avgScore)}`}>
                {overallMetrics.avgScore}
              </div>
              <Progress value={overallMetrics.avgScore} className="h-1 mt-2" />
            </Card>
            
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-xs text-text-muted">Rising Threats</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {overallMetrics.risingCount}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {overallMetrics.criticalCount} critical, {overallMetrics.highCount} high
              </div>
            </Card>
          </div>

          {/* Scoring Breakdown (if selected) */}
          {selectedScore && (
            <Card className={`border p-3 ${getScoreBg(selectedScore.score)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getTypeIcon(selectedScore.type);
                    return <Icon className="w-4 h-4" />;
                  })()}
                  <span className="text-sm font-medium">{selectedScore.name}</span>
                </div>
                <div className={`text-xl font-bold ${getScoreColor(selectedScore.score)}`}>
                  {selectedScore.score}
                </div>
              </div>
              
              <div className="space-y-2">
                {Object.entries(selectedScore.breakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-24 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Progress value={value} className="flex-1 h-1.5" />
                    <span className="text-xs w-8 text-right">{value}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 w-full text-xs"
                onClick={() => setSelectedScore(null)}
              >
                Close Breakdown
              </Button>
            </Card>
          )}

          {/* Threat Score List */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Prioritized Threats</span>
              <Badge variant="outline" className="text-xs ml-auto">
                {threatScores.length} entities
              </Badge>
            </div>
            
            <div className="space-y-1">
              {threatScores.slice(0, 15).map(score => {
                const Icon = getTypeIcon(score.type);
                return (
                  <div 
                    key={score.id}
                    onClick={() => setSelectedScore(score)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedScore?.id === score.id 
                        ? "bg-primary/20 border border-primary/30" 
                        : "bg-sidebar-bg hover:bg-sidebar-hover"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{score.name}</div>
                      <div className="text-xs text-text-muted capitalize">{score.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {score.trend === "rising" && (
                        <TrendingUp className="w-3 h-3 text-red-400" />
                      )}
                      {score.trend === "falling" && (
                        <Activity className="w-3 h-3 text-green-400" />
                      )}
                      <Badge className={`text-xs ${getScoreBg(score.score)}`}>
                        {score.score}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Scoring Weights */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Scoring Algorithm</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-sidebar-bg rounded p-2">
                <span className="text-text-muted">Severity</span>
                <span className="float-right">30%</span>
              </div>
              <div className="bg-sidebar-bg rounded p-2">
                <span className="text-text-muted">Sophistication</span>
                <span className="float-right">25%</span>
              </div>
              <div className="bg-sidebar-bg rounded p-2">
                <span className="text-text-muted">Asset Criticality</span>
                <span className="float-right">20%</span>
              </div>
              <div className="bg-sidebar-bg rounded p-2">
                <span className="text-text-muted">Active Status</span>
                <span className="float-right">15%</span>
              </div>
              <div className="bg-sidebar-bg rounded p-2 col-span-2">
                <span className="text-text-muted">Historical Intelligence</span>
                <span className="float-right">10%</span>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThreatScoringPanel;
