import { useState, lazy, Suspense } from "react";
import { Radio, Activity, Send, Antenna, Clock, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

// Lazy load sub-pages
const AgentsPage = lazy(() => import("./panels/c2/AgentsPage"));
const TaskQueuePage = lazy(() => import("./panels/c2/TaskQueuePage"));
const ListenersPage = lazy(() => import("./panels/c2/ListenersPage"));
const OperationTimelinePage = lazy(() => import("./panels/c2/OperationTimelinePage"));

const tabs: InnerTab[] = [
  { id: "agents", icon: Activity, label: "Agents", badge: 4, badgeVariant: "success" },
  { id: "tasks", icon: Send, label: "Task Queue", badge: 2, badgeVariant: "warning" },
  { id: "listeners", icon: Antenna, label: "Listeners" },
  { id: "timeline", icon: Clock, label: "Timeline" },
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-[hsl(0,100%,40%)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const C2FrameworkPanel = () => {
  const [activeTab, setActiveTab] = useState("agents");

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return <AgentsPage />;
      case "tasks":
        return <TaskQueuePage />;
      case "listeners":
        return <ListenersPage />;
      case "timeline":
        return <OperationTimelinePage />;
      default:
        return <AgentsPage />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(0,100%,6%)]">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[hsl(0,100%,18%)]">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[hsl(0,100%,60%)]" />
          <span className="text-sm font-semibold text-[hsl(0,100%,80%)]">Command & Control</span>
        </div>
      </div>

      <InnerPanelTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="red"
      />
      
      <ScrollArea className="flex-1">
        <div className="p-3">
          <Suspense fallback={<LoadingSpinner />}>
            {renderContent()}
          </Suspense>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[hsl(0,100%,18%)] bg-[hsl(0,100%,5%)]">
        <div className="flex items-center justify-between text-[10px] text-[hsl(0,60%,50%)]">
          <span>C2 Server: 0.0.0.0:443</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(120,100%,45%)] animate-pulse" />
            <span className="text-[hsl(120,100%,55%)]">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C2FrameworkPanel;
