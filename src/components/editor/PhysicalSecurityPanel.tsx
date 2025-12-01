import { Shield, Radio, CreditCard, Key, Fingerprint, Camera, AlertTriangle, Lock, Unlock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const PhysicalSecurityPanel = () => {
  const [activeTab, setActiveTab] = useState<"badge" | "rfid" | "facility">("badge");

  const badgeCloning = [
    { id: "hid-prox", name: "HID ProxCard II", frequency: "125 kHz", difficulty: "Easy", status: "captured" },
    { id: "mifare-classic", name: "MIFARE Classic 1K", frequency: "13.56 MHz", difficulty: "Medium", status: "cloning" },
    { id: "legic-prime", name: "LEGIC Prime", frequency: "13.56 MHz", difficulty: "Hard", status: "analyzing" },
    { id: "indala", name: "Indala FlexCard", frequency: "125 kHz", difficulty: "Easy", status: "ready" },
  ];

  const rfidAttacks = [
    { technique: "Relay Attack", target: "Vehicle Key Fob", range: "300m", success: 78 },
    { technique: "RFID Skimming", target: "Payment Cards", range: "10cm", success: 92 },
    { technique: "Tag Cloning", target: "Access Badges", range: "5cm", success: 85 },
    { technique: "Jamming Attack", target: "Wireless Locks", range: "50m", success: 67 },
  ];

  const facilityBypass = [
    { method: "Tailgating", description: "Following authorized personnel", risk: "high", detectable: 45 },
    { method: "Piggybacking", description: "Forced entry with authorized user", risk: "critical", detectable: 68 },
    { method: "Lock Bumping", description: "Pin tumbler lock manipulation", risk: "medium", detectable: 23 },
    { method: "RFID Cloning", description: "Badge duplication and replay", risk: "high", detectable: 54 },
    { method: "Social Engineering", description: "Impersonation and pretexting", risk: "critical", detectable: 72 },
  ];

  return (
    <div className="h-full flex flex-col bg-panel-bg text-text-primary overflow-hidden">
      {/* Safety Banner */}
      <div className="bg-yellow-900/20 border-b border-yellow-700/50 px-4 py-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
        <span className="text-xs text-yellow-400 font-medium">
          SIMULATION MODE: Physical Security Training Environment - Educational Purposes Only
        </span>
      </div>

      {/* Header */}
      <div className="border-b border-panel-border px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold">Physical Security Testing</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("badge")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === "badge"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Badge Cloning
          </button>
          <button
            onClick={() => setActiveTab("rfid")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === "rfid"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            RFID Attacks
          </button>
          <button
            onClick={() => setActiveTab("facility")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              activeTab === "facility"
                ? "bg-primary text-primary-foreground"
                : "bg-sidebar-hover text-text-secondary hover:text-text-primary"
            }`}
          >
            Facility Bypass
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {activeTab === "badge" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">Access Card Emulation</h3>
              </div>
              <div className="space-y-2">
                {badgeCloning.map((badge) => (
                  <Card key={badge.id} className="bg-sidebar-bg border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{badge.name}</div>
                        <div className="text-xs text-text-muted">{badge.frequency}</div>
                      </div>
                      <Badge variant={badge.status === "captured" ? "default" : "secondary"} className="text-xs">
                        {badge.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Difficulty: {badge.difficulty}</span>
                      <button className="px-2 py-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                        Simulate Clone
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold">Captured Credentials</h3>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-text-secondary">ID: 0007A45BC3 | Site: CORP-HQ-WEST</div>
                <div className="text-text-secondary">ID: 0009F12E87 | Site: LAB-BUILDING-2</div>
                <div className="text-text-secondary">ID: 000BC34A91 | Site: DATA-CENTER-1</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "rfid" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold">RFID Attack Vectors</h3>
              </div>
              <div className="space-y-3">
                {rfidAttacks.map((attack, idx) => (
                  <div key={idx} className="bg-sidebar-bg rounded border border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{attack.technique}</div>
                        <div className="text-xs text-text-muted">Target: {attack.target}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {attack.range}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Success Rate</span>
                        <span className="text-text-primary font-medium">{attack.success}%</span>
                      </div>
                      <Progress value={attack.success} className="h-1.5" />
                    </div>
                    <button className="w-full mt-2 px-2 py-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs">
                      Run Simulation
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold">Hardware Tools</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-primary">Proxmark3 RDV4</span>
                  <Badge variant="default" className="text-xs">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-primary">Chameleon Mini RevG</span>
                  <Badge variant="secondary" className="text-xs">Standby</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-primary">HackRF One</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "facility" && (
          <>
            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold">Access Control Bypass Methods</h3>
              </div>
              <div className="space-y-3">
                {facilityBypass.map((method, idx) => (
                  <Card key={idx} className="bg-sidebar-bg border-border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary mb-1">{method.method}</div>
                        <div className="text-xs text-text-muted">{method.description}</div>
                      </div>
                      <Badge 
                        variant={method.risk === "critical" ? "destructive" : "secondary"}
                        className="text-xs ml-2"
                      >
                        {method.risk}
                      </Badge>
                    </div>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Detectability</span>
                        <span className="text-text-primary font-medium">{method.detectable}%</span>
                      </div>
                      <Progress value={method.detectable} className="h-1.5" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-editor-bg rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold">Surveillance Awareness</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-secondary">CCTV Coverage</span>
                  <span className="text-text-primary">87% facility</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-secondary">Guard Patrol Routes</span>
                  <span className="text-text-primary">12-min intervals</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-secondary">Access Logs</span>
                  <span className="text-text-primary">Real-time monitoring</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-sidebar-bg rounded">
                  <span className="text-text-secondary">Blind Spots Identified</span>
                  <span className="text-green-400">7 locations</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-panel-border px-4 py-2 bg-statusbar-bg">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Physical Security Assessment Mode</span>
          <div className="flex items-center gap-2">
            <Unlock className="w-3 h-3 text-yellow-500" />
            <span className="text-yellow-500">Training Environment Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalSecurityPanel;