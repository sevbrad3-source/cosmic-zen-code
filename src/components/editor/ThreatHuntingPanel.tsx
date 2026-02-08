import { useState, lazy, Suspense } from "react";
import { Search, Target, Code, Database, Activity, BarChart3, Shield, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

// Lazy load sub-pages
const HuntsPage = lazy(() => import("./panels/threat-hunting/HuntsPage"));
const QueryBuilderPage = lazy(() => import("./panels/threat-hunting/QueryBuilderPage"));
const IOCLibraryPage = lazy(() => import("./panels/threat-hunting/IOCLibraryPage"));
const BehavioralRulesPage = lazy(() => import("./panels/threat-hunting/BehavioralRulesPage"));
const DataSourcesPage = lazy(() => import("./panels/threat-hunting/DataSourcesPage"));
const AnalyticsPage = lazy(() => import("./panels/threat-hunting/AnalyticsPage"));

const tabs: InnerTab[] = [
  { id: "hunts", icon: Target, label: "Hunts", badge: 3, badgeVariant: "success" },
  { id: "query", icon: Code, label: "Query Builder" },
  { id: "iocs", icon: Shield, label: "IOC Library", badge: 7, badgeVariant: "warning" },
  { id: "rules", icon: Activity, label: "Rules" },
  { id: "sources", icon: Database, label: "Data Sources" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-[hsl(210,100%,40%)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const ThreatHuntingPanel = () => {
  const [activeTab, setActiveTab] = useState("hunts");

  const renderContent = () => {
    switch (activeTab) {
      case "hunts":
        return <HuntsPage />;
      case "query":
        return <QueryBuilderPage />;
      case "iocs":
        return <IOCLibraryPage />;
      case "rules":
        return <BehavioralRulesPage />;
      case "sources":
        return <DataSourcesPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <HuntsPage />;
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

export default ThreatHuntingPanel;
