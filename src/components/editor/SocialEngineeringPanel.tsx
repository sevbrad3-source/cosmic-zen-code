import { useState } from "react";
import { Mail, Phone, MessageSquare, Globe, Users, Target, FileText, Send, CheckCircle, Clock, Zap, Eye, Skull, BarChart3, UserPlus, ShieldAlert, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "phishing", icon: Mail, label: "Phishing", badge: 4 },
  { id: "vishing", icon: Phone, label: "Vishing", badge: 3 },
  { id: "pretexting", icon: Users, label: "Pretexting" },
  { id: "campaigns", icon: Target, label: "Campaigns", badge: 2, badgeVariant: "success" as const },
  { id: "captures", icon: Eye, label: "Captures", badge: 3, badgeVariant: "critical" as const },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const SocialEngineeringPanel = () => {
  const [activeTab, setActiveTab] = useState("phishing");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const phishingTemplates = [
    { id: "pt-001", name: "Password Expiration Notice", type: "credential", effectiveness: 34, description: "IT Department password reset notification", previewSubject: "Action Required: Your password expires in 24 hours" },
    { id: "pt-002", name: "CEO Wire Transfer Request", type: "bec", effectiveness: 12, description: "Business Email Compromise - urgent wire transfer", previewSubject: "URGENT: Need wire transfer completed today" },
    { id: "pt-003", name: "SharePoint Document Shared", type: "credential", effectiveness: 28, description: "Fake SharePoint/OneDrive document notification", previewSubject: "John Smith shared 'Q4 Financial Report.xlsx' with you" },
    { id: "pt-004", name: "Package Delivery Failed", type: "malware", effectiveness: 41, description: "Fake shipping notification with malicious link", previewSubject: "Delivery failed - action required" },
  ];

  const vishingScripts = [
    { id: "vs-001", name: "IT Support Callback", pretext: "Calling from IT - detected unusual activity on your account", objectives: ["Obtain remote access", "Harvest credentials", "Deploy payload"], riskLevel: "high" },
    { id: "vs-002", name: "Survey/Market Research", pretext: "Conducting a brief survey about company security practices", objectives: ["Gather intel on security tools", "Identify key personnel", "Map org structure"], riskLevel: "medium" },
    { id: "vs-003", name: "Vendor Support", pretext: "Calling from [vendor] regarding your support ticket", objectives: ["Credential harvesting", "Social mapping", "Technical reconnaissance"], riskLevel: "high" },
  ];

  const pretextScenarios = [
    { name: "New Employee Onboarding", role: "HR Representative", target: "IT Helpdesk", goal: "Obtain VPN credentials and badge access", difficulty: "medium" },
    { name: "Fire Inspector", role: "City Fire Marshal", target: "Building Security", goal: "Physical access to server room", difficulty: "high" },
    { name: "Vendor Maintenance", role: "HVAC Technician", target: "Facilities Manager", goal: "Access to restricted areas", difficulty: "medium" },
    { name: "Executive Assistant", role: "C-Suite Support", target: "Finance Department", goal: "Wire transfer authorization", difficulty: "critical" },
  ];

  const activeCampaigns = [
    { id: "camp-001", name: "Q4 Phishing Assessment", status: "running", targets: 500, sent: 485, opened: 342, clicked: 67, submitted: 23, reported: 156 },
    { id: "camp-002", name: "Executive Targeting", status: "scheduled", targets: 25, sent: 0, opened: 0, clicked: 0, submitted: 0, reported: 0 },
  ];

  const recentCaptures = [
    { time: "14:32:15", email: "jsmith@target.corp", credentials: "jsmith:Summer2024!", ip: "192.168.1.105", userAgent: "Chrome/120" },
    { time: "14:28:44", email: "mwilson@target.corp", credentials: "mwilson:Password123", ip: "192.168.1.87", userAgent: "Firefox/121" },
    { time: "14:15:22", email: "agarcia@target.corp", credentials: "agarcia:Welcome1!", ip: "10.10.10.50", userAgent: "Edge/120" },
  ];

  return (
    <div className="h-full flex flex-col bg-[hsl(0,20%,8%)]">
      <div className="p-3 border-b border-[hsl(0,30%,20%)] bg-gradient-to-r from-[hsl(0,50%,12%)] to-transparent">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-[hsl(0,80%,60%)]" />
          <div>
            <h2 className="text-sm font-bold text-[hsl(0,80%,85%)]">Social Engineering Toolkit</h2>
            <p className="text-xs text-[hsl(0,40%,55%)]">Phishing, Vishing, Pretexting & Campaign Ops</p>
          </div>
        </div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {activeTab === "phishing" && phishingTemplates.map((template) => (
            <div key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`bg-[hsl(0,25%,12%)] rounded p-3 border cursor-pointer transition-all ${selectedTemplate === template.id ? "border-[hsl(0,80%,50%)] bg-[hsl(0,30%,15%)]" : "border-[hsl(0,30%,20%)] hover:border-[hsl(0,50%,35%)]"}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-[hsl(0,80%,85%)]">{template.name}</div>
                  <div className="text-xs text-[hsl(0,40%,55%)] mt-0.5">{template.description}</div>
                </div>
                <Badge className={`text-xs ${template.type === "credential" ? "bg-[hsl(210,40%,25%)] text-[hsl(210,80%,70%)]" : template.type === "bec" ? "bg-[hsl(280,40%,25%)] text-[hsl(280,70%,70%)]" : "bg-[hsl(0,40%,25%)] text-[hsl(0,80%,70%)]"}`}>{template.type}</Badge>
              </div>
              <div className="text-xs text-[hsl(0,30%,50%)] italic mb-2">Subject: {template.previewSubject}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(0,40%,55%)]">Effectiveness:</span>
                  <Progress value={template.effectiveness} className="w-20 h-1.5 bg-[hsl(0,20%,20%)]" />
                  <span className="text-xs text-[hsl(0,80%,70%)]">{template.effectiveness}%</span>
                </div>
                <button className="px-2 py-1 bg-[hsl(0,60%,35%)] hover:bg-[hsl(0,60%,40%)] text-white rounded text-xs flex items-center gap-1"><Send className="w-3 h-3" />Deploy</button>
              </div>
            </div>
          ))}

          {activeTab === "vishing" && vishingScripts.map((script) => (
            <div key={script.id} className="bg-[hsl(0,25%,12%)] rounded p-3 border border-[hsl(0,30%,20%)]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[hsl(0,80%,60%)]" /><span className="text-sm font-semibold text-[hsl(0,80%,85%)]">{script.name}</span></div>
                <Badge className={`text-xs ${script.riskLevel === "high" ? "bg-[hsl(0,50%,20%)] text-[hsl(0,80%,70%)]" : "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]"}`}>{script.riskLevel}</Badge>
              </div>
              <div className="text-xs text-[hsl(0,40%,60%)] mb-3 italic">"{script.pretext}"</div>
              <div className="space-y-1">
                {script.objectives.map((obj, i) => (
                  <div key={i} className="text-xs text-[hsl(0,40%,55%)] flex items-center gap-1.5"><Target className="w-3 h-3 text-[hsl(0,60%,50%)]" />{obj}</div>
                ))}
              </div>
            </div>
          ))}

          {activeTab === "pretexting" && (
            <>
              <div className="text-xs text-[hsl(0,40%,55%)] uppercase tracking-wide">Pretext Scenarios</div>
              {pretextScenarios.map((scenario, i) => (
                <div key={i} className="bg-[hsl(0,25%,12%)] rounded p-3 border border-[hsl(0,30%,20%)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[hsl(0,80%,85%)]">{scenario.name}</span>
                    <Badge className={`text-xs ${scenario.difficulty === "critical" ? "bg-red-600" : scenario.difficulty === "high" ? "bg-orange-600" : "bg-yellow-600"}`}>{scenario.difficulty}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-[hsl(0,40%,55%)]">
                    <span>Role: <span className="text-[hsl(0,80%,85%)]">{scenario.role}</span></span>
                    <span>Target: <span className="text-[hsl(0,80%,85%)]">{scenario.target}</span></span>
                  </div>
                  <div className="text-xs text-[hsl(0,40%,55%)] mt-1">Objective: <span className="text-[hsl(0,80%,70%)]">{scenario.goal}</span></div>
                </div>
              ))}
            </>
          )}

          {activeTab === "campaigns" && (
            <>
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="bg-[hsl(0,25%,12%)] rounded p-3 border border-[hsl(0,30%,20%)]">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-semibold text-[hsl(0,80%,85%)]">{campaign.name}</span>
                    <Badge className={`text-xs ${campaign.status === "running" ? "bg-[hsl(120,40%,20%)] text-[hsl(120,60%,65%)]" : "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]"}`}>{campaign.status}</Badge>
                  </div>
                  {campaign.status === "running" && (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[hsl(0,20%,10%)] rounded p-2"><div className="text-lg font-bold text-[hsl(210,80%,65%)]">{campaign.opened}</div><div className="text-xs text-[hsl(0,40%,55%)]">Opened</div></div>
                      <div className="bg-[hsl(0,20%,10%)] rounded p-2"><div className="text-lg font-bold text-[hsl(45,80%,55%)]">{campaign.clicked}</div><div className="text-xs text-[hsl(0,40%,55%)]">Clicked</div></div>
                      <div className="bg-[hsl(0,20%,10%)] rounded p-2"><div className="text-lg font-bold text-[hsl(0,80%,60%)]">{campaign.submitted}</div><div className="text-xs text-[hsl(0,40%,55%)]">Submitted</div></div>
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full h-8 bg-[hsl(0,60%,35%)] hover:bg-[hsl(0,60%,40%)] text-[hsl(0,80%,95%)] rounded text-xs font-medium flex items-center justify-center gap-2"><Zap className="w-3.5 h-3.5" />Create New Campaign</button>
            </>
          )}

          {activeTab === "captures" && recentCaptures.map((capture, i) => (
            <div key={i} className="bg-[hsl(0,25%,12%)] rounded p-2.5 border border-[hsl(0,30%,20%)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-[hsl(0,40%,55%)]">{capture.time}</span>
                <Badge className="text-[10px] bg-[hsl(0,50%,20%)] text-[hsl(0,80%,70%)]">captured</Badge>
              </div>
              <div className="text-xs text-[hsl(0,80%,85%)] font-medium mb-1">{capture.email}</div>
              <div className="text-xs font-mono text-[hsl(120,60%,55%)] bg-[hsl(0,20%,10%)] rounded px-2 py-1 mb-1.5">{capture.credentials}</div>
              <div className="text-[10px] text-[hsl(0,40%,50%)]">IP: {capture.ip} | {capture.userAgent}</div>
            </div>
          ))}

          {activeTab === "analytics" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[hsl(0,25%,12%)] rounded border border-[hsl(0,30%,20%)] text-center">
                  <div className="text-lg font-bold text-[hsl(0,80%,70%)]">13.4%</div>
                  <div className="text-xs text-[hsl(0,40%,55%)]">Click Rate</div>
                </div>
                <div className="p-2.5 bg-[hsl(0,25%,12%)] rounded border border-[hsl(0,30%,20%)] text-center">
                  <div className="text-lg font-bold text-[hsl(0,80%,60%)]">4.7%</div>
                  <div className="text-xs text-[hsl(0,40%,55%)]">Submit Rate</div>
                </div>
                <div className="p-2.5 bg-[hsl(0,25%,12%)] rounded border border-[hsl(0,30%,20%)] text-center">
                  <div className="text-lg font-bold text-green-500">32.2%</div>
                  <div className="text-xs text-[hsl(0,40%,55%)]">Report Rate</div>
                </div>
                <div className="p-2.5 bg-[hsl(0,25%,12%)] rounded border border-[hsl(0,30%,20%)] text-center">
                  <div className="text-lg font-bold text-blue-400">525</div>
                  <div className="text-xs text-[hsl(0,40%,55%)]">Total Targets</div>
                </div>
              </div>
              <div className="p-3 bg-[hsl(0,25%,12%)] rounded border border-[hsl(0,30%,20%)]">
                <div className="text-xs text-[hsl(0,40%,55%)] uppercase mb-2">Template Effectiveness</div>
                {phishingTemplates.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-1 text-xs">
                    <span className="text-[hsl(0,80%,85%)] truncate flex-1">{t.name}</span>
                    <Progress value={t.effectiveness} className="w-16 h-1.5 mx-2" />
                    <span className="text-[hsl(0,80%,70%)] w-8 text-right">{t.effectiveness}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SocialEngineeringPanel;
