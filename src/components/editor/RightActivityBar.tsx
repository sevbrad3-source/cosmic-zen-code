import { Target, Zap, ShieldAlert, Network, Terminal as TerminalIcon, Radio, Bug, Database, Activity, Crosshair, Users, Clock, Wrench, Shield, Calendar, FileCheck, Brain, TrendingUp, Package, Syringe, Wifi, FolderOpen, Cpu, Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RightActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const RightActivityBar = ({ activePanel, onPanelChange }: RightActivityBarProps) => {
  // Right drawer - Analysis & Advisory tools
  const items = [
    { id: "ai-advisor", icon: Brain, label: "AI Security Advisor" },
    { id: "threat-intel", icon: Shield, label: "Threat Intelligence" },
    { id: "vuln-prioritizer", icon: TrendingUp, label: "Vulnerability Prioritizer" },
    { id: "compliance", icon: FileCheck, label: "Compliance Checker" },
    { id: "remediation", icon: Wrench, label: "Remediation Advisor" },
    { id: "mitre-attack", icon: Target, label: "MITRE ATT&CK" },
    { id: "c2-framework", icon: Radio, label: "C2 Framework" },
    { id: "beacons", icon: Radio, label: "Beacon Manager" },
    { id: "payloads", icon: Package, label: "Payload Builder" },
    { id: "injection", icon: Syringe, label: "Process Injection" },
    { id: "covert", icon: Wifi, label: "Covert Channels" },
    { id: "lateral", icon: Crosshair, label: "Lateral Movement" },
    { id: "postexploit", icon: FolderOpen, label: "Post-Exploitation" },
    { id: "physical-security", icon: ShieldAlert, label: "Physical Security" },
    { id: "rowhammer", icon: Cpu, label: "Rowhammer Testing" },
    { id: "collab", icon: Users, label: "Team Collaboration" },
    { id: "report-scheduler", icon: Calendar, label: "Report Scheduler" },
  ];

  return (
    <div className="w-12 bg-activitybar-bg border-l border-border flex flex-col items-center py-2 gap-1">
      <TooltipProvider delayDuration={300}>
        {items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onPanelChange(item.id === activePanel ? "" : item.id)}
                className={`w-12 h-12 flex items-center justify-center transition-colors relative group ${
                  activePanel === item.id
                    ? "text-foreground"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-6 h-6" />
                {activePanel === item.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-activitybar-active" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-panel-bg border-border text-text-primary">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default RightActivityBar;
