import { useState } from "react";
import { Wifi, Radio, Signal, Zap, Lock, Unlock, AlertTriangle, Play, Square, RotateCcw, Settings, Target, Antenna, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const WirelessAttackPanel = () => {
  const [scanActive, setScanActive] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [attackProgress, setAttackProgress] = useState(0);

  const networks = [
    { ssid: "Corp-WiFi-5G", bssid: "AA:BB:CC:DD:EE:01", channel: 36, signal: -45, encryption: "WPA3", clients: 24, vendor: "Cisco" },
    { ssid: "Guest-Network", bssid: "AA:BB:CC:DD:EE:02", channel: 6, signal: -52, encryption: "WPA2", clients: 8, vendor: "Ubiquiti" },
    { ssid: "IoT-Devices", bssid: "AA:BB:CC:DD:EE:03", channel: 11, signal: -58, encryption: "WPA2", clients: 15, vendor: "TP-Link" },
    { ssid: "Hidden", bssid: "AA:BB:CC:DD:EE:04", channel: 1, signal: -67, encryption: "WEP", clients: 2, vendor: "Unknown" },
    { ssid: "SecureNet-Corp", bssid: "AA:BB:CC:DD:EE:05", channel: 44, signal: -71, encryption: "WPA3-Enterprise", clients: 45, vendor: "Aruba" },
  ];

  const attacks = [
    { name: "Deauth Attack", description: "Disconnect clients from target AP", risk: "high" },
    { name: "Evil Twin", description: "Create rogue AP mimicking target", risk: "critical" },
    { name: "PMKID Capture", description: "Capture PMKID for offline cracking", risk: "medium" },
    { name: "Handshake Capture", description: "Capture 4-way handshake", risk: "medium" },
    { name: "Karma Attack", description: "Respond to all probe requests", risk: "high" },
    { name: "KRACK Attack", description: "Key Reinstallation Attack", risk: "critical" },
  ];

  const getSignalStrength = (signal: number) => {
    if (signal > -50) return { color: "text-green-500", label: "Excellent" };
    if (signal > -60) return { color: "text-yellow-500", label: "Good" };
    if (signal > -70) return { color: "text-orange-500", label: "Fair" };
    return { color: "text-red-500", label: "Weak" };
  };

  const getEncryptionIcon = (encryption: string) => {
    if (encryption.includes("WPA3")) return <Lock className="w-3 h-3 text-green-500" />;
    if (encryption.includes("WPA2")) return <Lock className="w-3 h-3 text-yellow-500" />;
    return <Unlock className="w-3 h-3 text-red-500" />;
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(0,10%,5%)]">
      <div className="p-3 border-b border-[hsl(0,100%,20%)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded bg-[hsl(0,100%,25%)]">
            <Wifi className="w-4 h-4 text-[hsl(0,100%,70%)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(0,100%,85%)]">Wireless Attack Toolkit</h3>
            <p className="text-xs text-[hsl(0,60%,50%)]">802.11 Network Exploitation</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="scan" className="p-3">
          <TabsList className="w-full bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,20%)]">
            <TabsTrigger value="scan" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Radio className="w-3 h-3 mr-1" /> Scan
            </TabsTrigger>
            <TabsTrigger value="attack" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Zap className="w-3 h-3 mr-1" /> Attack
            </TabsTrigger>
            <TabsTrigger value="rogue" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Antenna className="w-3 h-3 mr-1" /> Rogue AP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => setScanActive(!scanActive)}
                className={scanActive ? "bg-red-600 hover:bg-red-700" : "bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]"}
              >
                {scanActive ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {scanActive ? "Stop" : "Scan"}
              </Button>
              <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                <RotateCcw className="w-3 h-3 mr-1" /> Refresh
              </Button>
              <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                <Settings className="w-3 h-3" />
              </Button>
            </div>

            {scanActive && (
              <div className="p-2 bg-[hsl(0,100%,15%)] rounded border border-[hsl(0,100%,25%)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[hsl(0,100%,70%)]">Scanning channels...</span>
                  <Signal className="w-3 h-3 text-[hsl(0,100%,50%)] animate-pulse" />
                </div>
                <Progress value={65} className="h-1" />
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase tracking-wide">
                Discovered Networks ({networks.length})
              </div>
              {networks.map((network, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedNetwork(network.ssid)}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    selectedNetwork === network.ssid
                      ? "bg-[hsl(0,100%,15%)] border-[hsl(0,100%,40%)]"
                      : "bg-[hsl(0,100%,8%)] border-[hsl(0,100%,20%)] hover:border-[hsl(0,100%,30%)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getEncryptionIcon(network.encryption)}
                      <span className="text-sm font-medium text-[hsl(0,100%,85%)]">
                        {network.ssid === "Hidden" ? "<Hidden SSID>" : network.ssid}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                      CH {network.channel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[hsl(0,60%,50%)] font-mono">{network.bssid}</span>
                    <div className="flex items-center gap-2">
                      <span className={getSignalStrength(network.signal).color}>
                        {network.signal} dBm
                      </span>
                      <span className="text-[hsl(0,60%,50%)]">{network.clients} clients</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <Badge className="bg-[hsl(0,100%,20%)] text-[hsl(0,100%,70%)]">{network.encryption}</Badge>
                    <span className="text-[hsl(0,60%,50%)]">{network.vendor}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attack" className="mt-3 space-y-3">
            {selectedNetwork ? (
              <>
                <div className="p-2 bg-[hsl(0,100%,12%)] rounded border border-[hsl(0,100%,25%)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-[hsl(0,100%,50%)]" />
                    <span className="text-sm font-medium text-[hsl(0,100%,85%)]">Target: {selectedNetwork}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {attacks.map((attack, i) => (
                    <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[hsl(0,100%,85%)]">{attack.name}</span>
                        <Badge 
                          className={
                            attack.risk === "critical" ? "bg-red-600" : 
                            attack.risk === "high" ? "bg-orange-600" : "bg-yellow-600"
                          }
                        >
                          {attack.risk}
                        </Badge>
                      </div>
                      <p className="text-xs text-[hsl(0,60%,50%)] mb-2">{attack.description}</p>
                      <Button size="sm" className="w-full bg-[hsl(0,100%,25%)] hover:bg-[hsl(0,100%,30%)]">
                        <Zap className="w-3 h-3 mr-1" /> Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-[hsl(0,60%,50%)]">
                <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a target network from the scan tab</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rogue" className="mt-3 space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">SSID to Clone</label>
              <Input 
                placeholder="Target SSID" 
                className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Interface</label>
              <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                <option>wlan0</option>
                <option>wlan1</option>
                <option>wlan0mon</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Channel</label>
              <Input 
                type="number" 
                defaultValue={6}
                className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)]"
              />
            </div>
            <div className="flex items-center gap-2 p-2 bg-[hsl(45,100%,15%)] rounded border border-[hsl(45,100%,30%)]">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-yellow-200">This creates a rogue access point for testing</span>
            </div>
            <Button className="w-full bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]">
              <Antenna className="w-4 h-4 mr-2" /> Deploy Rogue AP
            </Button>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default WirelessAttackPanel;
