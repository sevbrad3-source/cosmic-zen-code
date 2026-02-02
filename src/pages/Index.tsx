import { useState, useEffect } from "react";
import TitleBar from "@/components/editor/TitleBar";
import EditorArea from "@/components/editor/EditorArea";
import StatusBar from "@/components/editor/StatusBar";
import RightActivityBar from "@/components/editor/RightActivityBar";
import RightPanel from "@/components/editor/RightPanel";
import BlueTeamActivityBar from "@/components/editor/BlueTeamActivityBar";
import BlueTeamPanel from "@/components/editor/BlueTeamPanel";
import DiagnosticsToggle from "@/components/diagnostics/DiagnosticsToggle";
import { ThemeName } from "@/lib/themes";

const Index = () => {
  const [activeRightPanel, setActiveRightPanel] = useState("");
  const [activeBluePanel, setActiveBluePanel] = useState("");
  const [activeBottomPanel, setActiveBottomPanel] = useState("terminal");
  const [mainContent, setMainContent] = useState("editor");
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("granite");

  useEffect(() => {
    document.documentElement.classList.remove("theme-granite", "theme-compact", "theme-hacker", "theme-lcars");
    document.documentElement.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <TitleBar 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme}
        mainContent={mainContent}
        onMainContentChange={setMainContent}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* Blue Team - Left Side */}
        <BlueTeamActivityBar activePanel={activeBluePanel} onPanelChange={setActiveBluePanel} />
        <BlueTeamPanel activePanel={activeBluePanel} onClose={() => setActiveBluePanel("")} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorArea 
            activeContent={mainContent}
            onBottomPanelChange={setActiveBottomPanel}
            activeBottomPanel={activeBottomPanel}
          />
        </div>
        
        {/* Red Team - Right Side */}
        <RightPanel activePanel={activeRightPanel} onClose={() => setActiveRightPanel("")} />
        <RightActivityBar activePanel={activeRightPanel} onPanelChange={setActiveRightPanel} />
      </div>
      <StatusBar />
      <DiagnosticsToggle />
    </div>
  );
};

export default Index;
