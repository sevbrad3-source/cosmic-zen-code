import { useState, lazy, Suspense } from "react";
import { AlertTriangle, Clock, BookOpen, Server, FileText, Users, BarChart3 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

// Lazy load sub-pages
const ActiveIncidentsPage = lazy(() => import("./panels/incident-response/ActiveIncidentsPage"));
const PlaybooksPage = lazy(() => import("./panels/incident-response/PlaybooksPage"));
const TimelinePage = lazy(() => import("./panels/incident-response/TimelinePage"));
const AffectedAssetsPage = lazy(() => import("./panels/incident-response/AffectedAssetsPage"));

const tabs: InnerTab[] = [
  { id: "incidents", icon: AlertTriangle, label: "Incidents", badge: 3, badgeVariant: "critical" },
  { id: "playbooks", icon: BookOpen, label: "Playbooks" },
  { id: "timeline", icon: Clock, label: "Timeline" },
  { id: "assets", icon: Server, label: "Assets", badge: 7, badgeVariant: "warning" },
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-[hsl(210,100%,40%)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const IncidentResponsePanel = () => {
  const [activeTab, setActiveTab] = useState("incidents");

  const renderContent = () => {
    switch (activeTab) {
      case "incidents":
        return <ActiveIncidentsPage />;
      case "playbooks":
        return <PlaybooksPage />;
      case "timeline":
        return <TimelinePage />;
      case "assets":
        return <AffectedAssetsPage />;
      default:
        return <ActiveIncidentsPage />;
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

export default IncidentResponsePanel;
