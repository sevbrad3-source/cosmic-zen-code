import { useState, lazy, Suspense } from "react";
import { Network, ArrowRight, Key, Target, Map, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "topology", icon: Map, label: "Topology" },
  { id: "movement", icon: ArrowRight, label: "Movement" },
  { id: "credentials", icon: Key, label: "Credentials" },
  { id: "techniques", icon: Shield, label: "Techniques" },
];

interface Host {
  id: string;
  ip: string;
  hostname: string;
  os: string;
  compromised: boolean;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-[hsl(0,100%,40%)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const LateralMovementPanel = () => {
  const [activeTab, setActiveTab] = useState("topology");
  const [hosts] = useState<Host[]>([
    { id: "host1", ip: "192.168.1.10", hostname: "DC01", os: "Windows Server 2019", compromised: true },
    { id: "host2", ip: "192.168.1.15", hostname: "WEB01", os: "Ubuntu 20.04", compromised: false },
    { id: "host3", ip: "192.168.1.20", hostname: "DB01", os: "Windows Server 2016", compromised: false },
    { id: "host4", ip: "192.168.1.25", hostname: "FILE01", os: "Windows 10", compromised: false },
    { id: "host5", ip: "192.168.1.30", hostname: "MAIL01", os: "CentOS 8", compromised: true },
  ]);

  const [sourceHost, setSourceHost] = useState("");
  const [targetHost, setTargetHost] = useState("");
  const [technique, setTechnique] = useState("");

  const techniques = [
    { id: "pth", name: "Pass-the-Hash", mitre: "T1550.002", risk: "high" },
    { id: "ptt", name: "Pass-the-Ticket", mitre: "T1550.003", risk: "high" },
    { id: "psexec", name: "PsExec", mitre: "T1569.002", risk: "medium" },
    { id: "wmi", name: "WMI Execution", mitre: "T1047", risk: "medium" },
    { id: "rdp", name: "RDP Hijacking", mitre: "T1563.002", risk: "high" },
    { id: "dcom", name: "DCOM Execution", mitre: "T1021.003", risk: "medium" },
  ];

  const credentials = [
    { user: "Administrator", type: "NTLM", source: "DC01", cracked: true },
    { user: "sqlsvc", type: "Kerberos", source: "DB01", cracked: false },
    { user: "www-data", type: "SSH Key", source: "WEB01", cracked: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "topology":
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[hsl(0,100%,75%)]">NETWORK TOPOLOGY</div>
            <div className="space-y-2">
              {hosts.map((host) => (
                <div key={host.id} className={`p-3 rounded-lg border ${
                  host.compromised
                    ? "bg-[hsl(0,100%,10%)] border-[hsl(0,100%,30%)]"
                    : "bg-[hsl(0,100%,7%)] border-[hsl(0,100%,15%)]"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-[hsl(0,60%,50%)]" />
                      <span className="text-sm font-medium text-[hsl(0,100%,85%)]">{host.hostname}</span>
                      {host.compromised && (
                        <Badge className="text-[9px] bg-[hsl(0,100%,35%)]">OWNED</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] text-[hsl(0,60%,50%)] grid grid-cols-2 gap-1">
                    <span>IP: {host.ip}</span>
                    <span>OS: {host.os}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "movement":
        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[hsl(0,100%,75%)]">EXECUTE MOVEMENT</div>
            <div className="space-y-3">
              <Select value={sourceHost} onValueChange={setSourceHost}>
                <SelectTrigger className="h-8 text-xs bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]">
                  <SelectValue placeholder="Source (Compromised)" />
                </SelectTrigger>
                <SelectContent>
                  {hosts.filter(h => h.compromised).map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.hostname} ({h.ip})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={targetHost} onValueChange={setTargetHost}>
                <SelectTrigger className="h-8 text-xs bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]">
                  <SelectValue placeholder="Target Host" />
                </SelectTrigger>
                <SelectContent>
                  {hosts.filter(h => !h.compromised).map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.hostname} ({h.ip})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={technique} onValueChange={setTechnique}>
                <SelectTrigger className="h-8 text-xs bg-[hsl(0,100%,6%)] border-[hsl(0,100%,20%)]">
                  <SelectValue placeholder="Technique" />
                </SelectTrigger>
                <SelectContent>
                  {techniques.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.mitre})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full h-8 text-xs bg-[hsl(0,100%,35%)]" disabled={!sourceHost || !targetHost || !technique}>
                <ArrowRight className="w-3 h-3 mr-1" /> Execute Movement
              </Button>
            </div>
          </div>
        );
      case "credentials":
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[hsl(0,100%,75%)]">HARVESTED CREDENTIALS</div>
            <div className="space-y-2">
              {credentials.map((cred, i) => (
                <div key={i} className="p-3 bg-[hsl(0,100%,7%)] border border-[hsl(0,100%,15%)] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[hsl(0,100%,85%)]">{cred.user}</span>
                    <Badge className={`text-[9px] ${cred.cracked ? "bg-[hsl(120,100%,25%)]" : "bg-[hsl(45,100%,30%)]"}`}>
                      {cred.cracked ? "Cracked" : "Hash"}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-[hsl(0,60%,50%)]">{cred.type} • from {cred.source}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "techniques":
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[hsl(0,100%,75%)]">MOVEMENT TECHNIQUES</div>
            <div className="space-y-2">
              {techniques.map((t) => (
                <div key={t.id} className="p-3 bg-[hsl(0,100%,7%)] border border-[hsl(0,100%,15%)] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[hsl(0,100%,85%)]">{t.name}</span>
                    <Badge className="text-[9px] bg-[hsl(270,100%,30%)]">{t.mitre}</Badge>
                  </div>
                  <div className="text-[10px] text-[hsl(0,60%,50%)]">Risk: {t.risk}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1">
        <div className="p-3">{renderContent()}</div>
      </ScrollArea>
    </div>
  );
};

export default LateralMovementPanel;
