import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Server, Database, Laptop, Router, Lock, Unlock, ChevronRight, Play, Pause, RotateCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AttackNode {
  id: string;
  label: string;
  type: "entry" | "pivot" | "target" | "compromised" | "lateral";
  status: "secure" | "vulnerable" | "compromised" | "active-attack";
  technique: string;
  mitre: string;
}

interface AttackPath {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium";
  nodes: AttackNode[];
  progress: number;
  active: boolean;
  timeToCompromise: string;
}

const AttackPathVisualization = () => {
  const [selectedPath, setSelectedPath] = useState<string>("path-1");
  const [animating, setAnimating] = useState(true);
  const [attackProgress, setAttackProgress] = useState(0);

  const attackPaths: AttackPath[] = [
    {
      id: "path-1",
      name: "External to Domain Admin",
      severity: "critical",
      timeToCompromise: "4h 23m",
      progress: 75,
      active: true,
      nodes: [
        { id: "n1", label: "Phishing Email", type: "entry", status: "compromised", technique: "Spearphishing", mitre: "T1566.001" },
        { id: "n2", label: "User Workstation", type: "compromised", status: "compromised", technique: "Initial Access", mitre: "T1078" },
        { id: "n3", label: "File Server", type: "lateral", status: "compromised", technique: "SMB Lateral", mitre: "T1021.002" },
        { id: "n4", label: "Domain Controller", type: "target", status: "active-attack", technique: "DCSync", mitre: "T1003.006" },
        { id: "n5", label: "Database Server", type: "target", status: "vulnerable", technique: "SQL Injection", mitre: "T1190" },
      ],
    },
    {
      id: "path-2",
      name: "VPN to Internal Network",
      severity: "high",
      timeToCompromise: "2h 45m",
      progress: 40,
      active: true,
      nodes: [
        { id: "n1", label: "VPN Gateway", type: "entry", status: "compromised", technique: "Credential Stuffing", mitre: "T1110.004" },
        { id: "n2", label: "Jump Server", type: "pivot", status: "compromised", technique: "RDP Hijack", mitre: "T1563.002" },
        { id: "n3", label: "App Server", type: "lateral", status: "active-attack", technique: "Pass the Hash", mitre: "T1550.002" },
        { id: "n4", label: "Internal API", type: "target", status: "vulnerable", technique: "API Abuse", mitre: "T1106" },
      ],
    },
    {
      id: "path-3",
      name: "Supply Chain Attack",
      severity: "critical",
      timeToCompromise: "12h 15m",
      progress: 25,
      active: false,
      nodes: [
        { id: "n1", label: "Vendor Portal", type: "entry", status: "compromised", technique: "Supply Chain", mitre: "T1195" },
        { id: "n2", label: "Update Server", type: "pivot", status: "active-attack", technique: "Trojanized Update", mitre: "T1195.002" },
        { id: "n3", label: "Build System", type: "target", status: "vulnerable", technique: "Code Injection", mitre: "T1059" },
      ],
    },
  ];

  const currentPath = attackPaths.find((p) => p.id === selectedPath) || attackPaths[0];

  useEffect(() => {
    if (!animating) return;
    const interval = setInterval(() => {
      setAttackProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, [animating]);

  const getNodeColor = (status: AttackNode["status"]) => {
    switch (status) {
      case "compromised": return "hsl(0, 100%, 50%)";
      case "active-attack": return "hsl(30, 100%, 50%)";
      case "vulnerable": return "hsl(45, 100%, 50%)";
      default: return "hsl(120, 100%, 45%)";
    }
  };

  const getNodeIcon = (type: AttackNode["type"]) => {
    switch (type) {
      case "entry": return <Unlock className="w-3 h-3" />;
      case "pivot": return <Router className="w-3 h-3" />;
      case "lateral": return <Server className="w-3 h-3" />;
      case "target": return <Database className="w-3 h-3" />;
      case "compromised": return <Laptop className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const getSeverityColor = (severity: AttackPath["severity"]) => {
    switch (severity) {
      case "critical": return "hsl(0, 100%, 50%)";
      case "high": return "hsl(30, 100%, 50%)";
      default: return "hsl(45, 100%, 50%)";
    }
  };

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[hsl(0,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,70%)]">ATTACK PATH VISUALIZATION</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAnimating(!animating)}
            className="p-1 hover:bg-[hsl(210,100%,18%)] rounded"
          >
            {animating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setAttackProgress(0)}
            className="p-1 hover:bg-[hsl(210,100%,18%)] rounded"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Path Selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {attackPaths.map((path) => (
          <button
            key={path.id}
            onClick={() => setSelectedPath(path.id)}
            className={`flex-shrink-0 px-2 py-1 rounded text-[10px] transition-all ${
              selectedPath === path.id
                ? "bg-[hsl(210,100%,25%)] border border-[hsl(210,100%,40%)]"
                : "bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"
            }`}
          >
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getSeverityColor(path.severity) }} />
              {path.name}
            </div>
          </button>
        ))}
      </div>

      {/* Attack Path Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Severity</div>
          <div className="text-sm font-bold uppercase" style={{ color: getSeverityColor(currentPath.severity) }}>
            {currentPath.severity}
          </div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Time to Compromise</div>
          <div className="text-sm font-bold text-[hsl(30,100%,60%)]">{currentPath.timeToCompromise}</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded">
          <div className="text-[8px] text-[hsl(210,60%,50%)]">Attack Progress</div>
          <div className="text-sm font-bold text-[hsl(0,100%,60%)]">{currentPath.progress}%</div>
        </div>
      </div>

      {/* Visual Attack Chain */}
      <div className="p-3 bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded relative overflow-hidden">
        {/* Animated background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(90deg, transparent ${attackProgress - 10}%, hsl(0,100%,50%) ${attackProgress}%, transparent ${attackProgress + 10}%)`,
          }}
        />
        
        <div className="relative flex items-center justify-between">
          {currentPath.nodes.map((node, i) => {
            const isActive = (i / currentPath.nodes.length) * 100 <= attackProgress;
            return (
              <div key={node.id} className="flex items-center">
                {/* Node */}
                <div className="relative group">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? "animate-pulse" : ""
                    }`}
                    style={{
                      backgroundColor: `${getNodeColor(node.status)}20`,
                      borderWidth: 2,
                      borderColor: getNodeColor(node.status),
                      boxShadow: isActive ? `0 0 12px ${getNodeColor(node.status)}` : "none",
                    }}
                  >
                    <div style={{ color: getNodeColor(node.status) }}>{getNodeIcon(node.type)}</div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[hsl(210,100%,12%)] border border-[hsl(210,100%,25%)] rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-medium">{node.label}</div>
                    <div className="text-[hsl(210,60%,50%)]">{node.technique}</div>
                    <Badge className="mt-1 text-[7px] bg-[hsl(210,100%,20%)]">{node.mitre}</Badge>
                  </div>
                  {/* Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] text-center whitespace-nowrap" style={{ color: getNodeColor(node.status) }}>
                    {node.label}
                  </div>
                </div>
                
                {/* Connector */}
                {i < currentPath.nodes.length - 1 && (
                  <div className="flex-1 mx-1 relative h-0.5">
                    <div className="absolute inset-0 bg-[hsl(210,100%,20%)]" />
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-200"
                      style={{
                        width: isActive ? "100%" : "0%",
                        backgroundColor: getNodeColor(node.status),
                        boxShadow: isActive ? `0 0 6px ${getNodeColor(node.status)}` : "none",
                      }}
                    />
                    {isActive && (
                      <ChevronRight 
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 animate-pulse" 
                        style={{ color: getNodeColor(currentPath.nodes[i + 1].status) }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MITRE ATT&CK Techniques */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Techniques Used</span>
        <div className="flex flex-wrap gap-1">
          {currentPath.nodes.map((node) => (
            <Badge
              key={node.id}
              className="text-[8px]"
              style={{
                backgroundColor: `${getNodeColor(node.status)}20`,
                color: getNodeColor(node.status),
                borderColor: getNodeColor(node.status),
              }}
            >
              {node.mitre}: {node.technique}
            </Badge>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[9px] text-[hsl(210,60%,50%)] pt-2 border-t border-[hsl(210,100%,15%)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(0,100%,50%)]" />
            <span>Compromised</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(30,100%,50%)]" />
            <span>Active Attack</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(45,100%,50%)]" />
            <span>Vulnerable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(120,100%,45%)]" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackPathVisualization;
