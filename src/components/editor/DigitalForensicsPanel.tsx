import { useState } from "react";
import { Fingerprint, HardDrive, FileSearch, Clock, Download, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const DigitalForensicsPanel = () => {
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

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">Digital Forensics Lab</span>
          </div>
          <div className="px-2 py-0.5 bg-[hsl(210,100%,20%)] rounded text-[9px] text-[hsl(210,100%,60%)]">
            3 Active Cases
          </div>
        </div>

        {/* Safety Banner */}
        <div className="bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,25%)]/30 rounded p-2 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[hsl(210,100%,50%)] flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-[hsl(210,60%,60%)]">
            <span className="font-semibold text-[hsl(210,100%,60%)]">Simulation Mode:</span> All forensic data is synthetic for training purposes.
          </div>
        </div>

        {/* Cases */}
        <div className="space-y-2">
          <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Active Cases</div>
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveCase(c.id)}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                activeCase === c.id
                  ? "bg-[hsl(210,100%,15%)] border-[hsl(210,100%,40%)]"
                  : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(210,100%,30%)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[hsl(210,100%,85%)]">{c.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  c.priority === "critical" ? "bg-red-500/20 text-red-400" :
                  c.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>{c.priority}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[hsl(210,60%,50%)]">{c.artifacts} artifacts</span>
                <span className={`text-[10px] ${
                  c.status === "in-progress" ? "text-blue-400" :
                  c.status === "completed" ? "text-green-400" :
                  "text-[hsl(210,60%,50%)]"
                }`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Artifacts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Evidence Artifacts</div>
            <button className="text-[9px] text-[hsl(210,100%,60%)] hover:text-[hsl(210,100%,70%)]">+ Add Evidence</button>
          </div>
          <div className="space-y-1">
            {artifacts.map((artifact, i) => (
              <div key={i} className="bg-[hsl(210,100%,8%)] rounded p-2 border border-[hsl(210,100%,18%)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3 h-3 text-[hsl(210,100%,50%)]" />
                    <span className="text-[10px] text-[hsl(210,100%,80%)]">{artifact.name}</span>
                  </div>
                  <span className={`text-[9px] px-1 py-0.5 rounded ${
                    artifact.status === "analyzed" ? "bg-green-500/20 text-green-400" :
                    artifact.status === "processing" ? "bg-blue-500/20 text-blue-400" :
                    "bg-[hsl(210,100%,15%)] text-[hsl(210,60%,50%)]"
                  }`}>{artifact.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[9px] text-[hsl(210,60%,50%)]">
                  <span>{artifact.type}</span>
                  <span>{artifact.size}</span>
                  <span className="font-mono">{artifact.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-[hsl(210,100%,50%)]" />
            <span className="text-[10px] text-[hsl(210,60%,50%)] uppercase tracking-wider">Attack Timeline</span>
          </div>
          <div className="space-y-1 border-l-2 border-[hsl(210,100%,25%)] ml-1">
            {timeline.map((event, i) => (
              <div key={i} className="pl-3 py-1 relative">
                <div className={`absolute left-[-5px] top-2 w-2 h-2 rounded-full ${
                  event.severity === "critical" ? "bg-red-500" :
                  event.severity === "high" ? "bg-orange-500" :
                  "bg-yellow-500"
                }`} />
                <div className="text-[9px] font-mono text-[hsl(210,60%,50%)]">{event.time}</div>
                <div className="text-[10px] text-[hsl(210,100%,80%)]">{event.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[hsl(210,100%,25%)] hover:bg-[hsl(210,100%,30%)] rounded text-[10px] text-[hsl(210,100%,85%)] transition-colors">
            <FileSearch className="w-3 h-3" />
            Analyze Artifacts
          </button>
          <button className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-[10px] text-[hsl(210,100%,70%)] transition-colors">
            <Download className="w-3 h-3" />
            Export Report
          </button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DigitalForensicsPanel;
