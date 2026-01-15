import { Target, Shield, AlertTriangle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface Process {
  pid: number;
  name: string;
  user: string;
  arch: string;
  session: number;
}

const ProcessInjectionPanel = () => {
  const [processes] = useState<Process[]>([
    { pid: 1234, name: "explorer.exe", user: "demo_user", arch: "x64", session: 1 },
    { pid: 5678, name: "chrome.exe", user: "demo_user", arch: "x64", session: 1 },
    { pid: 9012, name: "notepad.exe", user: "demo_user", arch: "x86", session: 1 },
    { pid: 3456, name: "cmd.exe", user: "SYSTEM", arch: "x64", session: 0 },
  ]);

  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [method, setMethod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pid.toString().includes(searchTerm)
  );

  const handleInject = () => {
    if (!selectedPid || !method) {
      toast.error("Please select a process and injection method");
      return;
    }

    const process = processes.find(p => p.pid === selectedPid);
    toast.info("🎮 SIMULATION MODE", {
      description: `Mock injection into ${process?.name}. No actual code injection occurs. Training only.`,
      duration: 5000
    });
  };

  return (
    <div className="p-3 space-y-3">
      {/* Critical Safety Banner */}
      <div className="text-xs text-text-muted mb-2">PROCESS SELECTION</div>

      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
          <Input
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-xs pl-7"
          />
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
          {filteredProcesses.map((process) => (
            <div
              key={process.pid}
              onClick={() => setSelectedPid(process.pid)}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                selectedPid === process.pid
                  ? "bg-accent/10 border-accent"
                  : "bg-surface border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-semibold text-text-primary truncate">
                    {process.name}
                  </div>
                  <div className="text-[10px] text-text-muted flex items-center gap-2 mt-0.5">
                    <span>PID: {process.pid}</span>
                    <span>•</span>
                    <span>{process.user}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      {process.arch}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-text-muted mb-2">INJECTION METHOD</div>

      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select injection technique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createremotethread">CreateRemoteThread (Mock)</SelectItem>
            <SelectItem value="ntcreatethread">NtCreateThreadEx (Mock)</SelectItem>
            <SelectItem value="queueuserapc">QueueUserAPC (Mock)</SelectItem>
            <SelectItem value="processhollowing">Process Hollowing (Mock)</SelectItem>
            <SelectItem value="reflective">Reflective DLL (Mock)</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleInject}
          disabled={!selectedPid || !method}
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
        >
          <Target className="w-3 h-3" />
          Simulate Injection
        </Button>
      </div>

      {/* Educational Notice */}
      <div className="bg-accent/5 border border-accent/20 rounded p-2.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-text-secondary space-y-1">
            <div className="font-semibold text-text-primary">Educational Simulation</div>
            <div>This tool demonstrates process injection concepts for defensive security training. No actual process memory is modified.</div>
            <div className="pt-1 text-status-warning">⚠️ Real process injection is illegal outside authorized penetration testing engagements in isolated environments.</div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="text-xs text-text-muted space-y-2 pt-2">
        <div className="font-semibold text-text-secondary">SAFETY GUARANTEES:</div>
        <ul className="space-y-1 text-[11px] list-disc list-inside">
          <li>All processes shown are mock data</li>
          <li>No actual memory manipulation</li>
          <li>No code execution occurs</li>
          <li>Visual training interface only</li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessInjectionPanel;
