import { useState, useMemo } from 'react';
import { Crosshair, Target, Key, Maximize, Activity, Database, Shield, Skull, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useThreatActors, useAttackCampaigns } from '@/hooks/useThreatActors';
import { useSecurityEvents } from '@/hooks/useSecurityData';

// MITRE ATT&CK Tactics (in order)
const MITRE_TACTICS = [
  { id: 'reconnaissance', name: 'Reconnaissance', abbrev: 'RECON', color: '#6366f1' },
  { id: 'resource-development', name: 'Resource Development', abbrev: 'RES DEV', color: '#8b5cf6' },
  { id: 'initial-access', name: 'Initial Access', abbrev: 'INIT', color: '#a855f7' },
  { id: 'execution', name: 'Execution', abbrev: 'EXEC', color: '#d946ef' },
  { id: 'persistence', name: 'Persistence', abbrev: 'PERSIST', color: '#ec4899' },
  { id: 'privilege-escalation', name: 'Privilege Escalation', abbrev: 'PRIV ESC', color: '#f43f5e' },
  { id: 'defense-evasion', name: 'Defense Evasion', abbrev: 'DEF EVA', color: '#ef4444' },
  { id: 'credential-access', name: 'Credential Access', abbrev: 'CRED', color: '#f97316' },
  { id: 'discovery', name: 'Discovery', abbrev: 'DISC', color: '#f59e0b' },
  { id: 'lateral-movement', name: 'Lateral Movement', abbrev: 'LAT MOV', color: '#eab308' },
  { id: 'collection', name: 'Collection', abbrev: 'COLLECT', color: '#84cc16' },
  { id: 'command-and-control', name: 'Command & Control', abbrev: 'C2', color: '#22c55e' },
  { id: 'exfiltration', name: 'Exfiltration', abbrev: 'EXFIL', color: '#14b8a6' },
  { id: 'impact', name: 'Impact', abbrev: 'IMPACT', color: '#06b6d4' },
];

// Lockheed Martin Kill Chain Phases
const LOCKHEED_PHASES = [
  { id: 'reconnaissance', name: 'Reconnaissance', abbrev: 'RECON', icon: Crosshair, color: '#6366f1', description: 'Harvesting email addresses, conference information, etc.' },
  { id: 'weaponization', name: 'Weaponization', abbrev: 'WEAPON', icon: Target, color: '#8b5cf6', description: 'Coupling exploit with backdoor into deliverable payload' },
  { id: 'delivery', name: 'Delivery', abbrev: 'DELIVER', icon: ChevronRight, color: '#d946ef', description: 'Delivering weaponized bundle via email, web, USB, etc.' },
  { id: 'exploitation', name: 'Exploitation', abbrev: 'EXPLOIT', icon: Key, color: '#f43f5e', description: 'Exploiting vulnerability to execute code' },
  { id: 'installation', name: 'Installation', abbrev: 'INSTALL', icon: Maximize, color: '#f97316', description: 'Installing malware on asset' },
  { id: 'command-control', name: 'Command & Control', abbrev: 'C2', icon: Activity, color: '#22c55e', description: 'Command channel for remote manipulation' },
  { id: 'actions', name: 'Actions on Objectives', abbrev: 'ACTIONS', icon: Skull, color: '#06b6d4', description: 'Accomplishing original goals' },
];

// Map MITRE techniques to kill chain phases
const mapTechniqueToMitreTactic = (technique: string): string | null => {
  const t = technique.toLowerCase();
  if (t.includes('recon') || t.includes('scan') || t.includes('gather')) return 'reconnaissance';
  if (t.includes('phish') || t.includes('exploit') || t.includes('drive-by') || t.includes('supply-chain')) return 'initial-access';
  if (t.includes('script') || t.includes('powershell') || t.includes('cmd') || t.includes('execute')) return 'execution';
  if (t.includes('persist') || t.includes('boot') || t.includes('scheduled') || t.includes('registry')) return 'persistence';
  if (t.includes('privilege') || t.includes('elevation') || t.includes('uac')) return 'privilege-escalation';
  if (t.includes('evas') || t.includes('obfuscat') || t.includes('masquerade')) return 'defense-evasion';
  if (t.includes('credential') || t.includes('password') || t.includes('kerberos') || t.includes('dump')) return 'credential-access';
  if (t.includes('discover') || t.includes('enum') || t.includes('account')) return 'discovery';
  if (t.includes('lateral') || t.includes('remote') || t.includes('pass-the')) return 'lateral-movement';
  if (t.includes('collect') || t.includes('clipboard') || t.includes('screen')) return 'collection';
  if (t.includes('c2') || t.includes('command') || t.includes('proxy') || t.includes('tunnel')) return 'command-and-control';
  if (t.includes('exfil') || t.includes('transfer')) return 'exfiltration';
  if (t.includes('impact') || t.includes('destroy') || t.includes('ransom') || t.includes('wipe')) return 'impact';
  return null;
};

const mapTechniqueToLockheed = (technique: string): string | null => {
  const t = technique.toLowerCase();
  if (t.includes('recon') || t.includes('scan') || t.includes('gather') || t.includes('enum')) return 'reconnaissance';
  if (t.includes('payload') || t.includes('implant') || t.includes('builder')) return 'weaponization';
  if (t.includes('phish') || t.includes('drive-by') || t.includes('supply-chain') || t.includes('usb')) return 'delivery';
  if (t.includes('exploit') || t.includes('vulnerability') || t.includes('injection')) return 'exploitation';
  if (t.includes('persist') || t.includes('install') || t.includes('malware') || t.includes('backdoor')) return 'installation';
  if (t.includes('c2') || t.includes('command') || t.includes('beacon') || t.includes('proxy')) return 'command-control';
  if (t.includes('exfil') || t.includes('ransom') || t.includes('impact') || t.includes('lateral') || t.includes('credential')) return 'actions';
  return null;
};

const KillChainVisualization = () => {
  const [viewMode, setViewMode] = useState<'mitre' | 'lockheed'>('mitre');

  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { events } = useSecurityEvents();

  // Collect all techniques from actors, campaigns, events
  const allTechniques = useMemo(() => {
    const techniques: string[] = [];
    actors.forEach(a => a.known_ttps?.forEach(t => techniques.push(t)));
    campaigns.forEach(c => c.techniques_used?.forEach(t => techniques.push(t)));
    events.forEach(e => e.mitre_technique && techniques.push(e.mitre_technique));
    return techniques;
  }, [actors, campaigns, events]);

  // Count techniques per phase
  const mitreCounts = useMemo(() => {
    const counts: Record<string, { count: number; techniques: string[] }> = {};
    MITRE_TACTICS.forEach(t => { counts[t.id] = { count: 0, techniques: [] }; });
    allTechniques.forEach(tech => {
      const tactic = mapTechniqueToMitreTactic(tech);
      if (tactic && counts[tactic]) {
        counts[tactic].count++;
        if (!counts[tactic].techniques.includes(tech)) {
          counts[tactic].techniques.push(tech);
        }
      }
    });
    return counts;
  }, [allTechniques]);

  const lockheedCounts = useMemo(() => {
    const counts: Record<string, { count: number; techniques: string[] }> = {};
    LOCKHEED_PHASES.forEach(p => { counts[p.id] = { count: 0, techniques: [] }; });
    allTechniques.forEach(tech => {
      const phase = mapTechniqueToLockheed(tech);
      if (phase && counts[phase]) {
        counts[phase].count++;
        if (!counts[phase].techniques.includes(tech)) {
          counts[phase].techniques.push(tech);
        }
      }
    });
    return counts;
  }, [allTechniques]);

  const maxMitreCount = Math.max(...Object.values(mitreCounts).map(c => c.count), 1);
  const maxLockheedCount = Math.max(...Object.values(lockheedCounts).map(c => c.count), 1);

  return (
    <div className="h-full flex flex-col bg-neutral-950">
      {/* Header */}
      <div className="p-4 border-b border-red-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-400" />
            <h2 className="text-sm font-semibold text-neutral-200">Kill Chain Visualization</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'mitre' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mitre')}
              className="h-7 text-xs"
            >
              <Shield className="w-3 h-3 mr-1" />
              MITRE
            </Button>
            <Button
              variant={viewMode === 'lockheed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('lockheed')}
              className="h-7 text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              Lockheed
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-neutral-500">
          {viewMode === 'mitre'
            ? 'MITRE ATT&CK framework: 14 tactics from Reconnaissance to Impact'
            : 'Lockheed Martin Cyber Kill Chain: 7 phases of intrusion'
          }
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <TooltipProvider>
          {viewMode === 'mitre' ? (
            /* MITRE ATT&CK View */
            <div className="space-y-3">
              {/* Flow visualization */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {MITRE_TACTICS.map((tactic, idx) => {
                  const data = mitreCounts[tactic.id];
                  const intensity = data.count / maxMitreCount;
                  return (
                    <Tooltip key={tactic.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="flex flex-col items-center min-w-[60px] p-2 rounded-lg border transition-all cursor-pointer hover:scale-105"
                          style={{
                            borderColor: tactic.color,
                            backgroundColor: `${tactic.color}${Math.round(intensity * 40 + 10).toString(16).padStart(2, '0')}`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                            style={{ backgroundColor: tactic.color }}
                          >
                            {data.count}
                          </div>
                          <span className="text-[8px] text-center text-neutral-300 whitespace-nowrap">{tactic.abbrev}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p className="font-semibold">{tactic.name}</p>
                        <p className="text-xs text-neutral-400">{data.count} techniques detected</p>
                        {data.techniques.length > 0 && (
                          <div className="mt-1 text-[10px] text-neutral-500">
                            {data.techniques.slice(0, 5).join(', ')}
                            {data.techniques.length > 5 && ` +${data.techniques.length - 5} more`}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Arrow flow indicator */}
              <div className="flex items-center justify-center gap-1 py-2">
                <span className="text-[10px] text-neutral-500">Attack Progression</span>
                <ChevronRight className="w-4 h-4 text-red-500" />
                <ChevronRight className="w-4 h-4 text-red-500 -ml-2" />
                <ChevronRight className="w-4 h-4 text-red-500 -ml-2" />
              </div>

              {/* Detailed list */}
              <div className="space-y-2 mt-4">
                {MITRE_TACTICS.filter(t => mitreCounts[t.id].count > 0).map(tactic => {
                  const data = mitreCounts[tactic.id];
                  return (
                    <div
                      key={tactic.id}
                      className="p-3 rounded-lg border"
                      style={{ borderColor: `${tactic.color}40`, backgroundColor: `${tactic.color}10` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tactic.color }} />
                          <span className="text-sm font-medium text-neutral-200">{tactic.name}</span>
                        </div>
                        <Badge variant="outline" style={{ borderColor: tactic.color, color: tactic.color }}>
                          {data.count}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {data.techniques.slice(0, 8).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-[9px]">{tech}</Badge>
                        ))}
                        {data.techniques.length > 8 && (
                          <Badge variant="outline" className="text-[9px]">+{data.techniques.length - 8}</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Lockheed Martin Kill Chain View */
            <div className="space-y-4">
              {/* Horizontal chain */}
              <div className="relative">
                <div className="flex items-stretch gap-0">
                  {LOCKHEED_PHASES.map((phase, idx) => {
                    const data = lockheedCounts[phase.id];
                    const intensity = data.count / maxLockheedCount;
                    const Icon = phase.icon;
                    return (
                      <Tooltip key={phase.id}>
                        <TooltipTrigger asChild>
                          <div
                            className="flex-1 relative cursor-pointer transition-all hover:scale-[1.02]"
                            style={{ minWidth: '80px' }}
                          >
                            {/* Arrow shape */}
                            <div
                              className="h-20 flex flex-col items-center justify-center p-2 relative"
                              style={{
                                backgroundColor: `${phase.color}${Math.round(intensity * 50 + 20).toString(16).padStart(2, '0')}`,
                                clipPath: idx === LOCKHEED_PHASES.length - 1
                                  ? 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)'
                                  : 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)',
                                marginLeft: idx > 0 ? '-10px' : 0,
                              }}
                            >
                              <Icon className="w-5 h-5 mb-1" style={{ color: phase.color }} />
                              <span className="text-[9px] font-bold text-neutral-200">{phase.abbrev}</span>
                              <div
                                className="absolute bottom-1 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                                style={{ backgroundColor: phase.color }}
                              >
                                {data.count}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="font-semibold">{phase.name}</p>
                          <p className="text-xs text-neutral-400 mb-1">{phase.description}</p>
                          <p className="text-xs">{data.count} techniques detected</p>
                          {data.techniques.length > 0 && (
                            <div className="mt-1 text-[10px] text-neutral-500">
                              {data.techniques.slice(0, 5).join(', ')}
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              {/* Phase details */}
              <div className="space-y-2 mt-6">
                {LOCKHEED_PHASES.map(phase => {
                  const data = lockheedCounts[phase.id];
                  const Icon = phase.icon;
                  return (
                    <div
                      key={phase.id}
                      className="p-3 rounded-lg border"
                      style={{ borderColor: `${phase.color}40`, backgroundColor: `${phase.color}10` }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5" style={{ color: phase.color }} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-200">{phase.name}</span>
                            <Badge variant="outline" style={{ borderColor: phase.color, color: phase.color }}>
                              {data.count} hits
                            </Badge>
                          </div>
                          <p className="text-[10px] text-neutral-500">{phase.description}</p>
                        </div>
                      </div>
                      {data.techniques.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {data.techniques.slice(0, 6).map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-[9px]">{tech}</Badge>
                          ))}
                          {data.techniques.length > 6 && (
                            <Badge variant="outline" className="text-[9px]">+{data.techniques.length - 6}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TooltipProvider>
      </ScrollArea>

      {/* Footer stats */}
      <div className="p-3 border-t border-red-500/10">
        <div className="flex items-center justify-between text-[10px] text-neutral-500">
          <span>{allTechniques.length} total technique instances analyzed</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Live data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KillChainVisualization;
