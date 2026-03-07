import { useState, useEffect } from "react";
import { Radio, Wifi, Signal, Eye, Lock, Unlock, Globe, Activity, Search, Play, Square, Phone, MessageSquare, Mail, BarChart3, Radar, Map, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "signals", icon: Radar, label: "RF Spectrum" },
  { id: "intercepts", icon: Eye, label: "Intercepts" },
  { id: "comint", icon: Phone, label: "COMINT" },
  { id: "elint", icon: Radio, label: "ELINT" },
  { id: "geoloc", icon: Map, label: "Geolocation" },
  { id: "analysis", icon: BarChart3, label: "Analysis" },
];

interface SignalSource {
  id: string; type: "wifi" | "bluetooth" | "cellular" | "radio"; identifier: string; strength: number; encrypted: boolean; protocol: string; metadata: Record<string, string>; suspicious: boolean; timestamp: string;
}

interface Intercept {
  id: string; source: string; type: "voice" | "sms" | "data" | "email"; direction: "inbound" | "outbound"; timestamp: string; duration?: number; encrypted: boolean; content?: string;
}

const SIGINTPanel = () => {
  const [activeTab, setActiveTab] = useState("signals");
  const [isScanning, setIsScanning] = useState(true);
  const [signals, setSignals] = useState<SignalSource[]>([]);
  const [intercepts, setIntercepts] = useState<Intercept[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalSource | null>(null);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) setSignals(prev => [...prev.slice(-50), generateSignal()]);
      if (Math.random() > 0.85) setIntercepts(prev => [...prev.slice(-30), generateIntercept()]);
    }, 500);
    return () => clearInterval(interval);
  }, [isScanning]);

  const generateSignal = (): SignalSource => {
    const types: SignalSource["type"][] = ["wifi", "bluetooth", "cellular", "radio"];
    const type = types[Math.floor(Math.random() * types.length)];
    const identifiers: Record<string, string[]> = { wifi: ["CorpNet-5G", "Guest-WiFi", "Hidden-AP", "IoT-Network"], bluetooth: ["iPhone-Admin", "Galaxy-S23", "AirPods-Pro"], cellular: ["Verizon-LTE", "T-Mobile-5G", "AT&T-Band41"], radio: ["PMR-446", "TETRA-Net", "P25-Police"] };
    return { id: Math.random().toString(36).substr(2, 9), type, identifier: identifiers[type][Math.floor(Math.random() * identifiers[type].length)], strength: Math.floor(Math.random() * 100), encrypted: Math.random() > 0.3, protocol: type === "wifi" ? "802.11ac" : type === "bluetooth" ? "BLE 5.0" : type === "cellular" ? "LTE" : "Digital", metadata: { channel: String(Math.floor(Math.random() * 14) + 1), frequency: `${2400 + Math.floor(Math.random() * 100)}MHz`, vendor: ["Apple", "Samsung", "Cisco", "Motorola"][Math.floor(Math.random() * 4)] }, suspicious: Math.random() > 0.9, timestamp: new Date().toISOString().split('T')[1].slice(0, 12) };
  };

  const generateIntercept = (): Intercept => {
    const types: Intercept["type"][] = ["voice", "sms", "data", "email"];
    const type = types[Math.floor(Math.random() * types.length)];
    const contents: Record<string, string[]> = { sms: ["Meeting at 3pm", "Password reset code: 847293", "Wire transfer confirmed"], email: ["RE: Q4 Budget Review", "Urgent: System Access Required"], data: ["HTTP POST /api/auth", "DNS Query: corp.local"], voice: ["Call Duration: 4m 32s", "[VoLTE Encrypted]"] };
    return { id: Math.random().toString(36).substr(2, 9), source: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`, type, direction: Math.random() > 0.5 ? "inbound" : "outbound", timestamp: new Date().toISOString().split('T')[1].slice(0, 12), duration: type === "voice" ? Math.floor(Math.random() * 600) : undefined, encrypted: Math.random() > 0.4, content: contents[type][Math.floor(Math.random() * contents[type].length)] };
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, any> = { wifi: Wifi, bluetooth: Radio, cellular: Phone, radio: Signal, voice: Phone, sms: MessageSquare, email: Mail, data: Activity };
    return map[type] || Activity;
  };

  const getStrengthColor = (s: number) => s > 75 ? "text-green-500" : s > 50 ? "text-yellow-500" : s > 25 ? "text-orange-500" : "text-red-500";

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center"><Radio className="w-4 h-4 text-cyan-400" /></div>
          <div>
            <h3 className="text-sm font-semibold">SIGINT Operations</h3>
            <p className="text-xs text-text-muted">Signals Intelligence Platform</p>
          </div>
        </div>
      </div>

      <div className="p-2 border-b border-border flex items-center gap-2">
        <button onClick={() => setIsScanning(!isScanning)} className={`h-7 px-3 rounded text-xs font-medium flex items-center gap-1.5 ${isScanning ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary-hover text-primary-foreground"}`}>
          {isScanning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}{isScanning ? "Stop" : "Start"}
        </button>
        <div className="flex-1 relative"><Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" /><Input placeholder="Filter signals..." className="h-7 text-xs pl-7" /></div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {activeTab === "signals" && (
            <div className="flex">
              <div className="flex-1 space-y-1 pr-2">
                {signals.map((signal) => {
                  const TypeIcon = getTypeIcon(signal.type);
                  return (
                    <div key={signal.id} onClick={() => setSelectedSignal(signal)} className={`p-2 rounded border cursor-pointer transition-colors ${selectedSignal?.id === signal.id ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"} ${signal.suspicious ? "border-yellow-500/50" : ""}`}>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-xs font-medium flex-1 truncate">{signal.identifier}</span>
                        {signal.encrypted ? <Lock className="w-3 h-3 text-green-500" /> : <Unlock className="w-3 h-3 text-red-500" />}
                        <span className={`text-xs font-mono ${getStrengthColor(signal.strength)}`}>{signal.strength}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-text-muted"><span>{signal.type} • {signal.protocol}</span><span className="font-mono">{signal.timestamp}</span></div>
                    </div>
                  );
                })}
              </div>
              {selectedSignal && (
                <div className="w-48 border-l border-border pl-2 space-y-2">
                  <div className="text-xs text-text-muted uppercase">Details</div>
                  <div className="space-y-1 text-xs">
                    <div><span className="text-text-muted">ID:</span> <span className="font-mono">{selectedSignal.identifier}</span></div>
                    <div><span className="text-text-muted">Type:</span> {selectedSignal.type}</div>
                    <div><span className="text-text-muted">Protocol:</span> {selectedSignal.protocol}</div>
                    <div><span className="text-text-muted">Encrypted:</span> {selectedSignal.encrypted ? "Yes" : "No"}</div>
                    {Object.entries(selectedSignal.metadata).map(([k, v]) => <div key={k}><span className="text-text-muted capitalize">{k}:</span> {v}</div>)}
                  </div>
                  <button className="w-full h-7 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">Deep Analyze</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "intercepts" && intercepts.map((intercept) => {
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
                <div className="flex justify-between mt-1 text-xs text-text-muted"><span>{intercept.type}</span><span className="font-mono">{intercept.timestamp}</span></div>
              </div>
            );
          })}

          {activeTab === "comint" && (
            <div className="space-y-2 p-1">
              <div className="text-xs text-text-muted uppercase">Communications Intelligence</div>
              {[{ type: "Voice", count: intercepts.filter(i => i.type === "voice").length, encrypted: "67%" }, { type: "SMS/MMS", count: intercepts.filter(i => i.type === "sms").length, encrypted: "12%" }, { type: "Email", count: intercepts.filter(i => i.type === "email").length, encrypted: "89%" }].map((c) => (
                <div key={c.type} className="p-2.5 bg-sidebar-bg rounded border border-border">
                  <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold">{c.type}</span><Badge variant="outline" className="h-4 text-xs">{c.count} captured</Badge></div>
                  <div className="text-xs text-text-muted">Encrypted: {c.encrypted}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "elint" && (
            <div className="space-y-2 p-1">
              <div className="text-xs text-text-muted uppercase">Electronic Intelligence</div>
              {[{ name: "Radar Emission A", freq: "9.375 GHz", type: "X-Band Radar", bearing: "045°" }, { name: "ECM Signal", freq: "2.4 GHz", type: "Jammer", bearing: "180°" }, { name: "SATCOM Downlink", freq: "12.5 GHz", type: "Ku-Band", bearing: "270°" }].map((e, i) => (
                <div key={i} className="p-2.5 bg-sidebar-bg rounded border border-border">
                  <div className="text-xs font-semibold mb-1">{e.name}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-text-muted">
                    <span>Freq: <span className="text-foreground font-mono">{e.freq}</span></span>
                    <span>Type: <span className="text-foreground">{e.type}</span></span>
                    <span>Bearing: <span className="text-foreground font-mono">{e.bearing}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "geoloc" && (
            <div className="space-y-2 p-1">
              <div className="text-xs text-text-muted uppercase">Signal Geolocation</div>
              <div className="p-3 bg-sidebar-bg rounded border border-border text-center">
                <Map className="w-8 h-8 mx-auto text-text-muted mb-2 opacity-30" />
                <div className="text-xs text-text-muted">Triangulation requires 3+ signal sources</div>
                <div className="text-xs text-text-muted mt-1">Active sources: {signals.length}</div>
              </div>
              {signals.filter(s => s.suspicious).slice(0, 3).map((s) => (
                <div key={s.id} className="p-2 bg-sidebar-bg rounded border border-yellow-500/30">
                  <div className="flex items-center justify-between text-xs"><span className="font-semibold text-yellow-400">{s.identifier}</span><span className="font-mono text-text-muted">{s.metadata.frequency}</span></div>
                  <div className="text-xs text-text-muted">Bearing: {Math.floor(Math.random() * 360)}° • Range: ~{Math.floor(Math.random() * 500 + 50)}m</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="space-y-3 p-1">
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Signal Distribution</div>
                {["wifi", "bluetooth", "cellular", "radio"].map((type) => {
                  const count = signals.filter(s => s.type === type).length;
                  const pct = signals.length ? (count / signals.length) * 100 : 0;
                  return <div key={type} className="space-y-1"><div className="flex justify-between text-xs"><span className="capitalize">{type}</span><span className="font-mono">{count}</span></div><Progress value={pct} className="h-1" /></div>;
                })}
              </div>
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Encryption Status</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-editor-bg rounded"><div className="font-mono text-green-400 text-lg">{signals.filter(s => s.encrypted).length}</div><div className="text-text-muted">Encrypted</div></div>
                  <div className="text-center p-2 bg-editor-bg rounded"><div className="font-mono text-red-400 text-lg">{signals.filter(s => !s.encrypted).length}</div><div className="text-text-muted">Cleartext</div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SIGINTPanel;
