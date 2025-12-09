import { useState, useEffect } from "react";
import { Radio, Wifi, Signal, AlertTriangle, Eye, Lock, Unlock, Globe, Activity, Search, Filter, Download, Play, Square, Zap, Phone, MessageSquare, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface SignalSource {
  id: string;
  type: "wifi" | "bluetooth" | "cellular" | "radio" | "satellite";
  identifier: string;
  strength: number;
  encrypted: boolean;
  protocol: string;
  metadata: Record<string, string>;
  suspicious: boolean;
  timestamp: string;
}

interface Intercept {
  id: string;
  source: string;
  type: "voice" | "sms" | "data" | "email";
  direction: "inbound" | "outbound";
  timestamp: string;
  duration?: number;
  encrypted: boolean;
  content?: string;
}

const SIGINTPanel = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [signals, setSignals] = useState<SignalSource[]>([]);
  const [intercepts, setIntercepts] = useState<Intercept[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalSource | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newSignal = generateSignal();
        setSignals(prev => [...prev.slice(-50), newSignal]);
      }
      if (Math.random() > 0.85) {
        const newIntercept = generateIntercept();
        setIntercepts(prev => [...prev.slice(-30), newIntercept]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isScanning]);

  const generateSignal = (): SignalSource => {
    const types: SignalSource["type"][] = ["wifi", "bluetooth", "cellular", "radio"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const identifiers: Record<string, string[]> = {
      wifi: ["CorpNet-5G", "Guest-WiFi", "Hidden-AP", "IoT-Network", "SecureNet"],
      bluetooth: ["iPhone-Admin", "Galaxy-S23", "AirPods-Pro", "Car-Audio", "Keyboard-BT"],
      cellular: ["Verizon-LTE", "T-Mobile-5G", "AT&T-Band41", "Sprint-VoLTE"],
      radio: ["PMR-446", "TETRA-Net", "P25-Police", "DMR-Trunked"]
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      identifier: identifiers[type][Math.floor(Math.random() * identifiers[type].length)],
      strength: Math.floor(Math.random() * 100),
      encrypted: Math.random() > 0.3,
      protocol: type === "wifi" ? "802.11ac" : type === "bluetooth" ? "BLE 5.0" : type === "cellular" ? "LTE" : "Digital",
      metadata: {
        channel: String(Math.floor(Math.random() * 14) + 1),
        frequency: `${2400 + Math.floor(Math.random() * 100)}MHz`,
        vendor: ["Apple", "Samsung", "Cisco", "Motorola"][Math.floor(Math.random() * 4)]
      },
      suspicious: Math.random() > 0.9,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12)
    };
  };

  const generateIntercept = (): Intercept => {
    const types: Intercept["type"][] = ["voice", "sms", "data", "email"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const contents: Record<string, string[]> = {
      sms: ["Meeting at 3pm", "Password reset code: 847293", "Wire transfer confirmed", "[ENCRYPTED]"],
      email: ["RE: Q4 Budget Review", "Urgent: System Access Required", "[TLS ENCRYPTED]"],
      data: ["HTTP POST /api/auth", "DNS Query: corp.local", "TLS 1.3 Handshake"],
      voice: ["Call Duration: 4m 32s", "[VoLTE Encrypted]", "Conference Bridge Active"]
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      source: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      type,
      direction: Math.random() > 0.5 ? "inbound" : "outbound",
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      duration: type === "voice" ? Math.floor(Math.random() * 600) : undefined,
      encrypted: Math.random() > 0.4,
      content: contents[type][Math.floor(Math.random() * contents[type].length)]
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "wifi": return Wifi;
      case "bluetooth": return Radio;
      case "cellular": return Phone;
      case "radio": return Signal;
      case "satellite": return Globe;
      case "voice": return Phone;
      case "sms": return MessageSquare;
      case "email": return Mail;
      default: return Activity;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength > 75) return "text-green-500";
    if (strength > 50) return "text-yellow-500";
    if (strength > 25) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">SIGINT Operations</h3>
            <p className="text-xs text-text-muted">Signals Intelligence Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>TRAINING SIMULATION - All signals and intercepts are synthetic for educational purposes.</span>
        </div>
      </div>

      <div className="p-2 border-b border-border flex items-center gap-2">
        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`h-7 px-3 rounded text-xs font-medium flex items-center gap-1.5 ${
            isScanning ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary-hover text-primary-foreground"
          }`}
        >
          {isScanning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isScanning ? "Stop Scan" : "Start Scan"}
        </button>
        <div className="flex-1 relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Filter signals..." className="h-7 text-xs pl-7" />
        </div>
      </div>

      <Tabs defaultValue="signals" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 h-8 bg-transparent border-b border-border rounded-none justify-start flex-shrink-0">
          <TabsTrigger value="signals" className="text-xs h-6 data-[state=active]:bg-primary/20">RF Spectrum ({signals.length})</TabsTrigger>
          <TabsTrigger value="intercepts" className="text-xs h-6 data-[state=active]:bg-primary/20">Intercepts ({intercepts.length})</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs h-6 data-[state=active]:bg-primary/20">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="flex-1 p-0 mt-0 overflow-hidden flex">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {signals.map((signal) => {
                const TypeIcon = getTypeIcon(signal.type);
                return (
                  <div
                    key={signal.id}
                    onClick={() => setSelectedSignal(signal)}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedSignal?.id === signal.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"
                    } ${signal.suspicious ? "border-yellow-500/50" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-xs font-medium flex-1 truncate">{signal.identifier}</span>
                      <div className="flex items-center gap-1.5">
                        {signal.encrypted ? <Lock className="w-3 h-3 text-green-500" /> : <Unlock className="w-3 h-3 text-red-500" />}
                        <span className={`text-xs font-mono ${getStrengthColor(signal.strength)}`}>{signal.strength}%</span>
                        {signal.suspicious && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-text-muted">
                      <span>{signal.type} • {signal.protocol}</span>
                      <span className="font-mono">{signal.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {selectedSignal && (
            <div className="w-56 border-l border-border p-3 space-y-3 overflow-auto">
              <div className="text-xs text-text-muted uppercase">Signal Details</div>
              <div className="space-y-2 text-xs">
                <div><span className="text-text-muted">ID:</span> <span className="font-mono">{selectedSignal.identifier}</span></div>
                <div><span className="text-text-muted">Type:</span> {selectedSignal.type}</div>
                <div><span className="text-text-muted">Protocol:</span> {selectedSignal.protocol}</div>
                <div><span className="text-text-muted">Encrypted:</span> {selectedSignal.encrypted ? "Yes" : "No"}</div>
                {Object.entries(selectedSignal.metadata).map(([key, value]) => (
                  <div key={key}><span className="text-text-muted capitalize">{key}:</span> {value}</div>
                ))}
              </div>
              <button className="w-full h-7 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                Deep Analyze
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="intercepts" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-1">
            {intercepts.map((intercept) => {
              const TypeIcon = getTypeIcon(intercept.type);
              return (
                <div key={intercept.id} className="p-2 bg-sidebar-bg rounded border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <TypeIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-mono">{intercept.source}</span>
                    <Badge variant="outline" className="h-4 text-xs">{intercept.direction}</Badge>
                    {intercept.encrypted && <Lock className="w-3 h-3 text-green-500" />}
                  </div>
                  <div className="text-xs text-text-secondary truncate">{intercept.content}</div>
                  <div className="flex justify-between mt-1 text-xs text-text-muted">
                    <span>{intercept.type}</span>
                    <span className="font-mono">{intercept.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 p-3 mt-0 overflow-auto">
          <div className="space-y-3">
            <div className="p-3 bg-sidebar-bg rounded border border-border">
              <div className="text-xs text-text-muted uppercase mb-2">Signal Distribution</div>
              <div className="space-y-2">
                {["wifi", "bluetooth", "cellular", "radio"].map((type) => {
                  const count = signals.filter(s => s.type === type).length;
                  const pct = signals.length ? (count / signals.length) * 100 : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{type}</span>
                        <span className="font-mono">{count}</span>
                      </div>
                      <Progress value={pct} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-3 bg-sidebar-bg rounded border border-border">
              <div className="text-xs text-text-muted uppercase mb-2">Encryption Status</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-editor-bg rounded">
                  <div className="font-mono text-green-400 text-lg">{signals.filter(s => s.encrypted).length}</div>
                  <div className="text-text-muted">Encrypted</div>
                </div>
                <div className="text-center p-2 bg-editor-bg rounded">
                  <div className="font-mono text-red-400 text-lg">{signals.filter(s => !s.encrypted).length}</div>
                  <div className="text-text-muted">Cleartext</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SIGINTPanel;
