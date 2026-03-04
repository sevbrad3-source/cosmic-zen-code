import { Target, Search, Activity, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

interface Process {
  pid: number;
  name: string;
  user: string;
  arch: string;
  session: number;
}

const tabs: InnerTab[] = [
  { id: "processes", icon: Search, label: "Processes" },
  { id: "execution", icon: PlayCircle, label: "Execution" },
  { id: "intel", icon: Activity, label: "Intel" },
];

const ProcessInjectionPanel = () => {
  const [activeTab, setActiveTab] = useState("processes");
  const [processes] = useState<Process[]>([
    { pid: 1234, name: "explorer.exe", user: "demo_user", arch: "x64", session: 1 },
    { pid: 5678, name: "chrome.exe", user: "demo_user", arch: "x64", session: 1 },
    { pid: 9012, name: "notepad.exe", user: "demo_user", arch: "x86", session: 1 },
    { pid: 3456, name: "cmd.exe", user: "SYSTEM", arch: "x64", session: 0 },
  ]);

  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [method, setMethod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProcesses = processes.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.pid.toString().includes(searchTerm));

  const handleInject = () => {
    if (!selectedPid || !method) return toast.error("Please select a process and injection method");
    const process = processes.find((p) => p.pid === selectedPid);
    toast.success(`Execution plan queued for ${process?.name}`);
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1"><div className="p-3 space-y-3">
        {activeTab === "processes" && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input placeholder="Search processes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 text-xs pl-7" />
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {filteredProcesses.map((process) => (
                <div key={process.pid} onClick={() => setSelectedPid(process.pid)} className={`p-2 rounded border cursor-pointer ${selectedPid === process.pid ? "bg-muted border-primary" : "bg-card border-border"}`}>
                  <div className="text-xs font-semibold font-mono">{process.name}</div>
                  <div className="text-[10px] text-muted-foreground">PID {process.pid} • {process.user} • {process.arch}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "execution" && (
          <div className="space-y-3 bg-card border border-border rounded-lg p-3">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select execution technique" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="createremotethread">CreateRemoteThread</SelectItem>
                <SelectItem value="ntcreatethread">NtCreateThreadEx</SelectItem>
                <SelectItem value="queueuserapc">QueueUserAPC</SelectItem>
                <SelectItem value="processhollowing">Process Hollowing</SelectItem>
                <SelectItem value="reflective">Reflective DLL</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInject} disabled={!selectedPid || !method} size="sm" className="w-full h-8 text-xs gap-1.5">
              <Target className="w-3 h-3" /> Queue Execution
            </Button>
          </div>
        )}

        {activeTab === "intel" && (
          <div className="space-y-2">
            <div className="bg-card border border-border rounded-lg p-3 text-sm">Candidate processes: {filteredProcesses.length}</div>
            <div className="bg-card border border-border rounded-lg p-3 text-sm">Session-0 processes: {processes.filter((p) => p.session === 0).length}</div>
          </div>
        )}
      </div></ScrollArea>
    </div>
  );
};

export default ProcessInjectionPanel;
