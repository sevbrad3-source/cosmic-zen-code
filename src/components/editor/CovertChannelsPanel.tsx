import { Shield, AlertTriangle, Wifi, Radio, Image, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";

const CovertChannelsPanel = () => {
  const [channelType, setChannelType] = useState("");
  const [target, setTarget] = useState("");
  const [payload, setPayload] = useState("");
  const [transmitting, setTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTransmit = () => {
    if (!channelType || !target || !payload) {
      toast.error("Please configure all channel parameters");
      return;
    }

    toast.info("🎮 SIMULATION MODE", {
      description: "Mock covert channel transmission. No actual data exfiltration occurs. Educational visualization only.",
      duration: 5000
    });

    setTransmitting(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTransmitting(false);
          toast.success("Mock transmission complete (simulated)");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="p-3 space-y-3">
      {/* Critical Safety Banner */}
      <div className="bg-status-error/10 border border-status-error/30 rounded p-2 flex items-start gap-2">
        <Shield className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-status-error mb-1">EDUCATIONAL SIMULATION ONLY</div>
          <div className="text-text-secondary">All covert channels are simulated. No actual data exfiltration or network tunneling occurs. Training purposes exclusively.</div>
        </div>
      </div>

      <div className="text-xs text-text-muted mb-2">COVERT CHANNEL TECHNIQUES</div>

      {/* Channel Type Selection */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Channel Type</label>
          <Select value={channelType} onValueChange={setChannelType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select covert channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dns">DNS Tunneling (Mock)</SelectItem>
              <SelectItem value="icmp">ICMP Exfiltration (Mock)</SelectItem>
              <SelectItem value="http">HTTP Header Covert (Mock)</SelectItem>
              <SelectItem value="steg_image">Image Steganography (Mock)</SelectItem>
              <SelectItem value="steg_audio">Audio Steganography (Mock)</SelectItem>
              <SelectItem value="timing">Timing Channel (Mock)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Target/Destination</label>
          <Input
            placeholder="e.g., attacker.example.com"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Payload/Data</label>
          <Input
            placeholder="Data to exfiltrate (simulated)"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>

        {transmitting && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-text-secondary">Transmission Progress</div>
            <Progress value={progress} className="h-2" />
            <div className="text-[10px] text-text-muted text-center">{progress}% (Simulated)</div>
          </div>
        )}

        <Button
          onClick={handleTransmit}
          disabled={transmitting || !channelType || !target || !payload}
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
        >
          <Wifi className="w-3 h-3" />
          {transmitting ? "Transmitting..." : "Initiate Mock Channel"}
        </Button>
      </div>

      {/* Technique Details */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
        <div className="text-xs font-semibold text-text-primary mb-2">ACTIVE TECHNIQUES</div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Wifi className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">DNS Tunneling</div>
              <div className="text-[10px] text-text-muted">Encode data in DNS queries (simulated)</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Mock Mode</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Radio className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">ICMP Echo Data</div>
              <div className="text-[10px] text-text-muted">Hide data in ICMP packets (simulated)</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Mock Mode</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Image className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Steganography</div>
              <div className="text-[10px] text-text-muted">Embed data in image LSBs (simulated)</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Mock Mode</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Lock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Timing Channels</div>
              <div className="text-[10px] text-text-muted">Encode via packet timing (simulated)</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Mock Mode</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Notice */}
      <div className="bg-accent/5 border border-accent/20 rounded p-2.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-text-secondary space-y-1">
            <div className="font-semibold text-text-primary">Training Environment</div>
            <div>This interface demonstrates covert channel concepts for security research education. All operations are completely simulated.</div>
            <div className="pt-1 text-status-warning">⚠️ Real covert channels are illegal outside authorized security testing in controlled environments.</div>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="text-xs text-text-muted space-y-2 pt-2">
        <div className="font-semibold text-text-secondary">SAFETY GUARANTEES:</div>
        <ul className="space-y-1 text-[11px] list-disc list-inside">
          <li>No actual network traffic generated</li>
          <li>No data exfiltration occurs</li>
          <li>All channels are visualized mockups</li>
          <li>Educational demonstration only</li>
        </ul>
      </div>
    </div>
  );
};

export default CovertChannelsPanel;
