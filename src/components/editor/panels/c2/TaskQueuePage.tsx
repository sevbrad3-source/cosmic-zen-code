import { useState } from "react";
import { Send, CheckCircle, Clock, XCircle, Activity, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  agent: string;
  command: string;
  status: "queued" | "running" | "complete" | "failed";
  result?: string;
  submittedAt: string;
  completedAt?: string;
  operator: string;
}

const TaskQueuePage = () => {
  const [newCommand, setNewCommand] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");

  const tasks: Task[] = [
    { id: "TASK-001", agent: "AGENT-4F2A", command: "shell whoami", status: "complete", result: "www-data", submittedAt: "2m ago", completedAt: "2m ago", operator: "admin" },
    { id: "TASK-002", agent: "AGENT-7B91", command: "ps", status: "running", submittedAt: "1m ago", operator: "admin" },
    { id: "TASK-003", agent: "AGENT-C3E8", command: "download /etc/passwd", status: "queued", submittedAt: "30s ago", operator: "operator1" },
    { id: "TASK-004", agent: "AGENT-9D4C", command: "screenshot", status: "complete", result: "Captured 1920x1080", submittedAt: "5m ago", completedAt: "5m ago", operator: "admin" },
    { id: "TASK-005", agent: "AGENT-4F2A", command: "upload payload.sh /tmp/", status: "failed", result: "Permission denied", submittedAt: "10m ago", completedAt: "10m ago", operator: "operator1" },
    { id: "TASK-006", agent: "AGENT-7B91", command: "mimikatz sekurlsa::logonpasswords", status: "complete", result: "Dumped 5 credentials", submittedAt: "15m ago", completedAt: "14m ago", operator: "admin" },
    { id: "TASK-007", agent: "AGENT-9D4C", command: "shell netstat -an", status: "queued", submittedAt: "10s ago", operator: "admin" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle className="w-4 h-4 text-[hsl(120,100%,45%)]" />;
      case "running": return <Activity className="w-4 h-4 text-[hsl(210,100%,60%)] animate-pulse" />;
      case "queued": return <Clock className="w-4 h-4 text-[hsl(45,100%,55%)]" />;
      case "failed": return <XCircle className="w-4 h-4 text-[hsl(0,100%,55%)]" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-[hsl(120,100%,20%)] text-[hsl(120,100%,70%)]";
      case "running": return "bg-[hsl(210,100%,25%)] text-[hsl(210,100%,75%)]";
      case "queued": return "bg-[hsl(45,100%,25%)] text-[hsl(45,100%,75%)]";
      case "failed": return "bg-[hsl(0,100%,25%)] text-[hsl(0,100%,75%)]";
      default: return "bg-[hsl(0,60%,25%)]";
    }
  };

  const stats = {
    queued: tasks.filter(t => t.status === "queued").length,
    running: tasks.filter(t => t.status === "running").length,
    complete: tasks.filter(t => t.status === "complete").length,
    failed: tasks.filter(t => t.status === "failed").length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-[hsl(45,100%,10%)] border border-[hsl(45,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(45,100%,55%)]">{stats.queued}</div>
          <div className="text-[9px] text-[hsl(45,60%,50%)]">Queued</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,60%)]">{stats.running}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Running</div>
        </div>
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.complete}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Complete</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,25%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,55%)]">{stats.failed}</div>
          <div className="text-[9px] text-[hsl(0,60%,50%)]">Failed</div>
        </div>
      </div>

      {/* New Task */}
      <div className="p-3 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,18%)] rounded-lg space-y-2">
        <div className="text-xs font-semibold text-[hsl(0,100%,75%)]">NEW TASK</div>
        <select 
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full h-8 px-2 bg-[hsl(0,100%,6%)] border border-[hsl(0,100%,20%)] rounded text-xs text-[hsl(0,100%,80%)]"
        >
          <option value="all">All Agents</option>
          <option value="AGENT-4F2A">AGENT-4F2A (WEB-SERVER-01)</option>
          <option value="AGENT-7B91">AGENT-7B91 (DC01)</option>
          <option value="AGENT-C3E8">AGENT-C3E8 (MAIL-SERVER)</option>
          <option value="AGENT-9D4C">AGENT-9D4C (WORKSTATION-42)</option>
        </select>
        <div className="flex gap-2">
          <Input
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
            placeholder="Enter command..."
            className="flex-1 h-8 text-xs font-mono bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]"
          />
          <Button size="sm" className="h-8 text-xs bg-[hsl(0,100%,35%)]">
            <Send className="w-3 h-3 mr-1" /> Send
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[hsl(0,100%,75%)]">TASK QUEUE</div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 bg-[hsl(0,100%,7%)] border border-[hsl(0,100%,15%)] rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <div>
                  <div className="text-xs font-mono text-[hsl(0,100%,85%)]">{task.command}</div>
                  <div className="text-[10px] text-[hsl(0,60%,50%)]">{task.id} → {task.agent}</div>
                </div>
              </div>
              <Badge className={`text-[9px] ${getStatusColor(task.status)}`}>
                {task.status}
              </Badge>
            </div>

            {task.result && (
              <div className="p-2 bg-[hsl(0,100%,5%)] border border-[hsl(0,100%,12%)] rounded font-mono text-[10px] text-[hsl(0,100%,75%)] mb-2">
                {task.result}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-[hsl(0,60%,50%)]">
              <span>by {task.operator} • {task.submittedAt}</span>
              {task.completedAt && <span>Completed {task.completedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskQueuePage;
