import { Play, Square, Settings, Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface Listener {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  status: "running" | "stopped";
  connections: number;
}

const ListenerPanel = () => {
  const [listeners] = useState<Listener[]>([
    {
      id: "listener_001",
      name: "http-listener",
      type: "HTTP",
      host: "0.0.0.0",
      port: 8080,
      status: "running",
      connections: 2
    },
    {
      id: "listener_002",
      name: "https-listener",
      type: "HTTPS",
      host: "0.0.0.0",
      port: 8443,
      status: "stopped",
      connections: 0
    }
  ]);

  const [newListener, setNewListener] = useState({
    name: "",
    port: ""
  });

  const handleStart = (listener: Listener) => {
    toast.info("🎮 SIMULATION MODE", {
      description: `Mock start of ${listener.name}. No actual listener created.`
    });
  };

  const handleStop = (listener: Listener) => {
    toast.info("🎮 SIMULATION MODE", {
      description: `Mock stop of ${listener.name}. This is a safe training environment.`
    });
  };

  const handleCreate = () => {
    if (!newListener.name || !newListener.port) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.info("🎮 SIMULATION MODE", {
      description: "Mock listener creation. No actual network listener is started."
    });
    setNewListener({ name: "", port: "" });
  };

  return (
    <div className="p-3 space-y-3">
      {/* Safety Banner */}
      <div className="bg-status-warning/10 border border-status-warning/30 rounded p-2 flex items-start gap-2">
        <Shield className="w-4 h-4 text-status-warning flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-status-warning mb-1">SAFE SIMULATION MODE</div>
          <div className="text-text-secondary">All listeners are simulated. No actual network ports opened. Training only.</div>
        </div>
      </div>

      <div className="text-xs text-text-muted mb-2">CREATE NEW LISTENER</div>
      
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
        <Input
          placeholder="Listener name"
          value={newListener.name}
          onChange={(e) => setNewListener({ ...newListener, name: e.target.value })}
          className="h-8 text-xs"
        />
        <Input
          placeholder="Port number"
          type="number"
          value={newListener.port}
          onChange={(e) => setNewListener({ ...newListener, port: e.target.value })}
          className="h-8 text-xs"
        />
        <Button
          onClick={handleCreate}
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
        >
          <Play className="w-3 h-3" />
          Create Mock Listener
        </Button>
      </div>

      <div className="text-xs text-text-muted mb-2 pt-2">ACTIVE LISTENERS ({listeners.length})</div>
      
      {listeners.map((listener) => (
        <div key={listener.id} className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2 hover:border-accent/50 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-mono text-xs font-semibold text-text-primary truncate">
                  {listener.name}
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                  listener.status === "running" ? "text-status-success" : "text-text-muted"
                }`}>
                  {listener.status}
                </Badge>
              </div>
              <div className="text-[11px] text-text-muted space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Type:</span>
                  <span className="font-mono">{listener.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Address:</span>
                  <span className="font-mono">{listener.host}:{listener.port}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Connections:</span>
                  <span>{listener.connections}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
            {listener.status === "running" ? (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-[11px] gap-1.5"
                onClick={() => handleStop(listener)}
              >
                <Square className="w-3 h-3" />
                Stop
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-[11px] gap-1.5"
                onClick={() => handleStart(listener)}
              >
                <Play className="w-3 h-3" />
                Start
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>

          {/* Simulation Indicator */}
          <div className="pt-1.5 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-[10px] text-status-info">
              <AlertTriangle className="w-3 h-3" />
              <span>Simulated listener - no actual network activity</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListenerPanel;
