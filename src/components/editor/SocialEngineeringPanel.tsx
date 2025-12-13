import { useState } from "react";
import { Mail, Phone, MessageSquare, Globe, Users, Target, FileText, Send, AlertTriangle, CheckCircle, Clock, Zap, Eye, Skull } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const SocialEngineeringPanel = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const phishingTemplates = [
    {
      id: "pt-001",
      name: "Password Expiration Notice",
      type: "credential",
      effectiveness: 34,
      description: "IT Department password reset notification",
      previewSubject: "Action Required: Your password expires in 24 hours"
    },
    {
      id: "pt-002",
      name: "CEO Wire Transfer Request",
      type: "bec",
      effectiveness: 12,
      description: "Business Email Compromise - urgent wire transfer",
      previewSubject: "URGENT: Need wire transfer completed today"
    },
    {
      id: "pt-003",
      name: "SharePoint Document Shared",
      type: "credential",
      effectiveness: 28,
      description: "Fake SharePoint/OneDrive document notification",
      previewSubject: "John Smith shared 'Q4 Financial Report.xlsx' with you"
    },
    {
      id: "pt-004",
      name: "Package Delivery Failed",
      type: "malware",
      effectiveness: 41,
      description: "Fake shipping notification with malicious link",
      previewSubject: "Delivery failed - action required"
    }
  ];

  const vishingScripts = [
    {
      id: "vs-001",
      name: "IT Support Callback",
      pretext: "Calling from IT - detected unusual activity on your account",
      objectives: ["Obtain remote access", "Harvest credentials", "Deploy payload"],
      riskLevel: "high"
    },
    {
      id: "vs-002",
      name: "Survey/Market Research",
      pretext: "Conducting a brief survey about company security practices",
      objectives: ["Gather intel on security tools", "Identify key personnel", "Map org structure"],
      riskLevel: "medium"
    },
    {
      id: "vs-003",
      name: "Vendor Support",
      pretext: "Calling from [vendor] regarding your support ticket",
      objectives: ["Credential harvesting", "Social mapping", "Technical reconnaissance"],
      riskLevel: "high"
    }
  ];

  const activeCampaigns = [
    {
      id: "camp-001",
      name: "Q4 Phishing Assessment",
      status: "running",
      targets: 500,
      sent: 485,
      opened: 342,
      clicked: 67,
      submitted: 23,
      reported: 156
    },
    {
      id: "camp-002",
      name: "Executive Targeting",
      status: "scheduled",
      targets: 25,
      sent: 0,
      opened: 0,
      clicked: 0,
      submitted: 0,
      reported: 0
    }
  ];

  const recentCaptures = [
    { time: "14:32:15", email: "jsmith@target.corp", credentials: "jsmith:Summer2024!", ip: "192.168.1.105", userAgent: "Chrome/120" },
    { time: "14:28:44", email: "mwilson@target.corp", credentials: "mwilson:Password123", ip: "192.168.1.87", userAgent: "Firefox/121" },
    { time: "14:15:22", email: "agarcia@target.corp", credentials: "agarcia:Welcome1!", ip: "10.10.10.50", userAgent: "Edge/120" }
  ];

  return (
    <div className="h-full flex flex-col bg-[hsl(0,20%,8%)]">
      {/* Warning Banner */}
      <div className="px-3 py-1.5 bg-[hsl(45,90%,15%)] border-b border-[hsl(45,70%,25%)] flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-[hsl(45,90%,55%)]" />
        <span className="text-xs text-[hsl(45,90%,70%)]">
          SIMULATION ENVIRONMENT - All activities are logged and monitored
        </span>
      </div>

      {/* Header */}
      <div className="p-3 border-b border-[hsl(0,30%,20%)] bg-gradient-to-r from-[hsl(0,50%,12%)] to-transparent">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-[hsl(0,80%,60%)]" />
            <h2 className="text-sm font-bold text-[hsl(0,80%,85%)]">Social Engineering Toolkit</h2>
          </div>
          <Badge className="bg-[hsl(0,60%,25%)] text-[hsl(0,80%,85%)]">RED TEAM</Badge>
        </div>
        <div className="text-xs text-[hsl(0,40%,55%)]">
          Phishing campaigns, vishing scripts, and pretexting scenarios
        </div>
      </div>

      <Tabs defaultValue="phishing" className="flex-1 flex flex-col">
        <TabsList className="bg-[hsl(0,20%,12%)] border-b border-[hsl(0,30%,20%)] rounded-none h-9 justify-start px-2">
          <TabsTrigger value="phishing" className="text-xs data-[state=active]:bg-[hsl(0,50%,20%)] data-[state=active]:text-[hsl(0,80%,85%)]">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Phishing
          </TabsTrigger>
          <TabsTrigger value="vishing" className="text-xs data-[state=active]:bg-[hsl(0,50%,20%)] data-[state=active]:text-[hsl(0,80%,85%)]">
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            Vishing
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs data-[state=active]:bg-[hsl(0,50%,20%)] data-[state=active]:text-[hsl(0,80%,85%)]">
            <Target className="w-3.5 h-3.5 mr-1.5" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="captures" className="text-xs data-[state=active]:bg-[hsl(0,50%,20%)] data-[state=active]:text-[hsl(0,80%,85%)]">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Captures
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="phishing" className="p-3 m-0 space-y-3">
            <div className="text-xs text-[hsl(0,40%,55%)] uppercase tracking-wide">Email Templates</div>
            
            {phishingTemplates.map((template) => (
              <div 
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`bg-[hsl(0,25%,12%)] rounded p-3 border cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? "border-[hsl(0,80%,50%)] bg-[hsl(0,30%,15%)]" 
                    : "border-[hsl(0,30%,20%)] hover:border-[hsl(0,50%,35%)]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-[hsl(0,80%,85%)]">{template.name}</div>
                    <div className="text-xs text-[hsl(0,40%,55%)] mt-0.5">{template.description}</div>
                  </div>
                  <Badge className={`text-xs ${
                    template.type === "credential" ? "bg-[hsl(210,40%,25%)] text-[hsl(210,80%,70%)]" :
                    template.type === "bec" ? "bg-[hsl(280,40%,25%)] text-[hsl(280,70%,70%)]" :
                    "bg-[hsl(0,40%,25%)] text-[hsl(0,80%,70%)]"
                  }`}>
                    {template.type}
                  </Badge>
                </div>
                <div className="text-xs text-[hsl(0,30%,50%)] italic mb-2">
                  Subject: {template.previewSubject}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[hsl(0,40%,55%)]">Effectiveness:</span>
                    <Progress value={template.effectiveness} className="w-20 h-1.5 bg-[hsl(0,20%,20%)]" />
                    <span className="text-xs text-[hsl(0,80%,70%)]">{template.effectiveness}%</span>
                  </div>
                  <button className="px-2 py-1 bg-[hsl(0,60%,35%)] hover:bg-[hsl(0,60%,40%)] text-white rounded text-xs flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    Deploy
                  </button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="vishing" className="p-3 m-0 space-y-3">
            <div className="text-xs text-[hsl(0,40%,55%)] uppercase tracking-wide">Vishing Scripts</div>
            
            {vishingScripts.map((script) => (
              <div key={script.id} className="bg-[hsl(0,25%,12%)] rounded p-3 border border-[hsl(0,30%,20%)]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[hsl(0,80%,60%)]" />
                    <span className="text-sm font-semibold text-[hsl(0,80%,85%)]">{script.name}</span>
                  </div>
                  <Badge className={`text-xs ${
                    script.riskLevel === "high" ? "bg-[hsl(0,50%,20%)] text-[hsl(0,80%,70%)]" :
                    "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]"
                  }`}>
                    {script.riskLevel}
                  </Badge>
                </div>
                
                <div className="text-xs text-[hsl(0,40%,60%)] mb-3 italic">
                  "{script.pretext}"
                </div>
                
                <div>
                  <div className="text-xs text-[hsl(0,60%,55%)] font-medium mb-1.5">Objectives:</div>
                  <div className="space-y-1">
                    {script.objectives.map((obj, i) => (
                      <div key={i} className="text-xs text-[hsl(0,40%,55%)] flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-[hsl(0,60%,50%)]" />
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="campaigns" className="p-3 m-0 space-y-3">
            <div className="text-xs text-[hsl(0,40%,55%)] uppercase tracking-wide">Active Campaigns</div>
            
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-[hsl(0,25%,12%)] rounded p-3 border border-[hsl(0,30%,20%)]">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-semibold text-[hsl(0,80%,85%)]">{campaign.name}</span>
                  <Badge className={`text-xs ${
                    campaign.status === "running" ? "bg-[hsl(120,40%,20%)] text-[hsl(120,60%,65%)]" :
                    "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]"
                  }`}>
                    {campaign.status}
                  </Badge>
                </div>
                
                {campaign.status === "running" && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[hsl(0,20%,10%)] rounded p-2">
                      <div className="text-lg font-bold text-[hsl(210,80%,65%)]">{campaign.opened}</div>
                      <div className="text-xs text-[hsl(0,40%,55%)]">Opened</div>
                    </div>
                    <div className="bg-[hsl(0,20%,10%)] rounded p-2">
                      <div className="text-lg font-bold text-[hsl(45,80%,55%)]">{campaign.clicked}</div>
                      <div className="text-xs text-[hsl(0,40%,55%)]">Clicked</div>
                    </div>
                    <div className="bg-[hsl(0,20%,10%)] rounded p-2">
                      <div className="text-lg font-bold text-[hsl(0,80%,60%)]">{campaign.submitted}</div>
                      <div className="text-xs text-[hsl(0,40%,55%)]">Submitted</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button className="w-full h-8 bg-[hsl(0,60%,35%)] hover:bg-[hsl(0,60%,40%)] text-[hsl(0,80%,95%)] rounded text-xs font-medium flex items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Create New Campaign
            </button>
          </TabsContent>

          <TabsContent value="captures" className="p-3 m-0">
            <div className="text-xs text-[hsl(0,40%,55%)] uppercase tracking-wide mb-2">Recent Credential Captures</div>
            
            <div className="space-y-2">
              {recentCaptures.map((capture, i) => (
                <div key={i} className="bg-[hsl(0,25%,12%)] rounded p-2.5 border border-[hsl(0,30%,20%)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-[hsl(0,40%,55%)]">{capture.time}</span>
                    <Badge className="text-[10px] bg-[hsl(0,50%,20%)] text-[hsl(0,80%,70%)]">captured</Badge>
                  </div>
                  <div className="text-xs text-[hsl(0,80%,85%)] font-medium mb-1">{capture.email}</div>
                  <div className="text-xs font-mono text-[hsl(120,60%,55%)] bg-[hsl(0,20%,10%)] rounded px-2 py-1 mb-1.5">
                    {capture.credentials}
                  </div>
                  <div className="text-[10px] text-[hsl(0,40%,50%)]">
                    IP: {capture.ip} | {capture.userAgent}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default SocialEngineeringPanel;
