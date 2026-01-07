import { useState, useMemo } from "react";
import { Activity, Users, Crosshair, AlertTriangle, Database, Wifi, TrendingUp, Shield, Zap, Link2, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs, useSecurityEvents } from "@/hooks/useSecurityData";
import { useNetworkAssets } from "@/hooks/useNetworkAssets";
import { useInvestigations } from "@/hooks/useInvestigations";
import { format, subDays, isAfter } from "date-fns";

const GlobalThreatDashboard = () => {
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const { assets, compromisedAssets } = useNetworkAssets();
  const { investigations } = useInvestigations();

  // Compute correlations and metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const last24h = subDays(now, 1);
    const last7d = subDays(now, 7);

    // Active threats
    const activeActors = actors.filter(a => a.is_active).length;
    const activeCampaigns = campaigns.filter(c => c.status === "active").length;
    const activeIOCs = iocs.filter(i => i.is_active).length;
    const criticalIOCs = iocs.filter(i => i.threat_level === "critical").length;
    
    // Recent events
    const recentEvents = events.filter(e => isAfter(new Date(e.detected_at), last24h));
    const criticalEvents = recentEvents.filter(e => e.severity === "critical");
    const highEvents = recentEvents.filter(e => e.severity === "high");

    // Open investigations
    const openInvestigations = investigations.filter(i => i.status === "open" || i.status === "in_progress");
    const criticalInvestigations = investigations.filter(i => i.priority === "critical");

    // Risk score
    const avgRiskScore = assets.length > 0 
      ? Math.round(assets.reduce((sum, a) => sum + (a.risk_score || 0), 0) / assets.length)
      : 0;

    return {
      activeActors,
      activeCampaigns,
      activeIOCs,
      criticalIOCs,
      recentEventsCount: recentEvents.length,
      criticalEventsCount: criticalEvents.length,
      highEventsCount: highEvents.length,
      compromisedCount: compromisedAssets.length,
      totalAssets: assets.length,
      openInvestigations: openInvestigations.length,
      criticalInvestigations: criticalInvestigations.length,
      avgRiskScore
    };
  }, [actors, campaigns, iocs, events, assets, compromisedAssets, investigations]);

  // Actor-Campaign correlations
  const actorCampaignCorrelations = useMemo(() => {
    return actors.map(actor => {
      const linkedCampaigns = campaigns.filter(c => c.threat_actor_id === actor.id);
      const linkedIOCs = iocs.filter(i => actor.related_iocs?.includes(i.id));
      
      // Find techniques across campaigns
      const allTechniques = linkedCampaigns.flatMap(c => c.techniques_used || []);
      const uniqueTechniques = [...new Set(allTechniques)];

      return {
        actor,
        campaignCount: linkedCampaigns.length,
        iocCount: linkedIOCs.length,
        techniqueCount: uniqueTechniques.length,
        activeCampaigns: linkedCampaigns.filter(c => c.status === "active").length
      };
    }).filter(c => c.campaignCount > 0 || c.iocCount > 0);
  }, [actors, campaigns, iocs]);

  // IOC to Asset correlations (simplified)
  const iocAssetCorrelations = useMemo(() => {
    const correlations: { ioc: typeof iocs[0]; affectedAssets: typeof assets }[] = [];
    
    iocs.filter(i => i.is_active && i.ioc_type === "ip").forEach(ioc => {
      const affectedAssets = assets.filter(a => 
        a.ip_address === ioc.value || a.is_compromised
      );
      if (affectedAssets.length > 0) {
        correlations.push({ ioc, affectedAssets });
      }
    });

    return correlations.slice(0, 5);
  }, [iocs, assets]);

  // Severity distribution
  const severityDistribution = useMemo(() => {
    const dist = { critical: 0, high: 0, medium: 0, low: 0 };
    events.forEach(e => {
      if (e.severity in dist) {
        dist[e.severity as keyof typeof dist]++;
      }
    });
    return dist;
  }, [events]);

  return (
    <div className="h-full flex flex-col text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border bg-gradient-to-r from-red-500/10 to-purple-500/10">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-red-400" />
          <span className="text-sm font-semibold">Global Threat Dashboard</span>
          <Badge variant="outline" className="text-xs animate-pulse bg-red-500/20 border-red-500/30 text-red-400">
            LIVE
          </Badge>
        </div>
        <p className="text-xs text-text-muted">Real-time correlation of actors, campaigns, IOCs, and assets</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-red-500/10 border-red-500/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-red-400" />
                <span className="text-xs text-text-muted">Active Actors</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{metrics.activeActors}</div>
              <div className="text-xs text-text-muted">{metrics.activeCampaigns} active campaigns</div>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-text-muted">Active IOCs</span>
              </div>
              <div className="text-2xl font-bold text-orange-400">{metrics.activeIOCs}</div>
              <div className="text-xs text-red-400">{metrics.criticalIOCs} critical</div>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-text-muted">Events (24h)</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{metrics.recentEventsCount}</div>
              <div className="text-xs text-red-400">{metrics.criticalEventsCount} critical, {metrics.highEventsCount} high</div>
            </Card>

            <Card className="bg-cyan-500/10 border-cyan-500/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-text-muted">Compromised Assets</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.compromisedCount}</div>
              <div className="text-xs text-text-muted">of {metrics.totalAssets} total</div>
            </Card>
          </div>

          {/* Risk Score */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Overall Risk Score</span>
              </div>
              <Badge 
                className={`text-xs ${
                  metrics.avgRiskScore >= 70 ? "bg-red-500/20 text-red-400 border-red-500/30" :
                  metrics.avgRiskScore >= 40 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                  "bg-green-500/20 text-green-400 border-green-500/30"
                }`}
              >
                {metrics.avgRiskScore >= 70 ? "CRITICAL" : metrics.avgRiskScore >= 40 ? "ELEVATED" : "NORMAL"}
              </Badge>
            </div>
            <Progress 
              value={metrics.avgRiskScore} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>0</span>
              <span className="font-medium text-text-primary">{metrics.avgRiskScore}/100</span>
              <span>100</span>
            </div>
          </Card>

          {/* Severity Distribution */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Event Severity Distribution</span>
            </div>
            <div className="space-y-2">
              {Object.entries(severityDistribution).map(([severity, count]) => {
                const total = Object.values(severityDistribution).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colors: Record<string, string> = {
                  critical: "bg-red-500",
                  high: "bg-orange-500",
                  medium: "bg-yellow-500",
                  low: "bg-green-500"
                };
                return (
                  <div key={severity} className="flex items-center gap-2">
                    <span className="text-xs w-16 capitalize text-text-muted">{severity}</span>
                    <div className="flex-1 h-2 bg-sidebar-bg rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[severity]} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Actor-Campaign Correlations */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium">Actor-Campaign Correlations</span>
            </div>
            {actorCampaignCorrelations.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">No correlations found</p>
            ) : (
              <div className="space-y-2">
                {actorCampaignCorrelations.slice(0, 5).map(({ actor, campaignCount, iocCount, techniqueCount, activeCampaigns }) => (
                  <div key={actor.id} className="bg-sidebar-bg rounded p-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">{actor.name}</div>
                        <div className="text-xs text-text-muted">{actor.country_of_origin || "Unknown origin"}</div>
                      </div>
                      {activeCampaigns > 0 && (
                        <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          {activeCampaigns} active
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-purple-400" />
                        <span>{campaignCount} campaigns</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-orange-400" />
                        <span>{iocCount} IOCs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>{techniqueCount} TTPs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* IOC-Asset Correlations */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">IOC-Asset Impact</span>
            </div>
            {iocAssetCorrelations.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">No IOC-Asset correlations detected</p>
            ) : (
              <div className="space-y-2">
                {iocAssetCorrelations.map(({ ioc, affectedAssets }) => (
                  <div key={ioc.id} className="bg-sidebar-bg rounded p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {ioc.ioc_type}
                        </Badge>
                        <span className="text-xs font-mono truncate max-w-[120px]">{ioc.value}</span>
                      </div>
                      <Badge className={`text-xs ${
                        ioc.threat_level === "critical" ? "bg-red-500/20 text-red-400" :
                        ioc.threat_level === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {ioc.threat_level}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                      <Wifi className="w-3 h-3" />
                      <span>{affectedAssets.length} affected assets</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Open Investigations */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Active Investigations</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {metrics.openInvestigations} open
              </Badge>
            </div>
            {metrics.criticalInvestigations > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-xs text-red-400">
                ⚠️ {metrics.criticalInvestigations} critical priority investigation(s) require attention
              </div>
            )}
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GlobalThreatDashboard;
