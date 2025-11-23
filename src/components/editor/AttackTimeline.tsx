import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Zap, Search, Key, Database, Download, Target, Shield, Terminal } from "lucide-react";

interface TimelineEvent {
  id: string;
  timestamp: string;
  phase: string;
  action: string;
  target: string;
  result: "success" | "failed" | "partial";
  details: string;
  icon: any;
}

const AttackTimeline = () => {
  const timeline: TimelineEvent[] = [
    {
      id: "1",
      timestamp: "2024-01-10 14:23:15",
      phase: "Reconnaissance",
      action: "Port Scan",
      target: "192.168.1.0/24",
      result: "success",
      details: "Discovered 47 open ports across 12 hosts",
      icon: Search,
    },
    {
      id: "2",
      timestamp: "2024-01-10 14:28:42",
      phase: "Reconnaissance",
      action: "Service Enumeration",
      target: "192.168.1.100",
      result: "success",
      details: "Identified SSH (22), HTTP (80), MySQL (3306)",
      icon: Target,
    },
    {
      id: "3",
      timestamp: "2024-01-10 14:35:18",
      phase: "Initial Access",
      action: "Brute Force Attack",
      target: "SSH - 192.168.1.100:22",
      result: "success",
      details: "Valid credentials found: admin/password123",
      icon: Key,
    },
    {
      id: "4",
      timestamp: "2024-01-10 14:42:55",
      phase: "Execution",
      action: "Remote Shell",
      target: "192.168.1.100",
      result: "success",
      details: "Established reverse shell on port 4444",
      icon: Terminal,
    },
    {
      id: "5",
      timestamp: "2024-01-10 14:50:33",
      phase: "Privilege Escalation",
      action: "Kernel Exploit",
      target: "Linux kernel 4.15.0",
      result: "success",
      details: "Elevated to root via CVE-2021-3493",
      icon: Shield,
    },
    {
      id: "6",
      timestamp: "2024-01-10 15:05:12",
      phase: "Lateral Movement",
      action: "Pass-the-Hash",
      target: "192.168.1.105",
      result: "partial",
      details: "Compromised 2 of 4 domain admin accounts",
      icon: Zap,
    },
    {
      id: "7",
      timestamp: "2024-01-10 15:22:47",
      phase: "Collection",
      action: "Database Dump",
      target: "MySQL - customer_db",
      result: "success",
      details: "Extracted 50,000 records (2.3 GB)",
      icon: Database,
    },
    {
      id: "8",
      timestamp: "2024-01-10 15:45:20",
      phase: "Exfiltration",
      action: "Data Transfer",
      target: "External C2 Server",
      result: "success",
      details: "Exfiltrated data via encrypted tunnel",
      icon: Download,
    },
  ];

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case "reconnaissance": return "bg-blue-500";
      case "initial access": return "bg-yellow-500";
      case "execution": return "bg-orange-500";
      case "privilege escalation": return "bg-red-500";
      case "lateral movement": return "bg-purple-500";
      case "collection": return "bg-pink-500";
      case "exfiltration": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "success": return "text-green-500";
      case "failed": return "text-destructive";
      case "partial": return "text-yellow-500";
      default: return "text-text-secondary";
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">Attack Chain Timeline</h2>
        <p className="text-xs text-text-secondary">Complete sequence from initial access to objectives</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {timeline.map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-10 h-10 rounded-full ${getPhaseColor(event.phase)} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Event card */}
                  <div className="bg-panel-bg rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${getPhaseColor(event.phase)} text-white text-xs`}>
                            {event.phase}
                          </Badge>
                          <span className={`text-xs font-medium ${getResultColor(event.result)}`}>
                            {event.result.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{event.action}</p>
                        <p className="text-xs text-text-secondary mt-1">Target: {event.target}</p>
                      </div>
                      <span className="text-xs text-text-secondary whitespace-nowrap">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-foreground bg-activitybar-bg p-2 rounded">
                      {event.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AttackTimeline;
