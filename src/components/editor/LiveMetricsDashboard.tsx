import { useState, useEffect, useMemo } from "react";
import { 
  Activity, TrendingUp, TrendingDown, AlertTriangle, Shield,
  Zap, Clock, Target, BarChart3, PieChart, LineChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs, useSecurityEvents } from "@/hooks/useSecurityData";
import { useNetworkAssets } from "@/hooks/useNetworkAssets";
import { format, subHours, isAfter } from "date-fns";

const LiveMetricsDashboard = () => {
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const { assets, compromisedAssets } = useNetworkAssets();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatingMetrics, setAnimatingMetrics] = useState<Record<string, boolean>>({});

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate live metrics
  const liveMetrics = useMemo(() => {
    const now = new Date();
    const last1h = subHours(now, 1);
    const last24h = subHours(now, 24);

    const recentEvents = events.filter(e => isAfter(new Date(e.detected_at), last1h));
    const dailyEvents = events.filter(e => isAfter(new Date(e.detected_at), last24h));
    
    const criticalEvents = recentEvents.filter(e => e.severity === "critical");
    const highEvents = recentEvents.filter(e => e.severity === "high");
    
    const eventsPerHour = dailyEvents.length / 24;
    const criticalRate = dailyEvents.length > 0 
      ? (dailyEvents.filter(e => e.severity === "critical").length / dailyEvents.length) * 100 
      : 0;

    return {
      eventsLast1h: recentEvents.length,
      eventsLast24h: dailyEvents.length,
      criticalLast1h: criticalEvents.length,
      highLast1h: highEvents.length,
      avgEventsPerHour: Math.round(eventsPerHour),
      criticalRate: Math.round(criticalRate),
      activeActors: actors.filter(a => a.is_active).length,
      activeCampaigns: campaigns.filter(c => c.status === "active").length,
      activeIOCs: iocs.filter(i => i.is_active).length,
      compromisedAssets: compromisedAssets.length,
      totalAssets: assets.length
    };
  }, [actors, campaigns, iocs, events, assets, compromisedAssets]);

  // Trend analysis
  const trends = useMemo(() => {
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    events.forEach(e => {
      if (e.severity in severityCounts) {
        severityCounts[e.severity as keyof typeof severityCounts]++;
      }
    });

    const totalEvents = events.length || 1;
    return {
      severity: Object.entries(severityCounts).map(([key, value]) => ({
        name: key,
        value,
        percentage: Math.round((value / totalEvents) * 100)
      })),
      eventTypes: Object.entries(
        events.reduce((acc, e) => {
          acc[e.event_type] = (acc[e.event_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).slice(0, 5).map(([type, count]) => ({ type, count }))
    };
  }, [events]);

  // Sparkline-style mini charts
  const renderMiniChart = (data: number[], color: string) => {
    const max = Math.max(...data, 1);
    return (
      <div className="flex items-end gap-0.5 h-6">
        {data.map((value, i) => (
          <div
            key={i}
            className={`w-1 rounded-t transition-all ${color}`}
            style={{ height: `${(value / max) * 100}%`, minHeight: "2px" }}
          />
        ))}
      </div>
    );
  };

  const getHealthStatus = () => {
    const criticalRatio = liveMetrics.criticalRate;
    const compromiseRatio = liveMetrics.totalAssets > 0 
      ? (liveMetrics.compromisedAssets / liveMetrics.totalAssets) * 100 
      : 0;

    if (criticalRatio > 30 || compromiseRatio > 20) {
      return { status: "CRITICAL", color: "text-red-400", bg: "bg-red-500/20" };
    }
    if (criticalRatio > 15 || compromiseRatio > 10) {
      return { status: "ELEVATED", color: "text-orange-400", bg: "bg-orange-500/20" };
    }
    if (criticalRatio > 5 || compromiseRatio > 5) {
      return { status: "GUARDED", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    }
    return { status: "NORMAL", color: "text-green-400", bg: "bg-green-500/20" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="h-full flex flex-col text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold">Live Attack Metrics</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${healthStatus.bg} ${healthStatus.color}`}>
              {healthStatus.status}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {format(currentTime, "HH:mm:ss")}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Real-time Event Counters */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-text-muted">Events (1h)</span>
                </div>
                <TrendingUp className="w-3 h-3 text-red-400" />
              </div>
              <div className="text-2xl font-bold">{liveMetrics.eventsLast1h}</div>
              {renderMiniChart([3, 5, 2, 7, 4, 6, liveMetrics.eventsLast1h], "bg-yellow-400")}
            </Card>

            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-text-muted">Critical (1h)</span>
                </div>
                {liveMetrics.criticalLast1h > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </div>
              <div className="text-2xl font-bold text-red-400">{liveMetrics.criticalLast1h}</div>
              {renderMiniChart([1, 0, 2, 1, 0, 1, liveMetrics.criticalLast1h], "bg-red-400")}
            </Card>

            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-text-muted">Active Campaigns</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-400">{liveMetrics.activeCampaigns}</div>
              <div className="text-xs text-text-muted mt-1">
                {liveMetrics.activeActors} threat actors
              </div>
            </Card>

            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-text-muted">Compromised</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {liveMetrics.compromisedAssets}
                <span className="text-sm text-text-muted">/{liveMetrics.totalAssets}</span>
              </div>
              <Progress 
                value={(liveMetrics.compromisedAssets / Math.max(liveMetrics.totalAssets, 1)) * 100} 
                className="h-1 mt-2" 
              />
            </Card>
          </div>

          {/* Severity Distribution */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Severity Distribution</span>
            </div>
            <div className="space-y-2">
              {trends.severity.map(sev => {
                const colors: Record<string, string> = {
                  critical: "bg-red-500",
                  high: "bg-orange-500",
                  medium: "bg-yellow-500",
                  low: "bg-green-500"
                };
                return (
                  <div key={sev.name} className="flex items-center gap-2">
                    <span className="text-xs w-14 capitalize text-text-muted">{sev.name}</span>
                    <div className="flex-1 h-3 bg-sidebar-bg rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[sev.name]} transition-all duration-500`}
                        style={{ width: `${sev.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{sev.value} ({sev.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Event Types */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Top Event Types</span>
            </div>
            <div className="space-y-2">
              {trends.eventTypes.map((et, i) => (
                <div key={et.type} className="flex items-center gap-2">
                  <span className="text-xs w-24 truncate text-text-muted">{et.type}</span>
                  <div className="flex-1 h-2 bg-sidebar-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all"
                      style={{ width: `${Math.min(100, (et.count / Math.max(...trends.eventTypes.map(e => e.count), 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs w-8 text-right">{et.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Rate Metrics */}
          <Card className="bg-editor-bg border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <LineChart className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Rate Analysis</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sidebar-bg rounded p-2">
                <div className="text-xs text-text-muted mb-1">Avg Events/Hour</div>
                <div className="text-lg font-bold">{liveMetrics.avgEventsPerHour}</div>
              </div>
              <div className="bg-sidebar-bg rounded p-2">
                <div className="text-xs text-text-muted mb-1">Critical Rate</div>
                <div className="text-lg font-bold text-red-400">{liveMetrics.criticalRate}%</div>
              </div>
              <div className="bg-sidebar-bg rounded p-2">
                <div className="text-xs text-text-muted mb-1">Active IOCs</div>
                <div className="text-lg font-bold text-orange-400">{liveMetrics.activeIOCs}</div>
              </div>
              <div className="bg-sidebar-bg rounded p-2">
                <div className="text-xs text-text-muted mb-1">Events (24h)</div>
                <div className="text-lg font-bold">{liveMetrics.eventsLast24h}</div>
              </div>
            </div>
          </Card>

          {/* System Health */}
          <Card className={`border p-3 ${healthStatus.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">System Status</span>
              </div>
              <Badge className={`text-xs ${healthStatus.bg} ${healthStatus.color}`}>
                {healthStatus.status}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-text-muted">
              Last updated: {format(currentTime, "yyyy-MM-dd HH:mm:ss")}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default LiveMetricsDashboard;
