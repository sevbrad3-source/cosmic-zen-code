import { X, ChevronUp, Plus, ChevronDown, Terminal as TerminalIcon, Activity, Radio } from "lucide-react";
import { useEffect, useState, lazy, Suspense } from "react";
import { useProfiler } from "@/lib/diagnostics";
import { ErrorBoundary } from "@/components/diagnostics/ErrorBoundary";

const NetworkGraph = lazy(() => import("./NetworkGraph"));
const MapboxVisualization = lazy(() => import("./MapboxVisualization"));
const ExploitFlow = lazy(() => import("./ExploitFlow"));
const AttackTimeline = lazy(() => import("./AttackTimeline"));
const ReportGenerator = lazy(() => import("./ReportGenerator"));
const AttackChainBuilder = lazy(() => import("./AttackChainBuilder"));
const RedTeamReportGenerator = lazy(() => import("./RedTeamReportGenerator"));
const LiveCollaborationPanel = lazy(() => import("./LiveCollaborationPanel"));
const JointOperationsCenter = lazy(() => import("./JointOperationsCenter"));
const Terminal = lazy(() => import("./Terminal"));
const LogStream = lazy(() => import("./LogStream"));
const ListenerPanel = lazy(() => import("./ListenerPanel"));
const LogWhispererPanel = lazy(() => import("./LogWhispererPanel"));

interface Tab {
  id: string;
  name: string;
  content: string;
}

const mockTabs: Tab[] = [
  {
    id: "1",
    name: "exploit.py",
    content: `#!/usr/bin/env python3
# Red Team Simulation Framework
# EDUCATIONAL PURPOSE ONLY

import socket
import subprocess
from typing import Optional

class ExploitSimulator:
    """Simulated exploit for training purposes"""
    
    def __init__(self, target: str, port: int):
        self.target = target
        self.port = port
        self.connected = False
    
    def simulate_connection(self) -> bool:
        """Mock connection - no actual network activity"""
        print(f"[SIM] Connecting to {self.target}:{self.port}")
        self.connected = True
        return True
    
    def simulate_payload(self, payload: bytes) -> Optional[str]:
        """Mock payload delivery"""
        if not self.connected:
            return None
        print(f"[SIM] Payload size: {len(payload)} bytes")
        return "SIMULATED_RESPONSE"

if __name__ == "__main__":
    # Training mode only
    sim = ExploitSimulator("192.168.1.100", 445)
    sim.simulate_connection()`,
  },
  {
    id: "2",
    name: "recon.sh",
    content: `#!/bin/bash
# Reconnaissance Script - Training Environment
# All targets are simulated

echo "[*] Starting simulated reconnaissance..."
echo "[*] Target: \$TARGET_RANGE"

# Mock nmap scan
echo "[+] Port scan simulation..."
echo "    22/tcp   open  ssh"
echo "    80/tcp   open  http"
echo "    443/tcp  open  https"
echo "    3306/tcp open  mysql"

# Mock enumeration
echo "[+] Service enumeration..."
echo "    SSH-2.0-OpenSSH_8.2p1"
echo "    Apache/2.4.41 (Ubuntu)"

echo "[✓] Recon complete (simulated data)"`,
  },
];

interface EditorAreaProps {
  activeContent: string;
  onBottomPanelChange: (panel: string) => void;
  activeBottomPanel: string;
}

const EditorArea = ({ activeContent, onBottomPanelChange, activeBottomPanel }: EditorAreaProps) => {
  const profiler = useProfiler("EditorArea");
  const [tabs] = useState<Tab[]>(mockTabs);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [bottomPanelHeight] = useState(220);

  // Track render performance
  useEffect(() => {
    profiler.endRender();
  });

  // Mapbox sometimes renders into a 0-sized container when switching tabs; nudge a resize.
  useEffect(() => {
    if (activeContent !== "geomap") return;
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 250);
    return () => window.clearTimeout(t);
  }, [activeContent]);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content || "";

  const renderLineWithSyntax = (line: string, lineNumber: number) => {
    let highlighted = line;
    
    highlighted = highlighted.replace(
      /\b(import|from|const|let|var|function|return|export|default|class|interface|type|enum|as|extends|implements|def|if|else|elif|for|while|try|except|finally|with|async|await|echo|fi|then|do|done)\b/g,
      '<span class="text-syntax-keyword">$1</span>'
    );
    
    highlighted = highlighted.replace(
      /(["'`])(.*?)\1/g,
      '<span class="text-syntax-string">$1$2$1</span>'
    );
    
    highlighted = highlighted.replace(
      /(#.*$)/g,
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
      case "joc":
        return <JointOperationsCenter />;
      case "network":
        return <ErrorBoundary componentName="NetworkGraph"><NetworkGraph /></ErrorBoundary>;
      case "geomap":
        return <ErrorBoundary componentName="MapboxVisualization"><MapboxVisualization /></ErrorBoundary>;
      case "exploits":
        return <ErrorBoundary componentName="ExploitFlow"><ExploitFlow /></ErrorBoundary>;
      case "exploits":
        return <ExploitFlow />;
      case "timeline":
        return <AttackTimeline />;
      case "reports":
        return <ReportGenerator />;
      case "red-report":
        return <RedTeamReportGenerator />;
      case "team-comms":
        return <LiveCollaborationPanel />;
      case "attack-chain":
        return <AttackChainBuilder />;
      // Backwards-compatible IDs (older TitleBar ids)
      case "chain-builder":
        return <AttackChainBuilder />;
      case "collaboration":
        return <LiveCollaborationPanel />;
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
    switch (activeBottomPanel) {
      case "terminal":
        return <Terminal />;
      case "logs":
        return <LogStream />;
      case "listeners":
        return <ListenerPanel />;
      case "logwhisperer":
        return <LogWhispererPanel />;
      default:
        return <Terminal />;
    }
  };

  const bottomTabs = [
    { id: "terminal", label: "Terminal", icon: TerminalIcon },
    { id: "logs", label: "Logs", icon: Activity },
    { id: "listeners", label: "Listeners", icon: Radio },
    { id: "logwhisperer", label: "LogWhisperer", icon: Activity },
  ];

  return (
    <div className="flex-1 flex flex-col bg-editor-bg overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted">Loading...</div>}>
          {renderMainContent()}
        </Suspense>
      </div>
      
      {/* Consolidated Bottom Panel */}
      {activeBottomPanel && (
        <div className="border-t border-border bg-panel-bg flex flex-col" style={{ height: `${bottomPanelHeight}px` }}>
          <div className="h-9 flex items-center justify-between px-2 border-b border-panel-border bg-statusbar-bg">
            <div className="flex items-center gap-1">
              {bottomTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onBottomPanelChange(tab.id)}
                  className={`px-2 py-1 text-xs flex items-center gap-1.5 hover:bg-sidebar-hover rounded transition-colors ${
                    activeBottomPanel === tab.id 
                      ? "text-text-primary border-b-2 border-primary" 
                      : "text-text-secondary"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onBottomPanelChange("")}
                className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
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