import { useState } from "react";
import { Shield, Mail, Phone, MessageSquare, AlertTriangle, Users, Target, FileText, Brain, CheckCircle, XCircle, Clock, Zap, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const SocialEngineeringDefensePanel = () => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const phishingSimulations = [
    {
      id: "sim-001",
      name: "CEO Impersonation Test",
      type: "email",
      status: "completed",
      sentTo: 245,
      clicked: 18,
      reported: 156,
      credentials: 3,
      successRate: 7.3,
      template: "Urgent wire transfer request from CEO"
    },
    {
      id: "sim-002",
      name: "IT Password Reset",
      type: "email",
      status: "running",
      sentTo: 500,
      clicked: 67,
      reported: 89,
      credentials: 12,
      successRate: 13.4,
      template: "Your password expires in 24 hours"
    },
    {
      id: "sim-003",
      name: "Fake Invoice Alert",
      type: "email",
      status: "scheduled",
      sentTo: 0,
      clicked: 0,
      reported: 0,
      credentials: 0,
      successRate: 0,
      template: "Invoice #INV-2024-8847 requires immediate payment"
    }
  ];

  const pretextingScenarios = [
    {
      id: "pret-001",
      name: "IT Support Callback",
      type: "vishing",
      description: "Caller claims to be from IT, requests remote access",
      riskLevel: "high",
      indicators: ["Urgency pressure", "Authority claim", "Technical jargon"],
      defenses: ["Verify caller ID", "Callback verification", "No remote access without ticket"]
    },
    {
      id: "pret-002", 
      name: "Vendor Credential Update",
      type: "email",
      description: "Fake vendor requests banking information update",
      riskLevel: "critical",
      indicators: ["Domain spoofing", "Banking details request", "Urgency"],
      defenses: ["Verify through known contact", "Check email headers", "Multi-approval for financial changes"]
    },
    {
      id: "pret-003",
      name: "Delivery Package Tracking",
      type: "smishing",
      description: "SMS claiming package delivery needs action",
      riskLevel: "medium",
      indicators: ["Unknown sender", "Shortened URL", "Request for app install"],
      defenses: ["Don't click SMS links", "Verify with carrier directly", "Report to security"]
    }
  ];

  const trainingModules = [
    { name: "Phishing Awareness 101", completion: 92, enrolled: 500, passed: 456 },
    { name: "Vishing Defense Training", completion: 78, enrolled: 200, passed: 145 },
    { name: "Social Media OPSEC", completion: 65, enrolled: 150, passed: 89 },
    { name: "Physical Security Awareness", completion: 88, enrolled: 300, passed: 258 },
    { name: "Insider Threat Recognition", completion: 71, enrolled: 100, passed: 68 }
  ];

  const recentIncidents = [
    { time: "10:34:21", type: "phishing_report", user: "jsmith@corp.local", details: "Reported suspicious email from 'IT-Support@c0rp.local'" },
    { time: "10:28:15", type: "clicked_link", user: "mwilson@corp.local", details: "Clicked simulation link - CEO Impersonation Test" },
    { time: "10:15:42", type: "credential_submit", user: "klee@corp.local", details: "Submitted credentials to phishing page (training)" },
    { time: "10:08:33", type: "phishing_report", user: "agarcia@corp.local", details: "Reported real phishing attempt - BEC attack" },
    { time: "09:55:18", type: "vishing_report", user: "reception@corp.local", details: "Reported suspicious call claiming to be from Microsoft" }
  ];

  return (
    <div className="h-full flex flex-col bg-[hsl(210,20%,8%)]">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(210,30%,20%)] bg-gradient-to-r from-[hsl(210,50%,12%)] to-transparent">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[hsl(210,80%,60%)]" />
            <h2 className="text-sm font-bold text-[hsl(210,80%,85%)]">Social Engineering Defense</h2>
          </div>
          <Badge className="bg-[hsl(210,60%,25%)] text-[hsl(210,80%,85%)]">BLUE TEAM</Badge>
        </div>
        <div className="text-xs text-[hsl(210,40%,55%)]">
          Phishing simulation, pretexting defense, and security awareness training
        </div>
      </div>

      <Tabs defaultValue="simulations" className="flex-1 flex flex-col">
        <TabsList className="bg-[hsl(210,20%,12%)] border-b border-[hsl(210,30%,20%)] rounded-none h-9 justify-start px-2">
          <TabsTrigger value="simulations" className="text-xs data-[state=active]:bg-[hsl(210,50%,20%)] data-[state=active]:text-[hsl(210,80%,85%)]">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Phishing Sims
          </TabsTrigger>
          <TabsTrigger value="pretexting" className="text-xs data-[state=active]:bg-[hsl(210,50%,20%)] data-[state=active]:text-[hsl(210,80%,85%)]">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Pretexting
          </TabsTrigger>
          <TabsTrigger value="training" className="text-xs data-[state=active]:bg-[hsl(210,50%,20%)] data-[state=active]:text-[hsl(210,80%,85%)]">
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            Training
          </TabsTrigger>
          <TabsTrigger value="incidents" className="text-xs data-[state=active]:bg-[hsl(210,50%,20%)] data-[state=active]:text-[hsl(210,80%,85%)]">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Live Feed
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="simulations" className="p-3 m-0 space-y-3">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Sent", value: "1,245", icon: Mail, color: "hsl(210,80%,60%)" },
                { label: "Click Rate", value: "8.2%", icon: Target, color: "hsl(45,80%,55%)" },
                { label: "Report Rate", value: "62%", icon: CheckCircle, color: "hsl(120,60%,50%)" },
                { label: "Cred Captures", value: "15", icon: AlertTriangle, color: "hsl(0,70%,55%)" }
              ].map((stat, i) => (
                <div key={i} className="bg-[hsl(210,25%,12%)] rounded p-2 border border-[hsl(210,30%,20%)]">
                  <div className="flex items-center gap-1.5">
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    <span className="text-xs text-[hsl(210,40%,55%)]">{stat.label}</span>
                  </div>
                  <div className="text-lg font-bold mt-1" style={{ color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Active Simulations */}
            <div className="space-y-2">
              <div className="text-xs text-[hsl(210,40%,55%)] uppercase tracking-wide">Active Campaigns</div>
              {phishingSimulations.map((sim) => (
                <div 
                  key={sim.id}
                  onClick={() => setActiveSimulation(sim.id)}
                  className={`bg-[hsl(210,25%,12%)] rounded p-3 border cursor-pointer transition-all ${
                    activeSimulation === sim.id 
                      ? "border-[hsl(210,80%,50%)] bg-[hsl(210,30%,15%)]" 
                      : "border-[hsl(210,30%,20%)] hover:border-[hsl(210,50%,35%)]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-[hsl(210,80%,85%)]">{sim.name}</div>
                      <div className="text-xs text-[hsl(210,40%,55%)] mt-0.5">{sim.template}</div>
                    </div>
                    <Badge className={`text-xs ${
                      sim.status === "running" ? "bg-[hsl(210,60%,25%)] text-[hsl(210,80%,70%)]" :
                      sim.status === "completed" ? "bg-[hsl(120,40%,20%)] text-[hsl(120,60%,65%)]" :
                      "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]"
                    }`}>
                      {sim.status}
                    </Badge>
                  </div>
                  
                  {sim.status !== "scheduled" && (
                    <>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-[hsl(210,40%,55%)]">Sent</div>
                          <div className="text-[hsl(210,80%,85%)] font-semibold">{sim.sentTo}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[hsl(210,40%,55%)]">Clicked</div>
                          <div className="text-[hsl(45,80%,55%)] font-semibold">{sim.clicked}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[hsl(210,40%,55%)]">Reported</div>
                          <div className="text-[hsl(120,60%,55%)] font-semibold">{sim.reported}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[hsl(210,40%,55%)]">Creds</div>
                          <div className="text-[hsl(0,70%,55%)] font-semibold">{sim.credentials}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[hsl(210,40%,55%)]">Click Rate</span>
                          <span className="text-[hsl(210,80%,85%)]">{sim.successRate}%</span>
                        </div>
                        <Progress value={sim.successRate} className="h-1.5 bg-[hsl(210,20%,20%)]" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full h-8 bg-[hsl(210,60%,35%)] hover:bg-[hsl(210,60%,40%)] text-[hsl(210,80%,95%)] rounded text-xs font-medium flex items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Launch New Campaign
            </button>
          </TabsContent>

          <TabsContent value="pretexting" className="p-3 m-0 space-y-3">
            <div className="text-xs text-[hsl(210,40%,55%)] uppercase tracking-wide mb-2">Known Pretexting Scenarios</div>
            
            {pretextingScenarios.map((scenario) => (
              <div key={scenario.id} className="bg-[hsl(210,25%,12%)] rounded p-3 border border-[hsl(210,30%,20%)]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {scenario.type === "vishing" && <Phone className="w-4 h-4 text-[hsl(45,80%,55%)]" />}
                    {scenario.type === "email" && <Mail className="w-4 h-4 text-[hsl(210,80%,60%)]" />}
                    {scenario.type === "smishing" && <MessageSquare className="w-4 h-4 text-[hsl(280,60%,60%)]" />}
                    <span className="text-sm font-semibold text-[hsl(210,80%,85%)]">{scenario.name}</span>
                  </div>
                  <Badge className={`text-xs ${
                    scenario.riskLevel === "critical" ? "bg-[hsl(0,50%,20%)] text-[hsl(0,70%,65%)]" :
                    scenario.riskLevel === "high" ? "bg-[hsl(25,50%,20%)] text-[hsl(25,80%,65%)]" :
                    "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]"
                  }`}>
                    {scenario.riskLevel}
                  </Badge>
                </div>
                
                <p className="text-xs text-[hsl(210,40%,60%)] mb-3">{scenario.description}</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-[hsl(0,60%,55%)] font-medium mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Red Flags
                    </div>
                    <div className="space-y-1">
                      {scenario.indicators.map((indicator, i) => (
                        <div key={i} className="text-xs text-[hsl(210,40%,55%)] flex items-center gap-1.5">
                          <XCircle className="w-3 h-3 text-[hsl(0,60%,50%)]" />
                          {indicator}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[hsl(120,50%,55%)] font-medium mb-1.5 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Defenses
                    </div>
                    <div className="space-y-1">
                      {scenario.defenses.map((defense, i) => (
                        <div key={i} className="text-xs text-[hsl(210,40%,55%)] flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-[hsl(120,50%,50%)]" />
                          {defense}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="training" className="p-3 m-0 space-y-3">
            <div className="text-xs text-[hsl(210,40%,55%)] uppercase tracking-wide mb-2">Security Awareness Modules</div>
            
            {trainingModules.map((module, i) => (
              <div key={i} className="bg-[hsl(210,25%,12%)] rounded p-3 border border-[hsl(210,30%,20%)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[hsl(210,80%,85%)]">{module.name}</span>
                  <span className="text-xs text-[hsl(210,40%,55%)]">{module.passed}/{module.enrolled} passed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={module.completion} className="flex-1 h-2 bg-[hsl(210,20%,20%)]" />
                  <span className="text-sm font-bold text-[hsl(210,80%,85%)]">{module.completion}%</span>
                </div>
              </div>
            ))}
            
            <button className="w-full h-8 bg-[hsl(210,60%,35%)] hover:bg-[hsl(210,60%,40%)] text-[hsl(210,80%,95%)] rounded text-xs font-medium flex items-center justify-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Assign Training Module
            </button>
          </TabsContent>

          <TabsContent value="incidents" className="p-3 m-0">
            <div className="text-xs text-[hsl(210,40%,55%)] uppercase tracking-wide mb-2">Live Security Awareness Feed</div>
            
            <div className="space-y-1.5">
              {recentIncidents.map((incident, i) => (
                <div key={i} className="bg-[hsl(210,25%,12%)] rounded p-2 border border-[hsl(210,30%,20%)] flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[hsl(210,40%,50%)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-[hsl(210,40%,55%)]">{incident.time}</span>
                      <Badge className={`text-[10px] h-4 ${
                        incident.type === "phishing_report" ? "bg-[hsl(120,40%,20%)] text-[hsl(120,60%,65%)]" :
                        incident.type === "clicked_link" ? "bg-[hsl(45,40%,20%)] text-[hsl(45,70%,65%)]" :
                        incident.type === "vishing_report" ? "bg-[hsl(210,40%,20%)] text-[hsl(210,70%,65%)]" :
                        "bg-[hsl(0,40%,20%)] text-[hsl(0,70%,65%)]"
                      }`}>
                        {incident.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-xs text-[hsl(210,80%,85%)] font-medium">{incident.user}</div>
                    <div className="text-xs text-[hsl(210,40%,55%)] truncate">{incident.details}</div>
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

export default SocialEngineeringDefensePanel;
