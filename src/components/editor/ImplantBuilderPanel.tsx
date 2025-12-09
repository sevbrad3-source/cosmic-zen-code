import { useState } from "react";
import { Cpu, Shield, Code, AlertTriangle, Zap, Settings, Download, Play, Eye, Lock, Unlock, Radio, Globe, Wifi, Server, ChevronRight, Binary, FileCode, Package, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface ImplantConfig {
  id: string;
  name: string;
  platform: "windows" | "linux" | "macos" | "cross-platform";
  arch: "x64" | "x86" | "arm64";
  comms: "https" | "dns" | "smb" | "tcp" | "icmp";
  jitter: number;
  sleep: number;
  killDate?: string;
  features: string[];
}

const ImplantBuilderPanel = () => {
  const [config, setConfig] = useState<ImplantConfig>({
    id: "imp-001",
    name: "SHADOWSTRIKE",
    platform: "windows",
    arch: "x64",
    comms: "https",
    jitter: 30,
    sleep: 60,
    features: ["ProcessInjection", "Keylogger", "Screenshot", "FileExfil"]
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(config.features);

  const allFeatures = [
    { id: "ProcessInjection", name: "Process Injection", category: "Execution", risk: "high" },
    { id: "Keylogger", name: "Keylogger", category: "Collection", risk: "medium" },
    { id: "Screenshot", name: "Screenshot Capture", category: "Collection", risk: "low" },
    { id: "FileExfil", name: "File Exfiltration", category: "Exfiltration", risk: "high" },
    { id: "CredHarvest", name: "Credential Harvesting", category: "Credential Access", risk: "critical" },
    { id: "Persistence", name: "Registry Persistence", category: "Persistence", risk: "medium" },
    { id: "TokenImpersonation", name: "Token Impersonation", category: "Privilege Escalation", risk: "high" },
    { id: "PortForward", name: "Port Forwarding", category: "Command & Control", risk: "medium" },
    { id: "SocksProxy", name: "SOCKS5 Proxy", category: "Command & Control", risk: "medium" },
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

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Implant Builder</h3>
            <p className="text-xs text-text-muted">Custom Agent Generation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>SIMULATION - Generated implants are inert templates for training only.</span>
        </div>
      </div>

      <Tabs defaultValue="config" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 h-8 bg-transparent border-b border-border rounded-none justify-start flex-shrink-0">
          <TabsTrigger value="config" className="text-xs h-6 data-[state=active]:bg-primary/20">Configuration</TabsTrigger>
          <TabsTrigger value="features" className="text-xs h-6 data-[state=active]:bg-primary/20">Modules</TabsTrigger>
          <TabsTrigger value="evasion" className="text-xs h-6 data-[state=active]:bg-primary/20">Evasion</TabsTrigger>
          <TabsTrigger value="build" className="text-xs h-6 data-[state=active]:bg-primary/20">Build</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="flex-1 p-3 mt-0 overflow-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text-muted uppercase">Implant Name</label>
              <Input 
                value={config.name} 
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="h-7 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-text-muted uppercase">Platform</label>
                <select 
                  value={config.platform}
                  onChange={(e) => setConfig({ ...config, platform: e.target.value as any })}
                  className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs"
                >
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                  <option value="macos">macOS</option>
                  <option value="cross-platform">Cross-Platform</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-muted uppercase">Architecture</label>
                <select 
                  value={config.arch}
                  onChange={(e) => setConfig({ ...config, arch: e.target.value as any })}
                  className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs"
                >
                  <option value="x64">x64</option>
                  <option value="x86">x86</option>
                  <option value="arm64">ARM64</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-text-muted uppercase">Communication Protocol</label>
              <div className="grid grid-cols-5 gap-1">
                {["https", "dns", "smb", "tcp", "icmp"].map((proto) => (
                  <button
                    key={proto}
                    onClick={() => setConfig({ ...config, comms: proto as any })}
                    className={`h-7 rounded text-xs font-medium transition-colors ${
                      config.comms === proto 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {proto.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-text-muted uppercase">Sleep (seconds)</label>
                <Input 
                  type="number"
                  value={config.sleep} 
                  onChange={(e) => setConfig({ ...config, sleep: parseInt(e.target.value) })}
                  className="h-7 text-xs font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-muted uppercase">Jitter (%)</label>
                <Input 
                  type="number"
                  value={config.jitter} 
                  onChange={(e) => setConfig({ ...config, jitter: parseInt(e.target.value) })}
                  className="h-7 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-text-muted uppercase">Kill Date (Optional)</label>
              <Input 
                type="date"
                value={config.killDate || ""} 
                onChange={(e) => setConfig({ ...config, killDate: e.target.value })}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-1">
            {allFeatures.map((feature) => (
              <div
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedFeatures.includes(feature.id) 
                    ? "bg-primary/10 border-primary" 
                    : "bg-sidebar-bg border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm border ${selectedFeatures.includes(feature.id) ? "bg-primary border-primary" : "border-border"}`} />
                    <span className="text-xs font-medium">{feature.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-4 text-xs">{feature.category}</Badge>
                    <span className={`text-xs font-medium ${getRiskColor(feature.risk)}`}>{feature.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evasion" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-2">
            {evasionTechniques.map((tech) => (
              <div key={tech.id} className="p-2.5 bg-sidebar-bg rounded border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{tech.name}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-3 h-3" />
                    <span className="text-xs text-text-muted">Enable</span>
                  </label>
                </div>
                <div className="text-xs text-text-muted">{tech.description}</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="build" className="flex-1 p-3 mt-0 overflow-auto">
          <div className="space-y-4">
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
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" className="w-3 h-3" defaultChecked />
                  <span>EXE/ELF Binary</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" className="w-3 h-3" />
                  <span>DLL/SO Library</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" className="w-3 h-3" />
                  <span>Shellcode (raw)</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" className="w-3 h-3" />
                  <span>PowerShell</span>
                </label>
              </div>
            </div>

            <button className="w-full h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs font-medium flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Generate Implant (Simulation)
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImplantBuilderPanel;
