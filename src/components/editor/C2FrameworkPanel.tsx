import { Radio, Activity, Clock, Send, CheckCircle2, XCircle, AlertTriangle, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const C2FrameworkPanel = () => {
  const [activeTab, setActiveTab] = useState<"agents" | "tasks" | "timeline">("agents");

  const agents = [
    { 
      id: "AGENT-4F2A", 
      hostname: "WEB-SERVER-01", 
      ip: "192.168.1.10", 
      os: "Ubuntu 20.04",
      user: "www-data",
      status: "active",
      lastCheckin: "2s ago",
      jitter: "30%",
      sleep: "5s"
    },
    { 
      id: "AGENT-7B91", 
      hostname: "DC01", 
      ip: "192.168.1.25", 
      os: "Windows Server 2019",
      user: "SYSTEM",
      status: "active",
      lastCheckin: "8s ago",
      jitter: "50%",
      sleep: "10s"
    },
    { 
      id: "AGENT-C3E8", 
      hostname: "MAIL-SERVER", 
      ip: "192.168.1.50", 
      os: "CentOS 8",
      user: "root",
      status: "idle",
      lastCheckin: "45s ago",
      jitter: "20%",
      sleep: "15s"
    },
    { 
      id: "AGENT-9D4C", 
      hostname: "WORKSTATION-42", 
      ip: "192.168.1.105", 
      os: "Windows 10",
      user: "jsmith",
      status: "active",
      lastCheckin: "3s ago",
      jitter: "40%",
      sleep: "8s"
    },
  ];

  const tasks = [
    { id: "TASK-001", agent: "AGENT-4F2A", command: "shell whoami", status: "complete", result: "www-data" },
    { id: "TASK-002", agent: "AGENT-7B91", command: "ps", status: "running", result: null },
    { id: "TASK-003", agent: "AGENT-C3E8", command: "download /etc/passwd", status: "pending", result: null },
    { id: "TASK-004", agent: "AGENT-9D4C", command: "screenshot", status: "complete", result: "Captured 1920x1080" },
    { id: "TASK-005", agent: "AGENT-4F2A", command: "upload payload.sh", status: "failed", result: "Permission denied" },
    { id: "TASK-006", agent: "AGENT-7B91", command: "mimikatz", status: "complete", result: "Dumped 5 credentials" },
  ];

  const timeline = [
    { time: "14:32:15", event: "Agent AGENT-4F2A established connection", type: "info" },
    { time: "14:33:02", event: "Task TASK-001 completed: user enumeration", type: "success" },
    { time: "14:34:45", event: "Agent AGENT-7B91 elevated to SYSTEM", type: "success" },
    { time: "14:35:18", event: "Lateral movement attempt to 192.168.1.30", type: "warning" },
    { time: "14:36:54", event: "Credential harvested: admin/P@ssw0rd123", type: "success" },
    { time: "14:37:22", event: "Agent AGENT-C3E8 beacon timeout", type: "error" },
    { time: "14:38:10", event: "Agent AGENT-C3E8 reconnected", type: "info" },
    { time: "14:39:45", event: "Data exfiltration: 2.4 GB transferred", type: "success" },
  ];

  return (
    <div className="h-full flex flex-col bg-panel-bg text-text-primary overflow-hidden">
      {/* Header */}
      <div className="border-b border-panel-border px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold">Command & Control Framework</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("agents")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === "agents"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Active Agents
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === "tasks"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Task Queue
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === "timeline"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Operation Timeline
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {activeTab === "agents" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-semibold">Compromised Hosts</h3>
                </div>
                <Badge variant="default" className="text-xs">
                  {agents.filter(a => a.status === "active").length} Active
                </Badge>
              </div>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <Card key={agent.id} className="bg-sidebar-bg border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-text-primary flex items-center gap-2">
                          {agent.hostname}
                          <Badge 
                            variant={agent.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {agent.id} • {agent.ip}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="bg-editor-bg p-2 rounded">
                        <div className="text-text-muted">OS</div>
                        <div className="text-text-primary">{agent.os}</div>
                      </div>
                      <div className="bg-editor-bg p-2 rounded">
                        <div className="text-text-muted">User</div>
                        <div className="text-text-primary">{agent.user}</div>
                      </div>
                      <div className="bg-editor-bg p-2 rounded">
                        <div className="text-text-muted">Sleep</div>
                        <div className="text-text-primary">{agent.sleep}</div>
                      </div>
                      <div className="bg-editor-bg p-2 rounded">
                        <div className="text-text-muted">Jitter</div>
                        <div className="text-text-primary">{agent.jitter}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-text-muted">Last check-in: {agent.lastCheckin}</span>
                      <button className="px-2 py-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                        Task Agent
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2 text-xs">
                <button className="w-full p-2 bg-sidebar-bg hover:bg-sidebar-hover rounded text-left flex items-center gap-2">
                  <Send className="w-3 h-3" />
                  <span>Broadcast Command to All Agents</span>
                </button>
                <button className="w-full p-2 bg-sidebar-bg hover:bg-sidebar-hover rounded text-left flex items-center gap-2">
                  <Pause className="w-3 h-3" />
                  <span>Pause All Agent Activity</span>
                </button>
                <button className="w-full p-2 bg-sidebar-bg hover:bg-sidebar-hover rounded text-left flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  <span>Generate Health Report</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "tasks" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">Command Queue</h3>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card key={task.id} className="bg-sidebar-bg border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        {task.status === "complete" && <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />}
                        {task.status === "running" && <Activity className="w-4 h-4 text-blue-400 mt-0.5 animate-pulse" />}
                        {task.status === "pending" && <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />}
                        {task.status === "failed" && <XCircle className="w-4 h-4 text-red-400 mt-0.5" />}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-text-primary font-mono">
                            {task.command}
                          </div>
                          <div className="text-xs text-text-muted mt-1">
                            {task.id} • Target: {task.agent}
                          </div>
                          {task.result && (
                            <div className="text-xs text-text-secondary mt-1 font-mono bg-editor-bg p-1 rounded">
                              {task.result}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={
                          task.status === "complete" ? "default" :
                          task.status === "failed" ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <h3 className="text-sm font-semibold mb-2">New Task</h3>
              <div className="space-y-2">
                <select className="w-full h-8 bg-input-bg border border-input-border rounded px-2 text-xs text-text-primary">
                  <option>Select Agent...</option>
                  {agents.map(a => (
                    <option key={a.id}>{a.id} - {a.hostname}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="Enter command..." 
                  className="w-full h-8 bg-input-bg border border-input-border rounded px-2 text-xs text-text-primary font-mono"
                />
                <button className="w-full px-3 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                  Queue Task
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "timeline" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold">Operational Timeline</h3>
              </div>
              <div className="space-y-2">
                {timeline.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 pb-2 border-b border-border last:border-0">
                    <div className="w-16 flex-shrink-0 text-xs text-text-muted font-mono">{entry.time}</div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        {entry.type === "success" && <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5" />}
                        {entry.type === "error" && <XCircle className="w-3 h-3 text-red-400 mt-0.5" />}
                        {entry.type === "warning" && <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5" />}
                        {entry.type === "info" && <Activity className="w-3 h-3 text-blue-400 mt-0.5" />}
                        <span className="text-xs text-text-primary">{entry.event}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <h3 className="text-sm font-semibold mb-2">Operation Statistics</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Total Events</div>
                  <div className="text-lg font-semibold text-text-primary">{timeline.length}</div>
                </div>
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Duration</div>
                  <div className="text-lg font-semibold text-text-primary">0:07:30</div>
                </div>
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Commands Sent</div>
                  <div className="text-lg font-semibold text-blue-400">{tasks.length}</div>
                </div>
                <div className="p-2 bg-sidebar-bg rounded">
                  <div className="text-text-muted">Success Rate</div>
                  <div className="text-lg font-semibold text-green-400">83%</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-panel-border px-4 py-2 bg-statusbar-bg">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>C2 Server: 0.0.0.0:443</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C2FrameworkPanel;