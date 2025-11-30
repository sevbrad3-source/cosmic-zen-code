import { Shield, AlertTriangle, Zap, Activity, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const RowhammerPanel = () => {
  const [memoryType, setMemoryType] = useState("");
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleTest = () => {
    if (!memoryType) {
      toast.error("Please select memory type");
      return;
    }

    toast.info("🎮 SIMULATION MODE", {
      description: "Mock Rowhammer test. No actual memory manipulation occurs. Hardware security education only.",
      duration: 5000
    });

    setTesting(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTesting(false);
          setResults({
            vulnerable: Math.random() > 0.5,
            bitFlips: Math.floor(Math.random() * 1000),
            accessPatterns: Math.floor(Math.random() * 50000),
            rowsAffected: Math.floor(Math.random() * 100)
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="p-3 space-y-3">
      {/* Critical Safety Banner */}
      <div className="bg-status-error/10 border border-status-error/30 rounded p-2 flex items-start gap-2">
        <Shield className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-status-error mb-1">CRITICAL: HARDWARE SIMULATION ONLY</div>
          <div className="text-text-secondary">This is an EDUCATIONAL SIMULATION of Rowhammer attacks. No actual DRAM manipulation occurs. All testing is completely mocked for hardware security research training.</div>
        </div>
      </div>

      <div className="text-xs text-text-muted mb-2">ROWHAMMER VULNERABILITY TESTING</div>

      {/* Test Configuration */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] text-text-secondary">Memory Type</label>
          <Select value={memoryType} onValueChange={setMemoryType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select memory type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ddr3">DDR3 (Simulated)</SelectItem>
              <SelectItem value="ddr4">DDR4 (Simulated)</SelectItem>
              <SelectItem value="ddr5">DDR5 (Simulated)</SelectItem>
              <SelectItem value="lpddr4">LPDDR4 (Simulated)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {testing && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-text-secondary">Test Progress</div>
            <Progress value={progress} className="h-2" />
            <div className="text-[10px] text-text-muted text-center">
              {progress}% - Hammering memory rows (simulated)
            </div>
          </div>
        )}

        <Button
          onClick={handleTest}
          disabled={testing || !memoryType}
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
        >
          <Zap className="w-3 h-3" />
          {testing ? "Testing..." : "Run Mock Rowhammer Test"}
        </Button>
      </div>

      {/* Test Results */}
      {results && (
        <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-3">
          <div className="text-xs font-semibold text-text-primary mb-2">TEST RESULTS (SIMULATED)</div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-surface border border-border rounded">
              <span className="text-[11px] text-text-secondary">Vulnerability Status</span>
              <Badge variant={results.vulnerable ? "destructive" : "outline"} className="text-[10px]">
                {results.vulnerable ? "VULNERABLE (Mock)" : "RESILIENT (Mock)"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 bg-surface border border-border rounded">
              <span className="text-[11px] text-text-secondary">Bit Flips Detected</span>
              <span className="text-xs font-mono text-text-primary">{results.bitFlips}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-surface border border-border rounded">
              <span className="text-[11px] text-text-secondary">Access Patterns</span>
              <span className="text-xs font-mono text-text-primary">{results.accessPatterns}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-surface border border-border rounded">
              <span className="text-[11px] text-text-secondary">Rows Affected</span>
              <span className="text-xs font-mono text-text-primary">{results.rowsAffected}</span>
            </div>
          </div>
        </div>
      )}

      {/* Technical Information */}
      <div className="bg-surface-elevated border border-border rounded-lg p-3 space-y-2">
        <div className="text-xs font-semibold text-text-primary mb-2">ROWHAMMER CONCEPTS</div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Activity className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Memory Row Hammering</div>
              <div className="text-[10px] text-text-muted">Repeatedly accessing DRAM rows to induce bit flips</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Educational Concept</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <Zap className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Bit Flip Exploitation</div>
              <div className="text-[10px] text-text-muted">Using hardware glitches for privilege escalation</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Educational Concept</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-surface border border-border rounded">
            <BarChart3 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">Memory Access Patterns</div>
              <div className="text-[10px] text-text-muted">Optimizing aggressor row selection for maximum impact</div>
              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">Educational Concept</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Notice */}
      <div className="bg-accent/5 border border-accent/20 rounded p-2.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-text-secondary space-y-1">
            <div className="font-semibold text-text-primary">Hardware Security Research Simulation</div>
            <div>This interface demonstrates Rowhammer vulnerability concepts for hardware security education. No actual DRAM access or bit manipulation occurs.</div>
            <div className="pt-1 text-status-warning">⚠️ Real Rowhammer attacks require physical hardware access and are illegal outside authorized security research environments.</div>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="text-xs text-text-muted space-y-2 pt-2">
        <div className="font-semibold text-text-secondary">SAFETY GUARANTEES:</div>
        <ul className="space-y-1 text-[11px] list-disc list-inside">
          <li>No actual memory access occurs</li>
          <li>All test results are simulated</li>
          <li>No hardware manipulation possible</li>
          <li>Educational visualization only</li>
        </ul>
      </div>
    </div>
  );
};

export default RowhammerPanel;
