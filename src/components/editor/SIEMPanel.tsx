import { useState } from "react";
import { Activity, Search, Filter, Clock, AlertTriangle, TrendingUp, Database, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SIEMPanel = () => {
  const [timeRange, setTimeRange] = useState("1h");

  const alerts = [
    { id: 1, severity: "critical", rule: "Mimikatz Detection", source: "DC01", count: 3, time: "2 min ago" },
    { id: 2, severity: "high", rule: "Brute Force Attempt", source: "WEB-01", count: 47, time: "5 min ago" },
    { id: 3, severity: "medium", rule: "Suspicious DNS Query", source: "WKS-15", count: 12, time: "8 min ago" },
    { id: 4, severity: "low", rule: "New Service Installed", source: "SRV-03", count: 1, time: "15 min ago" },
  ];

  const queryExamples = [
    "EventID:4625 AND TargetUserName:admin*",
    "process.name:powershell.exe AND process.command_line:*-enc*",
    "destination.port:4444 OR destination.port:5555",
  ];

  const metrics = [
    { label: "Events/sec", value: "12,847", trend: "+5.2%" },
    { label: "Alerts Today", value: "234", trend: "-12%" },
    { label: "Critical", value: "7", trend: "+2" },
    { label: "Data Sources", value: "42", trend: "stable" },
  ];

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header with time range */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">SIEM ANALYTICS</span>
        </div>
        <div className="flex items-center gap-1">
          {["15m", "1h", "24h", "7d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-0.5 text-[10px] rounded ${
                timeRange === range
                  ? "bg-[hsl(210,100%,30%)] text-white"
                  : "text-[hsl(210,60%,50%)] hover:bg-[hsl(210,100%,15%)]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric, i) => (
          <div key={i} className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded">
            <div className="text-lg font-bold text-[hsl(210,100%,80%)]">{metric.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[hsl(210,60%,50%)]">{metric.label}</span>
              <span
                className={`text-[9px] ${
                  metric.trend.startsWith("+")
                    ? "text-[hsl(0,100%,60%)]"
                    : metric.trend.startsWith("-")
                    ? "text-[hsl(120,100%,50%)]"
                    : "text-[hsl(210,60%,50%)]"
                }`}
              >
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search Query */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Search className="w-3 h-3 text-[hsl(210,60%,50%)]" />
          <input
            type="text"
            placeholder="Enter KQL query..."
            className="flex-1 h-7 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,20%)] rounded px-2 text-xs text-[hsl(210,100%,85%)] placeholder:text-[hsl(210,60%,40%)]"
          />
          <button className="p-1.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded">
            <Play className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {queryExamples.map((query, i) => (
            <button
              key={i}
              className="px-2 py-0.5 text-[9px] bg-[hsl(210,100%,12%)] hover:bg-[hsl(210,100%,18%)] rounded font-mono truncate max-w-full"
            >
              {query.slice(0, 30)}...
            </button>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Active Alerts</span>
          <button className="p-1 hover:bg-[hsl(210,100%,15%)] rounded">
            <RefreshCw className="w-3 h-3 text-[hsl(210,60%,50%)]" />
          </button>
        </div>
        <div className="space-y-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded hover:border-[hsl(210,100%,30%)] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === "critical"
                        ? "bg-[hsl(0,100%,50%)] animate-pulse"
                        : alert.severity === "high"
                        ? "bg-[hsl(30,100%,50%)]"
                        : alert.severity === "medium"
                        ? "bg-[hsl(60,100%,50%)]"
                        : "bg-[hsl(210,60%,50%)]"
                    }`}
                  />
                  <span className="text-xs font-medium">{alert.rule}</span>
                </div>
                <Badge variant="outline" className="text-[9px] border-[hsl(210,100%,30%)]">
                  x{alert.count}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[hsl(210,60%,50%)]">{alert.source}</span>
                <span className="text-[10px] text-[hsl(210,60%,40%)]">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
        <div className="text-[10px] text-[hsl(210,60%,50%)] mb-2">Event Distribution (Last Hour)</div>
        <div className="flex h-8 gap-0.5">
          {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60, 85, 50].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-[hsl(210,100%,40%)] rounded-t"
              style={{ height: `${height}%`, alignSelf: "flex-end" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Play = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default SIEMPanel;
