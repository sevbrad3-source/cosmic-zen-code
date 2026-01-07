import { useState } from "react";
import { Crosshair, Plus, Calendar, Target, Zap, Clock, Users, ChevronDown, ChevronRight, Edit, Trash2, Link2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAttackCampaigns, useThreatActors } from "@/hooks/useThreatActors";
import { format } from "date-fns";

const CampaignManagementPanel = () => {
  const { campaigns, loading: campaignsLoading, addCampaign, updateCampaign } = useAttackCampaigns();
  const { actors, loading: actorsLoading } = useThreatActors();
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    status: "planning",
    threat_actor_id: "",
    objectives: "",
    techniques_used: "",
    tools_used: ""
  });

  const toggleExpanded = (id: string) => {
    setExpandedCampaigns(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "planning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "paused": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const handleAddCampaign = async () => {
    if (!newCampaign.name) return;
    
    await addCampaign({
      name: newCampaign.name,
      description: newCampaign.description || null,
      status: newCampaign.status,
      threat_actor_id: newCampaign.threat_actor_id || null,
      objectives: newCampaign.objectives ? newCampaign.objectives.split(",").map(o => o.trim()) : null,
      techniques_used: newCampaign.techniques_used ? newCampaign.techniques_used.split(",").map(t => t.trim()) : null,
      tools_used: newCampaign.tools_used ? newCampaign.tools_used.split(",").map(t => t.trim()) : null,
      start_time: new Date().toISOString()
    });

    setNewCampaign({
      name: "",
      description: "",
      status: "planning",
      threat_actor_id: "",
      objectives: "",
      techniques_used: "",
      tools_used: ""
    });
    setShowAddForm(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === "completed") {
      updates.end_time = new Date().toISOString();
    }
    await updateCampaign(id, updates);
  };

  const getLinkedActor = (actorId: string | null) => {
    if (!actorId) return null;
    return actors.find(a => a.id === actorId);
  };

  if (campaignsLoading || actorsLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold">Campaign Management</span>
            <Badge variant="outline" className="text-xs">{campaigns.length}</Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-7 px-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-center">
            <div className="text-red-400 font-bold">{campaigns.filter(c => c.status === "active").length}</div>
            <div className="text-text-muted">Active</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 text-center">
            <div className="text-yellow-400 font-bold">{campaigns.filter(c => c.status === "planning").length}</div>
            <div className="text-text-muted">Planning</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-center">
            <div className="text-green-400 font-bold">{campaigns.filter(c => c.status === "completed").length}</div>
            <div className="text-text-muted">Complete</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 text-center">
            <div className="text-blue-400 font-bold">{campaigns.filter(c => c.threat_actor_id).length}</div>
            <div className="text-text-muted">Linked</div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-3 border-b border-border bg-sidebar-bg space-y-2">
          <Input
            placeholder="Campaign Name"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
            className="h-8 text-xs"
          />
          <Textarea
            placeholder="Description"
            value={newCampaign.description}
            onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
            className="text-xs min-h-[60px]"
          />
          <div className="grid grid-cols-2 gap-2">
            <Select value={newCampaign.status} onValueChange={(v) => setNewCampaign({ ...newCampaign, status: v })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newCampaign.threat_actor_id} onValueChange={(v) => setNewCampaign({ ...newCampaign, threat_actor_id: v })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Link Actor" />
              </SelectTrigger>
              <SelectContent>
                {actors.map((actor) => (
                  <SelectItem key={actor.id} value={actor.id}>{actor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Objectives (comma-separated)"
            value={newCampaign.objectives}
            onChange={(e) => setNewCampaign({ ...newCampaign, objectives: e.target.value })}
            className="h-8 text-xs"
          />
          <Input
            placeholder="Techniques (e.g., T1566, T1059)"
            value={newCampaign.techniques_used}
            onChange={(e) => setNewCampaign({ ...newCampaign, techniques_used: e.target.value })}
            className="h-8 text-xs"
          />
          <Input
            placeholder="Tools (comma-separated)"
            value={newCampaign.tools_used}
            onChange={(e) => setNewCampaign({ ...newCampaign, tools_used: e.target.value })}
            className="h-8 text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleAddCampaign}>
              Create Campaign
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {campaigns.length === 0 ? (
            <div className="text-center text-text-muted text-xs py-8">
              No campaigns found. Create one to get started.
            </div>
          ) : (
            campaigns.map((campaign) => {
              const linkedActor = getLinkedActor(campaign.threat_actor_id);
              const isExpanded = expandedCampaigns.includes(campaign.id);
              
              return (
                <Collapsible key={campaign.id} open={isExpanded} onOpenChange={() => toggleExpanded(campaign.id)}>
                  <Card className="bg-editor-bg border-border overflow-hidden">
                    <CollapsibleTrigger className="w-full p-3 text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 mt-0.5 text-text-muted" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mt-0.5 text-text-muted" />
                          )}
                          <div>
                            <div className="text-sm font-medium">{campaign.name}</div>
                            <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              {campaign.start_time ? format(new Date(campaign.start_time), "MMM d, yyyy") : "Not started"}
                              {campaign.end_time && (
                                <span className="text-green-400">→ {format(new Date(campaign.end_time), "MMM d, yyyy")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                        {campaign.description && (
                          <p className="text-xs text-text-secondary">{campaign.description}</p>
                        )}

                        {/* Linked Actor */}
                        {linkedActor && (
                          <div className="bg-sidebar-bg rounded p-2">
                            <div className="flex items-center gap-2 text-xs">
                              <Users className="w-3 h-3 text-red-400" />
                              <span className="text-text-muted">Threat Actor:</span>
                              <Badge variant="outline" className="text-xs">
                                {linkedActor.name}
                              </Badge>
                              {linkedActor.country_of_origin && (
                                <span className="text-text-muted">({linkedActor.country_of_origin})</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Objectives */}
                        {campaign.objectives && campaign.objectives.length > 0 && (
                          <div>
                            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                              <Target className="w-3 h-3" /> Objectives
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {campaign.objectives.map((obj, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {obj}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Techniques */}
                        {campaign.techniques_used && campaign.techniques_used.length > 0 && (
                          <div>
                            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> MITRE Techniques
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {campaign.techniques_used.map((tech, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs font-mono bg-purple-500/10 border-purple-500/30 text-purple-400">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tools */}
                        {campaign.tools_used && campaign.tools_used.length > 0 && (
                          <div>
                            <div className="text-xs text-text-muted mb-1">Tools Used</div>
                            <div className="flex flex-wrap gap-1">
                              {campaign.tools_used.map((tool, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status Change */}
                        <div className="flex gap-2">
                          <Select value={campaign.status} onValueChange={(v) => handleStatusChange(campaign.id, v)}>
                            <SelectTrigger className="h-7 text-xs flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CampaignManagementPanel;
