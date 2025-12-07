import { Shield, Search, Eye, AlertTriangle, Activity, Database, Fingerprint, FileSearch, Lock, Bell, Radar, Bug, ShieldCheck, FileBarChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlueTeamActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const BlueTeamActivityBar = ({ activePanel, onPanelChange }: BlueTeamActivityBarProps) => {
  const items = [
    { id: "threat-hunt", icon: Search, label: "Threat Hunting" },
    { id: "detection-eng", icon: Radar, label: "Detection Engineering" },
    { id: "siem", icon: Activity, label: "SIEM & Analytics" },
    { id: "ioc-manager", icon: Database, label: "IOC Management" },
    { id: "threat-intel", icon: Eye, label: "Threat Intel Feeds" },
    { id: "forensics", icon: Fingerprint, label: "Digital Forensics" },
    { id: "log-analysis", icon: FileSearch, label: "Log Analysis" },
    { id: "incident-response", icon: AlertTriangle, label: "Incident Response" },
    { id: "security-controls", icon: Lock, label: "Security Controls" },
    { id: "alerts", icon: Bell, label: "Alert Center" },
    { id: "purple-team", icon: ShieldCheck, label: "Purple Team" },
    { id: "playbooks", icon: FileBarChart, label: "Scenario Playbooks" },
    { id: "vuln-management", icon: Bug, label: "Vulnerability Mgmt" },
  ];

  return (
    <div className="w-12 bg-[hsl(210,100%,8%)] border-r border-[hsl(210,100%,20%)] flex flex-col items-center py-2 gap-1">
      <div className="w-8 h-8 mb-2 flex items-center justify-center rounded bg-[hsl(210,100%,25%)]">
        <Shield className="w-5 h-5 text-[hsl(210,100%,70%)]" />
      </div>
      <TooltipProvider delayDuration={300}>
        {items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onPanelChange(item.id === activePanel ? "" : item.id)}
                className={`w-12 h-10 flex items-center justify-center transition-colors relative group ${
                  activePanel === item.id
                    ? "text-[hsl(210,100%,70%)] bg-[hsl(210,100%,15%)]"
                    : "text-[hsl(210,60%,50%)] hover:text-[hsl(210,100%,70%)] hover:bg-[hsl(210,100%,12%)]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {activePanel === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[hsl(210,100%,50%)]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[hsl(210,100%,12%)] border-[hsl(210,100%,25%)] text-[hsl(210,100%,85%)]">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default BlueTeamActivityBar;
