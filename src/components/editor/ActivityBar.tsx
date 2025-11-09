import { Files, Search, GitBranch, Settings, PlayCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const ActivityBar = ({ activeView, onViewChange }: ActivityBarProps) => {
  const items = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "source", icon: GitBranch, label: "Source Control" },
    { id: "run", icon: PlayCircle, label: "Run and Debug" },
  ];

  return (
    <div className="w-12 bg-activitybar-bg border-r border-border flex flex-col items-center py-2 gap-1">
      <TooltipProvider delayDuration={300}>
        {items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-12 h-12 flex items-center justify-center transition-colors relative group ${
                  activeView === item.id
                    ? "text-foreground"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-6 h-6" />
                {activeView === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-activitybar-active" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-panel-bg border-border text-text-primary">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      <div className="flex-1" />

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-panel-bg border-border text-text-primary">
            Settings
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActivityBar;
