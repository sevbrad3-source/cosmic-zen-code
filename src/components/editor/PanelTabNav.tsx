import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PanelTab {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface PanelTabNavProps {
  tabs: PanelTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "blue" | "red" | "neutral";
}

const PanelTabNav = ({ tabs, activeTab, onTabChange, variant = "neutral" }: PanelTabNavProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          container: "bg-[hsl(210,100%,8%)] border-b border-[hsl(210,100%,18%)]",
          active: "bg-[hsl(210,100%,15%)] text-[hsl(210,100%,70%)]",
          inactive: "text-[hsl(210,60%,50%)] hover:text-[hsl(210,100%,70%)] hover:bg-[hsl(210,100%,12%)]",
          indicator: "bg-[hsl(210,100%,50%)]",
          tooltip: "bg-[hsl(210,100%,12%)] border-[hsl(210,100%,25%)] text-[hsl(210,100%,85%)]"
        };
      case "red":
        return {
          container: "bg-[hsl(0,100%,8%)] border-b border-[hsl(0,100%,18%)]",
          active: "bg-[hsl(0,100%,15%)] text-[hsl(0,100%,70%)]",
          inactive: "text-[hsl(0,60%,50%)] hover:text-[hsl(0,100%,70%)] hover:bg-[hsl(0,100%,12%)]",
          indicator: "bg-[hsl(0,100%,50%)]",
          tooltip: "bg-[hsl(0,100%,12%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]"
        };
      default:
        return {
          container: "bg-surface-elevated border-b border-border",
          active: "bg-accent text-accent-foreground",
          inactive: "text-muted-foreground hover:text-foreground hover:bg-muted",
          indicator: "bg-primary",
          tooltip: "bg-popover border-border text-popover-foreground"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn("flex items-center gap-0.5 px-1 py-1", styles.container)}>
      <TooltipProvider delayDuration={200}>
        {tabs.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative w-8 h-7 flex items-center justify-center rounded transition-colors",
                  activeTab === tab.id ? styles.active : styles.inactive
                )}
              >
                <tab.icon className="w-4 h-4" />
                {activeTab === tab.id && (
                  <div className={cn("absolute bottom-0 left-1 right-1 h-0.5 rounded-full", styles.indicator)} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className={cn("text-xs", styles.tooltip)}>
              {tab.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default PanelTabNav;
