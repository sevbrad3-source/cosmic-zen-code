import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Clock, Calendar, Filter, Play, Pause, SkipForward, SkipBack,
  AlertTriangle, Shield, Target, Users, Zap, ChevronDown, ChevronUp
} from "lucide-react";
import { useSecurityEvents } from "@/hooks/useSecurityData";
import { useAttackCampaigns } from "@/hooks/useThreatActors";
import { format, subHours, isWithinInterval, parseISO } from "date-fns";

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: "event" | "campaign_start" | "campaign_end" | "ioc_detection";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  mitreTechnique?: string;
  source?: string;
  data: any;
}

export const AttackTimelineView = () => {
  const { events } = useSecurityEvents();
  const { campaigns } = useAttackCampaigns();
  
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d">("24h");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(100);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  // Build unified timeline from events and campaigns
  const timelineEvents = useMemo(() => {
    const timeline: TimelineEvent[] = [];
    const now = new Date();
    
    const rangeHours = {
      "1h": 1,
      "6h": 6,
      "24h": 24,
      "7d": 168
    }[timeRange];

    const startTime = subHours(now, rangeHours);

    // Add security events
    events.forEach(event => {
      const eventTime = parseISO(event.detected_at);
      if (isWithinInterval(eventTime, { start: startTime, end: now })) {
        timeline.push({
          id: `event-${event.id}`,
          timestamp: eventTime,
          type: "event",
          severity: event.severity as any,
          title: event.event_type,
          description: event.description,
          mitreTechnique: event.mitre_technique || undefined,
          source: event.source_ip || undefined,
          data: event
        });
      }
    });

    // Add campaign events
    campaigns.forEach(campaign => {
      if (campaign.start_time) {
        const startTime_c = parseISO(campaign.start_time);
        if (isWithinInterval(startTime_c, { start: startTime, end: now })) {
          timeline.push({
            id: `campaign-start-${campaign.id}`,
            timestamp: startTime_c,
            type: "campaign_start",
            severity: "critical",
            title: `Campaign Started: ${campaign.name}`,
            description: campaign.description || "Attack campaign initiated",
            data: campaign
          });
        }
      }
      
      if (campaign.end_time) {
        const endTime = parseISO(campaign.end_time);
        if (isWithinInterval(endTime, { start: startTime, end: now })) {
          timeline.push({
            id: `campaign-end-${campaign.id}`,
            timestamp: endTime,
            type: "campaign_end",
            severity: "info",
            title: `Campaign Ended: ${campaign.name}`,
            description: `Status: ${campaign.status}`,
            data: campaign
          });
        }
      }
    });

    // Sort by timestamp descending
    return timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [events, campaigns, timeRange]);

  // Filter by severity
  const filteredEvents = useMemo(() => {
    if (severityFilter === "all") return timelineEvents;
    return timelineEvents.filter(e => e.severity === severityFilter);
  }, [timelineEvents, severityFilter]);

  // Apply playback position filter
  const visibleEvents = useMemo(() => {
    const cutoffIndex = Math.floor((filteredEvents.length * playbackPosition) / 100);
    return filteredEvents.slice(0, cutoffIndex);
  }, [filteredEvents, playbackPosition]);

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "campaign_start": return <Target className="h-4 w-4" />;
      case "campaign_end": return <Shield className="h-4 w-4" />;
      case "ioc_detection": return <AlertTriangle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const severityCounts = useMemo(() => {
    return {
      critical: timelineEvents.filter(e => e.severity === "critical").length,
      high: timelineEvents.filter(e => e.severity === "high").length,
      medium: timelineEvents.filter(e => e.severity === "medium").length,
      low: timelineEvents.filter(e => e.severity === "low").length,
    };
  }, [timelineEvents]);

  // Group events by hour for density visualization
  const hourlyDensity = useMemo(() => {
    const density = new Map<string, number>();
    timelineEvents.forEach(event => {
      const hour = format(event.timestamp, "yyyy-MM-dd HH:00");
      density.set(hour, (density.get(hour) || 0) + 1);
    });
    return density;
  }, [timelineEvents]);

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Attack Timeline</h2>
          <Badge variant="outline">{timelineEvents.length} events</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-24">
              <Calendar className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="6h">6 Hours</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-28">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Severity summary */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{severityCounts.critical}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{severityCounts.high}</p>
            <p className="text-xs text-muted-foreground">High</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{severityCounts.medium}</p>
            <p className="text-xs text-muted-foreground">Medium</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{severityCounts.low}</p>
            <p className="text-xs text-muted-foreground">Low</p>
          </CardContent>
        </Card>
      </div>

      {/* Playback controls */}
      <Card className="bg-card/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setPlaybackPosition(0)}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setPlaybackPosition(100)}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Slider
                value={[playbackPosition]}
                onValueChange={([v]) => setPlaybackPosition(v)}
                max={100}
                step={1}
              />
            </div>
            <span className="text-xs text-muted-foreground w-20 text-right">
              {visibleEvents.length} / {filteredEvents.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <ScrollArea className="flex-1">
        <div className="relative pl-6 space-y-0">
          {/* Timeline line */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />

          {visibleEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No events in selected time range</p>
            </div>
          ) : (
            visibleEvents.map((event, index) => {
              const isExpanded = expandedEvents.has(event.id);
              const prevEvent = visibleEvents[index - 1];
              const showDateHeader = !prevEvent || 
                format(event.timestamp, "yyyy-MM-dd") !== format(prevEvent.timestamp, "yyyy-MM-dd");

              return (
                <div key={event.id}>
                  {showDateHeader && (
                    <div className="relative py-2 -ml-6 pl-6">
                      <div className="absolute left-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Calendar className="h-2 w-2 text-primary-foreground" />
                      </div>
                      <p className="text-sm font-medium text-primary ml-4">
                        {format(event.timestamp, "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  
                  <div className="relative py-2 group">
                    {/* Timeline dot */}
                    <div className={`absolute -left-4 w-3 h-3 rounded-full ${getSeverityColor(event.severity)} ring-2 ring-background`} />
                    
                    <Card 
                      className={`bg-card/50 hover:bg-card/80 cursor-pointer transition-colors ${
                        event.type === "campaign_start" ? "border-l-2 border-l-red-500" :
                        event.type === "campaign_end" ? "border-l-2 border-l-green-500" : ""
                      }`}
                      onClick={() => toggleExpand(event.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <div className={`p-1.5 rounded ${getSeverityColor(event.severity)}/20`}>
                              {getEventIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{event.title}</p>
                                <Badge variant="outline" className="text-xs">
                                  {event.severity}
                                </Badge>
                                {event.mitreTechnique && (
                                  <Badge variant="secondary" className="text-xs">
                                    {event.mitreTechnique}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {event.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(event.timestamp, "HH:mm:ss")}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-border space-y-2">
                            <p className="text-sm">{event.description}</p>
                            
                            {event.source && (
                              <p className="text-xs">
                                <span className="text-muted-foreground">Source:</span> {event.source}
                              </p>
                            )}
                            
                            {event.type === "event" && event.data && (
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {event.data.destination_ip && (
                                  <p><span className="text-muted-foreground">Destination:</span> {event.data.destination_ip}</p>
                                )}
                                {event.data.port && (
                                  <p><span className="text-muted-foreground">Port:</span> {event.data.port}</p>
                                )}
                                {event.data.protocol && (
                                  <p><span className="text-muted-foreground">Protocol:</span> {event.data.protocol}</p>
                                )}
                              </div>
                            )}

                            {event.type.includes("campaign") && event.data && (
                              <div className="space-y-1 text-xs">
                                {event.data.techniques_used?.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {event.data.techniques_used.map((tech: string) => (
                                      <Badge key={tech} variant="secondary" className="text-xs">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AttackTimelineView;
