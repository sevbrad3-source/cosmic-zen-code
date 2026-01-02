import { Target, Zap, ShieldAlert, Radio, Crosshair, Users, Calendar, Brain, TrendingUp, Package, Syringe, Wifi, FolderOpen, Cpu, Skull, Files, Search, GitBranch, PlayCircle, Bug, Radar, Activity, Signal, UserX, Key, Upload, Antenna } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RightActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const RightActivityBar = ({ activePanel, onPanelChange }: RightActivityBarProps) => {
  const items = [
    { id: "ai-advisor", icon: Brain, label: "AI Security Advisor" },
    { id: "social-eng", icon: UserX, label: "Social Engineering" },
    { id: "wireless-attack", icon: Antenna, label: "Wireless Attack Tools" },
    { id: "password-cracking", icon: Key, label: "Password Cracking" },
    { id: "exfiltrator", icon: Upload, label: "Data Exfiltration" },
    { id: "packet-capture", icon: Activity, label: "Packet Capture" },
    { id: "vuln-scanner", icon: Radar, label: "Vuln Scanner Workflow" },
    { id: "apt-emulation", icon: Skull, label: "APT Emulation" },
    { id: "zero-day", icon: Bug, label: "Zero-Day Research" },
    { id: "implant-builder", icon: Cpu, label: "Implant Builder" },
    { id: "sigint", icon: Signal, label: "SIGINT Operations" },
    { id: "exploit-db", icon: Files, label: "Exploit Database" },
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
    { id: "vuln-prioritizer", icon: TrendingUp, label: "Vulnerability Prioritizer" },
    { id: "collab", icon: Users, label: "Team Collaboration" },
    { id: "report-scheduler", icon: Calendar, label: "Report Scheduler" },
  ];

  return (
    <div className="w-12 bg-[hsl(0,100%,8%)] border-l border-[hsl(0,100%,20%)] flex flex-col items-center py-2 gap-0.5 overflow-y-auto scrollbar-thin">
      <div className="w-8 h-8 mb-2 flex items-center justify-center rounded bg-[hsl(0,100%,25%)]">
        <Skull className="w-5 h-5 text-[hsl(0,100%,70%)]" />
      </div>
      <TooltipProvider delayDuration={300}>
        {items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onPanelChange(item.id === activePanel ? "" : item.id)}
                className={`w-12 h-9 flex items-center justify-center transition-colors relative group ${
                  activePanel === item.id
                    ? "text-[hsl(0,100%,70%)] bg-[hsl(0,100%,15%)]"
                    : "text-[hsl(0,60%,50%)] hover:text-[hsl(0,100%,70%)] hover:bg-[hsl(0,100%,12%)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {activePanel === item.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-[hsl(0,100%,50%)]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-[hsl(0,100%,12%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default RightActivityBar;
