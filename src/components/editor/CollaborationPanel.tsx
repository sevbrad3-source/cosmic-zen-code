import { Users, MessageSquare, CheckSquare, Clock, AlertCircle, CheckCircle2, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "online" | "away" | "offline";
  avatar?: string;
}

interface Finding {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  assignedTo: string;
  status: "new" | "investigating" | "remediated" | "verified";
  comments: number;
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
}

const CollaborationPanel = () => {
  const [activeTab, setActiveTab] = useState<"team" | "findings" | "tasks">("team");

  const teamMembers: TeamMember[] = [
    { id: "1", name: "Alex Chen", role: "Lead Pentester", status: "online" },
    { id: "2", name: "Sarah Johnson", role: "Security Analyst", status: "online" },
    { id: "3", name: "Mike Rodriguez", role: "Red Team Op", status: "away" },
    { id: "4", name: "Emma Davis", role: "Security Engineer", status: "offline" },
  ];

  const sharedFindings: Finding[] = [
    { id: "1", title: "SQL Injection in /api/users", severity: "critical", assignedTo: "Alex Chen", status: "investigating", comments: 3 },
    { id: "2", title: "Weak Password Policy", severity: "high", assignedTo: "Sarah Johnson", status: "remediated", comments: 5 },
    { id: "3", title: "Missing CSRF Protection", severity: "medium", assignedTo: "Mike Rodriguez", status: "new", comments: 0 },
  ];

  const tasks: Task[] = [
    { id: "1", title: "Verify SQL injection patch", assignedTo: "Alex Chen", dueDate: "2024-01-15", priority: "high", status: "in-progress" },
    { id: "2", title: "Review password policy changes", assignedTo: "Sarah Johnson", dueDate: "2024-01-16", priority: "medium", status: "completed" },
    { id: "3", title: "Test CSRF token implementation", assignedTo: "Mike Rodriguez", dueDate: "2024-01-17", priority: "high", status: "todo" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-3 border-b border-border">
        <Button
          variant={activeTab === "team" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("team")}
          className="flex-1"
        >
          <Users className="w-4 h-4 mr-2" />
          Team
        </Button>
        <Button
          variant={activeTab === "findings" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("findings")}
          className="flex-1"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Findings
        </Button>
        <Button
          variant={activeTab === "tasks" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("tasks")}
          className="flex-1"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Tasks
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "team" && (
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-panel-bg rounded-lg border border-border">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-activitybar-bg text-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-panel-bg ${getStatusColor(member.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-text-secondary">{member.role}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Team Chat</h3>
              <div className="space-y-2">
                <div className="p-2 bg-activitybar-bg rounded text-xs">
                  <p className="text-text-secondary mb-1">Alex Chen • 2m ago</p>
                  <p className="text-foreground">Found a critical SQL injection, assigning to myself</p>
                </div>
                <div className="p-2 bg-activitybar-bg rounded text-xs">
                  <p className="text-text-secondary mb-1">Sarah Johnson • 15m ago</p>
                  <p className="text-foreground">Password policy has been updated and verified</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1 h-8 text-xs" />
                <Button size="sm" className="h-8">Send</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "findings" && (
          <div className="p-4 space-y-3">
            {sharedFindings.map((finding) => (
              <div key={finding.id} className="p-3 bg-panel-bg rounded-lg border border-border space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{finding.title}</p>
                    <p className="text-xs text-text-secondary mt-1">Assigned to {finding.assignedTo}</p>
                  </div>
                  <Badge className={`${getSeverityColor(finding.severity)} text-white text-xs`}>
                    {finding.severity}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {finding.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <MessageSquare className="w-3 h-3" />
                    {finding.comments}
                  </div>
                </div>
                <Separator />
                <Textarea
                  placeholder="Add a comment..."
                  className="h-16 text-xs resize-none"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="p-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="p-3 bg-panel-bg rounded-lg border border-border space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-text-secondary mt-1">Assigned to {task.assignedTo}</p>
                  </div>
                  {task.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {task.status}
                  </Badge>
                  <Badge className={`text-xs ${task.priority === "high" ? "bg-orange-500" : "bg-muted"}`}>
                    {task.priority}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock className="w-3 h-3" />
                    {task.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CollaborationPanel;
