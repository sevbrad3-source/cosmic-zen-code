import { useState } from "react";
import { Users, Globe, Target, Link, Plus, ChevronDown, ChevronRight, Shield, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs } from "@/hooks/useSecurityData";
import { toast } from "sonner";

const ThreatActorPanel = () => {
  const { actors, loading, addActor } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [expandedActors, setExpandedActors] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActor, setNewActor] = useState({ name: "", country: "", motivation: "" });

  const getSophisticationColor = (level: string | null) => {
    switch (level) {
      case "advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "intermediate": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "basic": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedActors);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedActors(newSet);
  };

  const getLinkedCampaigns = (actorId: string) => {
    return campaigns.filter((c) => c.threat_actor_id === actorId);
  };

  const getLinkedIOCs = (actorIOCs: string[] | null) => {
    if (!actorIOCs) return [];
    return iocs.filter((i) => actorIOCs.includes(i.id));
  };

  const handleAddActor = async () => {
    if (!newActor.name) {
      toast.error("Actor name is required");
      return;
    }

    const { error } = await addActor({
      name: newActor.name,
      country_of_origin: newActor.country || null,
      motivation: newActor.motivation || null,
      sophistication: "intermediate",
      is_active: true,
    });

    if (error) {
      toast.error("Failed to add threat actor");
    } else {
      toast.success("Threat actor added");
      setNewActor({ name: "", country: "", motivation: "" });
      setShowAddForm(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-[hsl(210,100%,15%)] rounded w-1/2" />
        <div className="h-32 bg-[hsl(210,100%,12%)] rounded" />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-[hsl(210,100%,85%)]">Threat Actors</span>
          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">
            {actors.length}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 text-xs"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      {showAddForm && (
        <div className="p-3 bg-[hsl(210,100%,10%)] rounded border border-[hsl(210,100%,20%)] space-y-2">
          <Input
            placeholder="Actor name (e.g., APT29)"
            value={newActor.name}
            onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
            className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Country"
              value={newActor.country}
              onChange={(e) => setNewActor({ ...newActor, country: e.target.value })}
              className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]"
            />
            <Input
              placeholder="Motivation"
              value={newActor.motivation}
              onChange={(e) => setNewActor({ ...newActor, motivation: e.target.value })}
              className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={handleAddActor}>Save</Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {actors.map((actor) => {
            const linkedCampaigns = getLinkedCampaigns(actor.id);
            const linkedIOCs = getLinkedIOCs(actor.related_iocs);
            const isExpanded = expandedActors.has(actor.id);

            return (
              <Collapsible key={actor.id} open={isExpanded} onOpenChange={() => toggleExpanded(actor.id)}>
                <div 
                  className={`p-3 bg-[hsl(210,100%,10%)] rounded border transition-colors cursor-pointer ${
                    selectedActor === actor.id 
                      ? "border-red-500/50 bg-red-500/5" 
                      : "border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,25%)]"
                  }`}
                  onClick={() => setSelectedActor(actor.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[hsl(210,60%,50%)]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[hsl(210,60%,50%)]" />
                        )}
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[hsl(210,100%,85%)]">{actor.name}</span>
                            {actor.is_active && (
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            )}
                          </div>
                          {actor.aliases && actor.aliases.length > 0 && (
                            <div className="text-xs text-[hsl(210,60%,50%)]">
                              aka: {actor.aliases.slice(0, 2).join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={`text-xs ${getSophisticationColor(actor.sophistication)}`}>
                        {actor.sophistication || "unknown"}
                      </Badge>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-3 space-y-3">
                    {/* Attribution */}
                    <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-medium text-[hsl(210,100%,75%)]">Attribution</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[hsl(210,60%,50%)]">Origin:</span>
                          <span className="ml-1 text-[hsl(210,100%,85%)]">{actor.country_of_origin || "Unknown"}</span>
                        </div>
                        <div>
                          <span className="text-[hsl(210,60%,50%)]">Motivation:</span>
                          <span className="ml-1 text-[hsl(210,100%,85%)]">{actor.motivation || "Unknown"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Target Industries */}
                    {actor.target_industries && actor.target_industries.length > 0 && (
                      <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-3 h-3 text-amber-400" />
                          <span className="text-xs font-medium text-[hsl(210,100%,75%)]">Target Industries</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {actor.target_industries.map((industry, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Known TTPs */}
                    {actor.known_ttps && actor.known_ttps.length > 0 && (
                      <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-3 h-3 text-purple-400" />
                          <span className="text-xs font-medium text-[hsl(210,100%,75%)]">Known TTPs</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {actor.known_ttps.slice(0, 6).map((ttp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                              {ttp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Linked Campaigns */}
                    <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs font-medium text-[hsl(210,100%,75%)]">
                          Campaigns ({linkedCampaigns.length})
                        </span>
                      </div>
                      {linkedCampaigns.length > 0 ? (
                        <div className="space-y-1">
                          {linkedCampaigns.map((campaign) => (
                            <div key={campaign.id} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,6%)] rounded">
                              <span className="text-xs text-[hsl(210,100%,85%)]">{campaign.name}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  campaign.status === "active" 
                                    ? "bg-green-500/10 text-green-400 border-green-500/30" 
                                    : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                                }`}
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[hsl(210,60%,50%)]">No linked campaigns</span>
                      )}
                    </div>

                    {/* Linked IOCs */}
                    <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Link className="w-3 h-3 text-red-400" />
                        <span className="text-xs font-medium text-[hsl(210,100%,75%)]">
                          Related IOCs ({linkedIOCs.length})
                        </span>
                      </div>
                      {linkedIOCs.length > 0 ? (
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {linkedIOCs.slice(0, 5).map((ioc) => (
                            <div key={ioc.id} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,6%)] rounded">
                              <span className="text-xs text-[hsl(210,100%,85%)] font-mono truncate max-w-[180px]">{ioc.value}</span>
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-red-500/10 text-red-400 border-red-500/30"
                              >
                                {ioc.ioc_type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[hsl(210,60%,50%)]">No linked IOCs</span>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}

          {actors.length === 0 && (
            <div className="text-center py-8 text-[hsl(210,60%,50%)]">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No threat actors tracked</p>
              <p className="text-xs">Add actors to track attribution</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThreatActorPanel;
