import { useState, lazy, Suspense } from "react";
import { Activity, Search, AlertTriangle, Shield, BarChart3, Database, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

// Lazy load sub-pages
const LogSearchPage = lazy(() => import("./panels/siem/LogSearchPage"));
const AlertsPage = lazy(() => import("./panels/siem/AlertsPage"));
const DetectionRulesPage = lazy(() => import("./panels/siem/DetectionRulesPage"));

const tabs: InnerTab[] = [
  { id: "search", icon: Search, label: "Log Search" },
  { id: "alerts", icon: AlertTriangle, label: "Alerts", badge: 5, badgeVariant: "critical" },
  { id: "rules", icon: Shield, label: "Detection Rules" },
  { id: "dashboards", icon: BarChart3, label: "Dashboards" },
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-[hsl(210,100%,40%)] border-t-transparent rounded-full animate-spin" />
  </div>
);

// Simple dashboard placeholder
const DashboardsPage = () => (
  <div className="space-y-4">
    <div className="text-xs font-semibold text-[hsl(210,100%,75%)]">SIEM DASHBOARDS</div>
    <div className="grid grid-cols-2 gap-2">
      {["Security Overview", "Authentication", "Network Traffic", "Endpoint Activity", "Threat Detection", "Compliance"].map((name, i) => (
        <div key={i} className="p-4 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg hover:border-[hsl(210,100%,30%)] cursor-pointer transition-colors">
          <div className="text-sm text-[hsl(210,100%,80%)]">{name}</div>
          <div className="text-[10px] text-[hsl(210,60%,50%)] mt-1">Click to view</div>
        </div>
      ))}
    </div>
  </div>
);

const SIEMPanel = () => {
  const [activeTab, setActiveTab] = useState("alerts");

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <LogSearchPage />;
      case "alerts":
        return <AlertsPage />;
      case "rules":
        return <DetectionRulesPage />;
      case "dashboards":
        return <DashboardsPage />;
      default:
        return <AlertsPage />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="blue"
      />
      <ScrollArea className="flex-1">
        <div className="p-3">
          <Suspense fallback={<LoadingSpinner />}>
            {renderContent()}
          </Suspense>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SIEMPanel;
