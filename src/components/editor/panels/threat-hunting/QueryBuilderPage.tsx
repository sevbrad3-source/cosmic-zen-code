import { useState } from "react";
import { Code, Play, Save, History, BookOpen, Zap, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const QueryBuilderPage = () => {
  const [query, setQuery] = useState(`// KQL Query - Detect Pass-the-Hash Activity
SecurityEvent
| where EventID in (4624, 4625, 4648)
| where LogonType == 9
| where AuthenticationPackageName == "NTLM"
| where TargetUserName !endswith "$"
| project TimeGenerated, Computer, TargetUserName, IpAddress, LogonType
| order by TimeGenerated desc
| take 100`);

  const [queryLanguage, setQueryLanguage] = useState<"kql" | "splunk" | "sigma" | "yara">("kql");

  const savedQueries = [
    { name: "Pass-the-Hash Detection", language: "kql", lastUsed: "2h ago" },
    { name: "Mimikatz Execution", language: "sigma", lastUsed: "1d ago" },
    { name: "Lateral Movement Patterns", language: "kql", lastUsed: "3d ago" },
    { name: "DNS Tunneling", language: "splunk", lastUsed: "1w ago" },
  ];

  const queryTemplates = [
    { name: "Failed Logon Attempts", category: "Authentication" },
    { name: "Process Injection", category: "Execution" },
    { name: "Scheduled Task Creation", category: "Persistence" },
    { name: "LSASS Access", category: "Credential Access" },
    { name: "SMB Lateral Movement", category: "Lateral Movement" },
    { name: "DNS Exfiltration", category: "Exfiltration" },
  ];

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        {(["kql", "splunk", "sigma", "yara"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setQueryLanguage(lang)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              queryLanguage === lang
                ? "bg-[hsl(210,100%,30%)] text-white"
                : "bg-[hsl(210,100%,10%)] text-[hsl(210,60%,60%)] hover:bg-[hsl(210,100%,15%)]"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Query Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">QUERY EDITOR</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-6 text-[10px]">
              <Copy className="w-3 h-3 mr-1" /> Copy
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-[10px]">
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
          </div>
        </div>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-48 font-mono text-xs bg-[hsl(210,100%,5%)] border-[hsl(210,100%,20%)] text-[hsl(210,100%,85%)] resize-none"
          placeholder="Enter your query..."
        />
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs bg-[hsl(210,100%,35%)] hover:bg-[hsl(210,100%,40%)]">
            <Play className="w-3 h-3 mr-1" /> Execute Query
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs border-[hsl(210,100%,30%)]">
            <Save className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </div>

      {/* Query Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(210,100%,70%)]">1,247</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Results</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">0.8s</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Query Time</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded-lg text-center">
          <div className="text-lg font-bold text-[hsl(45,100%,60%)]">24h</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Time Range</div>
        </div>
      </div>

      {/* Saved Queries */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">SAVED QUERIES</span>
        </div>
        <div className="space-y-1">
          {savedQueries.map((sq, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg flex items-center justify-between hover:border-[hsl(210,100%,25%)] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Badge className="text-[8px] bg-[hsl(210,100%,25%)]">{sq.language}</Badge>
                <span className="text-xs text-[hsl(210,100%,80%)]">{sq.name}</span>
              </div>
              <span className="text-[10px] text-[hsl(210,60%,45%)]">{sq.lastUsed}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[hsl(210,100%,60%)]" />
          <span className="text-xs font-semibold text-[hsl(210,100%,75%)]">TEMPLATES</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {queryTemplates.map((t, i) => (
            <button
              key={i}
              className="p-2 bg-[hsl(210,100%,7%)] border border-[hsl(210,100%,15%)] rounded-lg text-left hover:border-[hsl(210,100%,30%)] transition-colors"
            >
              <div className="text-[10px] text-[hsl(210,100%,80%)]">{t.name}</div>
              <div className="text-[9px] text-[hsl(210,60%,45%)]">{t.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryBuilderPage;
