import { useState } from "react";
import { Upload, Download, Cloud, Database, FileText, Image, Archive, Send, Settings, Play, Square, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const ExfiltratorPanel = () => {
  const [exfilActive, setExfilActive] = useState(false);
  const [encryptData, setEncryptData] = useState(true);
  const [steganography, setSteganography] = useState(false);

  const methods = [
    { id: "https", name: "HTTPS POST", port: 443, stealth: "High", speed: "Fast" },
    { id: "dns", name: "DNS Tunneling", port: 53, stealth: "Very High", speed: "Slow" },
    { id: "icmp", name: "ICMP Tunneling", port: 0, stealth: "High", speed: "Medium" },
    { id: "websocket", name: "WebSocket", port: 443, stealth: "High", speed: "Fast" },
    { id: "smtp", name: "SMTP (Email)", port: 25, stealth: "Medium", speed: "Medium" },
    { id: "ftp", name: "FTP/SFTP", port: 21, stealth: "Low", speed: "Fast" },
  ];

  const targetFiles = [
    { name: "credentials.db", size: "2.4 MB", type: "database", priority: "critical" },
    { name: "config.xml", size: "128 KB", type: "config", priority: "high" },
    { name: "users_export.csv", size: "5.8 MB", type: "data", priority: "high" },
    { name: "ssh_keys/", size: "45 KB", type: "keys", priority: "critical" },
    { name: "backup_2024.zip", size: "892 MB", type: "archive", priority: "medium" },
  ];

  const exfilHistory = [
    { file: "passwd", size: "4.2 KB", method: "DNS", status: "complete", time: "2m ago" },
    { file: "shadow", size: "2.8 KB", method: "DNS", status: "complete", time: "5m ago" },
    { file: "id_rsa", size: "1.6 KB", method: "HTTPS", status: "complete", time: "12m ago" },
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
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded bg-[hsl(0,100%,25%)]">
            <Upload className="w-4 h-4 text-[hsl(0,100%,70%)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(0,100%,85%)]">Data Exfiltration</h3>
            <p className="text-xs text-[hsl(0,60%,50%)]">Covert Data Transfer Simulator</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="config" className="p-3">
          <TabsList className="w-full bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,20%)]">
            <TabsTrigger value="config" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Settings className="w-3 h-3 mr-1" /> Config
            </TabsTrigger>
            <TabsTrigger value="targets" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <FileText className="w-3 h-3 mr-1" /> Targets
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Download className="w-3 h-3 mr-1" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-3 space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Exfiltration Method</label>
              <div className="space-y-1">
                {methods.map((method) => (
                  <label key={method.id} className="flex items-center gap-2 p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] cursor-pointer hover:border-[hsl(0,100%,30%)]">
                    <input type="radio" name="method" className="accent-[hsl(0,100%,50%)]" />
                    <div className="flex-1">
                      <span className="text-sm text-[hsl(0,100%,85%)]">{method.name}</span>
                      <div className="flex gap-2 text-xs text-[hsl(0,60%,50%)]">
                        <span>Port {method.port}</span>
                        <span>•</span>
                        <span>Stealth: {method.stealth}</span>
                      </div>
                    </div>
                    <Badge className="bg-[hsl(0,100%,20%)] text-[hsl(0,100%,70%)]">{method.speed}</Badge>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">C2 Server</label>
              <Input 
                placeholder="https://exfil.example.com"
                className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] font-mono"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[hsl(0,100%,70%)]" />
                  <span className="text-sm text-[hsl(0,100%,85%)]">Encrypt Data</span>
                </div>
                <Switch checked={encryptData} onCheckedChange={setEncryptData} />
              </div>

              <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-[hsl(0,100%,70%)]" />
                  <span className="text-sm text-[hsl(0,100%,85%)]">Steganography</span>
                </div>
                <Switch checked={steganography} onCheckedChange={setSteganography} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Chunk Size</label>
              <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                <option>512 bytes (Slow, Stealthy)</option>
                <option>4 KB (Medium)</option>
                <option>64 KB (Fast)</option>
                <option>1 MB (Very Fast)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Jitter (ms)</label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  defaultValue={100}
                  className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]"
                  placeholder="Min"
                />
                <Input 
                  type="number"
                  defaultValue={5000}
                  className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="p-2 bg-[hsl(45,100%,15%)] rounded border border-[hsl(45,100%,30%)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-200">Simulation mode - No actual data transfer</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="targets" className="mt-3 space-y-3">
            <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Target Files</div>
            <div className="space-y-2">
              {targetFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <input type="checkbox" className="accent-[hsl(0,100%,50%)]" defaultChecked={file.priority === "critical"} />
                  {getTypeIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[hsl(0,100%,85%)] truncate">{file.name}</div>
                    <div className="text-xs text-[hsl(0,60%,50%)]">{file.size}</div>
                  </div>
                  <Badge 
                    className={
                      file.priority === "critical" ? "bg-red-600" :
                      file.priority === "high" ? "bg-orange-600" : "bg-yellow-600"
                    }
                  >
                    {file.priority}
                  </Badge>
                </div>
              ))}
            </div>

            {exfilActive && (
              <div className="p-3 bg-[hsl(0,100%,12%)] rounded border border-[hsl(0,100%,25%)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[hsl(0,100%,70%)]">Exfiltrating credentials.db...</span>
                  <Send className="w-4 h-4 text-[hsl(0,100%,50%)] animate-pulse" />
                </div>
                <Progress value={67} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-[hsl(0,60%,50%)]">
                  <span>1.6 MB / 2.4 MB</span>
                  <span>~45s remaining</span>
                </div>
              </div>
            )}

            <Button 
              onClick={() => setExfilActive(!exfilActive)}
              className={`w-full ${exfilActive ? "bg-red-600 hover:bg-red-700" : "bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]"}`}
            >
              {exfilActive ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {exfilActive ? "Stop Exfiltration" : "Start Exfiltration"}
            </Button>
          </TabsContent>

          <TabsContent value="history" className="mt-3 space-y-3">
            <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Exfiltration History</div>
            <div className="space-y-2">
              {exfilHistory.map((item, i) => (
                <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[hsl(0,100%,85%)] font-mono">{item.file}</span>
                    <Badge className="bg-green-600">{item.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[hsl(0,60%,50%)]">
                    <span>{item.size} via {item.method}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[hsl(0,100%,10%)] rounded border border-[hsl(0,100%,20%)]">
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase mb-2">Session Stats</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[hsl(0,60%,50%)]">Total transferred:</span>
                  <span className="text-[hsl(0,100%,85%)]">8.6 KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(0,60%,50%)]">Files exfiltrated:</span>
                  <span className="text-green-500">3</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default ExfiltratorPanel;
