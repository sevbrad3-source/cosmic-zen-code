import { Shield, Search, Eye, AlertTriangle, Activity, Database, Fingerprint, FileSearch, Lock, Bell, Radar, Bug, ShieldCheck, FileBarChart, Mail, Radio, GitBranch, Network, Crosshair, Layers, Zap, Users, Briefcase, Wifi, Clock, Share2, PlayCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlueTeamActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const BlueTeamActivityBar = ({ activePanel, onPanelChange }: BlueTeamActivityBarProps) => {
  const items = [
    { id: "global-dashboard", icon: Activity, label: "Global Threat Dashboard" },
    { id: "threat-alerts", icon: Bell, label: "Threat Alerts" },
    { id: "kill-chain", icon: Zap, label: "Kill Chain Visualization" },
    { id: "attack-timeline", icon: Clock, label: "Attack Timeline" },
    { id: "actor-graph", icon: Share2, label: "Actor Relationship Map" },
    { id: "response-playbooks", icon: PlayCircle, label: "Response Playbooks" },
    { id: "threat-hunt", icon: Search, label: "Threat Hunting" },
    { id: "detection-eng", icon: Radar, label: "Detection Engineering" },
    { id: "siem", icon: Activity, label: "SIEM & Analytics" },
    { id: "ioc-manager", icon: Database, label: "IOC Management" },
    { id: "threat-intel", icon: Eye, label: "Threat Intel Feeds" },
    { id: "threat-actors", icon: Users, label: "Threat Actors" },
    { id: "campaigns", icon: Crosshair, label: "Campaign Management" },
    { id: "investigations", icon: Briefcase, label: "Investigations" },
    { id: "asset-discovery", icon: Wifi, label: "Asset Discovery" },
    { id: "report-generator", icon: FileBarChart, label: "Report Generator" },
    { id: "forensics", icon: Fingerprint, label: "Digital Forensics" },
    { id: "log-analysis", icon: FileSearch, label: "Log Analysis" },
    { id: "incident-response", icon: AlertTriangle, label: "Incident Response" },
    { id: "security-controls", icon: Lock, label: "Security Controls" },
    { id: "alerts", icon: Bell, label: "Alert Center" },
    { id: "purple-team", icon: ShieldCheck, label: "Purple Team" },
    { id: "playbooks", icon: FileBarChart, label: "Scenario Playbooks" },
    { id: "vuln-management", icon: Bug, label: "Vulnerability Mgmt" },
    { id: "social-eng-defense", icon: Mail, label: "Social Eng Defense" },
    { id: "soc-dashboard", icon: Activity, label: "SOC Dashboard" },
    { id: "secure-comms", icon: Radio, label: "Secure Comms" },
    { id: "threat-modeling", icon: GitBranch, label: "Threat Modeling" },
    { id: "network-defense", icon: Network, label: "Network Defense" },
    { id: "honeypot", icon: Crosshair, label: "Honeypot Management" },
    { id: "deception", icon: Layers, label: "Deception Technology" },
    { id: "attack-path", icon: Zap, label: "Attack Path Analysis" },
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
