import { useState } from "react";
import { Radio, Shield, Lock, MessageSquare, Users, Phone, Video, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "channels", icon: Radio, label: "Channels", badge: 12, badgeVariant: "warning" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "team", icon: Users, label: "Team" },
  { id: "calls", icon: Phone, label: "Calls" },
];

const SecureCommsPanel = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [activeChannel, setActiveChannel] = useState("soc-general");

  const channels = [
    { id: "soc-general", name: "SOC General", unread: 3, encrypted: true },
    { id: "incident-001", name: "Incident IR-001", unread: 12, encrypted: true, priority: true },
    { id: "threat-intel", name: "Threat Intel", unread: 0, encrypted: true },
    { id: "management", name: "Management Brief", unread: 1, encrypted: true },
  ];

  const messages = [
    { id: 1, user: "J. Smith", time: "14:32", content: "Confirming lateral movement detected on segment 10.0.2.x", role: "analyst" },
    { id: 2, user: "M. Chen", time: "14:35", content: "I've isolated the affected hosts. Running memory forensics now.", role: "analyst" },
    { id: 3, user: "System", time: "14:36", content: "ALERT: New IOC added - SHA256: 3b4a...f2d1", role: "system" },
    { id: 4, user: "A. Kumar", time: "14:38", content: "Cross-referencing with VirusTotal. Matches APT29 tooling signature.", role: "lead" },
  ];

  const teamMembers = [
    { name: "John Smith", role: "SOC Analyst", status: "online" },
    { name: "Maria Chen", role: "IR Lead", status: "online" },
    { name: "Arun Kumar", role: "Threat Intel", status: "away" },
    { name: "Sarah Wilson", role: "SOC Manager", status: "offline" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "channels":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Channels</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]"><Lock className="w-2.5 h-2.5 mr-1" />E2E</Badge>
            </div>
            {channels.map((channel) => (
              <button key={channel.id} onClick={() => { setActiveChannel(channel.id); setActiveTab("messages"); }} className={`w-full flex items-center justify-between p-2 rounded transition-colors ${activeChannel === channel.id ? 'bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,35%)]' : 'bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]'}`}>
                <div className="flex items-center gap-2"><Lock className="w-3 h-3 text-[hsl(210,60%,50%)]" /><span className="text-xs text-[hsl(210,100%,80%)]">{channel.name}</span>{channel.priority && <Badge className="bg-red-500/20 text-red-400 h-4 text-[9px]">PRIORITY</Badge>}</div>
                {channel.unread > 0 && <Badge className="bg-[hsl(210,100%,50%)] text-white h-4 min-w-[20px] text-[10px]">{channel.unread}</Badge>}
              </button>
            ))}
          </div>
        );
      case "messages":
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Messages</span>
            <div className="bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded-lg p-2 space-y-2 max-h-64 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`text-xs ${msg.role === 'system' ? 'bg-[hsl(210,100%,12%)] rounded p-1.5 border-l-2 border-[hsl(210,100%,50%)]' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5"><span className={`font-semibold ${msg.role === 'lead' ? 'text-[hsl(210,100%,70%)]' : msg.role === 'system' ? 'text-[hsl(210,100%,60%)]' : 'text-[hsl(210,60%,60%)]'}`}>{msg.user}</span><span className="text-[10px] text-[hsl(210,60%,40%)]">{msg.time}</span></div>
                  <div className="text-[hsl(210,60%,70%)]">{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2"><Input placeholder="Type secure message..." className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]" /><button className="h-8 w-8 bg-[hsl(210,100%,50%)] hover:bg-[hsl(210,100%,55%)] rounded flex items-center justify-center"><Send className="w-3.5 h-3.5 text-white" /></button></div>
          </div>
        );
      case "team":
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase">Team Online</span>
            {teamMembers.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded">
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-yellow-500' : 'bg-neutral-500'}`} /><div><div className="text-xs text-[hsl(210,100%,80%)]">{member.name}</div><div className="text-[10px] text-[hsl(210,60%,50%)]">{member.role}</div></div></div>
                <div className="flex gap-1"><button className="w-6 h-6 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,25%)] rounded flex items-center justify-center"><MessageSquare className="w-3 h-3 text-[hsl(210,60%,60%)]" /></button><button className="w-6 h-6 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,25%)] rounded flex items-center justify-center"><Phone className="w-3 h-3 text-[hsl(210,60%,60%)]" /></button></div>
              </div>
            ))}
          </div>
        );
      case "calls":
        return (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase">Voice & Video</span>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-12 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex flex-col items-center justify-center gap-1"><Video className="w-4 h-4" />Video Call</button>
              <button className="h-12 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex flex-col items-center justify-center gap-1"><Phone className="w-4 h-4" />Voice Call</button>
            </div>
            <div className="text-[10px] text-[hsl(210,60%,50%)] text-center">No active calls</div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="blue" />
      <ScrollArea className="flex-1"><div className="p-3">{renderContent()}</div></ScrollArea>
    </div>
  );
};

export default SecureCommsPanel;
