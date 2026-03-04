import { useState } from "react";
import { Zap, Activity, BarChart3, Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "test", icon: Search, label: "Testing" },
  { id: "findings", icon: BarChart3, label: "Findings" },
  { id: "hardening", icon: Shield, label: "Hardening" },
];

const RowhammerPanel = () => {
  const [activeTab, setActiveTab] = useState("test");
  const [memoryType, setMemoryType] = useState("");
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleTest = () => {
    if (!memoryType) return toast.error("Please select memory type");
    setTesting(true);
    setProgress(0);
    setResults(null);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTesting(false);
          setResults({ vulnerable: Math.random() > 0.5, bitFlips: Math.floor(Math.random() * 1000), accessPatterns: Math.floor(Math.random() * 50000), rowsAffected: Math.floor(Math.random() * 100) });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1"><div className="p-3 space-y-3">
        {activeTab === "test" && (
          <div className="bg-card border border-border rounded-lg p-3 space-y-3">
            <Select value={memoryType} onValueChange={setMemoryType}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select memory type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ddr3">DDR3</SelectItem>
                <SelectItem value="ddr4">DDR4</SelectItem>
                <SelectItem value="ddr5">DDR5</SelectItem>
                <SelectItem value="lpddr4">LPDDR4</SelectItem>
              </SelectContent>
            </Select>
            {testing && (
              <div className="space-y-1.5">
                <div className="text-[11px] text-muted-foreground">Test Progress</div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            <Button onClick={handleTest} disabled={testing || !memoryType} size="sm" className="w-full h-8 text-xs gap-1.5">
              <Zap className="w-3 h-3" /> {testing ? "Running..." : "Run Test"}
            </Button>
          </div>
        )}

        {activeTab === "findings" && results && (
          <div className="bg-card border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/40 rounded"><span className="text-xs">Vulnerability Status</span><Badge variant={results.vulnerable ? "destructive" : "outline"}>{results.vulnerable ? "Vulnerable" : "Resilient"}</Badge></div>
            <div className="flex items-center justify-between p-2 bg-muted/40 rounded"><span className="text-xs">Bit Flips</span><span className="font-mono text-xs">{results.bitFlips}</span></div>
            <div className="flex items-center justify-between p-2 bg-muted/40 rounded"><span className="text-xs">Access Patterns</span><span className="font-mono text-xs">{results.accessPatterns}</span></div>
            <div className="flex items-center justify-between p-2 bg-muted/40 rounded"><span className="text-xs">Rows Affected</span><span className="font-mono text-xs">{results.rowsAffected}</span></div>
          </div>
        )}

        {activeTab === "hardening" && (
          <div className="space-y-2">
            <div className="bg-card border border-border rounded-lg p-3 flex items-start gap-2"><Activity className="w-4 h-4 text-primary mt-0.5" /><div><div className="text-sm">Enable ECC where available</div><div className="text-xs text-muted-foreground">Correct single-bit memory faults</div></div></div>
            <div className="bg-card border border-border rounded-lg p-3 flex items-start gap-2"><Shield className="w-4 h-4 text-primary mt-0.5" /><div><div className="text-sm">Tune refresh rate</div><div className="text-xs text-muted-foreground">Reduce disturbance-error probability</div></div></div>
          </div>
        )}
      </div></ScrollArea>
    </div>
  );
};

export default RowhammerPanel;
