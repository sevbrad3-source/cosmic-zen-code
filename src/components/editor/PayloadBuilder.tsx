import { Download, Shield, AlertTriangle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const PayloadBuilder = () => {
  const [config, setConfig] = useState({
    type: "",
    format: "",
    host: "",
    port: ""
  });

  const handleGenerate = () => {
    if (!config.type || !config.format || !config.host || !config.port) {
      toast.error("Please configure all payload options");
      return;
    }
    
    toast.info("🎮 SIMULATION MODE", {
      description: "Mock payload generation. No actual malicious code created. Educational purposes only.",
      duration: 5000
    });
  };

  return (
    <div className="p-3 space-y-3">
      {/* Safety Banner */}
      <div className="bg-status-error/10 border border-status-error/30 rounded p-2 flex items-start gap-2">
        <Shield className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-status-error mb-1">EDUCATIONAL SIMULATION ONLY</div>
          <div className="text-text-secondary">This tool generates MOCK payloads only. No actual executable code is created. For training purposes exclusively in authorized environments.</div>
        </div>
      </div>

      <div className="text-xs text-text-muted mb-2">PAYLOAD CONFIGURATION</div>
      
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Payload Type</label>
          <Select value={config.type} onValueChange={(value) => setConfig({ ...config, type: value })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reverse_http">Reverse HTTP (Mock)</SelectItem>
              <SelectItem value="reverse_https">Reverse HTTPS (Mock)</SelectItem>
              <SelectItem value="reverse_tcp">Reverse TCP (Mock)</SelectItem>
              <SelectItem value="bind_tcp">Bind TCP (Mock)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Output Format</label>
          <Select value={config.format} onValueChange={(value) => setConfig({ ...config, format: value })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exe">Windows EXE (Simulated)</SelectItem>
              <SelectItem value="dll">Windows DLL (Simulated)</SelectItem>
              <SelectItem value="powershell">PowerShell (Simulated)</SelectItem>
              <SelectItem value="service_exe">Service EXE (Simulated)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">LHOST (Listener Host)</label>
          <Input
            placeholder="e.g., 192.168.1.100"
            value={config.host}
            onChange={(e) => setConfig({ ...config, host: e.target.value })}
            className="h-8 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">LPORT (Listener Port)</label>
          <Input
            placeholder="e.g., 8080"
            type="number"
            value={config.port}
            onChange={(e) => setConfig({ ...config, port: e.target.value })}
            className="h-8 text-xs font-mono"
          />
        </div>

        <Button
          onClick={handleGenerate}
          size="sm"
          className="w-full h-8 text-xs gap-1.5 mt-2"
        >
          <Code className="w-3 h-3" />
          Generate Mock Payload
        </Button>
      </div>

      {/* Educational Notice */}
      <div className="bg-accent/5 border border-accent/20 rounded p-2.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-text-secondary space-y-1">
            <div className="font-semibold text-text-primary">Training Environment</div>
            <div>This interface simulates payload generation for educational purposes. No actual malicious code is created or executed.</div>
            <div className="pt-1 text-status-warning">⚠️ Real payload generation requires proper authorization and should only occur in isolated, controlled VM environments.</div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="text-xs text-text-muted space-y-2 pt-2">
        <div className="font-semibold text-text-secondary">SAFETY FEATURES:</div>
        <ul className="space-y-1 text-[11px] list-disc list-inside">
          <li>All payloads are simulated mock data</li>
          <li>No executable code is generated</li>
          <li>No network connections established</li>
          <li>Educational visualization only</li>
        </ul>
      </div>
    </div>
  );
};

export default PayloadBuilder;
