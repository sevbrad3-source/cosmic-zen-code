import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Radio, AlertTriangle, Globe, Clock, RefreshCw,
  ExternalLink, Shield, Skull, Activity, Zap,
  Bell, Filter, Search, CheckCircle, XCircle
} from 'lucide-react';

interface ThreatFeed {
  id: string;
  name: string;
  source: string;
  lastUpdate: string;
  status: 'active' | 'stale' | 'error';
  iocCount: number;
}

interface ThreatAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  source: string;
  timestamp: string;
  iocs: string[];
  matched: boolean;
  description: string;
}

const ThreatIntelFeedsPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feeds' | 'alerts' | 'correlation'>('alerts');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const feeds: ThreatFeed[] = [
    { id: '1', name: 'AlienVault OTX', source: 'otx.alienvault.com', lastUpdate: '2 min ago', status: 'active', iocCount: 15234 },
    { id: '2', name: 'Abuse.ch URLhaus', source: 'urlhaus.abuse.ch', lastUpdate: '5 min ago', status: 'active', iocCount: 8456 },
    { id: '3', name: 'CIRCL MISP', source: 'misp.circl.lu', lastUpdate: '1 hour ago', status: 'stale', iocCount: 45678 },
    { id: '4', name: 'VirusTotal', source: 'virustotal.com', lastUpdate: '30 sec ago', status: 'active', iocCount: 125000 },
    { id: '5', name: 'Shodan', source: 'shodan.io', lastUpdate: '15 min ago', status: 'active', iocCount: 3421 },
    { id: '6', name: 'ThreatFox', source: 'threatfox.abuse.ch', lastUpdate: 'Error', status: 'error', iocCount: 0 },
  ];

  const alerts: ThreatAlert[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'APT41 Infrastructure Detected',
      source: 'Mandiant',
      timestamp: '2 min ago',
      iocs: ['185.220.101.1', 'evil-domain.com', 'SHA256:a1b2c3...'],
      matched: true,
      description: 'Known APT41 C2 infrastructure identified matching internal network traffic patterns.'
    },
    {
      id: '2',
      severity: 'high',
      title: 'New Cobalt Strike Beacon Signature',
      source: 'AlienVault OTX',
      timestamp: '15 min ago',
      iocs: ['192.168.1.100', 'beacon.dll'],
      matched: false,
      description: 'Updated Cobalt Strike malleable C2 profile signatures detected in threat feeds.'
    },
    {
      id: '3',
      severity: 'high',
      title: 'Ransomware Campaign IOCs',
      source: 'CISA',
      timestamp: '1 hour ago',
      iocs: ['lockbit3.onion', 'ransom-note.txt', 'encrypt.exe'],
      matched: true,
      description: 'LockBit 3.0 ransomware indicators correlating with recent network anomalies.'
    },
    {
      id: '4',
      severity: 'medium',
      title: 'Phishing Kit Infrastructure',
      source: 'URLhaus',
      timestamp: '2 hours ago',
      iocs: ['phish-site.com', 'fake-login.html'],
      matched: false,
      description: 'New phishing kit targeting Office 365 credentials detected in the wild.'
    },
    {
      id: '5',
      severity: 'low',
      title: 'Scanning Activity Increase',
      source: 'Shodan',
      timestamp: '4 hours ago',
      iocs: ['45.33.32.156', '185.176.27.0/24'],
      matched: false,
      description: 'Increased scanning activity from known research networks targeting exposed services.'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'stale': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-surface text-text-primary">
      {/* Header */}
      <div className="p-3 border-b border-border bg-sidebar-bg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold">Threat Intelligence</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Safety Banner */}
        <div className="mb-3 p-2 rounded bg-status-warning/10 border border-status-warning/30 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-status-warning flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-status-warning">
            <span className="font-semibold">SIMULATED FEEDS</span>
            <span className="text-text-muted ml-1">All threat data is mocked for training purposes.</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded p-1">
          <Button
            size="sm"
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            className="h-7 text-xs flex-1"
            onClick={() => setActiveTab('alerts')}
          >
            <Bell className="w-3 h-3 mr-1" />
            Alerts
            <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-red-500/20 text-red-400">5</Badge>
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'feeds' ? 'default' : 'ghost'}
            className="h-7 text-xs flex-1"
            onClick={() => setActiveTab('feeds')}
          >
            <Globe className="w-3 h-3 mr-1" />
            Feeds
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'correlation' ? 'default' : 'ghost'}
            className="h-7 text-xs flex-1"
            onClick={() => setActiveTab('correlation')}
          >
            <Activity className="w-3 h-3 mr-1" />
            Correlation
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {activeTab === 'alerts' && (
            <>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${
                    alert.matched
                      ? 'bg-red-500/5 border-red-500/30'
                      : 'bg-sidebar-bg border-border hover:border-accent/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'critical' ? (
                          <Skull className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{alert.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted">{alert.source}</span>
                          <span className="text-[10px] text-text-muted">•</span>
                          <span className="text-[10px] text-text-muted">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    {alert.matched && (
                      <Badge className="text-[9px] bg-red-500/20 text-red-400 border-red-500/30">
                        <Zap className="w-2.5 h-2.5 mr-0.5" />
                        MATCHED
                      </Badge>
                    )}
                  </div>

                  <p className="text-[10px] text-text-muted mb-2">{alert.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {alert.iocs.slice(0, 3).map((ioc, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] font-mono bg-background border-border">
                        {ioc}
                      </Badge>
                    ))}
                    {alert.iocs.length > 3 && (
                      <Badge variant="outline" className="text-[9px] bg-background border-border">
                        +{alert.iocs.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-6 text-[10px] flex-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[10px] flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'feeds' && (
            <>
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="p-3 rounded-lg border bg-sidebar-bg border-border hover:border-accent/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium">{feed.name}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] ${getStatusColor(feed.status)}`}>
                      {feed.status === 'active' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : feed.status === 'error' ? (
                        <XCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span className="capitalize">{feed.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span>{feed.source}</span>
                    <span>{feed.iocCount.toLocaleString()} IOCs</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Updated {feed.lastUpdate}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'correlation' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg border bg-sidebar-bg border-border">
                <div className="text-xs font-medium mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  Auto-Correlation Engine
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-lg font-bold text-red-400">23</div>
                    <div className="text-[10px] text-text-muted">IOC Matches</div>
                  </div>
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-lg font-bold text-orange-400">7</div>
                    <div className="text-[10px] text-text-muted">Active Alerts</div>
                  </div>
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-lg font-bold text-yellow-400">156</div>
                    <div className="text-[10px] text-text-muted">Scanned Today</div>
                  </div>
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-lg font-bold text-green-400">98.2%</div>
                    <div className="text-[10px] text-text-muted">Feed Coverage</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-sidebar-bg border-border">
                <div className="text-xs font-medium mb-2">Recent Correlations</div>
                <div className="space-y-2">
                  {[
                    { ioc: '185.220.101.1', feeds: 3, type: 'IP', confidence: 95 },
                    { ioc: 'evil-domain.com', feeds: 2, type: 'Domain', confidence: 87 },
                    { ioc: 'SHA256:a1b2c3...', feeds: 4, type: 'Hash', confidence: 99 },
                  ].map((corr, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-background border border-border">
                      <div>
                        <div className="text-[10px] font-mono">{corr.ioc}</div>
                        <div className="text-[9px] text-text-muted">{corr.feeds} feeds • {corr.type}</div>
                      </div>
                      <Badge className={`text-[9px] ${corr.confidence >= 90 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {corr.confidence}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThreatIntelFeedsPanel;