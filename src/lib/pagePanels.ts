// Maps each main page (top-bar route) to the panels that should appear in the
// left (Blue Team) and right (Red Team) activity bars. `null` means "show all".
// "ai-copilot" is always available in the right drawer.

export const PAGE_LEFT_PANELS: Record<string, string[] | null> = {
  command: [
    "global-dashboard",
    "live-metrics",
    "threat-alerts",
    "soc-dashboard",
    "alerts",
    "threat-intel",
    "ioc-manager",
  ],
  joc: [
    "global-dashboard",
    "live-metrics",
    "threat-scoring",
    "kill-chain",
    "attack-timeline",
    "response-playbooks",
    "incident-response",
    "purple-team",
    "soc-dashboard",
  ],
  editor: ["detection-eng", "log-analysis", "ioc-manager", "siem"],
  network: [
    "asset-discovery",
    "network-defense",
    "honeypot",
    "deception",
    "attack-path",
  ],
  geomap: ["global-dashboard", "threat-actors", "campaigns", "stix-taxii"],
  exploits: ["mitre-heatmap", "kill-chain", "correlation-engine", "threat-hunt"],
  timeline: ["attack-timeline", "kill-chain", "actor-graph", "investigations"],
  "attack-chain": ["mitre-heatmap", "kill-chain", "response-playbooks", "purple-team"],
  reports: ["report-generator", "investigations", "forensics", "log-analysis"],
  "team-comms": ["alerts", "threat-alerts", "incident-response", "soc-dashboard"],
  "zero-day": ["detection-eng", "vuln-management", "threat-hunt"],
  forensics: ["forensics", "log-analysis", "investigations", "incident-response"],
  signals: ["threat-intel", "stix-taxii", "actor-graph", "correlation-engine"],
  hardware: ["asset-discovery", "vuln-management", "security-controls"],
};

export const PAGE_RIGHT_PANELS: Record<string, string[] | null> = {
  command: ["ai-advisor", "mitre-attack", "exploit-db"],
  joc: ["ai-advisor", "c2-framework", "mitre-attack", "apt-emulation"],
  editor: ["exploit-db", "payloads", "implant-builder"],
  network: ["packet-capture", "vuln-scanner", "lateral", "wireless-attack"],
  geomap: ["c2-framework", "beacons", "sigint"],
  exploits: [
    "exploit-db",
    "payloads",
    "injection",
    "covert",
    "lateral",
    "postexploit",
    "rowhammer",
    "zero-day",
  ],
  timeline: ["mitre-attack", "apt-emulation", "beacons"],
  "attack-chain": [
    "mitre-attack",
    "apt-emulation",
    "c2-framework",
    "lateral",
    "postexploit",
    "exfiltrator",
  ],
  reports: ["ai-advisor", "report-scheduler", "vuln-prioritizer"],
  "team-comms": ["ai-advisor", "collab"],
  "zero-day": ["zero-day", "exploit-db", "payloads", "implant-builder"],
  forensics: ["ai-advisor", "packet-capture", "sigint"],
  signals: ["sigint", "wireless-attack", "covert"],
  hardware: ["rowhammer", "implant-builder", "physical-security"],
};

export const getLeftPanelsForPage = (page: string): string[] | null =>
  PAGE_LEFT_PANELS[page] ?? null;

export const getRightPanelsForPage = (page: string): string[] | null =>
  PAGE_RIGHT_PANELS[page] ?? null;
