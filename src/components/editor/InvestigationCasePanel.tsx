import { useState } from "react";
import { FileSearch, Plus, Clock, User, Link, AlertTriangle, CheckCircle, Circle, PlayCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvestigations } from "@/hooks/useInvestigations";
import { useIOCs, useSecurityEvents } from "@/hooks/useSecurityData";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const InvestigationCasePanel = () => {
  const { investigations, loading, addInvestigation, updateInvestigation, addTimelineEvent, linkEvidence } = useInvestigations();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showNewCase, setShowNewCase] = useState(false);
  const [showLinkEvidence, setShowLinkEvidence] = useState(false);
  const [newCase, setNewCase] = useState({ title: "", description: "", priority: "medium" });
  const [timelineNote, setTimelineNote] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Circle className="w-3 h-3 text-blue-400" />;
      case "in_progress": return <PlayCircle className="w-3 h-3 text-amber-400" />;
      case "closed": return <CheckCircle className="w-3 h-3 text-green-400" />;
      default: return <Circle className="w-3 h-3 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleCreateCase = async () => {
    if (!newCase.title) {
      toast.error("Title is required");
      return;
    }

    const { error } = await addInvestigation({
      title: newCase.title,
      description: newCase.description || null,
      priority: newCase.priority,
      status: "open",
      timeline: [{
        timestamp: new Date().toISOString(),
        action: "Case created",
        user: "Analyst",
      }],
    });

    if (error) {
      toast.error("Failed to create case");
    } else {
      toast.success("Investigation case created");
      setNewCase({ title: "", description: "", priority: "medium" });
      setShowNewCase(false);
    }
  };

  const handleAddTimelineEvent = async () => {
    if (!selectedCase || !timelineNote) return;

    const { error } = await addTimelineEvent(selectedCase, {
      timestamp: new Date().toISOString(),
      action: timelineNote,
      user: "Analyst",
    });

    if (error) {
      toast.error("Failed to add timeline event");
    } else {
      toast.success("Timeline updated");
      setTimelineNote("");
    }
  };

  const handleLinkEvidence = async (type: "ioc" | "event", id: string) => {
    if (!selectedCase) return;

    const { error } = await linkEvidence(selectedCase, type, id);
    if (error) {
      toast.error("Failed to link evidence");
    } else {
      toast.success(`${type.toUpperCase()} linked to investigation`);
    }
  };

  const handleStatusChange = async (caseId: string, status: string) => {
    await updateInvestigation(caseId, { status });
    toast.success("Status updated");
  };

  const selectedInvestigation = investigations.find((i) => i.id === selectedCase);
  const linkedIOCs = selectedInvestigation?.related_iocs 
    ? iocs.filter((i) => selectedInvestigation.related_iocs?.includes(i.id)) 
    : [];
  const linkedEvents = selectedInvestigation?.related_events 
    ? events.filter((e) => selectedInvestigation.related_events?.includes(e.id)) 
    : [];

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
          <FileSearch className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-[hsl(210,100%,85%)]">Investigations</span>
          <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            {investigations.filter((i) => i.status !== "closed").length} Active
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 text-xs"
          onClick={() => setShowNewCase(!showNewCase)}
        >
          <Plus className="w-3 h-3 mr-1" />
          New Case
        </Button>
      </div>

      {showNewCase && (
        <div className="p-3 bg-[hsl(210,100%,10%)] rounded border border-[hsl(210,100%,20%)] space-y-2">
          <Input
            placeholder="Case title"
            value={newCase.title}
            onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
            className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]"
          />
          <Textarea
            placeholder="Description..."
            value={newCase.description}
            onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
            className="text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)] min-h-[60px]"
          />
          <Select value={newCase.priority} onValueChange={(v) => setNewCase({ ...newCase, priority: v })}>
            <SelectTrigger className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={handleCreateCase}>Create</Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowNewCase(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-2">
          {investigations.map((inv) => (
            <div 
              key={inv.id}
              className={`p-3 bg-[hsl(210,100%,10%)] rounded border transition-colors cursor-pointer ${
                selectedCase === inv.id 
                  ? "border-cyan-500/50 bg-cyan-500/5" 
                  : "border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,25%)]"
              }`}
              onClick={() => setSelectedCase(inv.id === selectedCase ? null : inv.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(inv.status)}
                  <span className="text-sm font-medium text-[hsl(210,100%,85%)]">{inv.title}</span>
                </div>
                <Badge className={`text-xs ${getPriorityColor(inv.priority)}`}>
                  {inv.priority}
                </Badge>
              </div>

              {inv.description && (
                <p className="text-xs text-[hsl(210,60%,60%)] mb-2 line-clamp-2">{inv.description}</p>
              )}

              <div className="flex items-center gap-3 text-xs text-[hsl(210,60%,50%)]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(inv.created_at), { addSuffix: true })}
                </div>
                {inv.assigned_to && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {inv.assigned_to}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  {(inv.related_iocs?.length || 0) + (inv.related_events?.length || 0)} evidence
                </div>
              </div>

              {selectedCase === inv.id && (
                <div className="mt-3 pt-3 border-t border-[hsl(210,100%,18%)] space-y-3">
                  {/* Status Control */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[hsl(210,60%,50%)]">Status:</span>
                    <Select value={inv.status} onValueChange={(v) => handleStatusChange(inv.id, v)}>
                      <SelectTrigger className="h-7 w-32 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timeline */}
                  <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[hsl(210,100%,75%)]">Timeline</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                      {((inv.timeline as any[]) || []).map((event, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="text-[hsl(210,100%,85%)]">{event.action}</span>
                            <div className="text-[hsl(210,60%,50%)]">
                              {event.user} • {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add timeline note..."
                        value={timelineNote}
                        onChange={(e) => setTimelineNote(e.target.value)}
                        className="h-7 text-xs bg-[hsl(210,100%,6%)] border-[hsl(210,100%,15%)]"
                      />
                      <Button size="sm" className="h-7 text-xs" onClick={handleAddTimelineEvent}>Add</Button>
                    </div>
                  </div>

                  {/* Linked Evidence */}
                  <div className="p-2 bg-[hsl(210,100%,8%)] rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[hsl(210,100%,75%)]">
                        Evidence ({linkedIOCs.length + linkedEvents.length})
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs"
                        onClick={() => setShowLinkEvidence(!showLinkEvidence)}
                      >
                        <Link className="w-3 h-3 mr-1" />
                        Link
                      </Button>
                    </div>

                    {showLinkEvidence && (
                      <div className="mb-2 p-2 bg-[hsl(210,100%,6%)] rounded space-y-2">
                        <div className="text-xs text-[hsl(210,60%,60%)]">Link IOC:</div>
                        <div className="max-h-20 overflow-y-auto space-y-1">
                          {iocs.slice(0, 5).map((ioc) => (
                            <button
                              key={ioc.id}
                              onClick={() => handleLinkEvidence("ioc", ioc.id)}
                              className="w-full text-left p-1.5 text-xs bg-[hsl(210,100%,10%)] rounded hover:bg-[hsl(210,100%,15%)] transition-colors"
                            >
                              <span className="font-mono truncate">{ioc.value}</span>
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-[hsl(210,60%,60%)]">Link Event:</div>
                        <div className="max-h-20 overflow-y-auto space-y-1">
                          {events.slice(0, 5).map((event) => (
                            <button
                              key={event.id}
                              onClick={() => handleLinkEvidence("event", event.id)}
                              className="w-full text-left p-1.5 text-xs bg-[hsl(210,100%,10%)] rounded hover:bg-[hsl(210,100%,15%)] transition-colors"
                            >
                              {event.description}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      {linkedIOCs.map((ioc) => (
                        <div key={ioc.id} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,6%)] rounded">
                          <span className="text-xs font-mono truncate max-w-[150px] text-[hsl(210,100%,85%)]">{ioc.value}</span>
                          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">IOC</Badge>
                        </div>
                      ))}
                      {linkedEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,6%)] rounded">
                          <span className="text-xs truncate max-w-[150px] text-[hsl(210,100%,85%)]">{event.description}</span>
                          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">Event</Badge>
                        </div>
                      ))}
                      {linkedIOCs.length === 0 && linkedEvents.length === 0 && (
                        <span className="text-xs text-[hsl(210,60%,50%)]">No evidence linked</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {investigations.length === 0 && (
            <div className="text-center py-8 text-[hsl(210,60%,50%)]">
              <FileSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active investigations</p>
              <p className="text-xs">Create a new case to start</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default InvestigationCasePanel;
