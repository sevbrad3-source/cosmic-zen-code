import { useState } from "react";
import { Upload, Download, Cloud, Database, FileText, Image, Archive, Send, Settings, Play, Square, Eye, EyeOff, Lock, Shield, BarChart3, Globe, Layers, Clock, Zap, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "methods", icon: Route, label: "Methods", badge: 6 },
  { id: "targets", icon: FileText, label: "Targets", badge: 5 },
  { id: "staging", icon: Layers, label: "Staging" },
  { id: "transfer", icon: Send, label: "Active", badgeVariant: "success" as const, badge: "LIVE" },
  { id: "history", icon: Clock, label: "History", badge: 3 },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const ExfiltratorPanel = () => {
  const [activeTab, setActiveTab] = useState("methods");
  const [exfilActive, setExfilActive] = useState(false);
  const [encryptData, setEncryptData] = useState(true);
  const [steganography, setSteganography] = useState(false);

  const methods = [
    { id: "https", name: "HTTPS POST", port: 443, stealth: "High", speed: "Fast", bandwidth: "10 MB/s", detection: "Low" },
    { id: "dns", name: "DNS Tunneling", port: 53, stealth: "Very High", speed: "Slow", bandwidth: "50 KB/s", detection: "Very Low" },
    { id: "icmp", name: "ICMP Tunneling", port: 0, stealth: "High", speed: "Medium", bandwidth: "500 KB/s", detection: "Low" },
    { id: "websocket", name: "WebSocket", port: 443, stealth: "High", speed: "Fast", bandwidth: "8 MB/s", detection: "Low" },
    { id: "smtp", name: "SMTP (Email)", port: 25, stealth: "Medium", speed: "Medium", bandwidth: "2 MB/s", detection: "Medium" },
    { id: "ftp", name: "FTP/SFTP", port: 21, stealth: "Low", speed: "Fast", bandwidth: "15 MB/s", detection: "High" },
  ];

  const targetFiles = [
    { name: "credentials.db", size: "2.4 MB", type: "database", priority: "critical", hash: "a4f2c8..." },
    { name: "config.xml", size: "128 KB", type: "config", priority: "high", hash: "b7e1d3..." },
    { name: "users_export.csv", size: "5.8 MB", type: "data", priority: "high", hash: "c9f4a1..." },
    { name: "ssh_keys/", size: "45 KB", type: "keys", priority: "critical", hash: "d2b5e7..." },
    { name: "backup_2024.zip", size: "892 MB", type: "archive", priority: "medium", hash: "e8c3f9..." },
  ];

  const stagingQueue = [
    { name: "credentials.db", status: "encrypted", compression: "92%", chunks: 12 },
    { name: "ssh_keys/id_rsa", status: "staged", compression: "15%", chunks: 1 },
    { name: "config.xml", status: "compressing", compression: "78%", chunks: 3 },
  ];

  const exfilHistory = [
    { file: "passwd", size: "4.2 KB", method: "DNS", status: "complete", time: "2m ago", duration: "12s" },
    { file: "shadow", size: "2.8 KB", method: "DNS", status: "complete", time: "5m ago", duration: "8s" },
    { file: "id_rsa", size: "1.6 KB", method: "HTTPS", status: "complete", time: "12m ago", duration: "1s" },
    { file: "config.xml", size: "128 KB", method: "ICMP", status: "complete", time: "18m ago", duration: "45s" },
    { file: "users.csv", size: "5.8 MB", method: "WebSocket", status: "failed", time: "25m ago", duration: "—" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database": return <Database className="w-4 h-4 text-blue-400" />;
      case "config": return <FileText className="w-4 h-4 text-yellow-400" />;
      case "data": return <FileText className="w-4 h-4 text-green-400" />;
      case "keys": return <Lock className="w-4 h-4 text-red-400" />;
      case "archive": return <Archive className="w-4 h-4 text-purple-400" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(0,10%,5%)]">
      <div className="p-3 border-b border-[hsl(0,100%,20%)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[hsl(0,100%,25%)]">
            <Upload className="w-4 h-4 text-[hsl(0,100%,70%)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(0,100%,85%)]">Data Exfiltration</h3>
            <p className="text-xs text-[hsl(0,60%,50%)]">Covert Data Transfer Operations</p>
          </div>
        </div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {activeTab === "methods" && (
            <>
              <div className="space-y-2">
                <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Exfiltration Channels</div>
                {methods.map((method) => (
                  <label key={method.id} className="flex items-center gap-2 p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] cursor-pointer hover:border-[hsl(0,100%,30%)]">
                    <input type="radio" name="method" className="accent-[hsl(0,100%,50%)]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[hsl(0,100%,85%)]">{method.name}</span>
                        <Badge className="bg-[hsl(0,100%,20%)] text-[hsl(0,100%,70%)]">{method.speed}</Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-[hsl(0,60%,50%)] mt-1">
                        <span>Port {method.port}</span>
                        <span>Stealth: {method.stealth}</span>
                        <span>BW: {method.bandwidth}</span>
                        <span>Detection: {method.detection}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs text-[hsl(0,60%,50%)] uppercase">C2 Endpoint</div>
                <Input placeholder="https://exfil.endpoint.com" className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] font-mono" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-[hsl(0,100%,70%)]" /><span className="text-sm text-[hsl(0,100%,85%)]">AES-256 Encryption</span></div>
                  <Switch checked={encryptData} onCheckedChange={setEncryptData} />
                </div>
                <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <div className="flex items-center gap-2"><Image className="w-4 h-4 text-[hsl(0,100%,70%)]" /><span className="text-sm text-[hsl(0,100%,85%)]">Steganography</span></div>
                  <Switch checked={steganography} onCheckedChange={setSteganography} />
                </div>
              </div>
            </>
          )}

          {activeTab === "targets" && (
            <>
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Target Files</div>
              {targetFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <input type="checkbox" className="accent-[hsl(0,100%,50%)]" defaultChecked={file.priority === "critical"} />
                  {getTypeIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[hsl(0,100%,85%)] truncate">{file.name}</div>
                    <div className="text-xs text-[hsl(0,60%,50%)]">{file.size} • SHA256: {file.hash}</div>
                  </div>
                  <Badge className={file.priority === "critical" ? "bg-red-600" : file.priority === "high" ? "bg-orange-600" : "bg-yellow-600"}>{file.priority}</Badge>
                </div>
              ))}
              <Button className="w-full bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]"><Upload className="w-4 h-4 mr-2" />Add to Staging Queue</Button>
            </>
          )}

          {activeTab === "staging" && (
            <>
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Staging Queue</div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                    <div className="text-xs text-[hsl(0,60%,50%)]">Chunk Size</div>
                    <select className="w-full mt-1 h-7 px-2 rounded bg-[hsl(0,100%,12%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-xs">
                      <option>512 bytes</option><option>4 KB</option><option>64 KB</option><option>1 MB</option>
                    </select>
                  </div>
                  <div className="p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                    <div className="text-xs text-[hsl(0,60%,50%)]">Jitter (ms)</div>
                    <div className="flex gap-1 mt-1">
                      <Input type="number" defaultValue={100} className="h-7 text-xs bg-[hsl(0,100%,12%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]" />
                      <Input type="number" defaultValue={5000} className="h-7 text-xs bg-[hsl(0,100%,12%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]" />
                    </div>
                  </div>
                </div>
                {stagingQueue.map((item, i) => (
                  <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[hsl(0,100%,85%)] font-mono">{item.name}</span>
                      <Badge className={item.status === "encrypted" ? "bg-green-600" : item.status === "staged" ? "bg-blue-600" : "bg-yellow-600"}>{item.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[hsl(0,60%,50%)]">
                      <span>Compression: {item.compression}</span>
                      <span>{item.chunks} chunk(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "transfer" && (
            <>
              {exfilActive ? (
                <div className="p-3 bg-[hsl(0,100%,12%)] rounded border border-[hsl(0,100%,25%)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[hsl(0,100%,70%)]">Exfiltrating credentials.db...</span>
                    <Send className="w-4 h-4 text-[hsl(0,100%,50%)] animate-pulse" />
                  </div>
                  <Progress value={67} className="h-2 mb-2" />
                  <div className="grid grid-cols-2 gap-2 text-xs text-[hsl(0,60%,50%)]">
                    <span>Transferred: 1.6 MB / 2.4 MB</span>
                    <span className="text-right">ETA: ~45s</span>
                    <span>Method: DNS Tunneling</span>
                    <span className="text-right">Speed: 36 KB/s</span>
                    <span>Chunks sent: 8/12</span>
                    <span className="text-right">Packet loss: 0.2%</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-[hsl(0,60%,50%)]">
                  <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active transfers</p>
                </div>
              )}
              <Button onClick={() => setExfilActive(!exfilActive)} className={`w-full ${exfilActive ? "bg-red-600 hover:bg-red-700" : "bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]"}`}>
                {exfilActive ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {exfilActive ? "Abort Transfer" : "Start Exfiltration"}
              </Button>
            </>
          )}

          {activeTab === "history" && (
            <>
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Transfer History</div>
              {exfilHistory.map((item, i) => (
                <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[hsl(0,100%,85%)] font-mono">{item.file}</span>
                    <Badge className={item.status === "complete" ? "bg-green-600" : "bg-red-600"}>{item.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[hsl(0,60%,50%)]">
                    <span>{item.size} via {item.method} • {item.duration}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                  <div className="text-lg font-bold text-[hsl(0,100%,70%)]">8.6 KB</div>
                  <div className="text-xs text-[hsl(0,60%,50%)]">Total Transferred</div>
                </div>
                <div className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                  <div className="text-lg font-bold text-green-500">4</div>
                  <div className="text-xs text-[hsl(0,60%,50%)]">Files Exfiltrated</div>
                </div>
                <div className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                  <div className="text-lg font-bold text-yellow-500">1</div>
                  <div className="text-xs text-[hsl(0,60%,50%)]">Failed Transfers</div>
                </div>
                <div className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                  <div className="text-lg font-bold text-blue-400">0.2%</div>
                  <div className="text-xs text-[hsl(0,60%,50%)]">Avg Packet Loss</div>
                </div>
              </div>
              <div className="p-3 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                <div className="text-xs text-[hsl(0,60%,50%)] uppercase mb-2">Channel Usage</div>
                {["DNS Tunneling", "HTTPS POST", "ICMP"].map((ch) => (
                  <div key={ch} className="flex items-center justify-between py-1 text-xs">
                    <span className="text-[hsl(0,100%,85%)]">{ch}</span>
                    <Progress value={Math.random() * 100} className="w-24 h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExfiltratorPanel;
