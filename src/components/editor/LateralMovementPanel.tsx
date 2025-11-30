import { Shield, AlertTriangle, ArrowRight, Key, Share2, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface Host {
  id: string;
  ip: string;
  hostname: string;
  os: string;
  compromised: boolean;
}

const LateralMovementPanel = () => {
  const [hosts] = useState<Host[]>([
    { id: "host1", ip: "192.168.1.10", hostname: "DC01", os: "Windows Server 2019", compromised: true },
    { id: "host2", ip: "192.168.1.15", hostname: "WEB01", os: "Ubuntu 20.04", compromised: false },
    { id: "host3", ip: "192.168.1.20", hostname: "DB01", os: "Windows Server 2016", compromised: false },
    { id: "host4", ip: "192.168.1.25", hostname: "FILE01", os: "Windows 10", compromised: false },
  ]);

  const [sourceHost, setSourceHost] = useState("");
  const [targetHost, setTargetHost] = useState("");
  const [technique, setTechnique] = useState("");
  const [credentials, setCredentials] = useState("");

  const handleMove = () => {
    if (!sourceHost || !targetHost || !technique) {
      toast.error("Please configure all movement parameters");
      return;
    }

    const source = hosts.find(h => h.id === sourceHost);
    const target = hosts.find(h => h.id === targetHost);

    toast.info("🎮 SIMULATION MODE", {
      description: `Mock lateral movement from ${source?.hostname} to ${target?.hostname}. No actual network compromise occurs. Training only.`,
      duration: 5000
    });
  };

  return (
    <div className="p-3 space-y-3">
      {/* Critical Safety Banner */}
      <div className="bg-status-error/10 border border-status-error/30 rounded p-2 flex items-start gap-2">
        <Shield className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-status-error mb-1">CRITICAL: SIMULATION ONLY</div>
          <div className="text-text-secondary">All lateral movement is simulated. No actual network pivoting or credential attacks occur. Educational purposes exclusively.</div>
        </div>
      </div>

      <div className="text-xs text-text-muted mb-2">NETWORK TOPOLOGY</div>

      {/* Network Map */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
        {hosts.map((host) => (
          <div
            key={host.id}
            className={`p-2 rounded border ${
              host.compromised
                ? "bg-status-error/10 border-status-error/30"
                : "bg-surface border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Network className="w-3 h-3 text-text-muted" />
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    {host.hostname}
                  </span>
                  {host.compromised && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 text-status-error">
                      COMPROMISED (Mock)
                    </Badge>
                  )}
                </div>
                <div className="text-[10px] text-text-muted ml-5 mt-0.5">
                  <div>IP: {host.ip}</div>
                  <div>OS: {host.os}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-text-muted mb-2">LATERAL MOVEMENT CONFIGURATION</div>

      {/* Movement Configuration */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Source Host (Compromised)</label>
          <Select value={sourceHost} onValueChange={setSourceHost}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {hosts.filter(h => h.compromised).map(host => (
                <SelectItem key={host.id} value={host.id}>
                  {host.hostname} ({host.ip})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Target Host</label>
          <Select value={targetHost} onValueChange={setTargetHost}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              {hosts.filter(h => !h.compromised).map(host => (
                <SelectItem key={host.id} value={host.id}>
                  {host.hostname} ({host.ip})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Movement Technique</label>
          <Select value={technique} onValueChange={setTechnique}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select technique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pth">Pass-the-Hash (Mock)</SelectItem>
              <SelectItem value="ptt">Pass-the-Ticket (Mock)</SelectItem>
              <SelectItem value="psexec">PsExec (Mock)</SelectItem>
              <SelectItem value="wmi">WMI Execution (Mock)</SelectItem>
              <SelectItem value="rdp">RDP Hijacking (Mock)</SelectItem>
              <SelectItem value="dcom">DCOM Execution (Mock)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Credentials (Optional)</label>
          <Input
            placeholder="NTLM hash or ticket (simulated)"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            className="h-8 text-xs font-mono"
            type="password"
          />
        </div>

        <Button
          onClick={handleMove}
          disabled={!sourceHost || !targetHost || !technique}
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
        >
          <ArrowRight className="w-3 h-3" />
          Simulate Lateral Movement
        </Button>
      </div>

      {/* Technique Reference */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
        <div className="text-xs font-semibold text-text-primary mb-2">TECHNIQUE REFERENCE</div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Key className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Pass-the-Hash (PtH)</div>
              <div className="text-[10px] text-text-muted">Use NTLM hash without cracking (simulated)</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Mock Mode</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Share2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Pass-the-Ticket (PtT)</div>
              <div className="text-[10px] text-text-muted">Kerberos ticket reuse attack (simulated)</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Mock Mode</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Network className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Network Pivoting</div>
              <div className="text-[10px] text-text-muted">Route through compromised hosts (simulated)</div>
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
            <div className="font-semibold text-text-primary">Red Team Training Simulation</div>
            <div>This demonstrates lateral movement concepts for defensive security training. All network activity is completely mocked.</div>
            <div className="pt-1 text-status-warning">⚠️ Real lateral movement attacks are illegal outside authorized penetration tests in isolated lab environments.</div>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="text-xs text-text-muted space-y-2 pt-2">
        <div className="font-semibold text-text-secondary">SAFETY GUARANTEES:</div>
        <ul className="space-y-1 text-[11px] list-disc list-inside">
          <li>All hosts are simulated data</li>
          <li>No actual network connections</li>
          <li>No credential attacks occur</li>
          <li>Visual training interface only</li>
        </ul>
      </div>
    </div>
  );
};

export default LateralMovementPanel;
