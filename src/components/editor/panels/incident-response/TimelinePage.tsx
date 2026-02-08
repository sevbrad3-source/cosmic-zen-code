import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, MessageSquare, FileText, AlertTriangle, Shield, User, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "detection" | "action" | "communication" | "evidence" | "milestone";
  title: string;
  description: string;
  actor: string;
  automated: boolean;
}

const TimelinePage = () => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const events: TimelineEvent[] = [
    { id: "1", timestamp: "14:32:15", type: "detection", title: "Initial Detection", description: "EDR alert triggered: Ransomware behavior detected on FIN-WKS-001", actor: "EDR System", automated: true },
    { id: "2", timestamp: "14:33:02", type: "action", title: "Incident Created", description: "Incident INC-001 created and assigned to SOC Team A", actor: "SOAR Platform", automated: true },
    { id: "3", timestamp: "14:35:18", type: "action", title: "Host Isolation", description: "FIN-WKS-001 isolated from network via EDR", actor: "Sarah Chen", automated: false },
    { id: "4", timestamp: "14:38:45", type: "evidence", title: "Memory Dump Acquired", description: "RAM dump collected from affected host for analysis", actor: "Sarah Chen", automated: false },
    { id: "5", timestamp: "14:42:00", type: "communication", title: "Stakeholder Notification", description: "Finance department head notified of ongoing incident", actor: "Mike Torres", automated: false },
    { id: "6", timestamp: "14:48:33", type: "detection", title: "Additional Hosts Identified", description: "Lateral movement detected to FIN-WKS-002 and FIN-WKS-003", actor: "EDR System", automated: true },
    { id: "7", timestamp: "14:52:15", type: "action", title: "Bulk Isolation", description: "3 additional hosts isolated from network", actor: "Sarah Chen", automated: false },
    { id: "8", timestamp: "15:05:00", type: "milestone", title: "Containment Achieved", description: "Threat contained - no further spread detected", actor: "IR Team", automated: false },
    { id: "9", timestamp: "15:15:22", type: "evidence", title: "Malware Sample Extracted", description: "Ransomware binary captured for analysis: locker.exe", actor: "Alex Kim", automated: false },
    { id: "10", timestamp: "15:30:00", type: "communication", title: "Executive Briefing", description: "CISO briefed on incident status and recovery timeline", actor: "Mike Torres", automated: false },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "detection": return <AlertTriangle className="w-3 h-3" />;
      case "action": return <Shield className="w-3 h-3" />;
      case "communication": return <MessageSquare className="w-3 h-3" />;
      case "evidence": return <FileText className="w-3 h-3" />;
      case "milestone": return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "detection": return "bg-[hsl(0,100%,25%)] text-[hsl(0,100%,75%)] border-[hsl(0,100%,35%)]";
      case "action": return "bg-[hsl(210,100%,25%)] text-[hsl(210,100%,75%)] border-[hsl(210,100%,35%)]";
      case "communication": return "bg-[hsl(270,100%,25%)] text-[hsl(270,100%,75%)] border-[hsl(270,100%,35%)]";
      case "evidence": return "bg-[hsl(45,100%,25%)] text-[hsl(45,100%,75%)] border-[hsl(45,100%,35%)]";
      case "milestone": return "bg-[hsl(120,100%,20%)] text-[hsl(120,100%,70%)] border-[hsl(120,100%,30%)]";
      default: return "bg-[hsl(210,60%,25%)] text-[hsl(210,60%,75%)]";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">INCIDENT TIMELINE</span>
          <Badge className="text-[9px] bg-[hsl(210,100%,25%)]">{events.length} events</Badge>
        </div>
        <Button size="sm" className="h-7 text-xs bg-[hsl(210,100%,30%)]">
          <Plus className="w-3 h-3 mr-1" /> Add Event
        </Button>
      </div>

      {/* Duration Banner */}
      <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg flex items-center justify-between">
        <span className="text-[10px] text-[hsl(210,60%,55%)]">Incident Duration</span>
        <span className="text-sm font-bold text-[hsl(210,100%,75%)]">0:57:45</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[hsl(210,100%,20%)]" />

        <div className="space-y-2">
          {events.map((event, i) => (
            <div key={event.id} className="relative pl-10">
              {/* Timeline Dot */}
              <div className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 ${
                event.type === "milestone" 
                  ? "bg-[hsl(120,100%,40%)] border-[hsl(120,100%,50%)]" 
                  : "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]"
              }`} />

              <div
                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                className="p-2.5 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg cursor-pointer hover:border-[hsl(210,100%,25%)] transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[hsl(210,60%,55%)]">{event.timestamp}</span>
                    <Badge variant="outline" className={`text-[9px] ${getTypeColor(event.type)}`}>
                      {getTypeIcon(event.type)}
                      <span className="ml-1">{event.type}</span>
                    </Badge>
                    {event.automated && (
                      <Badge className="text-[8px] bg-[hsl(270,100%,25%)]">Auto</Badge>
                    )}
                  </div>
                  {expandedEvent === event.id ? (
                    <ChevronUp className="w-3 h-3 text-[hsl(210,60%,50%)]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[hsl(210,60%,50%)]" />
                  )}
                </div>

                <div className="text-xs font-medium text-[hsl(210,100%,85%)]">{event.title}</div>

                {expandedEvent === event.id && (
                  <div className="mt-2 pt-2 border-t border-[hsl(210,100%,15%)]">
                    <p className="text-[11px] text-[hsl(210,60%,60%)] mb-2">{event.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(210,60%,50%)]">
                      <User className="w-3 h-3" />
                      {event.actor}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
