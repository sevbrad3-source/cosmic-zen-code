import { Menu, Minimize2, Maximize2, X, Palette, FileText, Network, Globe, Zap, Clock, Link, FileBarChart, Crosshair, Fingerprint, Radar, Cpu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { themes, ThemeName } from "@/lib/themes";

interface TitleBarProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  mainContent: string;
  onMainContentChange: (content: string) => void;
}

const TitleBar = ({ currentTheme, onThemeChange, mainContent, onMainContentChange }: TitleBarProps) => {
  const mainContentOptions = [
    { id: "editor", label: "Code Editor", icon: FileText },
    { id: "network", label: "Network Map", icon: Network },
    { id: "geomap", label: "Geographic Map", icon: Globe },
    { id: "exploits", label: "Exploit Flow", icon: Zap },
    { id: "timeline", label: "Attack Timeline", icon: Clock },
    { id: "chain-builder", label: "Attack Chain", icon: Link },
    { id: "reports", label: "Red Team Report", icon: FileBarChart },
    { id: "collaboration", label: "Team Comms", icon: Network },
  ];

  const specializedTools = [
    { id: "zero-day", label: "Zero-Day Research", icon: Crosshair },
    { id: "forensics", label: "Memory Forensics", icon: Fingerprint },
    { id: "signals", label: "Signal Intelligence", icon: Radar },
    { id: "hardware", label: "Hardware Exploits", icon: Cpu },
  ];

  return (
    <div className="h-10 bg-titlebar-bg border-b border-border flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <button className="hover:bg-sidebar-hover px-2 py-1 rounded transition-colors">
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[hsl(0,100%,50%)] animate-pulse" />
          <span className="text-sm font-bold tracking-wide">JOINT COMMAND CENTER</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center gap-1">
        {mainContentOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onMainContentChange(option.id)}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-[11px] ${
                mainContent === option.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-titlebar-hover text-text-secondary"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{option.label}</span>
            </button>
          );
        })}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-[11px] hover:bg-titlebar-hover text-text-secondary border border-border/50">
              <Crosshair className="w-3 h-3" />
              <span>Specialized</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="bg-panel-bg border-border text-text-primary">
            {specializedTools.map((tool) => (
              <DropdownMenuItem
                key={tool.id}
                onClick={() => onMainContentChange(tool.id)}
                className="text-xs cursor-pointer hover:bg-sidebar-hover flex items-center gap-2"
              >
                <tool.icon className="w-3 h-3" />
                {tool.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-1 text-xs text-text-secondary hover:bg-sidebar-hover rounded transition-colors">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-panel-bg border-border text-text-primary min-w-[160px] z-50">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`text-xs cursor-pointer hover:bg-sidebar-hover ${
                  currentTheme === theme.id ? "bg-sidebar-active" : ""
                }`}
              >
                {theme.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
          <Minimize2 className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-sidebar-hover hover:text-primary-foreground rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
