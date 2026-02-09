import { useState } from "react";
import { Fingerprint, HardDrive, FileSearch, Clock, Download, AlertTriangle, CheckCircle, Activity, Database, Cpu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "cases", icon: Fingerprint, label: "Cases", badge: 3 },
  { id: "evidence", icon: HardDrive, label: "Evidence", badge: 47 },
  { id: "timeline", icon: Clock, label: "Timeline" },
  { id: "memory", icon: Cpu, label: "Memory Analysis" },
  { id: "disk", icon: Database, label: "Disk Analysis" },
];

const DigitalForensicsPanel = () => {
  const [activeTab, setActiveTab] = useState("cases");
  const [activeCase, setActiveCase] = useState("case-001");

  const cases = [
    { id: "case-001", name: "Ransomware Investigation", status: "in-progress", priority: "critical", artifacts: 47 },
    { id: "case-002", name: "Data Breach Analysis", status: "pending", priority: "high", artifacts: 23 },
    { id: "case-003", name: "Insider Threat", status: "completed", priority: "medium", artifacts: 89 },
  ];

  const artifacts = [
    { type: "Memory Dump", name: "memdump_srv01.raw", size: "16 GB", hash: "a4b2c1...", status: "analyzed" },
    { type: "Disk Image", name: "workstation_c.e01", size: "256 GB", hash: "f8e9d7...", status: "processing" },
    { type: "Network Capture", name: "traffic_24h.pcap", size: "4.2 GB", hash: "b5c6a3...", status: "queued" },
    { type: "Registry Hive", name: "SYSTEM.reg", size: "24 MB", hash: "d1e2f3...", status: "analyzed" },
    { type: "Event Logs", name: "Security.evtx", size: "128 MB", hash: "c7d8e9...", status: "analyzed" },
  ];

  const timeline = [
    { time: "2024-01-15 03:24:17", event: "Malicious PowerShell execution", severity: "critical" },
    { time: "2024-01-15 03:24:45", event: "Lateral movement to DC01", severity: "critical" },
    { time: "2024-01-15 03:25:12", event: "Credential dumping detected", severity: "high" },
    { time: "2024-01-15 03:26:33", event: "Data staging initiated", severity: "high" },
    { time: "2024-01-15 03:28:01", event: "Exfiltration to external IP", severity: "critical" },
  ];

  const memoryFindings = [
    { process: "powershell.exe", pid: 4532, finding: "Encoded command detected", severity: "critical" },
    { process: "rundll32.exe", pid: 2184, finding: "Injected shellcode in memory", severity: "critical" },
    { process: "svchost.exe", pid: 1024, finding: "Anomalous network connections", severity: "high" },
    { process: "lsass.exe", pid: 672, finding: "Credential access attempt", severity: "critical" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "cases":
        return (
          <div className="space-y-2">
            <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Active Cases</div>
            {cases.map((c) => (
              <div key={c.id} onClick={() => setActiveCase(c.id)} className={`p-2 rounded border cursor-pointer transition-colors ${activeCase === c.id ? "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]" : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[hsl(210,100%,85%)]">{c.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${c.priority === "critical" ? "bg-red-500/20 text-red-400" : c.priority === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{c.priority}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[hsl(210,60%,50%)]">{c.artifacts} artifacts</span>
                  <span className={`text-[10px] ${c.status === "in-progress" ? "text-blue-400" : c.status === "completed" ? "text-green-400" : "text-[hsl(210,60%,50%)]"}`}>{c.status}</span>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-[10px] text-[hsl(210,100%,85%)] transition-colors"><FileSearch className="w-3 h-3" />Analyze Artifacts</button>
              <button className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-[10px] text-[hsl(210,100%,70%)] transition-colors"><Download className="w-3 h-3" />Export Report</button>
            </div>
          </div>
        );
      case "evidence":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Evidence Artifacts</div>
              <button className="text-[9px] text-[hsl(210,100%,60%)] hover:text-[hsl(210,100%,70%)]">+ Add Evidence</button>
            </div>
            {artifacts.map((artifact, i) => (
              <div key={i} className="bg-[hsl(210,100%,8%)] rounded p-2 border border-[hsl(210,100%,18%)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><HardDrive className="w-3 h-3 text-[hsl(210,100%,50%)]" /><span className="text-[10px] text-[hsl(210,100%,80%)]">{artifact.name}</span></div>
                  <span className={`text-[9px] px-1 py-0.5 rounded ${artifact.status === "analyzed" ? "bg-green-500/20 text-green-400" : artifact.status === "processing" ? "bg-blue-500/20 text-blue-400" : "bg-[hsl(210,100%,15%)] text-[hsl(210,60%,50%)]"}`}>{artifact.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[9px] text-[hsl(210,60%,50%)]">
                  <span>{artifact.type}</span><span>{artifact.size}</span><span className="font-mono">{artifact.hash}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case "timeline":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-[hsl(210,100%,50%)]" /><span className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Attack Timeline</span></div>
            <div className="space-y-1 border-l-2 border-[hsl(210,100%,25%)] ml-1">
              {timeline.map((event, i) => (
                <div key={i} className="pl-3 py-1 relative">
                  <div className={`absolute left-[-5px] top-2 w-2 h-2 rounded-full ${event.severity === "critical" ? "bg-red-500" : event.severity === "high" ? "bg-orange-500" : "bg-yellow-500"}`} />
                  <div className="text-[9px] font-mono text-[hsl(210,60%,50%)]">{event.time}</div>
                  <div className="text-[10px] text-[hsl(210,100%,80%)]">{event.event}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "memory":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Memory Analysis Results</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-2 text-center">
                <div className="text-lg font-bold text-red-400">4</div>
                <div className="text-[9px] text-[hsl(210,60%,50%)]">Suspicious Processes</div>
              </div>
              <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded p-2 text-center">
                <div className="text-lg font-bold text-[hsl(210,100%,70%)]">16 GB</div>
                <div className="text-[9px] text-[hsl(210,60%,50%)]">Dump Size</div>
              </div>
            </div>
            {memoryFindings.map((finding, i) => (
              <div key={i} className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[hsl(210,100%,80%)]">{finding.process} (PID: {finding.pid})</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${finding.severity === "critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>{finding.severity}</span>
                </div>
                <div className="text-[10px] text-[hsl(210,60%,60%)] mt-1">{finding.finding}</div>
              </div>
            ))}
          </div>
        );
      case "disk":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Disk Forensics</span>
            <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded p-3 space-y-2">
              <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase">Image Info</div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div><span className="text-[hsl(210,60%,50%)]">Format:</span> <span className="text-[hsl(210,100%,80%)]">E01</span></div>
                <div><span className="text-[hsl(210,60%,50%)]">Size:</span> <span className="text-[hsl(210,100%,80%)]">256 GB</span></div>
                <div><span className="text-[hsl(210,60%,50%)]">Filesystem:</span> <span className="text-[hsl(210,100%,80%)]">NTFS</span></div>
                <div><span className="text-[hsl(210,60%,50%)]">Partitions:</span> <span className="text-[hsl(210,100%,80%)]">3</span></div>
              </div>
            </div>
            <div className="space-y-1">
              {["Deleted file recovery: 47 files", "Timeline analysis: 2,341 events", "Registry analysis: Complete", "Browser history: 892 entries", "USB device history: 5 devices"].map((item, i) => (
                <div key={i} className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-[hsl(120,100%,50%)]" />
                  <span className="text-[10px] text-[hsl(210,100%,80%)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="blue" />
      <ScrollArea className="flex-1"><div className="p-3">{renderContent()}</div></ScrollArea>
    </div>
  );
};

export default DigitalForensicsPanel;
