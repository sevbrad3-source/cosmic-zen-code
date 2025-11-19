import { useState } from "react";
import { Shield, Server, Database, Laptop, Router, Globe } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "target" | "router" | "server" | "database" | "workstation" | "internet";
  x: number;
  y: number;
  compromised: boolean;
  risk: "low" | "medium" | "high" | "critical";
}

interface Edge {
  from: string;
  to: string;
  protocol: string;
  active: boolean;
}

const NetworkGraph = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: "internet", label: "Internet", type: "internet", x: 50, y: 50, compromised: false, risk: "low" },
    { id: "firewall", label: "Firewall", type: "router", x: 50, y: 150, compromised: false, risk: "medium" },
    { id: "dmz-web", label: "Web Server", type: "server", x: 20, y: 250, compromised: true, risk: "critical" },
    { id: "dmz-mail", label: "Mail Server", type: "server", x: 80, y: 250, compromised: true, risk: "high" },
    { id: "router", label: "Internal Router", type: "router", x: 50, y: 350, compromised: true, risk: "high" },
    { id: "dc", label: "Domain Controller", type: "server", x: 30, y: 450, compromised: false, risk: "critical" },
    { id: "db", label: "Database", type: "database", x: 70, y: 450, compromised: false, risk: "critical" },
    { id: "ws1", label: "Workstation-01", type: "workstation", x: 15, y: 550, compromised: false, risk: "medium" },
    { id: "ws2", label: "Workstation-02", type: "workstation", x: 45, y: 550, compromised: false, risk: "low" },
    { id: "ws3", label: "Workstation-03", type: "workstation", x: 75, y: 550, compromised: false, risk: "medium" },
  ];

  const edges: Edge[] = [
    { from: "internet", to: "firewall", protocol: "HTTPS", active: true },
    { from: "firewall", to: "dmz-web", protocol: "HTTP", active: true },
    { from: "firewall", to: "dmz-mail", protocol: "SMTP", active: true },
    { from: "dmz-web", to: "router", protocol: "SSH", active: true },
    { from: "dmz-mail", to: "router", protocol: "SSH", active: false },
    { from: "router", to: "dc", protocol: "SMB", active: true },
    { from: "router", to: "db", protocol: "MySQL", active: true },
    { from: "dc", to: "ws1", protocol: "RDP", active: false },
    { from: "dc", to: "ws2", protocol: "RDP", active: false },
    { from: "dc", to: "ws3", protocol: "RDP", active: false },
    { from: "db", to: "dmz-web", protocol: "MySQL", active: true },
  ];

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "internet": return Globe;
      case "router": return Router;
      case "server": return Server;
      case "database": return Database;
      case "workstation": return Laptop;
      default: return Shield;
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="relative w-full h-full bg-panel-bg">
      <svg className="w-full h-full" viewBox="0 0 100 600">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            className="fill-border"
          >
            <polygon points="0 0, 10 3, 0 6" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            className="fill-primary"
          >
            <polygon points="0 0, 10 3, 0 6" />
          </marker>
        </defs>

        {/* Draw edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <g key={i}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={edge.active ? "stroke-primary" : "stroke-border"}
                strokeWidth="0.3"
                markerEnd={edge.active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              />
              {edge.active && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2}
                  className="fill-text-muted text-[2px] font-mono"
                  textAnchor="middle"
                >
                  {edge.protocol}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => setSelectedNode(node.id)}
              className="cursor-pointer"
            >
              <circle
                r="4"
                className={`
                  ${isSelected ? "fill-primary stroke-primary" : "fill-panel-bg stroke-border"}
                  ${node.compromised ? "stroke-red-500 fill-red-500/20" : ""}
                  transition-all hover:stroke-primary
                `}
                strokeWidth="0.5"
              />
              {node.compromised && (
                <circle
                  r="4.5"
                  className="fill-none stroke-red-500 animate-ping"
                  strokeWidth="0.3"
                  opacity="0.5"
                />
              )}
              <text
                y="6"
                className="fill-text-secondary text-[2.5px] font-mono"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Node details panel */}
      {selectedNodeData && (
        <div className="absolute top-2 right-2 bg-sidebar-bg border border-border rounded p-3 w-48 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-text-primary">{selectedNodeData.label}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-text-muted hover:text-text-primary"
            >
              ×
            </button>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Type:</span>
              <span className="text-text-secondary capitalize">{selectedNodeData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Status:</span>
              <span className={selectedNodeData.compromised ? "text-red-500" : "text-green-500"}>
                {selectedNodeData.compromised ? "Compromised" : "Secure"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Risk:</span>
              <span className={`
                ${selectedNodeData.risk === "critical" ? "text-red-500" :
                  selectedNodeData.risk === "high" ? "text-orange-500" :
                  selectedNodeData.risk === "medium" ? "text-yellow-500" :
                  "text-green-500"}
              `}>
                {selectedNodeData.risk.toUpperCase()}
              </span>
            </div>
          </div>
          {selectedNodeData.compromised && (
            <div className="mt-3 pt-2 border-t border-border">
              <button className="w-full py-1.5 px-2 bg-primary text-primary-foreground rounded text-xs hover:opacity-90 transition-opacity">
                Pivot to Node
              </button>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-sidebar-bg border border-border rounded p-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-text-muted">Compromised</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-text-muted">Active Connection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-border bg-panel-bg" />
          <span className="text-text-muted">Secure</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
