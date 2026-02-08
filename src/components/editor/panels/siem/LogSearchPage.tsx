import { useState } from "react";
import { Search, Play, Clock, Filter, Save, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const LogSearchPage = () => {
  const [query, setQuery] = useState("EventID:4625 AND TargetUserName:admin*");
  const [timeRange, setTimeRange] = useState("1h");

  const searchResults = [
    { timestamp: "14:32:15.234", source: "DC01", level: "Warning", message: "Failed logon attempt for admin - invalid password", raw: '{"EventID": 4625, "TargetUserName": "admin", "IpAddress": "192.168.1.50"}' },
    { timestamp: "14:32:14.891", source: "DC01", level: "Warning", message: "Failed logon attempt for admin - invalid password", raw: '{"EventID": 4625, "TargetUserName": "admin", "IpAddress": "192.168.1.50"}' },
    { timestamp: "14:32:14.567", source: "DC01", level: "Warning", message: "Failed logon attempt for admin - invalid password", raw: '{"EventID": 4625, "TargetUserName": "admin", "IpAddress": "192.168.1.50"}' },
    { timestamp: "14:32:14.123", source: "DC01", level: "Warning", message: "Failed logon attempt for administrator - account locked", raw: '{"EventID": 4625, "TargetUserName": "administrator", "IpAddress": "10.0.0.45"}' },
    { timestamp: "14:31:58.789", source: "WEB-01", level: "Error", message: "Failed logon attempt for admin_backup - unknown account", raw: '{"EventID": 4625, "TargetUserName": "admin_backup", "IpAddress": "external"}' },
  ];

  const savedSearches = [
    { name: "Brute Force Detection", count: 1247 },
    { name: "Privilege Escalation", count: 23 },
    { name: "Lateral Movement", count: 89 },
    { name: "Data Exfiltration", count: 12 },
  ];

  return (
    <div className="space-y-4">
      {/* Time Range */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[hsl(210,60%,50%)]" />
          {["15m", "1h", "6h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-[10px] rounded ${
                timeRange === range
                  ? "bg-[hsl(210,100%,30%)] text-white"
                  : "bg-[hsl(210,100%,10%)] text-[hsl(210,60%,55%)] hover:bg-[hsl(210,100%,15%)]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" className="h-6 text-[10px]">
          <Filter className="w-3 h-3 mr-1" /> Filters
        </Button>
      </div>

      {/* Search Query */}
      <div className="space-y-2">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-20 font-mono text-xs bg-[hsl(210,100%,5%)] border-[hsl(210,100%,20%)] text-[hsl(210,100%,85%)] resize-none"
          placeholder="Enter KQL query..."
        />
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs bg-[hsl(210,100%,35%)]">
            <Play className="w-3 h-3 mr-1" /> Search
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs border-[hsl(210,100%,25%)]">
            <Save className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </div>

      {/* Quick Searches */}
      <div className="flex flex-wrap gap-1">
        {savedSearches.map((s, i) => (
          <Badge key={i} variant="outline" className="text-[9px] cursor-pointer hover:bg-[hsl(210,100%,15%)] border-[hsl(210,100%,25%)]">
            {s.name} ({s.count})
          </Badge>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[hsl(210,60%,55%)]">Found {searchResults.length} events</span>
          <span className="text-[10px] text-[hsl(210,60%,45%)]">Query time: 0.34s</span>
        </div>

        <div className="space-y-1">
          {searchResults.map((result, i) => (
            <div key={i} className="p-2 bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded-lg hover:border-[hsl(210,100%,25%)] cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-[hsl(210,60%,55%)]">{result.timestamp}</span>
                <Badge variant="outline" className="text-[8px] border-[hsl(210,100%,30%)]">{result.source}</Badge>
                <Badge className={`text-[8px] ${result.level === "Error" ? "bg-[hsl(0,100%,30%)]" : "bg-[hsl(45,100%,30%)]"}`}>
                  {result.level}
                </Badge>
              </div>
              <div className="text-xs text-[hsl(210,100%,80%)]">{result.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogSearchPage;
