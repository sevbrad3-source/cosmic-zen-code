import { useState } from "react";
import { Wifi, Radio, Image, Lock, BarChart3, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "channels", icon: Radio, label: "Channels" },
  { id: "transfer", icon: Send, label: "Transfer" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const CovertChannelsPanel = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [channelType, setChannelType] = useState("");
  const [target, setTarget] = useState("");
  const [payload, setPayload] = useState("");
  const [transmitting, setTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTransmit = () => {
    if (!channelType || !target || !payload) return toast.error("Please configure all channel parameters");
    setTransmitting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTransmitting(false);
          toast.success("Transmission complete");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1"><div className="p-3 space-y-3">
        {activeTab === "channels" && (
          <div className="bg-card border border-border rounded-lg p-3 space-y-2">
            {[
              { icon: Wifi, name: "DNS Tunneling", detail: "Data encoded in query labels" },
              { icon: Radio, name: "ICMP Channel", detail: "Payload fragments over echo frames" },
              { icon: Image, name: "Steganography", detail: "LSB embedding in media assets" },
              { icon: Lock, name: "Timing Channel", detail: "Bitstream over delay modulation" },
            ].map((item) => (
              <div key={item.name} className="p-2 rounded border border-border bg-muted/30">
                <div className="flex items-center gap-2"><item.icon className="w-4 h-4 text-primary" /><span className="text-sm">{item.name}</span></div>
                <div className="text-xs text-muted-foreground mt-1">{item.detail}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transfer" && (
          <div className="bg-card border border-border rounded-lg p-3 space-y-3">
            <Select value={channelType} onValueChange={setChannelType}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select channel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dns">DNS Tunneling</SelectItem>
                <SelectItem value="icmp">ICMP Channel</SelectItem>
                <SelectItem value="http">HTTP Header Channel</SelectItem>
                <SelectItem value="steg_image">Image Steganography</SelectItem>
                <SelectItem value="timing">Timing Channel</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Destination" value={target} onChange={(e) => setTarget(e.target.value)} className="h-8 text-xs font-mono" />
            <Input placeholder="Payload" value={payload} onChange={(e) => setPayload(e.target.value)} className="h-8 text-xs font-mono" />
            {transmitting && <Progress value={progress} className="h-2" />}
            <Button onClick={handleTransmit} disabled={transmitting || !channelType || !target || !payload} size="sm" className="w-full h-8 text-xs gap-1.5">
              <Send className="w-3 h-3" /> {transmitting ? "Transmitting..." : "Start Transfer"}
            </Button>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-2">
            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"><span className="text-sm">Active channel</span><Badge variant="outline">{channelType || "none"}</Badge></div>
            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"><span className="text-sm">Throughput</span><span className="text-xs font-mono">42.8 KB/s</span></div>
            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"><span className="text-sm">Packet loss</span><span className="text-xs font-mono">0.7%</span></div>
          </div>
        )}
      </div></ScrollArea>
    </div>
  );
};

export default CovertChannelsPanel;
