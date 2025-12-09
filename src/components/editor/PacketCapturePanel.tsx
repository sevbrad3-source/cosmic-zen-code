import { useState, useEffect, useRef } from "react";
import { Play, Square, Download, Filter, Wifi, Shield, AlertTriangle, Eye, Zap, Radio, Globe, Lock, Unlock, Search, Layers, Activity, Clock, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Packet {
  id: string;
  timestamp: string;
  src: string;
  srcPort: number;
  dst: string;
  dstPort: number;
  protocol: string;
  length: number;
  info: string;
  flags?: string[];
  payload?: string;
  encrypted: boolean;
  suspicious: boolean;
  layer: "L2" | "L3" | "L4" | "L7";
}

interface ProtocolStats {
  name: string;
  count: number;
  bytes: number;
  percentage: number;
}

const PacketCapturePanel = () => {
  const [isCapturing, setIsCapturing] = useState(true);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [filter, setFilter] = useState("");
  const [protocolStats, setProtocolStats] = useState<ProtocolStats[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const packetIdRef = useRef(0);

  const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "SSH", "SMB", "RDP", "LDAP", "Kerberos", "ICMP", "ARP"];
  const srcIPs = ["192.168.1.10", "192.168.1.25", "10.10.14.5", "203.0.113.10", "192.168.1.100", "172.16.0.5"];
  const dstIPs = ["192.168.1.1", "192.168.1.20", "8.8.8.8", "203.0.113.1", "192.168.1.30", "10.10.10.100"];

  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      const newPacket = generatePacket();
      setPackets(prev => {
        const updated = [...prev, newPacket].slice(-500);
        updateStats(updated);
        return updated;
      });
    }, 50 + Math.random() * 150);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const generatePacket = (): Packet => {
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const src = srcIPs[Math.floor(Math.random() * srcIPs.length)];
    const dst = dstIPs[Math.floor(Math.random() * dstIPs.length)];
    const srcPort = Math.floor(Math.random() * 60000) + 1024;
    const dstPort = getPortForProtocol(protocol);
    const isSuspicious = Math.random() > 0.92;
    const isEncrypted = ["HTTPS", "SSH", "RDP", "Kerberos"].includes(protocol);

    packetIdRef.current++;

    return {
      id: `PKT-${packetIdRef.current.toString().padStart(6, '0')}`,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      src,
      srcPort,
      dst,
      dstPort,
      protocol,
      length: Math.floor(Math.random() * 1400) + 64,
      info: getPacketInfo(protocol, isSuspicious),
      flags: protocol === "TCP" ? getTCPFlags() : undefined,
      payload: Math.random() > 0.5 ? generatePayload(protocol, isEncrypted) : undefined,
      encrypted: isEncrypted,
      suspicious: isSuspicious,
      layer: getLayer(protocol)
    };
  };

  const getPortForProtocol = (protocol: string): number => {
    const ports: Record<string, number> = {
      HTTP: 80, HTTPS: 443, SSH: 22, DNS: 53, SMB: 445,
      RDP: 3389, LDAP: 389, Kerberos: 88, ICMP: 0, ARP: 0
    };
    return ports[protocol] || Math.floor(Math.random() * 1000) + 1;
  };

  const getLayer = (protocol: string): "L2" | "L3" | "L4" | "L7" => {
    if (["ARP"].includes(protocol)) return "L2";
    if (["ICMP"].includes(protocol)) return "L3";
    if (["TCP", "UDP"].includes(protocol)) return "L4";
    return "L7";
  };

  const getTCPFlags = (): string[] => {
    const allFlags = ["SYN", "ACK", "FIN", "RST", "PSH", "URG"];
    const numFlags = Math.floor(Math.random() * 3) + 1;
    return allFlags.sort(() => Math.random() - 0.5).slice(0, numFlags);
  };

  const getPacketInfo = (protocol: string, suspicious: boolean): string => {
    const infos: Record<string, string[]> = {
      HTTP: ["GET /api/v1/users HTTP/1.1", "POST /login HTTP/1.1", "GET /admin/config HTTP/1.1", "PUT /api/data HTTP/1.1"],
      HTTPS: ["TLS 1.3 Application Data", "TLS Handshake: Client Hello", "TLS Encrypted Alert", "Application Data [Encrypted]"],
      DNS: ["Standard query A corp.local", "Standard query response A 192.168.1.10", "Standard query PTR 10.1.168.192.in-addr.arpa"],
      SSH: ["SSH-2.0-OpenSSH_8.9 connection established", "Encrypted packet", "Key exchange init"],
      SMB: ["SMB2 NEGOTIATE Request", "SMB2 SESSION_SETUP Request", "SMB2 TREE_CONNECT Request", "SMB2 CREATE Request"],
      TCP: ["[SYN] Seq=0 Win=65535", "[SYN, ACK] Seq=0 Ack=1 Win=65535", "[ACK] Seq=1 Ack=1"],
      UDP: ["Source port: 53 Destination port: 53", "UDP Payload: 512 bytes"],
      RDP: ["RDP Connection Request", "Encrypted RDP Session Data", "RDP Graphics Update PDU"],
      LDAP: ["searchRequest(10) \"DC=corp,DC=local\"", "bindRequest(1) name=\"CN=admin\"", "searchResEntry(10)"],
      Kerberos: ["AS-REQ: TGT Request", "AS-REP: TGT Response", "TGS-REQ: Service Ticket Request"],
      ICMP: ["Echo (ping) request id=0x0001", "Echo (ping) reply id=0x0001", "Destination unreachable"],
      ARP: ["Who has 192.168.1.1? Tell 192.168.1.100", "192.168.1.1 is at 00:1a:2b:3c:4d:01"]
    };
    const baseInfo = infos[protocol]?.[Math.floor(Math.random() * (infos[protocol]?.length || 1))] || "Unknown";
    return suspicious ? `⚠ ANOMALY: ${baseInfo}` : baseInfo;
  };

  const generatePayload = (protocol: string, encrypted: boolean): string => {
    if (encrypted) return "[ Encrypted Data - Unable to decode ]";
    const samples = [
      "GET /api/users HTTP/1.1\\r\\nHost: corp.local\\r\\n",
      "{\"username\":\"admin\",\"token\":\"eyJhbGciOiJIUzI1NiIs\"}",
      "SELECT * FROM users WHERE id=1; DROP TABLE--",
      "cmd.exe /c whoami && net user",
      "POST /shell.php HTTP/1.1\\r\\nContent-Type: application/x-www-form-urlencoded"
    ];
    return samples[Math.floor(Math.random() * samples.length)];
  };

  const updateStats = (pkts: Packet[]) => {
    const stats: Record<string, { count: number; bytes: number }> = {};
    pkts.forEach(p => {
      if (!stats[p.protocol]) stats[p.protocol] = { count: 0, bytes: 0 };
      stats[p.protocol].count++;
      stats[p.protocol].bytes += p.length;
    });
    const total = Object.values(stats).reduce((acc, s) => acc + s.count, 0);
    setProtocolStats(
      Object.entries(stats)
        .map(([name, s]) => ({ name, ...s, percentage: (s.count / total) * 100 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    );
  };

  const filteredPackets = packets.filter(p => 
    !filter || 
    p.src.includes(filter) || 
    p.dst.includes(filter) || 
    p.protocol.toLowerCase().includes(filter.toLowerCase()) ||
    p.info.toLowerCase().includes(filter.toLowerCase())
  );

  const getProtocolColor = (protocol: string) => {
    const colors: Record<string, string> = {
      HTTP: "text-blue-400", HTTPS: "text-green-400", SSH: "text-purple-400",
      DNS: "text-yellow-400", SMB: "text-orange-400", TCP: "text-cyan-400",
      UDP: "text-teal-400", RDP: "text-pink-400", LDAP: "text-indigo-400",
      Kerberos: "text-amber-400", ICMP: "text-gray-400", ARP: "text-lime-400"
    };
    return colors[protocol] || "text-text-primary";
  };

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div className="p-2 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCapturing(!isCapturing)}
            className={`h-7 px-3 rounded text-xs font-medium flex items-center gap-1.5 ${
              isCapturing ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary-hover text-primary-foreground"
            }`}
          >
            {isCapturing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isCapturing ? "Stop" : "Start"}
          </button>
          <button className="h-7 px-3 bg-sidebar-hover rounded text-xs flex items-center gap-1.5 text-text-secondary hover:text-text-primary">
            <Download className="w-3 h-3" />
            Export PCAP
          </button>
          <div className="flex-1 relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter: ip.src == 192.168.1.10 && tcp.port == 443"
              className="h-7 text-xs pl-7 font-mono"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
            <span className="text-text-secondary">Packets: <span className="text-text-primary font-mono">{packets.length}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-blue-400" />
            <span className="text-text-secondary">Bytes: <span className="text-text-primary font-mono">{(packets.reduce((a, p) => a + p.length, 0) / 1024).toFixed(1)}KB</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-yellow-500" />
            <span className="text-text-secondary">Anomalies: <span className="text-destructive font-mono">{packets.filter(p => p.suspicious).length}</span></span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="packets" className="flex-1 flex flex-col">
        <TabsList className="px-2 h-8 bg-transparent border-b border-border rounded-none justify-start">
          <TabsTrigger value="packets" className="text-xs h-6 data-[state=active]:bg-primary/20">Packet List</TabsTrigger>
          <TabsTrigger value="protocols" className="text-xs h-6 data-[state=active]:bg-primary/20">Protocol Analysis</TabsTrigger>
          <TabsTrigger value="details" className="text-xs h-6 data-[state=active]:bg-primary/20">Packet Details</TabsTrigger>
        </TabsList>

        <TabsContent value="packets" className="flex-1 p-0 mt-0">
          <div className="h-6 flex items-center text-xs font-medium bg-sidebar-bg border-b border-border px-2">
            <span className="w-16">Time</span>
            <span className="w-28">Source</span>
            <span className="w-28">Destination</span>
            <span className="w-16">Protocol</span>
            <span className="w-12">Len</span>
            <span className="flex-1">Info</span>
          </div>
          <ScrollArea className="flex-1 h-[calc(100%-24px)]" ref={scrollRef}>
            <div className="divide-y divide-border/30">
              {filteredPackets.slice(-100).map((pkt) => (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`h-6 flex items-center text-xs px-2 cursor-pointer hover:bg-sidebar-hover transition-colors ${
                    selectedPacket?.id === pkt.id ? "bg-primary/20" : ""
                  } ${pkt.suspicious ? "bg-destructive/10" : ""}`}
                >
                  <span className="w-16 font-mono text-text-muted">{pkt.timestamp}</span>
                  <span className="w-28 font-mono truncate">{pkt.src}:{pkt.srcPort}</span>
                  <span className="w-28 font-mono truncate">{pkt.dst}:{pkt.dstPort}</span>
                  <span className={`w-16 font-mono font-medium ${getProtocolColor(pkt.protocol)}`}>{pkt.protocol}</span>
                  <span className="w-12 font-mono text-text-muted">{pkt.length}</span>
                  <span className="flex-1 truncate flex items-center gap-1.5">
                    {pkt.encrypted && <Lock className="w-3 h-3 text-green-500 flex-shrink-0" />}
                    {pkt.suspicious && <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                    <span className="truncate">{pkt.info}</span>
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="protocols" className="flex-1 p-2 mt-0 overflow-auto">
          <div className="space-y-3">
            <div className="text-xs text-text-muted uppercase tracking-wide">Protocol Distribution</div>
            {protocolStats.map((stat) => (
              <div key={stat.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-mono font-medium ${getProtocolColor(stat.name)}`}>{stat.name}</span>
                  <span className="text-text-muted">{stat.count} pkts ({(stat.bytes / 1024).toFixed(1)}KB)</span>
                </div>
                <Progress value={stat.percentage} className="h-1.5" />
              </div>
            ))}
            <div className="mt-4 p-3 bg-sidebar-bg rounded border border-border">
              <div className="text-xs text-text-muted uppercase mb-2">Deep Packet Inspection</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between"><span className="text-text-secondary">TLS Handshakes:</span><span className="font-mono">47</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">HTTP Requests:</span><span className="font-mono">234</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">DNS Queries:</span><span className="font-mono">128</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">SMB Sessions:</span><span className="font-mono">12</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Cleartext Creds:</span><span className="font-mono text-destructive">3</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Suspicious:</span><span className="font-mono text-yellow-500">{packets.filter(p => p.suspicious).length}</span></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="flex-1 p-2 mt-0 overflow-auto">
          {selectedPacket ? (
            <div className="space-y-3">
              <div className="p-2 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">Frame {selectedPacket.id}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-text-muted">Timestamp:</span> <span className="font-mono">{selectedPacket.timestamp}</span></div>
                  <div><span className="text-text-muted">Length:</span> <span className="font-mono">{selectedPacket.length} bytes</span></div>
                  <div><span className="text-text-muted">Protocol:</span> <span className={`font-mono ${getProtocolColor(selectedPacket.protocol)}`}>{selectedPacket.protocol}</span></div>
                  <div><span className="text-text-muted">Layer:</span> <span className="font-mono">{selectedPacket.layer}</span></div>
                </div>
              </div>
              <div className="p-2 bg-sidebar-bg rounded border border-border">
                <div className="text-xs text-text-muted uppercase mb-2">IP Layer</div>
                <div className="space-y-1 text-xs">
                  <div><span className="text-text-muted">Source:</span> <span className="font-mono">{selectedPacket.src}:{selectedPacket.srcPort}</span></div>
                  <div><span className="text-text-muted">Destination:</span> <span className="font-mono">{selectedPacket.dst}:{selectedPacket.dstPort}</span></div>
                </div>
              </div>
              {selectedPacket.flags && (
                <div className="p-2 bg-sidebar-bg rounded border border-border">
                  <div className="text-xs text-text-muted uppercase mb-2">TCP Flags</div>
                  <div className="flex gap-1 flex-wrap">
                    {selectedPacket.flags.map(f => (
                      <Badge key={f} variant="outline" className="text-xs h-5">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedPacket.payload && (
                <div className="p-2 bg-sidebar-bg rounded border border-border">
                  <div className="text-xs text-text-muted uppercase mb-2">Payload</div>
                  <pre className="text-xs font-mono text-syntax-string bg-editor-bg p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                    {selectedPacket.payload}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-text-muted">
              Select a packet to view details
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PacketCapturePanel;
