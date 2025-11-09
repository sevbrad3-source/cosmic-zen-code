import { Menu, Minimize2, Maximize2, X, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes, ThemeName } from "@/lib/themes";

interface TitleBarProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const TitleBar = ({ currentTheme, onThemeChange }: TitleBarProps) => {
  return (
    <div className="h-9 bg-titlebar-bg border-b border-border flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <button className="hover:bg-sidebar-hover px-2 py-1 rounded transition-colors">
          <Menu className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">Visual Studio Code</span>
        <div className="flex items-center gap-0.5 text-xs text-text-secondary">
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            File
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            Edit
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            Selection
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            View
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            Go
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            Run
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            Terminal
          </button>
          <button className="px-2 py-1 hover:bg-sidebar-hover rounded transition-colors">
            Help
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-1 text-xs text-text-secondary hover:bg-sidebar-hover rounded transition-colors">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-panel-bg border-border text-text-primary min-w-[160px] z-50"
          >
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
