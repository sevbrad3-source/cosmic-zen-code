import { Menu, Minimize2, Maximize2, X, Palette, FileText, Network, Globe, Zap, Clock, Link, FileBarChart, Crosshair, Fingerprint, Radar, Cpu, Shield, Brain, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { themes, ThemeName } from "@/lib/themes";

interface TitleBarProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  mainContent: string;
  onMainContentChange: (content: string) => void;
}

const TitleBar = ({ currentTheme, onThemeChange, mainContent, onMainContentChange }: TitleBarProps) => {
  const { user, signOut } = useAuth();
  const mainContentOptions = [
    { id: "command", label: "Command Center", icon: Brain },
    { id: "joc", label: "Joint Ops Center", icon: Shield },
    { id: "editor", label: "Code Editor", icon: FileText },
    { id: "network", label: "Network Map", icon: Network },
    { id: "geomap", label: "Geographic Map", icon: Globe },
    { id: "exploits", label: "Exploit Flow", icon: Zap },
    { id: "timeline", label: "Attack Timeline", icon: Clock },
    { id: "attack-chain", label: "Attack Chain", icon: Link },
    { id: "reports", label: "Reports", icon: FileBarChart },
    { id: "team-comms", label: "Team Comms", icon: Network },
  ];

  const specializedTools = [
    { id: "zero-day", label: "Zero-Day Research", icon: Crosshair },
    { id: "forensics", label: "Memory Forensics", icon: Fingerprint },
    { id: "signals", label: "Signal Intelligence", icon: Radar },
    { id: "hardware", label: "Hardware Exploits", icon: Cpu },
  ];

  return (
    <TooltipProvider delayDuration={250}>
      <div className="h-10 bg-titlebar-bg border-b border-border flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button className="hover:bg-sidebar-hover px-2 py-1 rounded transition-colors">
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(0,100%,50%)] animate-pulse" />
            <span className="text-sm font-bold tracking-[0.2em]">JOC</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-0.5">
          {mainContentOptions.map((option) => {
            const Icon = option.icon;
            const active = mainContent === option.id;
            return (
              <Tooltip key={option.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onMainContentChange(option.id)}
                    aria-label={option.label}
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-titlebar-hover text-text-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {option.label}
                </TooltipContent>
              </Tooltip>
            );
          })}

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Specialized tools"
                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-titlebar-hover text-text-secondary border border-border/50 ml-1"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Specialized
              </TooltipContent>
            </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Theme"
                    className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-sidebar-hover rounded transition-colors"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Theme
              </TooltipContent>
            </Tooltip>
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
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut()}
                  aria-label={`Sign out (${user.email ?? "user"})`}
                  className="w-8 h-8 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors text-text-secondary hover:text-primary ml-1 border-l border-border pl-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Sign out {user.email ? `(${user.email})` : ""}
              </TooltipContent>
            </Tooltip>
          )}
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
    </TooltipProvider>
  );
};

export default TitleBar;
