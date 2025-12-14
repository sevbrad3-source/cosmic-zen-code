import { Radio, Shield, Lock, MessageSquare, Users, Phone, Video, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SecureCommsPanel = () => {
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

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[hsl(210,100%,60%)]" />
            <span className="text-sm font-semibold text-[hsl(210,100%,80%)]">Secure Comms</span>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
            <Lock className="w-2.5 h-2.5 mr-1" />
            E2E ENCRYPTED
          </Badge>
        </div>

        {/* Safety Banner */}
        <div className="bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,25%)] rounded-lg p-2 flex items-start gap-2">
          <Shield className="w-4 h-4 text-[hsl(210,100%,60%)] flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-[hsl(210,60%,60%)]">
            <span className="font-semibold text-[hsl(210,100%,70%)]">SIMULATION MODE</span> — Secure channel simulation for training
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Channels</span>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                activeChannel === channel.id 
                  ? 'bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,35%)]' 
                  : 'bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] hover:border-[hsl(210,100%,25%)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-[hsl(210,60%,50%)]" />
                <span className={`text-xs ${activeChannel === channel.id ? 'text-[hsl(210,100%,80%)]' : 'text-[hsl(210,60%,60%)]'}`}>
                  {channel.name}
                </span>
                {channel.priority && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 h-4 text-[9px]">PRIORITY</Badge>
                )}
              </div>
              {channel.unread > 0 && (
                <Badge className="bg-[hsl(210,100%,50%)] text-white h-4 min-w-[20px] text-[10px]">
                  {channel.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Messages</span>
          <div className="bg-[hsl(210,100%,6%)] border border-[hsl(210,100%,15%)] rounded-lg p-2 space-y-2 max-h-48 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`text-xs ${msg.role === 'system' ? 'bg-[hsl(210,100%,12%)] rounded p-1.5 border-l-2 border-[hsl(210,100%,50%)]' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-semibold ${
                    msg.role === 'lead' ? 'text-[hsl(210,100%,70%)]' :
                    msg.role === 'system' ? 'text-[hsl(210,100%,60%)]' :
                    'text-[hsl(210,60%,60%)]'
                  }`}>
                    {msg.user}
                  </span>
                  <span className="text-[10px] text-[hsl(210,60%,40%)]">{msg.time}</span>
                </div>
                <div className="text-[hsl(210,60%,70%)]">{msg.content}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Type secure message..." 
              className="h-8 text-xs bg-[hsl(210,100%,8%)] border-[hsl(210,100%,20%)]"
            />
            <button className="h-8 w-8 bg-[hsl(210,100%,50%)] hover:bg-[hsl(210,100%,55%)] rounded flex items-center justify-center transition-colors">
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-[hsl(210,60%,50%)] uppercase tracking-wider">Team Online</span>
          <div className="space-y-1.5">
            {teamMembers.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,15%)] rounded">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'away' ? 'bg-yellow-500' :
                    'bg-neutral-500'
                  }`} />
                  <div>
                    <div className="text-xs text-[hsl(210,100%,80%)]">{member.name}</div>
                    <div className="text-[10px] text-[hsl(210,60%,50%)]">{member.role}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="w-6 h-6 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,25%)] rounded flex items-center justify-center transition-colors">
                    <MessageSquare className="w-3 h-3 text-[hsl(210,60%,60%)]" />
                  </button>
                  <button className="w-6 h-6 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,25%)] rounded flex items-center justify-center transition-colors">
                    <Phone className="w-3 h-3 text-[hsl(210,60%,60%)]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Video className="w-3.5 h-3.5" />
            Start Call
          </button>
          <button className="h-8 bg-[hsl(210,100%,15%)] hover:bg-[hsl(210,100%,20%)] border border-[hsl(210,100%,25%)] rounded text-xs text-[hsl(210,100%,70%)] flex items-center justify-center gap-1.5 transition-colors">
            <Users className="w-3.5 h-3.5" />
            New Channel
          </button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SecureCommsPanel;
