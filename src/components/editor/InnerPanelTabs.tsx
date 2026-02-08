import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InnerTab {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  badgeVariant?: "default" | "critical" | "warning" | "success";
}

interface InnerPanelTabsProps {
  tabs: InnerTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "blue" | "red" | "neutral";
  size?: "sm" | "md";
}

const InnerPanelTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = "neutral",
  size = "sm" 
}: InnerPanelTabsProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          container: "bg-[hsl(210,100%,6%)] border-b border-[hsl(210,100%,15%)]",
          active: "bg-[hsl(210,100%,18%)] text-[hsl(210,100%,85%)] border-b-2 border-[hsl(210,100%,50%)]",
          inactive: "text-[hsl(210,60%,50%)] hover:text-[hsl(210,100%,70%)] hover:bg-[hsl(210,100%,10%)]",
          badge: {
            default: "bg-[hsl(210,100%,30%)] text-[hsl(210,100%,85%)]",
            critical: "bg-[hsl(0,100%,40%)] text-white animate-pulse",
            warning: "bg-[hsl(45,100%,40%)] text-black",
            success: "bg-[hsl(120,100%,30%)] text-white"
          }
        };
      case "red":
        return {
          container: "bg-[hsl(0,100%,6%)] border-b border-[hsl(0,100%,15%)]",
          active: "bg-[hsl(0,100%,18%)] text-[hsl(0,100%,85%)] border-b-2 border-[hsl(0,100%,50%)]",
          inactive: "text-[hsl(0,60%,50%)] hover:text-[hsl(0,100%,70%)] hover:bg-[hsl(0,100%,10%)]",
          badge: {
            default: "bg-[hsl(0,100%,30%)] text-[hsl(0,100%,85%)]",
            critical: "bg-[hsl(0,100%,50%)] text-white animate-pulse",
            warning: "bg-[hsl(45,100%,40%)] text-black",
            success: "bg-[hsl(120,100%,30%)] text-white"
          }
        };
      default:
        return {
          container: "bg-surface border-b border-border",
          active: "bg-muted text-foreground border-b-2 border-primary",
          inactive: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          badge: {
            default: "bg-muted text-muted-foreground",
            critical: "bg-destructive text-destructive-foreground animate-pulse",
            warning: "bg-yellow-500 text-black",
            success: "bg-green-500 text-white"
          }
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(
      "flex items-stretch overflow-x-auto scrollbar-none",
      styles.container
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 transition-all whitespace-nowrap",
            size === "sm" ? "text-[10px]" : "text-xs",
            activeTab === tab.id ? styles.active : styles.inactive
          )}
        >
          <tab.icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
          <span className="font-medium">{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[9px] font-semibold min-w-[18px] text-center",
              styles.badge[tab.badgeVariant || "default"]
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default InnerPanelTabs;
