import { useState } from "react";
import TitleBar from "@/components/editor/TitleBar";
import ActivityBar from "@/components/editor/ActivityBar";
import Sidebar from "@/components/editor/Sidebar";
import EditorArea from "@/components/editor/EditorArea";
import StatusBar from "@/components/editor/StatusBar";
import Terminal from "@/components/editor/Terminal";

const Index = () => {
  const [activeView, setActiveView] = useState("explorer");

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <TitleBar />
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />
        <Sidebar activeView={activeView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorArea />
          <Terminal />
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

export default Index;
