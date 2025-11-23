import { Target, Zap, ShieldAlert, Network, Terminal as TerminalIcon, Radio, Bug, Database, Activity, Crosshair } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RightActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const RightActivityBar = ({ activePanel, onPanelChange }: RightActivityBarProps) => {
  const items = [
    { id: "targets", icon: Target, label: "Target Enumeration" },
    { id: "exploits", icon: Zap, label: "Exploit Database" },
    { id: "payloads", icon: Bug, label: "Payload Generator" },
    { id: "vulns", icon: ShieldAlert, label: "Vulnerability Scanner" },
    { id: "network", icon: Network, label: "Network Mapper" },
    { id: "shells", icon: TerminalIcon, label: "Active Shells" },
    { id: "listeners", icon: Radio, label: "Listeners" },
    { id: "loot", icon: Database, label: "Credential Vault" },
    { id: "monitor", icon: Activity, label: "Live Monitoring" },
    { id: "pivots", icon: Crosshair, label: "Campaign Scheduler" },
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
