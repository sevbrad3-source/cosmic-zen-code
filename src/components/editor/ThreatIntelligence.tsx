import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Shield, Search, ExternalLink, AlertTriangle, TrendingUp, Globe } from "lucide-react";
import { useState } from "react";

interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  origin: string;
  active: boolean;
  sophistication: "low" | "medium" | "high" | "advanced";
  motivations: string[];
  matchScore: number;
}

interface TTP {
  id: string;
  tactic: string;
  technique: string;
  mitreId: string;
  description: string;
  detected: boolean;
}

const ThreatIntelligence = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"actors" | "ttps" | "iocs">("actors");

  const threatActors: ThreatActor[] = [
    {
      id: "1",
      name: "APT29 (Cozy Bear)",
      aliases: ["The Dukes", "Cozy Duke"],
      origin: "Russia",
      active: true,
      sophistication: "advanced",
      motivations: ["Espionage", "Intelligence Gathering"],
      matchScore: 87
    },
    {
      id: "2",
      name: "APT28 (Fancy Bear)",
      aliases: ["Sofacy", "Sednit"],
      origin: "Russia",
      active: true,
      sophistication: "advanced",
      motivations: ["Espionage", "Information Theft"],
      matchScore: 72
    },
    {
      id: "3",
      name: "Lazarus Group",
      aliases: ["Hidden Cobra", "Zinc"],
      origin: "North Korea",
      active: true,
      sophistication: "high",
      motivations: ["Financial Crime", "Espionage"],
      matchScore: 65
    }
  ];

  const ttps: TTP[] = [
    {
      id: "1",
      tactic: "Initial Access",
      technique: "Valid Accounts",
      mitreId: "T1078",
      description: "Adversaries may obtain and abuse credentials of existing accounts",
      detected: true
    },
    {
      id: "2",
      tactic: "Privilege Escalation",
      technique: "Exploitation for Privilege Escalation",
      mitreId: "T1068",
      description: "Exploitation of software vulnerabilities to gain elevated access",
      detected: true
    },
    {
      id: "3",
      tactic: "Defense Evasion",
      technique: "Obfuscated Files or Information",
      mitreId: "T1027",
      description: "Making files or information difficult to discover or analyze",
      detected: false
    },
    {
      id: "4",
      tactic: "Credential Access",
      technique: "Brute Force",
      mitreId: "T1110",
      description: "Trying many passwords or passphrases to guess correct credential",
      detected: true
    },
    {
      id: "5",
      tactic: "Lateral Movement",
      technique: "Remote Services",
      mitreId: "T1021",
      description: "Using valid accounts to log into remote machines",
      detected: true
    },
    {
      id: "6",
      tactic: "Collection",
      technique: "Data from Information Repositories",
      mitreId: "T1213",
      description: "Collecting data from information repositories like databases",
      detected: true
    },
    {
      id: "7",
      tactic: "Exfiltration",
      technique: "Exfiltration Over C2 Channel",
      mitreId: "T1041",
      description: "Stealing data over the same channel used for command and control",
      detected: true
    }
  ];

  const iocs = [
    { type: "IP Address", value: "185.220.101.34", threat: "Known C2 Server", severity: "high" },
    { type: "Domain", value: "malicious-site.com", threat: "Phishing Infrastructure", severity: "medium" },
    { type: "File Hash", value: "d41d8cd98f00b204e9800998ecf8427e", threat: "Malware Sample", severity: "critical" },
    { type: "URL", value: "http://evil.com/payload.exe", threat: "Malware Distribution", severity: "high" }
  ];

  const getSophisticationColor = (level: string) => {
    switch (level) {
      case "advanced": return "bg-destructive";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Threat Intelligence</h2>
          </div>
          <Button size="sm" variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Feed
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search threats, TTPs, or IOCs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "actors" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("actors")}
            className="flex-1"
          >
            APT Groups
          </Button>
          <Button
            variant={activeTab === "ttps" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ttps")}
            className="flex-1"
          >
            TTPs
          </Button>
          <Button
            variant={activeTab === "iocs" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("iocs")}
            className="flex-1"
          >
            IOCs
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "actors" && (
          <div className="p-4 space-y-3">
            <div className="bg-activitybar-bg border border-border rounded-lg p-3 mb-4">
              <p className="text-xs text-foreground">
                <strong>Correlation Analysis:</strong> Based on observed TTPs and patterns, {threatActors.length} threat actors match your current findings.
              </p>
            </div>

            {threatActors.map((actor) => (
              <div key={actor.id} className="bg-panel-bg rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{actor.name}</h3>
                      {actor.active && (
                        <Badge variant="outline" className="text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mb-2">
                      Aliases: {actor.aliases.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{actor.matchScore}%</div>
                    <div className="text-xs text-text-secondary">Match</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${getSophisticationColor(actor.sophistication)} text-white text-xs`}>
                    {actor.sophistication.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {actor.origin}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Motivations:</p>
                  <div className="flex gap-1 flex-wrap">
                    {actor.motivations.map((m, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View MITRE ATT&CK Profile
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ttps" && (
          <div className="p-4 space-y-3">
            <div className="bg-activitybar-bg border border-border rounded-lg p-3 mb-4">
              <p className="text-xs text-foreground">
                <strong>MITRE ATT&CK Framework:</strong> {ttps.filter(t => t.detected).length} of {ttps.length} techniques detected in your environment.
              </p>
            </div>

            {ttps.map((ttp) => (
              <div key={ttp.id} className="bg-panel-bg rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {ttp.mitreId}
                      </Badge>
                      {ttp.detected && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Detected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{ttp.technique}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      <strong>Tactic:</strong> {ttp.tactic}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-foreground bg-activitybar-bg p-2 rounded">
                  {ttp.description}
                </p>
                <Button size="sm" variant="ghost" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View on MITRE ATT&CK
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "iocs" && (
          <div className="p-4 space-y-3">
            <div className="bg-activitybar-bg border border-border rounded-lg p-3 mb-4">
              <p className="text-xs text-foreground">
                <strong>Indicators of Compromise:</strong> {iocs.length} IOCs identified from threat intelligence feeds.
              </p>
            </div>

            {iocs.map((ioc, idx) => (
              <div key={idx} className="bg-panel-bg rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {ioc.type}
                      </Badge>
                      <Badge className={`${getSeverityColor(ioc.severity)} text-white text-xs`}>
                        {ioc.severity}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-foreground bg-activitybar-bg p-2 rounded break-all">
                      {ioc.value}
                    </p>
                    <p className="text-xs text-text-secondary mt-2">
                      <strong>Threat:</strong> {ioc.threat}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    Block
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 text-xs">
                    More Info
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ThreatIntelligence;
