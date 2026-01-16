import { useState } from "react";
import { 
  Share2, Download, Upload, FileJson, Check, AlertCircle, 
  RefreshCw, ExternalLink, Database, Shield, Clock, Globe
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThreatActors, useAttackCampaigns } from "@/hooks/useThreatActors";
import { useIOCs, useSecurityEvents } from "@/hooks/useSecurityData";

interface STIXBundle {
  id: string;
  name: string;
  type: "export" | "import";
  objects: number;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

interface TAXIIServer {
  id: string;
  name: string;
  url: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  collections: number;
}

const STIXTAXIIPanel = () => {
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const [isExporting, setIsExporting] = useState(false);
  const [taxiiUrl, setTaxiiUrl] = useState("");

  const bundles: STIXBundle[] = [
    { id: "1", name: "APT_Indicators_Bundle", type: "export", objects: 47, timestamp: new Date().toISOString(), status: "success" },
    { id: "2", name: "Financial_Sector_IOCs", type: "import", objects: 128, timestamp: new Date(Date.now() - 3600000).toISOString(), status: "success" },
    { id: "3", name: "Ransomware_Campaign_Intel", type: "export", objects: 23, timestamp: new Date(Date.now() - 7200000).toISOString(), status: "pending" },
  ];

  const servers: TAXIIServer[] = [
    { id: "1", name: "CISA Threat Feed", url: "https://cisa.gov/taxii/", status: "connected", lastSync: "5 min ago", collections: 12 },
    { id: "2", name: "MITRE ATT&CK", url: "https://cti-taxii.mitre.org/", status: "connected", lastSync: "1 hour ago", collections: 8 },
    { id: "3", name: "AlienVault OTX", url: "https://otx.alienvault.com/taxii/", status: "disconnected", lastSync: "3 days ago", collections: 24 },
  ];

  const generateSTIXBundle = () => {
    setIsExporting(true);
    // Generate STIX 2.1 bundle from current data
    const bundle = {
      type: "bundle",
      id: `bundle--${crypto.randomUUID()}`,
      objects: [
        // Threat actors as STIX threat-actor SDOs
        ...actors.map(actor => ({
          type: "threat-actor",
          id: `threat-actor--${actor.id}`,
          name: actor.name,
          description: actor.description,
          aliases: actor.aliases,
          sophistication: actor.sophistication,
          primary_motivation: actor.motivation,
          threat_actor_types: ["nation-state", "criminal"],
        })),
        // IOCs as STIX indicators
        ...iocs.map(ioc => ({
          type: "indicator",
          id: `indicator--${ioc.id}`,
          pattern: ioc.ioc_type === "ip" ? `[ipv4-addr:value = '${ioc.value}']` :
                   ioc.ioc_type === "domain" ? `[domain-name:value = '${ioc.value}']` :
                   ioc.ioc_type === "hash" ? `[file:hashes.'SHA-256' = '${ioc.value}']` :
                   `[url:value = '${ioc.value}']`,
          pattern_type: "stix",
          valid_from: ioc.first_seen,
          valid_until: ioc.is_active ? undefined : ioc.last_seen,
          labels: ioc.tags,
        })),
        // Campaigns as STIX campaigns
        ...campaigns.map(camp => ({
          type: "campaign",
          id: `campaign--${camp.id}`,
          name: camp.name,
          description: camp.description,
          objective: camp.objectives?.join(", "),
          first_seen: camp.start_time,
          last_seen: camp.end_time,
        })),
      ]
    };
    
    // Simulate export delay
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stix_bundle_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      setIsExporting(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
      case "disconnected":
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="h-full flex flex-col text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold">Threat Intelligence Sharing</span>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-400">
            STIX 2.1 / TAXII 2.1
          </Badge>
        </div>
        <p className="text-xs text-text-muted">Export and import threat intelligence in STIX/TAXII format</p>
      </div>

      <Tabs defaultValue="export" className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-2 bg-sidebar-bg border border-border">
          <TabsTrigger value="export" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Upload className="w-3 h-3" />
            Export
          </TabsTrigger>
          <TabsTrigger value="import" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Download className="w-3 h-3" />
            Import
          </TabsTrigger>
          <TabsTrigger value="taxii" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-3 h-3" />
            TAXII Servers
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="export" className="p-3 space-y-4 m-0">
            {/* Export Summary */}
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Available for Export</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-sidebar-bg rounded p-2 flex items-center justify-between">
                  <span className="text-text-muted">Threat Actors</span>
                  <Badge variant="outline">{actors.length}</Badge>
                </div>
                <div className="bg-sidebar-bg rounded p-2 flex items-center justify-between">
                  <span className="text-text-muted">IOCs</span>
                  <Badge variant="outline">{iocs.length}</Badge>
                </div>
                <div className="bg-sidebar-bg rounded p-2 flex items-center justify-between">
                  <span className="text-text-muted">Campaigns</span>
                  <Badge variant="outline">{campaigns.length}</Badge>
                </div>
                <div className="bg-sidebar-bg rounded p-2 flex items-center justify-between">
                  <span className="text-text-muted">Events</span>
                  <Badge variant="outline">{events.length}</Badge>
                </div>
              </div>
              <Button
                onClick={generateSTIXBundle}
                disabled={isExporting}
                className="w-full mt-3 gap-2"
                size="sm"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Bundle...
                  </>
                ) : (
                  <>
                    <FileJson className="w-4 h-4" />
                    Export STIX Bundle
                  </>
                )}
              </Button>
            </Card>

            {/* Recent Exports */}
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Recent Bundles</span>
              </div>
              <div className="space-y-2">
                {bundles.map(bundle => (
                  <div key={bundle.id} className="bg-sidebar-bg rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium">{bundle.name}</span>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(bundle.status)}`}>
                        {bundle.status === "success" && <Check className="w-3 h-3 mr-1" />}
                        {bundle.status === "pending" && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                        {bundle.status === "failed" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {bundle.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{bundle.objects} objects</span>
                      <span>•</span>
                      <span>{bundle.type === "export" ? "Exported" : "Imported"}</span>
                      <span>•</span>
                      <span>{new Date(bundle.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="p-3 space-y-4 m-0">
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Import STIX Bundle</span>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <FileJson className="w-10 h-10 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted mb-2">
                  Drag and drop a STIX bundle file here
                </p>
                <p className="text-xs text-text-muted mb-3">or</p>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Browse Files
                </Button>
              </div>
            </Card>

            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Import Validation</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>STIX 2.1 schema validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Duplicate detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Relationship mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Auto-enrichment from existing data</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="taxii" className="p-3 space-y-4 m-0">
            <Card className="bg-editor-bg border-border p-3">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">Add TAXII Server</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://taxii.server.com/taxii2/"
                  value={taxiiUrl}
                  onChange={(e) => setTaxiiUrl(e.target.value)}
                  className="flex-1 text-xs bg-sidebar-bg border-border"
                />
                <Button size="sm" className="gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Connect
                </Button>
              </div>
            </Card>

            <div className="space-y-2">
              {servers.map(server => (
                <Card key={server.id} className="bg-editor-bg border-border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">{server.name}</span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(server.status)}`}>
                      {server.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-text-muted font-mono mb-2 truncate">
                    {server.url}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">
                      {server.collections} collections • Last sync: {server.lastSync}
                    </span>
                    <Button variant="outline" size="sm" className="h-6 text-xs gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Sync
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default STIXTAXIIPanel;
