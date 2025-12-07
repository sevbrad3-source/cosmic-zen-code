import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, Shield, Sword, Play, Clock, Users, 
  ChevronRight, Search, Filter, Star, Target,
  AlertTriangle, CheckCircle, Zap, Lock
} from 'lucide-react';

interface Playbook {
  id: string;
  name: string;
  type: 'attack' | 'defense';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  participants: string;
  description: string;
  techniques: string[];
  objectives: string[];
  starred?: boolean;
}

const ScenarioPlaybookPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'attack' | 'defense'>('all');
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);

  const playbooks: Playbook[] = [
    {
      id: 'apt-simulation',
      name: 'APT29 Simulation',
      type: 'attack',
      difficulty: 'advanced',
      duration: '4-6 hours',
      participants: '2-4',
      description: 'Simulate Cozy Bear tactics including spearphishing, credential harvesting, and lateral movement.',
      techniques: ['T1566', 'T1003', 'T1021', 'T1074'],
      objectives: ['Initial access via phishing', 'Credential dumping', 'Domain enumeration', 'Data staging'],
      starred: true
    },
    {
      id: 'ransomware-defense',
      name: 'Ransomware Incident Response',
      type: 'defense',
      difficulty: 'intermediate',
      duration: '2-3 hours',
      participants: '3-6',
      description: 'Practice containment, eradication, and recovery procedures for ransomware incidents.',
      techniques: ['T1486', 'T1490', 'T1489'],
      objectives: ['Isolate affected systems', 'Identify ransomware variant', 'Restore from backups', 'Document timeline'],
      starred: true
    },
    {
      id: 'web-app-pentest',
      name: 'Web Application Pentest',
      type: 'attack',
      difficulty: 'intermediate',
      duration: '3-4 hours',
      participants: '1-2',
      description: 'Comprehensive web application security assessment covering OWASP Top 10 vulnerabilities.',
      techniques: ['T1190', 'T1059', 'T1071'],
      objectives: ['SQL injection testing', 'XSS discovery', 'Authentication bypass', 'Session hijacking']
    },
    {
      id: 'threat-hunting',
      name: 'Threat Hunting Exercise',
      type: 'defense',
      difficulty: 'advanced',
      duration: '4-8 hours',
      participants: '2-4',
      description: 'Proactive threat hunting exercise focusing on detecting living-off-the-land techniques.',
      techniques: ['T1059.001', 'T1053', 'T1218'],
      objectives: ['Baseline normal behavior', 'Hunt for PowerShell anomalies', 'Scheduled task analysis', 'LOLBin detection']
    },
    {
      id: 'supply-chain',
      name: 'Supply Chain Attack',
      type: 'attack',
      difficulty: 'expert',
      duration: '6-8 hours',
      participants: '3-5',
      description: 'Advanced supply chain compromise simulation including third-party software manipulation.',
      techniques: ['T1195', 'T1199', 'T1176'],
      objectives: ['Identify supply chain vector', 'Compromise build pipeline', 'Deploy backdoor', 'Maintain persistence']
    },
    {
      id: 'purple-team',
      name: 'Purple Team Exercise',
      type: 'defense',
      difficulty: 'advanced',
      duration: '8-12 hours',
      participants: '4-8',
      description: 'Collaborative red and blue team exercise with real-time detection validation.',
      techniques: ['T1055', 'T1003', 'T1082', 'T1016'],
      objectives: ['Execute attack chain', 'Validate detections', 'Tune alert rules', 'Document gaps'],
      starred: true
    }
  ];

  const filteredPlaybooks = playbooks.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || p.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'advanced': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'expert': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/30';
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border bg-sidebar-bg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold">Scenario Playbooks</span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/30">
            {playbooks.length} Playbooks
          </Badge>
        </div>

        {/* Safety Banner */}
        <div className="mb-3 p-2 rounded bg-status-warning/10 border border-status-warning/30 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-status-warning flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-status-warning">
            <span className="font-semibold">TRAINING ENVIRONMENT</span>
            <span className="text-text-muted ml-1">All scenarios are for educational purposes only.</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playbooks..."
            className="pl-8 h-8 text-xs bg-background border-border"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant={activeFilter === 'all' ? 'default' : 'ghost'}
            className="h-7 text-xs flex-1"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'attack' ? 'default' : 'ghost'}
            className={`h-7 text-xs flex-1 ${activeFilter === 'attack' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : ''}`}
            onClick={() => setActiveFilter('attack')}
          >
            <Sword className="w-3 h-3 mr-1" />
            Attack
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'defense' ? 'default' : 'ghost'}
            className={`h-7 text-xs flex-1 ${activeFilter === 'defense' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : ''}`}
            onClick={() => setActiveFilter('defense')}
          >
            <Shield className="w-3 h-3 mr-1" />
            Defense
          </Button>
        </div>
      </div>

      {/* Playbook List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredPlaybooks.map((playbook) => (
            <div
              key={playbook.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedPlaybook?.id === playbook.id
                  ? 'bg-accent/10 border-accent/40'
                  : 'bg-sidebar-bg border-border hover:border-accent/30'
              }`}
              onClick={() => setSelectedPlaybook(playbook)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {playbook.type === 'attack' ? (
                    <div className="p-1.5 rounded bg-red-500/10">
                      <Sword className="w-3.5 h-3.5 text-red-400" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded bg-blue-500/10">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">{playbook.name}</span>
                      {playbook.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                    </div>
                    <div className={`text-[10px] capitalize ${getDifficultyColor(playbook.difficulty)} px-1.5 py-0.5 rounded inline-block mt-1`}>
                      {playbook.difficulty}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>

              <p className="text-[10px] text-text-muted mb-2 line-clamp-2">{playbook.description}</p>

              <div className="flex items-center gap-3 text-[10px] text-text-muted">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{playbook.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{playbook.participants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{playbook.techniques.length} TTPs</span>
                </div>
              </div>

              {selectedPlaybook?.id === playbook.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <div className="text-[10px] font-medium text-text-secondary">MITRE Techniques:</div>
                  <div className="flex flex-wrap gap-1">
                    {playbook.techniques.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-[9px] bg-accent/10 border-accent/30 text-accent">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-[10px] font-medium text-text-secondary mt-2">Objectives:</div>
                  <div className="space-y-1">
                    {playbook.objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="w-full mt-3 h-8 text-xs bg-accent hover:bg-accent/90">
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Launch Scenario
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScenarioPlaybookPanel;