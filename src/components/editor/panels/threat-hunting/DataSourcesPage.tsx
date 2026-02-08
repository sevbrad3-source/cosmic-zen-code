import { useState } from "react";
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings, Activity, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "connected" | "degraded" | "disconnected";
  eventsPerSecond: number;
  lastEvent: string;
  coverage: number;
  lag: string;
  enabled: boolean;
}

const DataSourcesPage = () => {
  const [dataSources] = useState<DataSource[]>([
    { id: "1", name: "Windows Event Logs", type: "Endpoint", status: "connected", eventsPerSecond: 2847, lastEvent: "< 1s", coverage: 95, lag: "2s", enabled: true },
    { id: "2", name: "Sysmon", type: "Endpoint", status: "connected", eventsPerSecond: 1523, lastEvent: "< 1s", coverage: 88, lag: "1s", enabled: true },
    { id: "3", name: "EDR Telemetry", type: "Endpoint", status: "connected", eventsPerSecond: 4521, lastEvent: "< 1s", coverage: 92, lag: "3s", enabled: true },
    { id: "4", name: "Network Flow", type: "Network", status: "connected", eventsPerSecond: 8934, lastEvent: "< 1s", coverage: 100, lag: "5s", enabled: true },
    { id: "5", name: "Firewall Logs", type: "Network", status: "degraded", eventsPerSecond: 156, lastEvent: "45s", coverage: 78, lag: "1m", enabled: true },
    { id: "6", name: "DNS Logs", type: "Network", status: "connected", eventsPerSecond: 3421, lastEvent: "< 1s", coverage: 100, lag: "2s", enabled: true },
    { id: "7", name: "Proxy Logs", type: "Network", status: "connected", eventsPerSecond: 2156, lastEvent: "< 1s", coverage: 85, lag: "4s", enabled: true },
    { id: "8", name: "Active Directory", type: "Identity", status: "connected", eventsPerSecond: 892, lastEvent: "2s", coverage: 100, lag: "3s", enabled: true },
    { id: "9", name: "Cloud Trail", type: "Cloud", status: "disconnected", eventsPerSecond: 0, lastEvent: "2h ago", coverage: 0, lag: "-", enabled: false },
    { id: "10", name: "Email Gateway", type: "Email", status: "connected", eventsPerSecond: 234, lastEvent: "5s", coverage: 100, lag: "10s", enabled: true },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-[hsl(120,100%,45%)]" />;
      case "degraded": return <AlertTriangle className="w-4 h-4 text-[hsl(45,100%,50%)]" />;
      default: return <XCircle className="w-4 h-4 text-[hsl(0,100%,50%)]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-[hsl(120,100%,20%)] text-[hsl(120,100%,70%)] border-[hsl(120,100%,30%)]";
      case "degraded": return "bg-[hsl(45,100%,15%)] text-[hsl(45,100%,70%)] border-[hsl(45,100%,35%)]";
      default: return "bg-[hsl(0,100%,15%)] text-[hsl(0,100%,70%)] border-[hsl(0,100%,30%)]";
    }
  };

  const stats = {
    connected: dataSources.filter(d => d.status === "connected").length,
    degraded: dataSources.filter(d => d.status === "degraded").length,
    disconnected: dataSources.filter(d => d.status === "disconnected").length,
    totalEPS: dataSources.reduce((acc, d) => acc + d.eventsPerSecond, 0),
  };

  const groupedSources = dataSources.reduce((acc, ds) => {
    if (!acc[ds.type]) acc[ds.type] = [];
    acc[ds.type].push(ds);
    return acc;
  }, {} as Record<string, DataSource[]>);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.connected}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Connected</div>
        </div>
        <div className="p-2 bg-[hsl(45,100%,8%)] border border-[hsl(45,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(45,100%,55%)]">{stats.degraded}</div>
          <div className="text-[9px] text-[hsl(45,60%,50%)]">Degraded</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,55%)]">{stats.disconnected}</div>
          <div className="text-[9px] text-[hsl(0,60%,50%)]">Offline</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">{(stats.totalEPS / 1000).toFixed(1)}k</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">EPS</div>
        </div>
      </div>

      {/* Data Sources by Type */}
      {Object.entries(groupedSources).map(([type, sources]) => (
        <div key={type} className="space-y-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-xs font-semibold text-[hsl(210,100%,75%)] uppercase">{type}</span>
            <Badge className="text-[9px] bg-[hsl(210,100%,25%)]">{sources.length}</Badge>
          </div>
          
          <div className="space-y-1">
            {sources.map((ds) => (
              <div
                key={ds.id}
                className={`p-2.5 rounded-lg border transition-colors ${
                  ds.enabled
                    ? "bg-[hsl(210,100%,7%)] border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]"
                    : "bg-[hsl(210,50%,5%)] border-[hsl(210,50%,12%)] opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ds.status)}
                    <span className="text-sm text-[hsl(210,100%,85%)]">{ds.name}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${getStatusColor(ds.status)}`}>
                    {ds.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <div className="text-[hsl(210,60%,45%)]">EPS</div>
                    <div className="text-[hsl(210,100%,75%)] font-mono">{ds.eventsPerSecond.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[hsl(210,60%,45%)]">Last Event</div>
                    <div className="text-[hsl(210,100%,75%)]">{ds.lastEvent}</div>
                  </div>
                  <div>
                    <div className="text-[hsl(210,60%,45%)]">Coverage</div>
                    <div className="flex items-center gap-1">
                      <Progress value={ds.coverage} className="h-1 w-12" />
                      <span className="text-[hsl(210,100%,75%)]">{ds.coverage}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[hsl(210,60%,45%)]">Lag</div>
                    <div className="text-[hsl(210,100%,75%)]">{ds.lag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] border-[hsl(210,100%,25%)]">
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh All
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] border-[hsl(210,100%,25%)]">
          <Settings className="w-3 h-3 mr-1" /> Configure
        </Button>
      </div>
    </div>
  );
};

export default DataSourcesPage;
