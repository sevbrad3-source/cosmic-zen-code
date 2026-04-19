import { useState, useEffect, useMemo, useCallback } from "react";
import TitleBar from "@/components/editor/TitleBar";
import EditorArea from "@/components/editor/EditorArea";
import StatusBar from "@/components/editor/StatusBar";
import RightActivityBar from "@/components/editor/RightActivityBar";
import RightPanel from "@/components/editor/RightPanel";
import BlueTeamActivityBar from "@/components/editor/BlueTeamActivityBar";
import BlueTeamPanel from "@/components/editor/BlueTeamPanel";
import DiagnosticsToggle from "@/components/diagnostics/DiagnosticsToggle";
import { ThemeName } from "@/lib/themes";
import { CinematicHome } from "@/components/cinematic/CinematicHome";
import { ThreatTicker } from "@/components/cinematic/ThreatTicker";
import { CommandPalette } from "@/components/cinematic/CommandPalette";
import { AICopilotDock } from "@/components/cinematic/AICopilotDock";
import { useAutonomousAnalyst } from "@/components/cinematic/useAutonomousAnalyst";
import { useThreatHunter } from "@/components/cinematic/useThreatHunter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [activeRightPanel, setActiveRightPanel] = useState("");
  const [activeBluePanel, setActiveBluePanel] = useState("");
  const [activeBottomPanel, setActiveBottomPanel] = useState("terminal");
  const [mainContent, setMainContent] = useState("command");
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("cinematic");

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [autonomous, setAutonomous] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const { runs, busy, triage } = useAutonomousAnalyst({ autonomous, threshold: "medium" });
  const { hunts, busy: hunterBusy, runCycle: runHuntCycle } = useThreatHunter({ autonomous, intervalSec: 180 });

  const decisionsToday = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return runs.filter((r) => r.ts >= cutoff).length;
  }, [runs]);

  useEffect(() => {
    document.documentElement.classList.remove("theme-cinematic", "theme-granite", "theme-compact", "theme-hacker", "theme-lcars");
    document.documentElement.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  const triageLatest = useCallback(async () => {
    const { data, error } = await supabase
      .from("security_events")
      .select("id,event_type,severity")
      .order("detected_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) {
      toast.error("No events available to triage yet.");
      return;
    }
    toast.info(`Analyst triaging ${data.event_type}…`);
    triage(data.id, { event_type: data.event_type, severity: data.severity });
  }, [triage]);

  const handlePaletteAction = useCallback((action: string, payload?: unknown) => {
    if (action === "main") setMainContent(String(payload));
    else if (action === "blue") setActiveBluePanel(String(payload));
    else if (action === "red") setActiveRightPanel(String(payload));
    else if (action === "ai-triage-latest") triageLatest();
    else if (action === "ai-run-hunt") {
      toast.info("Threat Hunter cycle launched.");
      runHuntCycle();
    } else if (action === "ai-toggle-auto") {
      setAutonomous((v) => { toast.success(`Autonomous mode ${!v ? "ENABLED" : "DISABLED"}`); return !v; });
    } else if (action === "ai-brief") {
      toast.info("Situation brief queued for next idle cycle.");
    }
  }, [triageLatest, runHuntCycle]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <TitleBar
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        mainContent={mainContent}
        onMainContentChange={setMainContent}
      />
      <ThreatTicker />
      <div className="flex-1 flex overflow-hidden">
        <BlueTeamActivityBar activePanel={activeBluePanel} onPanelChange={setActiveBluePanel} />
        <BlueTeamPanel activePanel={activeBluePanel} onClose={() => setActiveBluePanel("")} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {mainContent === "command" ? (
            <CinematicHome
              autonomous={autonomous}
              decisionsToday={decisionsToday}
              runs={runs}
              hunts={hunts}
              hunterBusy={hunterBusy}
              onRunHunt={runHuntCycle}
            />
          ) : (
            <EditorArea
              activeContent={mainContent}
              onBottomPanelChange={setActiveBottomPanel}
              activeBottomPanel={activeBottomPanel}
            />
          )}
        </div>

        <RightPanel activePanel={activeRightPanel} onClose={() => setActiveRightPanel("")} />
        <RightActivityBar activePanel={activeRightPanel} onPanelChange={setActiveRightPanel} />
      </div>
      <StatusBar />

      <AICopilotDock
        runs={runs}
        busy={busy}
        autonomous={autonomous}
        onToggleAutonomous={() => setAutonomous((v) => { toast.success(`Autonomous mode ${!v ? "ENABLED" : "DISABLED"}`); return !v; })}
        onTriageLatest={triageLatest}
        collapsed={dockCollapsed}
        onToggleCollapsed={() => setDockCollapsed((v) => !v)}
      />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onAction={handlePaletteAction} />
      <DiagnosticsToggle />
    </div>
  );
};

export default Index;
