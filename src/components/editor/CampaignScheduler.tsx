import { useState } from "react";
import { Calendar, Play, Pause, Plus, Target, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CampaignScheduler = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Network Infrastructure Scan",
      targets: ["192.168.1.0/24"],
      schedule: "Daily at 02:00",
      status: "running",
      progress: 67,
      currentTarget: "192.168.1.45",
      completed: 45,
      total: 67,
      startTime: "2024-03-15 02:00",
    },
    {
      id: 2,
      name: "Web Application Testing",
      targets: ["app.example.com", "api.example.com"],
      schedule: "Weekly on Sunday",
      status: "scheduled",
      progress: 0,
      currentTarget: null,
      completed: 0,
      total: 2,
      nextRun: "2024-03-17 00:00",
    },
    {
      id: 3,
      name: "Phishing Simulation",
      targets: ["All Employees"],
      schedule: "Monthly (1st)",
      status: "completed",
      progress: 100,
      currentTarget: null,
      completed: 247,
      total: 247,
      completedTime: "2024-03-01 16:45",
    },
  ]);

  const [newCampaign, setNewCampaign] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-500 text-white";
      case "scheduled": return "bg-yellow-500 text-black";
      case "completed": return "bg-green-500 text-white";
      case "paused": return "bg-gray-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Activity className="w-3 h-3 animate-pulse" />;
      case "scheduled": return <Clock className="w-3 h-3" />;
      case "completed": return <Activity className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Campaign Scheduler</h3>
        </div>
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => setNewCampaign(!newCampaign)}
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      {newCampaign && (
        <Card className="p-4 space-y-3 border-primary">
          <h4 className="text-sm font-semibold">Create New Campaign</h4>
          <div className="space-y-2">
            <Input placeholder="Campaign Name" />
            <Input placeholder="Target List (comma separated)" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Attack Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scan">Network Scan</SelectItem>
                <SelectItem value="webapp">Web App Test</SelectItem>
                <SelectItem value="exploit">Exploit Chain</SelectItem>
                <SelectItem value="phishing">Phishing Sim</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">Create & Schedule</Button>
              <Button size="sm" variant="outline" onClick={() => setNewCampaign(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1">{campaign.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(campaign.status)}
                      {campaign.status.toUpperCase()}
                    </span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">{campaign.schedule}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {campaign.status === "running" ? (
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : campaign.status === "scheduled" || campaign.status === "paused" ? (
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Play className="w-4 h-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            {campaign.status === "running" && (
              <>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{campaign.completed}/{campaign.total} targets</span>
                  </div>
                  <Progress value={campaign.progress} />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="w-3 h-3" />
                    <span>Current: {campaign.currentTarget}</span>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Targets:</span>
                <span className="font-mono">{campaign.targets.join(", ")}</span>
              </div>
              {campaign.status === "running" && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Started:</span>
                  <span>{campaign.startTime}</span>
                </div>
              )}
              {campaign.status === "scheduled" && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Next Run:</span>
                  <span>{campaign.nextRun}</span>
                </div>
              )}
              {campaign.status === "completed" && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Completed:</span>
                  <span>{campaign.completedTime}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignScheduler;
