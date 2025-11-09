import { X } from "lucide-react";
import { useState } from "react";

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

const EditorArea = () => {
  const [tabs] = useState<Tab[]>(mockTabs);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content || "";

  const renderLineWithSyntax = (line: string, lineNumber: number) => {
    // Simple syntax highlighting simulation
    let highlighted = line;
    
    // Keywords
    highlighted = highlighted.replace(
      /\b(import|from|const|let|var|function|return|export|default|class|interface|type|enum|as|extends|implements)\b/g,
      '<span class="text-syntax-keyword">$1</span>'
    );
    
    // Strings
    highlighted = highlighted.replace(
      /(["'`])(.*?)\1/g,
      '<span class="text-syntax-string">$1$2$1</span>'
    );
    
    // Comments
    highlighted = highlighted.replace(
      /(\/\/.*$)/g,
      '<span class="text-syntax-comment">$1</span>'
    );
    
    // Function names
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

  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      {/* Tabs */}
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

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-2">
            {activeContent.split("\n").map((line, index) =>
              renderLineWithSyntax(line || " ", index + 1)
            )}
          </div>
        </div>

        {/* Minimap */}
        <div className="w-24 bg-editor-bg border-l border-border overflow-hidden">
          <div className="scale-[0.15] origin-top-left w-[666%] transform opacity-40 pointer-events-none">
            {activeContent.split("\n").map((line, index) => (
              <div key={index} className="text-[8px] font-mono whitespace-pre leading-tight">
                {line || " "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorArea;
