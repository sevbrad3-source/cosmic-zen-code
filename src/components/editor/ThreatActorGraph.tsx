import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, Users, Target, Shield, ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs } from "@/hooks/useSecurityData";

interface GraphNode {
  id: string;
  type: "actor" | "campaign" | "ioc";
  label: string;
  x: number;
  y: number;
  data: any;
}

interface GraphEdge {
  source: string;
  target: string;
  type: "owns" | "uses" | "shares";
}

export const ThreatActorGraph = () => {
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<"all" | "actors" | "campaigns" | "iocs">("all");
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Build graph data from entities
  useEffect(() => {
    const graphNodes: GraphNode[] = [];
    const graphEdges: GraphEdge[] = [];
    
    const centerX = 400;
    const centerY = 300;
    
    // Add actor nodes in inner circle
    actors.forEach((actor, i) => {
      const angle = (2 * Math.PI * i) / Math.max(actors.length, 1);
      const radius = 150;
      graphNodes.push({
        id: `actor-${actor.id}`,
        type: "actor",
        label: actor.name,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        data: actor
      });
    });

    // Add campaign nodes in middle ring
    campaigns.forEach((campaign, i) => {
      const angle = (2 * Math.PI * i) / Math.max(campaigns.length, 1) + 0.3;
      const radius = 280;
      graphNodes.push({
        id: `campaign-${campaign.id}`,
        type: "campaign",
        label: campaign.name,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        data: campaign
      });

      // Link campaign to actor
      if (campaign.threat_actor_id) {
        graphEdges.push({
          source: `actor-${campaign.threat_actor_id}`,
          target: `campaign-${campaign.id}`,
          type: "owns"
        });
      }
    });

    // Add IOC nodes in outer ring (limit to critical ones)
    const criticalIOCs = iocs.filter(ioc => ioc.threat_level === "critical").slice(0, 20);
    criticalIOCs.forEach((ioc, i) => {
      const angle = (2 * Math.PI * i) / Math.max(criticalIOCs.length, 1) + 0.6;
      const radius = 400;
      graphNodes.push({
        id: `ioc-${ioc.id}`,
        type: "ioc",
        label: ioc.value.substring(0, 20) + (ioc.value.length > 20 ? "..." : ""),
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        data: ioc
      });
    });

    // Link IOCs to actors via related_iocs
    actors.forEach(actor => {
      if (actor.related_iocs) {
        actor.related_iocs.forEach(iocId => {
          if (criticalIOCs.some(ioc => ioc.id === iocId)) {
            graphEdges.push({
              source: `actor-${actor.id}`,
              target: `ioc-${iocId}`,
              type: "uses"
            });
          }
        });
      }
    });

    // Find shared IOCs between actors
    const iocActorMap = new Map<string, string[]>();
    actors.forEach(actor => {
      actor.related_iocs?.forEach(iocId => {
        const existing = iocActorMap.get(iocId) || [];
        existing.push(actor.id);
        iocActorMap.set(iocId, existing);
      });
    });

    // Create "shares" edges for actors with common IOCs
    iocActorMap.forEach((actorIds) => {
      if (actorIds.length > 1) {
        for (let i = 0; i < actorIds.length - 1; i++) {
          graphEdges.push({
            source: `actor-${actorIds[i]}`,
            target: `actor-${actorIds[i + 1]}`,
            type: "shares"
          });
        }
      }
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [actors, campaigns, iocs]);

  // Canvas rendering
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      if (edge.type === "owns") {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
        ctx.lineWidth = 2;
      } else if (edge.type === "uses") {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
        ctx.lineWidth = 3;
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Filter nodes
    const filteredNodes = filter === "all" 
      ? nodes 
      : nodes.filter(n => n.type === filter.slice(0, -1) as any);

    // Draw nodes
    filteredNodes.forEach(node => {
      ctx.beginPath();
      
      const radius = node.type === "actor" ? 25 : node.type === "campaign" ? 20 : 15;
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      if (node.type === "actor") {
        ctx.fillStyle = selectedNode?.id === node.id ? "#dc2626" : "#ef4444";
      } else if (node.type === "campaign") {
        ctx.fillStyle = selectedNode?.id === node.id ? "#d97706" : "#f59e0b";
      } else {
        ctx.fillStyle = selectedNode?.id === node.id ? "#7c3aed" : "#a855f7";
      }
      
      ctx.fill();
      ctx.strokeStyle = selectedNode?.id === node.id ? "#fff" : "rgba(255,255,255,0.3)";
      ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + radius + 14);
    });

    ctx.restore();
  }, [nodes, edges, selectedNode, zoom, filter, offset]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;

    const clickedNode = nodes.find(node => {
      const radius = node.type === "actor" ? 25 : node.type === "campaign" ? 20 : 15;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;

    const clickedNode = nodes.find(node => {
      const radius = node.type === "actor" ? 25 : node.type === "campaign" ? 20 : 15;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    });

    if (clickedNode) {
      setDragNode(clickedNode.id);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragNode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;

    setNodes(prev => prev.map(node => 
      node.id === dragNode ? { ...node, x, y } : node
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "actor": return <Users className="h-4 w-4" />;
      case "campaign": return <Target className="h-4 w-4" />;
      case "ioc": return <Shield className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const getConnections = (nodeId: string) => {
    return edges.filter(e => e.source === nodeId || e.target === nodeId);
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Threat Actor Relationship Map</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="actors">Actors</SelectItem>
              <SelectItem value="campaigns">Campaigns</SelectItem>
              <SelectItem value="iocs">IOCs</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(z + 0.2, 2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <Card className="flex-1 bg-card/50 overflow-hidden">
          <CardContent className="p-0 h-full">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </CardContent>
        </Card>

        <Card className="w-80 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {selectedNode ? "Node Details" : "Legend & Stats"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getNodeTypeIcon(selectedNode.type)}
                  <span className="font-medium">{selectedNode.label}</span>
                </div>
                <Badge variant={
                  selectedNode.type === "actor" ? "destructive" :
                  selectedNode.type === "campaign" ? "default" : "secondary"
                }>
                  {selectedNode.type.toUpperCase()}
                </Badge>
                
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Connections: {getConnections(selectedNode.id).length}</p>
                  
                  {selectedNode.type === "actor" && selectedNode.data && (
                    <>
                      <p><span className="text-muted-foreground">Sophistication:</span> {selectedNode.data.sophistication}</p>
                      <p><span className="text-muted-foreground">Origin:</span> {selectedNode.data.country_of_origin || "Unknown"}</p>
                      <p><span className="text-muted-foreground">Active:</span> {selectedNode.data.is_active ? "Yes" : "No"}</p>
                    </>
                  )}
                  
                  {selectedNode.type === "campaign" && selectedNode.data && (
                    <>
                      <p><span className="text-muted-foreground">Status:</span> {selectedNode.data.status}</p>
                      <p><span className="text-muted-foreground">Techniques:</span> {selectedNode.data.techniques_used?.length || 0}</p>
                    </>
                  )}
                  
                  {selectedNode.type === "ioc" && selectedNode.data && (
                    <>
                      <p><span className="text-muted-foreground">Type:</span> {selectedNode.data.ioc_type}</p>
                      <p><span className="text-muted-foreground">Threat Level:</span> {selectedNode.data.threat_level}</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Node Types</p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      <span>Threat Actors ({actors.length})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span>Campaigns ({campaigns.length})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      <span>Critical IOCs</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Edge Types</p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-0.5 bg-blue-500" />
                      <span>Owns (Actor → Campaign)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-0.5 bg-red-400 border-dashed" />
                      <span>Uses (Actor → IOC)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-1 bg-purple-500" />
                      <span>Shares IOC</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Click and drag nodes to reposition. Use zoom controls to navigate.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatActorGraph;
