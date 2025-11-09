import { useState, useEffect } from "react";
import TitleBar from "@/components/editor/TitleBar";
import ActivityBar from "@/components/editor/ActivityBar";
import Sidebar from "@/components/editor/Sidebar";
import EditorArea from "@/components/editor/EditorArea";
import StatusBar from "@/components/editor/StatusBar";
import Terminal from "@/components/editor/Terminal";
import RightActivityBar from "@/components/editor/RightActivityBar";
import RightPanel from "@/components/editor/RightPanel";
import { ThemeName } from "@/lib/themes";

const Index = () => {
  const [activeView, setActiveView] = useState("explorer");
  const [activeRightPanel, setActiveRightPanel] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("granite");

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove("theme-granite", "theme-compact", "theme-hacker");
    // Add current theme class
    document.documentElement.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <TitleBar currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />
        <Sidebar activeView={activeView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorArea />
          <Terminal />
        </div>
        <RightPanel activePanel={activeRightPanel} onClose={() => setActiveRightPanel("")} />
        <RightActivityBar activePanel={activeRightPanel} onPanelChange={setActiveRightPanel} />
      </div>
      <StatusBar />
    </div>
  );
};

export default Index;
