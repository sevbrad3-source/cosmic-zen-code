import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, MessageSquare, Send, Video, Mic, MicOff,
  VideoOff, ScreenShare, Phone, Settings, Circle,
  Hash, AtSign, Pin, Smile, Image, Paperclip, Bell,
  Crown, Shield, Sword, AlertTriangle, Zap, Radio
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: 'red' | 'blue' | 'lead' | 'observer';
  status: 'online' | 'busy' | 'away';
  avatar: string;
  currentPanel?: string;
  typing?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: 'red' | 'blue' | 'lead' | 'observer';
  content: string;
  timestamp: string;
  channel: string;
  pinned?: boolean;
  reactions?: { emoji: string; count: number }[];
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unread?: number;
  users?: number;
}

const LiveCollaborationPanel = () => {
  const [activeChannel, setActiveChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: Channel[] = [
    { id: 'general', name: 'general', type: 'text', unread: 3 },
    { id: 'red-team', name: 'red-team-ops', type: 'text', unread: 1 },
    { id: 'blue-team', name: 'blue-team-defense', type: 'text' },
    { id: 'intel', name: 'threat-intel', type: 'text' },
    { id: 'findings', name: 'findings', type: 'text', unread: 5 },
    { id: 'voice-main', name: 'Main Briefing', type: 'voice', users: 4 },
    { id: 'voice-red', name: 'Red Team Comms', type: 'voice', users: 2 },
    { id: 'voice-blue', name: 'Blue Team Comms', type: 'voice', users: 3 },
  ];

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Sarah Chen', role: 'lead', status: 'online', avatar: 'SC', currentPanel: 'C2 Framework' },
    { id: '2', name: 'Marcus Webb', role: 'red', status: 'online', avatar: 'MW', currentPanel: 'Payload Builder' },
    { id: '3', name: 'Alex Rivera', role: 'red', status: 'busy', avatar: 'AR', currentPanel: 'Network Map', typing: true },
    { id: '4', name: 'Jordan Kim', role: 'blue', status: 'online', avatar: 'JK', currentPanel: 'SIEM Analytics' },
    { id: '5', name: 'Taylor Brooks', role: 'blue', status: 'online', avatar: 'TB', currentPanel: 'Threat Hunting' },
    { id: '6', name: 'Casey Morgan', role: 'blue', status: 'away', avatar: 'CM', currentPanel: 'IOC Manager' },
    { id: '7', name: 'Jamie Lee', role: 'observer', status: 'online', avatar: 'JL' },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Chen',
      userRole: 'lead',
      content: '🎯 Alright team, exercise begins in 5 minutes. Red team, confirm your attack vectors are ready.',
      timestamp: '10:25 AM',
      channel: 'general',
      pinned: true
    },
    {
      id: '2',
      userId: '2',
      userName: 'Marcus Webb',
      userRole: 'red',
      content: 'Payloads are staged, C2 infrastructure is spun up. Ready to execute initial access vector.',
      timestamp: '10:26 AM',
      channel: 'general',
      reactions: [{ emoji: '👍', count: 3 }]
    },
    {
      id: '3',
      userId: '4',
      userName: 'Jordan Kim',
      userRole: 'blue',
      content: 'Blue team is monitoring. All SIEM rules are active, behavioral analytics baseline is set.',
      timestamp: '10:27 AM',
      channel: 'general'
    },
    {
      id: '4',
      userId: '3',
      userName: 'Alex Rivera',
      userRole: 'red',
      content: '⚡ Initial foothold established on DMZ server. Moving to internal recon.',
      timestamp: '10:32 AM',
      channel: 'general',
      reactions: [{ emoji: '🔥', count: 2 }, { emoji: '👀', count: 4 }]
    },
    {
      id: '5',
      userId: '5',
      userName: 'Taylor Brooks',
      userRole: 'blue',
      content: '🚨 Detected anomalous PowerShell execution on DMZSRV01. Investigating...',
      timestamp: '10:33 AM',
      channel: 'general'
    }
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'blue': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'lead': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-neutral-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'red': return <Sword className="w-3 h-3" />;
      case 'blue': return <Shield className="w-3 h-3" />;
      case 'lead': return <Crown className="w-3 h-3" />;
      default: return null;
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '0',
      userName: 'You',
      userRole: 'observer',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');
  const onlineMembers = teamMembers.filter(m => m.status === 'online' || m.status === 'busy');

  return (
    <div className="h-full flex bg-surface text-text-primary">
      {/* Channels Sidebar */}
      <div className="w-56 border-r border-border bg-sidebar-bg flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold">REDSTORM OPS</div>
              <div className="text-[10px] text-text-muted">Joint Exercise Alpha</div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Text Channels */}
            <div className="mb-3">
              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1">
                Text Channels
              </div>
              {textChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                    activeChannel === channel.id
                      ? 'bg-accent/20 text-accent'
                      : 'text-text-muted hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.unread && (
                    <Badge className="h-4 px-1.5 text-[9px] bg-red-500 text-white">
                      {channel.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Voice Channels */}
            <div className="mb-3">
              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1">
                Voice Channels
              </div>
              {voiceChannels.map((channel) => (
                <button
                  key={channel.id}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.users && (
                    <span className="text-[10px] text-green-400">{channel.users}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Online Members */}
            <div>
              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1">
                Online — {onlineMembers.length}
              </div>
              {onlineMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface transition-colors"
                >
                  <div className="relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getRoleColor(member.role)}`}>
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-sidebar-bg ${getStatusColor(member.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] truncate">{member.name}</span>
                      {getRoleIcon(member.role)}
                    </div>
                    {member.currentPanel && (
                      <div className="text-[9px] text-text-muted truncate">{member.currentPanel}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* User Controls */}
        <div className="p-2 border-t border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                  YU
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-green-500" />
              </div>
              <div className="text-[11px]">
                <div className="font-medium">You</div>
                <div className="text-text-muted text-[9px]">Observer</div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between bg-sidebar-bg">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-medium">{channels.find(c => c.id === activeChannel)?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Bell className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Pin className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2 bg-status-warning/10 border-b border-status-warning/30 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-status-warning" />
          <span className="text-[10px] text-status-warning">
            <span className="font-semibold">SIMULATION EXERCISE</span>
            <span className="text-text-muted ml-1">All communications are part of the training scenario.</span>
          </span>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages
              .filter(m => m.channel === activeChannel || activeChannel === 'general')
              .map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.pinned ? 'bg-yellow-500/5 -mx-2 px-2 py-2 rounded border-l-2 border-yellow-500' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getRoleColor(msg.userRole)}`}>
                    {msg.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{msg.userName}</span>
                      <Badge className={`text-[9px] px-1.5 py-0 h-4 ${getRoleColor(msg.userRole)}`}>
                        {msg.userRole}
                      </Badge>
                      <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                      {msg.pinned && <Pin className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <p className="text-sm text-text-secondary">{msg.content}</p>
                    {msg.reactions && (
                      <div className="flex gap-1 mt-1">
                        {msg.reactions.map((r, i) => (
                          <button key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border hover:border-accent/30 text-xs">
                            <span>{r.emoji}</span>
                            <span className="text-text-muted">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Typing Indicator */}
        {teamMembers.some(m => m.typing) && (
          <div className="px-4 py-1 text-[10px] text-text-muted">
            <span className="font-medium">{teamMembers.find(m => m.typing)?.name}</span> is typing...
          </div>
        )}

        {/* Message Input */}
        <div className="p-3 border-t border-border bg-sidebar-bg">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-9 w-9 flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name}`}
                className="pr-20 h-9 text-sm bg-background border-border"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Image className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Smile className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <Button size="icon" className="h-9 w-9 bg-accent hover:bg-accent/90 flex-shrink-0" onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCollaborationPanel;