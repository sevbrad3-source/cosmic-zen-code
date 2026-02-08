import { useState } from "react";
import { Radio, Plus, Play, Pause, Settings, Trash2, CheckCircle, XCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Listener {
  id: string;
  name: string;
  type: "http" | "https" | "dns" | "smb" | "tcp";
  bindAddress: string;
  port: number;
  status: "running" | "stopped" | "error";
  connections: number;
  startedAt: string;
  bytesIn: string;
  bytesOut: string;
}

const ListenersPage = () => {
  const [showNewListener, setShowNewListener] = useState(false);

  const listeners: Listener[] = [
    { id: "L-001", name: "Primary HTTPS", type: "https", bindAddress: "0.0.0.0", port: 443, status: "running", connections: 3, startedAt: "2h ago", bytesIn: "4.2 MB", bytesOut: "12.8 MB" },
    { id: "L-002", name: "DNS C2", type: "dns", bindAddress: "0.0.0.0", port: 53, status: "running", connections: 1, startedAt: "5h ago", bytesIn: "128 KB", bytesOut: "256 KB" },
    { id: "L-003", name: "SMB Pipe", type: "smb", bindAddress: "0.0.0.0", port: 445, status: "running", connections: 2, startedAt: "1h ago", bytesIn: "2.1 MB", bytesOut: "8.4 MB" },
    { id: "L-004", name: "Backup HTTP", type: "http", bindAddress: "0.0.0.0", port: 8080, status: "stopped", connections: 0, startedAt: "-", bytesIn: "0", bytesOut: "0" },
    { id: "L-005", name: "Raw TCP", type: "tcp", bindAddress: "0.0.0.0", port: 4444, status: "running", connections: 1, startedAt: "30m ago", bytesIn: "512 KB", bytesOut: "1.2 MB" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "https": return "bg-[hsl(120,100%,25%)] text-[hsl(120,100%,80%)]";
      case "http": return "bg-[hsl(45,100%,30%)] text-[hsl(45,100%,90%)]";
      case "dns": return "bg-[hsl(270,100%,30%)] text-[hsl(270,100%,85%)]";
      case "smb": return "bg-[hsl(210,100%,30%)] text-[hsl(210,100%,85%)]";
      case "tcp": return "bg-[hsl(0,100%,30%)] text-[hsl(0,100%,85%)]";
      default: return "bg-[hsl(0,60%,30%)]";
    }
  };

  const stats = {
    running: listeners.filter(l => l.status === "running").length,
    stopped: listeners.filter(l => l.status === "stopped").length,
    connections: listeners.reduce((acc, l) => acc + l.connections, 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(120,100%,8%)] border border-[hsl(120,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.running}</div>
          <div className="text-[9px] text-[hsl(120,60%,50%)]">Running</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,55%)]">{stats.stopped}</div>
          <div className="text-[9px] text-[hsl(0,60%,50%)]">Stopped</div>
        </div>
        <div className="p-2 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,20%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(0,100%,70%)]">{stats.connections}</div>
          <div className="text-[9px] text-[hsl(0,60%,50%)]">Connections</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[hsl(0,100%,75%)]">ACTIVE LISTENERS</span>
        <Button size="sm" className="h-7 text-xs bg-[hsl(0,100%,30%)]" onClick={() => setShowNewListener(!showNewListener)}>
          <Plus className="w-3 h-3 mr-1" /> New Listener
        </Button>
      </div>

      {/* New Listener Form */}
      {showNewListener && (
        <div className="p-3 bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Name" className="h-8 text-xs bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]" />
            <select className="h-8 px-2 bg-[hsl(0,100%,6%)] border border-[hsl(0,100%,20%)] rounded text-xs text-[hsl(0,100%,80%)]">
              <option>HTTPS</option>
              <option>HTTP</option>
              <option>DNS</option>
              <option>SMB</option>
              <option>TCP</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Bind Address" defaultValue="0.0.0.0" className="h-8 text-xs bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]" />
            <Input placeholder="Port" type="number" className="h-8 text-xs bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]" />
          </div>
          <Button size="sm" className="w-full h-8 text-xs bg-[hsl(0,100%,35%)]">
            Create Listener
          </Button>
        </div>
      )}

      {/* Listeners List */}
      <div className="space-y-2">
        {listeners.map((listener) => (
          <div
            key={listener.id}
            className="p-3 bg-[hsl(0,100%,7%)] border border-[hsl(0,100%,15%)] rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${listener.status === "running" ? "text-[hsl(120,100%,50%)]" : "text-[hsl(0,60%,40%)]"}`} />
                <div>
                  <div className="text-sm font-medium text-[hsl(0,100%,85%)]">{listener.name}</div>
                  <div className="text-[10px] text-[hsl(0,60%,50%)] font-mono">
                    {listener.bindAddress}:{listener.port}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={`text-[9px] ${getTypeColor(listener.type)}`}>
                  {listener.type.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-[10px] mb-2">
              <div>
                <div className="text-[hsl(0,60%,45%)]">Status</div>
                <div className={listener.status === "running" ? "text-[hsl(120,100%,55%)]" : "text-[hsl(0,100%,55%)]"}>
                  {listener.status}
                </div>
              </div>
              <div>
                <div className="text-[hsl(0,60%,45%)]">Connections</div>
                <div className="text-[hsl(0,100%,75%)]">{listener.connections}</div>
              </div>
              <div>
                <div className="text-[hsl(0,60%,45%)]">In</div>
                <div className="text-[hsl(0,100%,75%)]">{listener.bytesIn}</div>
              </div>
              <div>
                <div className="text-[hsl(0,60%,45%)]">Out</div>
                <div className="text-[hsl(0,100%,75%)]">{listener.bytesOut}</div>
              </div>
            </div>

            <div className="flex gap-1">
              {listener.status === "running" ? (
                <Button size="sm" variant="outline" className="flex-1 h-6 text-[9px] border-[hsl(45,100%,30%)] text-[hsl(45,100%,60%)]">
                  <Pause className="w-3 h-3 mr-1" /> Stop
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="flex-1 h-6 text-[9px] border-[hsl(120,100%,25%)] text-[hsl(120,100%,55%)]">
                  <Play className="w-3 h-3 mr-1" /> Start
                </Button>
              )}
              <Button size="sm" variant="outline" className="h-6 text-[9px] border-[hsl(0,100%,25%)]">
                <Settings className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-[9px] border-[hsl(0,100%,25%)] text-[hsl(0,100%,60%)]">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListenersPage;
