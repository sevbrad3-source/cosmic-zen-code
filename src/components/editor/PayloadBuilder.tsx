import { useState } from "react";
import { Download, Code, Server, Plug, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "profile", icon: Layers, label: "Profile" },
  { id: "network", icon: Server, label: "Network" },
  { id: "build", icon: Download, label: "Build" },
];

const PayloadBuilder = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [config, setConfig] = useState({ type: "", format: "", host: "", port: "" });

  const handleGenerate = () => {
    if (!config.type || !config.format || !config.host || !config.port) return toast.error("Please configure all payload options");
    toast.success("Payload profile generated");
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {activeTab === "profile" && (
            <Card className="p-3 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">Payload Type</label>
                <Select value={config.type} onValueChange={(value) => setConfig({ ...config, type: value })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reverse_http">Reverse HTTP</SelectItem>
                    <SelectItem value="reverse_https">Reverse HTTPS</SelectItem>
                    <SelectItem value="reverse_tcp">Reverse TCP</SelectItem>
                    <SelectItem value="bind_tcp">Bind TCP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">Output Format</label>
                <Select value={config.format} onValueChange={(value) => setConfig({ ...config, format: value })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exe">Windows EXE</SelectItem>
                    <SelectItem value="dll">Windows DLL</SelectItem>
                    <SelectItem value="powershell">PowerShell</SelectItem>
                    <SelectItem value="service_exe">Service EXE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}

          {activeTab === "network" && (
            <Card className="p-3 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">LHOST</label>
                <Input placeholder="e.g., 192.168.1.100" value={config.host} onChange={(e) => setConfig({ ...config, host: e.target.value })} className="h-8 text-xs font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">LPORT</label>
                <Input placeholder="e.g., 8080" type="number" value={config.port} onChange={(e) => setConfig({ ...config, port: e.target.value })} className="h-8 text-xs font-mono" />
              </div>
            </Card>
          )}

          {activeTab === "build" && (
            <Card className="p-3 space-y-3">
              <div className="text-sm">Build pipeline ready</div>
              <div className="text-xs text-muted-foreground">Selected profile: {config.type || "-"} • {config.format || "-"}</div>
              <Button onClick={handleGenerate} size="sm" className="w-full h-8 text-xs gap-1.5"><Code className="w-3 h-3" />Generate Payload</Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5"><Plug className="w-3 h-3" />Attach to Listener</Button>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PayloadBuilder;
