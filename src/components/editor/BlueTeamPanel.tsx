import { lazy, Suspense } from "react";
import { X, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ThreatHuntingPanel = lazy(() => import("./ThreatHuntingPanel"));
const DetectionEngineeringPanel = lazy(() => import("./DetectionEngineeringPanel"));
const SIEMPanel = lazy(() => import("./SIEMPanel"));
const IOCManagerPanel = lazy(() => import("./IOCManagerPanel"));
const IncidentResponsePanel = lazy(() => import("./IncidentResponsePanel"));
const SecurityControlsPanel = lazy(() => import("./SecurityControlsPanel"));
const PurpleTeamPanel = lazy(() => import("./PurpleTeamPanel"));
const ThreatIntelFeedsPanel = lazy(() => import("./ThreatIntelFeedsPanel"));
const ScenarioPlaybookPanel = lazy(() => import("./ScenarioPlaybookPanel"));
const DigitalForensicsPanel = lazy(() => import("./DigitalForensicsPanel"));
const LogAnalysisPanel = lazy(() => import("./LogAnalysisPanel"));
const AlertCenterPanel = lazy(() => import("./AlertCenterPanel"));
const VulnerabilityManagementPanel = lazy(() => import("./VulnerabilityManagementPanel"));
const SocialEngineeringDefensePanel = lazy(() => import("./SocialEngineeringDefensePanel"));
const SOCDashboardPanel = lazy(() => import("./SOCDashboardPanel"));
const SecureCommsPanel = lazy(() => import("./SecureCommsPanel"));
const ThreatModelingPanel = lazy(() => import("./ThreatModelingPanel"));
const NetworkDefensePanel = lazy(() => import("./NetworkDefensePanel"));
const HoneypotManagementPanel = lazy(() => import("./HoneypotManagementPanel"));
const DeceptionTechnologyPanel = lazy(() => import("./DeceptionTechnologyPanel"));
const AttackPathVisualization = lazy(() => import("./AttackPathVisualization"));
const ThreatActorPanel = lazy(() => import("./ThreatActorPanel"));
const InvestigationCasePanel = lazy(() => import("./InvestigationCasePanel"));
const NetworkAssetDiscoveryPanel = lazy(() => import("./NetworkAssetDiscoveryPanel"));
interface BlueTeamPanelProps {
  activePanel: string;
  onClose: () => void;
}

const PanelSkeleton = () => (
  <div className="p-3 space-y-3 animate-pulse">
    <div className="h-6 bg-[hsl(210,100%,15%)] rounded w-1/2" />
    <div className="h-32 bg-[hsl(210,100%,12%)] rounded" />
    <div className="h-24 bg-[hsl(210,100%,12%)] rounded" />
  </div>
);

const BlueTeamPanel = ({ activePanel, onClose }: BlueTeamPanelProps) => {
  if (!activePanel) return null;

  const renderPanel = () => {
    switch (activePanel) {
      case "threat-hunt":
        return <ThreatHuntingPanel />;
      case "detection-eng":
        return <DetectionEngineeringPanel />;
      case "siem":
        return <SIEMPanel />;
      case "ioc-manager":
        return <IOCManagerPanel />;
      case "incident-response":
        return <IncidentResponsePanel />;
      case "security-controls":
        return <SecurityControlsPanel />;
      case "threat-intel":
        return <ThreatIntelFeedsPanel />;
      case "threat-actors":
        return <ThreatActorPanel />;
      case "investigations":
        return <InvestigationCasePanel />;
      case "asset-discovery":
        return <NetworkAssetDiscoveryPanel />;
      case "playbooks":
        return <ScenarioPlaybookPanel />;
      case "purple-team":
        return <PurpleTeamPanel />;
      case "forensics":
        return <DigitalForensicsPanel />;
      case "log-analysis":
        return <LogAnalysisPanel />;
      case "alerts":
        return <AlertCenterPanel />;
      case "vuln-management":
        return <VulnerabilityManagementPanel />;
      case "social-eng-defense":
        return <SocialEngineeringDefensePanel />;
      case "soc-dashboard":
        return <SOCDashboardPanel />;
      case "secure-comms":
        return <SecureCommsPanel />;
      case "threat-modeling":
        return <ThreatModelingPanel />;
      case "network-defense":
        return <NetworkDefensePanel />;
      case "honeypot":
        return <HoneypotManagementPanel />;
      case "deception":
        return <DeceptionTechnologyPanel />;
      case "attack-path":
        return <AttackPathVisualization />;
      default:
        return (
          <div className="p-4 text-[hsl(210,60%,60%)] text-sm">
            <Shield className="w-8 h-8 mb-2 text-[hsl(210,100%,50%)]" />
            <p>Blue Team module coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-[hsl(210,100%,6%)] border-r border-[hsl(210,100%,18%)] flex flex-col">
      <div className="h-9 px-3 flex items-center justify-between border-b border-[hsl(210,100%,18%)] bg-[hsl(210,100%,8%)]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs uppercase tracking-wide font-semibold text-[hsl(210,100%,75%)]">
            Blue Team
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center hover:bg-[hsl(210,100%,15%)] rounded transition-colors"
        >
          <X className="w-4 h-4 text-[hsl(210,60%,50%)]" />
        </button>
      </div>
      <ScrollArea className="flex-1">
        <Suspense fallback={<PanelSkeleton />}>
          {renderPanel()}
        </Suspense>
      </ScrollArea>
    </div>
  );
};

export default BlueTeamPanel;
