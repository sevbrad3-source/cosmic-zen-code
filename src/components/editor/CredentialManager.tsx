import { useState } from "react";
import { Key, Search, Copy, Eye, EyeOff, Filter, Activity, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "vault", icon: Key, label: "Vault" },
  { id: "sources", icon: Database, label: "Sources" },
  { id: "audit", icon: Activity, label: "Audit" },
];

const CredentialManager = () => {
  const [activeTab, setActiveTab] = useState("vault");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const credentials = [
    { id: 1, type: "password", username: "admin", password: "P@ssw0rd123!", source: "192.168.1.100", service: "SSH", timestamp: "2024-03-15 14:23", strength: "weak" },
    { id: 2, type: "ssh_key", username: "root", key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...", source: "192.168.1.105", service: "SSH", timestamp: "2024-03-15 15:45", strength: "strong" },
    { id: 3, type: "token", username: "api_service", token: "sk_live_51HT7KaLkjsdf892343kljsdf", source: "api.example.com", service: "API", timestamp: "2024-03-15 16:12", strength: "medium" },
    { id: 4, type: "password", username: "dbuser", password: "mysql_prod_2024", source: "192.168.1.110", service: "MySQL", timestamp: "2024-03-15 14:30", strength: "medium" },
    { id: 5, type: "hash", username: "john.doe", hash: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", source: "web.example.com", service: "Web App", timestamp: "2024-03-15 15:20", strength: "unknown" },
  ];

  const togglePasswordVisibility = (id: number) => setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || cred.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const strengthCounts = {
    strong: credentials.filter((c) => c.strength === "strong").length,
    medium: credentials.filter((c) => c.strength === "medium").length,
    weak: credentials.filter((c) => c.strength === "weak").length,
  };

  const renderVault = () => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search credentials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="password">Passwords</SelectItem>
            <SelectItem value="ssh_key">SSH Keys</SelectItem>
            <SelectItem value="token">Tokens</SelectItem>
            <SelectItem value="hash">Hashes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCredentials.map((cred) => (
        <Card key={cred.id} className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{cred.type.replace("_", " ").toUpperCase()}</Badge>
              <span className="text-xs text-muted-foreground">{cred.service}</span>
            </div>
            <span className="text-xs text-muted-foreground">{cred.timestamp}</span>
          </div>
          <div className="text-sm font-mono mb-2">{cred.username}@{cred.source}</div>
          <div className="bg-muted/50 rounded p-2 font-mono text-xs break-all relative group">
            {cred.type === "password" && <span>{showPasswords[cred.id] ? cred.password : "••••••••••••"}</span>}
            {cred.type === "ssh_key" && <span>{showPasswords[cred.id] ? cred.key : "••••• SSH PRIVATE KEY •••••"}</span>}
            {cred.type === "token" && <span>{showPasswords[cred.id] ? cred.token : "••••••••••••••••••••••••"}</span>}
            {cred.type === "hash" && <span>{cred.hash}</span>}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {cred.type !== "hash" && (
                <Button size="sm" variant="secondary" className="h-6 w-6 p-0" onClick={() => togglePasswordVisibility(cred.id)}>
                  {showPasswords[cred.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              )}
              <Button size="sm" variant="secondary" className="h-6 w-6 p-0" onClick={() => copyToClipboard(cred.password || cred.key || cred.token || cred.hash || "") }>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSources = () => (
    <div className="space-y-2">
      {["SSH", "API", "Web App", "MySQL"].map((source) => (
        <Card key={source} className="p-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{source}</div>
            <div className="text-xs text-muted-foreground">Collection pipeline active</div>
          </div>
          <Badge variant="secondary">{credentials.filter((c) => c.service === source).length}</Badge>
        </Card>
      ))}
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-2">
      <Card className="p-3">
        <div className="text-xs text-muted-foreground mb-2">Strength Distribution</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-muted/40"><div className="text-lg font-semibold">{strengthCounts.strong}</div><div className="text-xs text-muted-foreground">Strong</div></div>
          <div className="p-2 rounded bg-muted/40"><div className="text-lg font-semibold">{strengthCounts.medium}</div><div className="text-xs text-muted-foreground">Medium</div></div>
          <div className="p-2 rounded bg-muted/40"><div className="text-lg font-semibold">{strengthCounts.weak}</div><div className="text-xs text-muted-foreground">Weak</div></div>
        </div>
      </Card>
      <Card className="p-3 flex items-center gap-2 text-sm"><Shield className="w-4 h-4 text-primary" /> Access policy checks: healthy</Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />
      <ScrollArea className="flex-1">
        <div className="p-3">
          {activeTab === "vault" && renderVault()}
          {activeTab === "sources" && renderSources()}
          {activeTab === "audit" && renderAudit()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CredentialManager;
