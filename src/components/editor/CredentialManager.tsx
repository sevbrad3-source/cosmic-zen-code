import { useState } from "react";
import { Key, Search, Copy, Eye, EyeOff, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CredentialManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const credentials = [
    {
      id: 1,
      type: "password",
      username: "admin",
      password: "P@ssw0rd123!",
      source: "192.168.1.100",
      service: "SSH",
      timestamp: "2024-03-15 14:23",
      strength: "weak",
    },
    {
      id: 2,
      type: "ssh_key",
      username: "root",
      key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...",
      source: "192.168.1.105",
      service: "SSH",
      timestamp: "2024-03-15 15:45",
      strength: "strong",
    },
    {
      id: 3,
      type: "token",
      username: "api_service",
      token: "sk_live_51HT7KaLkjsdf892343kljsdf",
      source: "api.example.com",
      service: "API",
      timestamp: "2024-03-15 16:12",
      strength: "medium",
    },
    {
      id: 4,
      type: "password",
      username: "dbuser",
      password: "mysql_prod_2024",
      source: "192.168.1.110",
      service: "MySQL",
      timestamp: "2024-03-15 14:30",
      strength: "medium",
    },
    {
      id: 5,
      type: "hash",
      username: "john.doe",
      hash: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      source: "web.example.com",
      service: "Web App",
      timestamp: "2024-03-15 15:20",
      strength: "unknown",
    },
  ];

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "password": return "bg-blue-500 text-white";
      case "ssh_key": return "bg-purple-500 text-white";
      case "token": return "bg-green-500 text-white";
      case "hash": return "bg-orange-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "weak": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = 
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || cred.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Credential Vault</h3>
        </div>
        <Badge variant="secondary">{credentials.length} credentials</Badge>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
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

      <div className="space-y-3">
        {filteredCredentials.map((cred) => (
          <Card key={cred.id} className="p-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getTypeColor(cred.type)}>
                    {cred.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className={`text-xs font-medium ${getStrengthColor(cred.strength)}`}>
                    {cred.strength !== "unknown" && `${cred.strength} strength`}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">User:</span>
                    <span className="text-sm font-mono">{cred.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">Source:</span>
                    <span className="text-sm font-mono text-muted-foreground">{cred.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">Service:</span>
                    <span className="text-sm">{cred.service}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded p-2 font-mono text-xs break-all relative group">
              {cred.type === "password" && (
                <span>
                  {showPasswords[cred.id] ? cred.password : "••••••••••••"}
                </span>
              )}
              {cred.type === "ssh_key" && (
                <span className="text-muted-foreground">
                  {showPasswords[cred.id] ? cred.key : "••••• SSH PRIVATE KEY •••••"}
                </span>
              )}
              {cred.type === "token" && (
                <span>
                  {showPasswords[cred.id] ? cred.token : "••••••••••••••••••••••••"}
                </span>
              )}
              {cred.type === "hash" && (
                <span className="text-muted-foreground">
                  {cred.hash}
                </span>
              )}
              
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {cred.type !== "hash" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0"
                    onClick={() => togglePasswordVisibility(cred.id)}
                  >
                    {showPasswords[cred.id] ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(
                    cred.password || cred.key || cred.token || cred.hash || ""
                  )}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-2 text-right">
              Captured: {cred.timestamp}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CredentialManager;
