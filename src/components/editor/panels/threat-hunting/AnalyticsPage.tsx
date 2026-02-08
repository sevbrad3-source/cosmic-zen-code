import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Activity, Calendar, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("24h");

  const metrics = [
    { label: "Total Hunts", value: "47", change: "+12%", trend: "up" },
    { label: "Findings", value: "234", change: "+28%", trend: "up" },
    { label: "IOCs Discovered", value: "89", change: "+15%", trend: "up" },
    { label: "MTTD", value: "4.2h", change: "-18%", trend: "down" },
  ];

  const topTechniques = [
    { technique: "T1055 - Process Injection", hunts: 12, findings: 34 },
    { technique: "T1003 - Credential Dumping", hunts: 8, findings: 28 },
    { technique: "T1071 - Application Layer Protocol", hunts: 7, findings: 19 },
    { technique: "T1021 - Remote Services", hunts: 6, findings: 15 },
    { technique: "T1053 - Scheduled Task", hunts: 5, findings: 12 },
  ];

  const huntPerformance = [
    { analyst: "Sarah Chen", hunts: 15, findings: 67, successRate: 92 },
    { analyst: "Mike Torres", hunts: 12, findings: 45, successRate: 88 },
    { analyst: "Alex Kim", hunts: 10, findings: 78, successRate: 95 },
    { analyst: "Jordan Lee", hunts: 8, findings: 32, successRate: 85 },
  ];

  const hourlyActivity = [40, 35, 20, 15, 12, 18, 45, 78, 95, 88, 72, 65, 58, 62, 70, 85, 92, 88, 75, 60, 45, 38, 42, 48];

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {["1h", "6h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-[10px] rounded transition-colors ${
                timeRange === range
                  ? "bg-[hsl(210,100%,30%)] text-white"
                  : "bg-[hsl(210,100%,10%)] text-[hsl(210,60%,55%)] hover:bg-[hsl(210,100%,15%)]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" className="h-6 text-[10px] border-[hsl(210,100%,25%)]">
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m, i) => (
          <div key={i} className="p-3 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg">
            <div className="text-[10px] text-[hsl(210,60%,50%)] mb-1">{m.label}</div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold text-[hsl(210,100%,80%)]">{m.value}</span>
              <div className={`flex items-center gap-0.5 text-[10px] ${
                m.trend === "up" 
                  ? m.label === "MTTD" ? "text-[hsl(120,100%,50%)]" : "text-[hsl(120,100%,50%)]"
                  : m.label === "MTTD" ? "text-[hsl(120,100%,50%)]" : "text-[hsl(0,100%,50%)]"
              }`}>
                {m.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="p-3 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">HUNT ACTIVITY</span>
          </div>
          <span className="text-[10px] text-[hsl(210,60%,50%)]">Last 24 hours</span>
        </div>
        <div className="flex h-20 items-end gap-0.5">
          {hourlyActivity.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-[hsl(210,100%,40%)] hover:bg-[hsl(210,100%,50%)] rounded-t transition-colors cursor-pointer"
              style={{ height: `${height}%` }}
              title={`${i}:00 - ${height} events`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[8px] text-[hsl(210,60%,40%)]">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Top Techniques */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">TOP MITRE TECHNIQUES</span>
        </div>
        <div className="space-y-1">
          {topTechniques.map((t, i) => (
            <div key={i} className="p-2 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg flex items-center justify-between">
              <span className="text-xs text-[hsl(210,100%,80%)]">{t.technique}</span>
              <div className="flex items-center gap-2">
                <Badge className="text-[9px] bg-[hsl(210,100%,25%)]">{t.hunts} hunts</Badge>
                <Badge className="text-[9px] bg-[hsl(30,100%,30%)]">{t.findings} findings</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst Performance */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">ANALYST PERFORMANCE</span>
        </div>
        <div className="space-y-1">
          {huntPerformance.map((a, i) => (
            <div key={i} className="p-2 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[hsl(210,100%,80%)]">{a.analyst}</span>
                <Badge className={`text-[9px] ${a.successRate >= 90 ? "bg-[hsl(120,100%,25%)]" : "bg-[hsl(45,100%,30%)]"}`}>
                  {a.successRate}% success
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-[hsl(210,60%,50%)]">
                <span>{a.hunts} hunts</span>
                <span>{a.findings} findings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
