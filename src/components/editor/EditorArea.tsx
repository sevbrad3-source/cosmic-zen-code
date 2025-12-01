import { X, ChevronUp, Plus, ChevronDown } from "lucide-react";
import { useState, lazy, Suspense } from "react";

const NetworkGraph = lazy(() => import("./NetworkGraph"));
const MapboxVisualization = lazy(() => import("./MapboxVisualization"));
const ExploitFlow = lazy(() => import("./ExploitFlow"));
const AttackTimeline = lazy(() => import("./AttackTimeline"));
const ReportGenerator = lazy(() => import("./ReportGenerator"));
const Terminal = lazy(() => import("./Terminal"));
const LogStream = lazy(() => import("./LogStream"));
const ListenerPanel = lazy(() => import("./ListenerPanel"));

interface Tab {
  id: string;
  name: string;
  content: string;
}

const mockTabs: Tab[] = [
  {
    id: "1",
    name: "App.tsx",
    content: `import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default App;`,
  },
  {
    id: "2",
    name: "index.tsx",
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  },
];

interface EditorAreaProps {
  activeContent: string;
  onBottomPanelChange: (panel: string) => void;
  activeBottomPanel: string;
}

const EditorArea = ({ activeContent, onBottomPanelChange, activeBottomPanel }: EditorAreaProps) => {
  const [tabs] = useState<Tab[]>(mockTabs);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [bottomPanelHeight] = useState(200);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content || "";

  const renderLineWithSyntax = (line: string, lineNumber: number) => {
    let highlighted = line;
    
    highlighted = highlighted.replace(
      /\b(import|from|const|let|var|function|return|export|default|class|interface|type|enum|as|extends|implements)\b/g,
      '<span class="text-syntax-keyword">$1</span>'
    );
    
    highlighted = highlighted.replace(
      /(["'`])(.*?)\1/g,
      '<span class="text-syntax-string">$1$2$1</span>'
    );
    
    highlighted = highlighted.replace(
      /(\/\/.*$)/g,
      '<span class="text-syntax-comment">$1</span>'
    );
    
    highlighted = highlighted.replace(
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
      '<span class="text-syntax-function">$1</span>'
    );

    return (
      <div key={lineNumber} className="flex hover:bg-editor-active-line group">
        <div className="w-12 flex-shrink-0 text-right pr-3 text-text-muted select-none text-xs leading-6">
          {lineNumber}
        </div>
        <div
          className="flex-1 pl-2 leading-6 text-sm font-mono"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeContent) {
      case "network":
        return <NetworkGraph />;
      case "geomap":
        return <MapboxVisualization />;
      case "exploits":
        return <ExploitFlow />;
      case "timeline":
        return <AttackTimeline />;
      case "reports":
        return <ReportGenerator />;
      default:
        return (
          <>
            <div className="h-9 bg-tab-bg border-b border-tab-border flex items-center">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-full px-3 flex items-center gap-2 text-sm cursor-pointer border-r border-tab-border transition-colors ${
                    activeTab === tab.id
                      ? "bg-tab-active-bg text-text-primary"
                      : "bg-tab-bg text-text-secondary hover:bg-tab-hover"
                  } ${activeTab === tab.id ? "border-t-2 border-t-primary" : ""}`}
                >
                  <span>{tab.name}</span>
                  <button className="hover:bg-sidebar-hover rounded p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="p-2">
                  {activeTabContent.split("\n").map((line, index) =>
                    renderLineWithSyntax(line || " ", index + 1)
                  )}
                </div>
              </div>
              <div className="w-24 bg-editor-bg border-l border-border overflow-hidden">
                <div className="scale-[0.15] origin-top-left w-[666%] transform opacity-40 pointer-events-none">
                  {activeTabContent.split("\n").map((line, index) => (
                    <div key={index} className="text-[8px] font-mono whitespace-pre leading-tight">
                      {line || " "}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const renderBottomPanel = () => {
    if (!activeBottomPanel) return null;
    switch (activeBottomPanel) {
      case "terminal":
        return <Terminal />;
      case "logs":
        return <LogStream />;
      case "listeners":
        return <ListenerPanel />;
      default:
        return <Terminal />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-editor-bg overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted">Loading...</div>}>
          {renderMainContent()}
        </Suspense>
      </div>
      {activeBottomPanel && (
        <div className="border-t border-border bg-panel-bg flex flex-col" style={{ height: `${bottomPanelHeight}px` }}>
          <div className="h-9 flex items-center justify-between px-2 border-b border-panel-border">
            <div className="flex items-center gap-1">
              <button onClick={() => onBottomPanelChange("terminal")} className={`px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors ${activeBottomPanel === "terminal" ? "text-text-primary border-b-2 border-primary" : "text-text-secondary"}`}>Terminal</button>
              <button onClick={() => onBottomPanelChange("logs")} className={`px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors ${activeBottomPanel === "logs" ? "text-text-primary border-b-2 border-primary" : "text-text-secondary"}`}>Logs</button>
              <button onClick={() => onBottomPanelChange("listeners")} className={`px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors ${activeBottomPanel === "listeners" ? "text-text-primary border-b-2 border-primary" : "text-text-secondary"}`}>Listeners</button>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"><Plus className="w-4 h-4" /></button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"><ChevronDown className="w-4 h-4" /></button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"><ChevronUp className="w-4 h-4" /></button>
              <button onClick={() => onBottomPanelChange("")} className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-text-muted">Loading...</div>}>
              {renderBottomPanel()}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorArea;