import { useState } from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle, Activity, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "connection" | "task" | "callback" | "error" | "data";
  agent?: string;
  description: string;
  details?: string;
}

const OperationTimelinePage = () => {
  const [filter, setFilter] = useState<string>("all");

  const events: TimelineEvent[] = [
    { id: "1", timestamp: "14:32:15", type: "connection", agent: "AGENT-4F2A", description: "Agent established connection", details: "Initial callback via HTTPS" },
    { id: "2", timestamp: "14:33:02", type: "task", agent: "AGENT-4F2A", description: "Task completed: whoami", details: "Result: www-data" },
    { id: "3", timestamp: "14:34:45", type: "connection", agent: "AGENT-7B91", description: "Agent elevated to SYSTEM", details: "Privilege escalation successful" },
    { id: "4", timestamp: "14:35:18", type: "task", agent: "AGENT-7B91", description: "Lateral movement initiated", details: "Target: 192.168.1.30" },
    { id: "5", timestamp: "14:36:54", type: "data", agent: "AGENT-7B91", description: "Credential harvested", details: "5 credentials from LSASS" },
    { id: "6", timestamp: "14:37:22", type: "error", agent: "AGENT-C3E8", description: "Agent beacon timeout", details: "No callback for 60s" },
    { id: "7", timestamp: "14:38:10", type: "callback", agent: "AGENT-C3E8", description: "Agent reconnected", details: "Resumed normal operation" },
    { id: "8", timestamp: "14:39:45", type: "data", agent: "AGENT-4F2A", description: "Data exfiltration", details: "2.4 GB transferred via HTTPS" },
    { id: "9", timestamp: "14:42:00", type: "task", agent: "AGENT-9D4C", description: "Screenshot captured", details: "1920x1080 desktop" },
    { id: "10", timestamp: "14:45:30", type: "connection", agent: "AGENT-2E7F", description: "New agent registered", details: "DB-PRIMARY (192.168.1.30)" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "connection": return <Activity className="w-3 h-3 text-[hsl(120,100%,50%)]" />;
      case "task": return <CheckCircle className="w-3 h-3 text-[hsl(210,100%,60%)]" />;
      case "callback": return <Clock className="w-3 h-3 text-[hsl(45,100%,55%)]" />;
      case "error": return <XCircle className="w-3 h-3 text-[hsl(0,100%,55%)]" />;
      case "data": return <AlertTriangle className="w-3 h-3 text-[hsl(270,100%,60%)]" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "connection": return "bg-[hsl(120,100%,20%)] text-[hsl(120,100%,70%)] border-[hsl(120,100%,30%)]";
      case "task": return "bg-[hsl(210,100%,20%)] text-[hsl(210,100%,70%)] border-[hsl(210,100%,30%)]";
      case "callback": return "bg-[hsl(45,100%,20%)] text-[hsl(45,100%,70%)] border-[hsl(45,100%,35%)]";
      case "error": return "bg-[hsl(0,100%,20%)] text-[hsl(0,100%,70%)] border-[hsl(0,100%,30%)]";
      case "data": return "bg-[hsl(270,100%,20%)] text-[hsl(270,100%,70%)] border-[hsl(270,100%,30%)]";
      default: return "bg-[hsl(0,60%,20%)]";
    }
  };

  const filteredEvents = filter === "all" ? events : events.filter(e => e.type === filter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[hsl(0,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(0,100%,75%)]">OPERATION TIMELINE</span>
          <Badge className="text-[9px] bg-[hsl(0,100%,25%)]">{events.length} events</Badge>
        </div>
        <Button size="sm" variant="outline" className="h-6 text-[10px] border-[hsl(0,100%,25%)]">
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {["all", "connection", "task", "callback", "error", "data"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-2 py-1 text-[10px] rounded whitespace-nowrap transition-colors ${
              filter === type
                ? "bg-[hsl(0,100%,30%)] text-white"
                : "bg-[hsl(0,100%,10%)] text-[hsl(0,60%,55%)] hover:bg-[hsl(0,100%,15%)]"
            }`}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Duration Banner */}
      <div className="p-2 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,18%)] rounded-lg flex items-center justify-between">
        <span className="text-[10px] text-[hsl(0,60%,55%)]">Operation Duration</span>
        <span className="text-sm font-bold text-[hsl(0,100%,75%)]">0:13:15</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[hsl(0,100%,20%)]" />

        <div className="space-y-2">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative pl-10">
              <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-[hsl(0,100%,15%)] border-2 border-[hsl(0,100%,40%)]" />

              <div className="p-2.5 bg-[hsl(0,100%,7%)] border border-[hsl(0,100%,15%)] rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[hsl(0,60%,55%)]">{event.timestamp}</span>
                    <Badge variant="outline" className={`text-[9px] ${getTypeColor(event.type)}`}>
                      {getTypeIcon(event.type)}
                      <span className="ml-1">{event.type}</span>
                    </Badge>
                    {event.agent && (
                      <Badge className="text-[9px] bg-[hsl(0,100%,20%)]">{event.agent}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-xs text-[hsl(0,100%,80%)]">{event.description}</div>
                {event.details && (
                  <div className="text-[10px] text-[hsl(0,60%,55%)] mt-1">{event.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationTimelinePage;
