import { Play, Square, Settings, Activity, PlusCircle, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

interface Listener {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  status: "running" | "stopped";
  connections: number;
}

const tabs: InnerTab[] = [
  { id: "active", icon: Radio, label: "Active" },
  { id: "create", icon: PlusCircle, label: "Create" },
  { id: "telemetry", icon: Activity, label: "Telemetry" },
];

const ListenerPanel = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [listeners] = useState<Listener[]>([
    { id: "listener_001", name: "http-listener", type: "HTTP", host: "0.0.0.0", port: 8080, status: "running", connections: 2 },
    { id: "listener_002", name: "https-listener", type: "HTTPS", host: "0.0.0.0", port: 8443, status: "stopped", connections: 0 },
  ]);
  const [newListener, setNewListener] = useState({ name: "", port: "" });

  const handleStart = (listener: Listener) => toast.success(`Started listener: ${listener.name}`);
  const handleStop = (listener: Listener) => toast.info(`Stopped listener: ${listener.name}`);
  const handleCreate = () => {
    if (!newListener.name || !newListener.port) return toast.error("Please fill in all fields");
    toast.success(`Created listener: ${newListener.name}`);
    setNewListener({ name: "", port: "" });
  };

  const renderActive = () => (
    <div className="space-y-2">
      {listeners.map((listener) => (
        <div key={listener.id} className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-semibold">{listener.name}</div>
              <div className="text-[11px] text-text-muted">{listener.host}:{listener.port} • {listener.type}</div>
            </div>
            <Badge variant="outline" className="text-[10px]">{listener.status}</Badge>
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
            {listener.status === "running" ? (
              <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px] gap-1.5" onClick={() => handleStop(listener)}><Square className="w-3 h-3" />Stop</Button>
            ) : (
              <Button size="sm" variant="outline" className="flex-1 h-7 text-[11px] gap-1.5" onClick={() => handleStart(listener)}><Play className="w-3 h-3" />Start</Button>
            )}
            <Button size="sm" variant="outline" className="h-7 px-2"><Settings className="w-3 h-3" /></Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCreate = () => (
    <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
      <Input placeholder="Listener name" value={newListener.name} onChange={(e) => setNewListener({ ...newListener, name: e.target.value })} className="h-8 text-xs" />
      <Input placeholder="Port number" type="number" value={newListener.port} onChange={(e) => setNewListener({ ...newListener, port: e.target.value })} className="h-8 text-xs" />
      <Button onClick={handleCreate} size="sm" className="w-full h-8 text-xs gap-1.5"><PlusCircle className="w-3 h-3" />Create Listener</Button>
    </div>
  );

  const renderTelemetry = () => (
    <div className="space-y-2">
      <div className="bg-surface-elevated border border-border rounded-lg p-3 text-sm">Total listeners: {listeners.length}</div>
      <div className="bg-surface-elevated border border-border rounded-lg p-3 text-sm">Active connections: {listeners.reduce((a, b) => a + b.connections, 0)}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1"><div className="p-3">
        {activeTab === "active" && renderActive()}
        {activeTab === "create" && renderCreate()}
        {activeTab === "telemetry" && renderTelemetry()}
      </div></ScrollArea>
    </div>
  );
};

export default ListenerPanel;
