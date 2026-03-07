import { useState } from "react";
import { Cpu, Shield, Code, Zap, Settings, Download, Play, Eye, Lock, Unlock, Radio, Globe, Wifi, Server, Binary, FileCode, Package, Layers, ShieldOff, BarChart3, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "config", icon: Settings, label: "Config" },
  { id: "modules", icon: Layers, label: "Modules", badge: 12 },
  { id: "evasion", icon: ShieldOff, label: "Evasion", badge: 6 },
  { id: "comms", icon: Radio, label: "Comms" },
  { id: "build", icon: Package, label: "Build" },
  { id: "history", icon: BarChart3, label: "History" },
];

interface ImplantConfig {
  name: string; platform: string; arch: string; comms: string; jitter: number; sleep: number; killDate?: string;
}

const ImplantBuilderPanel = () => {
  const [activeTab, setActiveTab] = useState("config");
  const [config, setConfig] = useState<ImplantConfig>({ name: "SHADOWSTRIKE", platform: "windows", arch: "x64", comms: "https", jitter: 30, sleep: 60 });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["ProcessInjection", "Keylogger", "Screenshot", "FileExfil"]);

  const allFeatures = [
    { id: "ProcessInjection", name: "Process Injection", category: "Execution", risk: "high" },
    { id: "Keylogger", name: "Keylogger", category: "Collection", risk: "medium" },
    { id: "Screenshot", name: "Screenshot Capture", category: "Collection", risk: "low" },
    { id: "FileExfil", name: "File Exfiltration", category: "Exfiltration", risk: "high" },
    { id: "CredHarvest", name: "Credential Harvesting", category: "Credential Access", risk: "critical" },
    { id: "Persistence", name: "Registry Persistence", category: "Persistence", risk: "medium" },
    { id: "TokenImpersonation", name: "Token Impersonation", category: "Priv Escalation", risk: "high" },
    { id: "PortForward", name: "Port Forwarding", category: "C2", risk: "medium" },
    { id: "SocksProxy", name: "SOCKS5 Proxy", category: "C2", risk: "medium" },
    { id: "LateralMove", name: "Lateral Movement", category: "Lateral Movement", risk: "critical" },
    { id: "AMSIBypass", name: "AMSI Bypass", category: "Defense Evasion", risk: "high" },
    { id: "ETWPatch", name: "ETW Patching", category: "Defense Evasion", risk: "high" },
  ];

  const evasionTechniques = [
    { id: "syscall", name: "Direct Syscalls", description: "Bypass user-mode hooks" },
    { id: "unhook", name: "NTDLL Unhooking", description: "Remove EDR hooks from ntdll.dll" },
    { id: "sleep", name: "Sleep Obfuscation", description: "Encrypt memory during sleep" },
    { id: "stack", name: "Stack Spoofing", description: "Fake call stack frames" },
    { id: "pe", name: "PE Header Stomping", description: "Remove PE headers from memory" },
    { id: "module", name: "Module Stomping", description: "Overwrite legitimate modules" },
  ];

  const buildHistory = [
    { name: "SHADOWSTRIKE_v3", platform: "windows/x64", size: "89KB", time: "2h ago" },
    { name: "GHOSTWALKER_v1", platform: "linux/x64", size: "45KB", time: "1d ago" },
    { name: "NIGHTCRAWL_v2", platform: "windows/x64", size: "112KB", time: "3d ago" },
  ];

  const toggleFeature = (id: string) => setSelectedFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  const getRiskColor = (risk: string) => ({ critical: "text-red-500", high: "text-orange-500", medium: "text-yellow-500", low: "text-green-500" }[risk] || "text-gray-500");

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center"><Cpu className="w-4 h-4 text-red-400" /></div>
          <div>
            <h3 className="text-sm font-semibold">Implant Builder</h3>
            <p className="text-xs text-text-muted">Custom Agent Generation</p>
          </div>
        </div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {activeTab === "config" && (
            <>
              <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Implant Name</label><Input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} className="h-7 text-xs font-mono" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Platform</label><select value={config.platform} onChange={(e) => setConfig({ ...config, platform: e.target.value })} className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs"><option value="windows">Windows</option><option value="linux">Linux</option><option value="macos">macOS</option><option value="cross-platform">Cross-Platform</option></select></div>
                <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Architecture</label><select value={config.arch} onChange={(e) => setConfig({ ...config, arch: e.target.value })} className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs"><option value="x64">x64</option><option value="x86">x86</option><option value="arm64">ARM64</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Sleep (s)</label><Input type="number" value={config.sleep} onChange={(e) => setConfig({ ...config, sleep: parseInt(e.target.value) })} className="h-7 text-xs font-mono" /></div>
                <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Jitter (%)</label><Input type="number" value={config.jitter} onChange={(e) => setConfig({ ...config, jitter: parseInt(e.target.value) })} className="h-7 text-xs font-mono" /></div>
              </div>
              <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Kill Date</label><Input type="date" value={config.killDate || ""} onChange={(e) => setConfig({ ...config, killDate: e.target.value })} className="h-7 text-xs" /></div>
            </>
          )}

          {activeTab === "modules" && allFeatures.map((f) => (
            <div key={f.id} onClick={() => toggleFeature(f.id)} className={`p-2 rounded border cursor-pointer transition-colors ${selectedFeatures.includes(f.id) ? "bg-primary/10 border-primary" : "bg-sidebar-bg border-border hover:border-primary/50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm border ${selectedFeatures.includes(f.id) ? "bg-primary border-primary" : "border-border"}`} />
                  <span className="text-xs font-medium">{f.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-4 text-xs">{f.category}</Badge>
                  <span className={`text-xs font-medium ${getRiskColor(f.risk)}`}>{f.risk}</span>
                </div>
              </div>
            </div>
          ))}

          {activeTab === "evasion" && evasionTechniques.map((t) => (
            <div key={t.id} className="p-2.5 bg-sidebar-bg rounded border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{t.name}</span>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-3 h-3" /><span className="text-xs text-text-muted">Enable</span></label>
              </div>
              <div className="text-xs text-text-muted">{t.description}</div>
            </div>
          ))}

          {activeTab === "comms" && (
            <>
              <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Protocol</label>
                <div className="grid grid-cols-5 gap-1">
                  {["https", "dns", "smb", "tcp", "icmp"].map((p) => (
                    <button key={p} onClick={() => setConfig({ ...config, comms: p })} className={`h-7 rounded text-xs font-medium transition-colors ${config.comms === p ? "bg-primary text-primary-foreground" : "bg-sidebar-hover text-text-secondary hover:text-text-primary"}`}>{p.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2"><label className="text-xs text-text-muted uppercase">C2 Server</label><Input placeholder="https://c2.example.com" className="h-7 text-xs font-mono" /></div>
              <div className="space-y-2"><label className="text-xs text-text-muted uppercase">Fallback Servers</label><Input placeholder="Comma-separated URIs" className="h-7 text-xs font-mono" /></div>
              <div className="space-y-2"><label className="text-xs text-text-muted uppercase">User Agent</label><Input defaultValue="Mozilla/5.0 (Windows NT 10.0; Win64; x64)" className="h-7 text-xs font-mono" /></div>
            </>
          )}

          {activeTab === "build" && (
            <>
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Build Summary</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-text-muted">Name:</span> <span className="font-mono">{config.name}</span></div>
                  <div><span className="text-text-muted">Platform:</span> <span className="font-mono">{config.platform}</span></div>
                  <div><span className="text-text-muted">Arch:</span> <span className="font-mono">{config.arch}</span></div>
                  <div><span className="text-text-muted">Comms:</span> <span className="font-mono">{config.comms}</span></div>
                  <div><span className="text-text-muted">Modules:</span> <span className="font-mono">{selectedFeatures.length}</span></div>
                  <div><span className="text-text-muted">Est. Size:</span> <span className="font-mono">~{45 + selectedFeatures.length * 8}KB</span></div>
                </div>
              </div>
              <div className="p-3 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Output Formats</div>
                <div className="grid grid-cols-2 gap-2">
                  {["EXE/ELF Binary", "DLL/SO Library", "Shellcode (raw)", "PowerShell", ".NET Assembly", "Python Script"].map((f) => (
                    <label key={f} className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" className="w-3 h-3" defaultChecked={f === "EXE/ELF Binary"} /><span>{f}</span></label>
                  ))}
                </div>
              </div>
              <button className="w-full h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs font-medium flex items-center justify-center gap-2"><Package className="w-4 h-4" />Generate Implant</button>
            </>
          )}

          {activeTab === "history" && buildHistory.map((b, i) => (
            <div key={i} className="p-2.5 bg-sidebar-bg rounded border border-border flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold font-mono">{b.name}</div>
                <div className="text-xs text-text-muted">{b.platform} • {b.size} • {b.time}</div>
              </div>
              <Download className="w-3 h-3 text-text-muted cursor-pointer" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImplantBuilderPanel;
