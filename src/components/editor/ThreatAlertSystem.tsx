import { useEffect, useState, useCallback } from 'react';
import { Bell, BellRing, AlertTriangle, Shield, Activity, X, ExternalLink, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useSecurityEvents, useIOCs } from '@/hooks/useSecurityData';
import { useThreatActors, useAttackCampaigns } from '@/hooks/useThreatActors';
import { toast } from 'sonner';

interface ThreatAlert {
  id: string;
  type: 'ioc' | 'campaign' | 'actor' | 'event';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  dismissed: boolean;
  metadata?: Record<string, unknown>;
}

const ThreatAlertSystem = () => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();

  // Check push permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Push notifications not supported in this browser');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      setPushEnabled(permission === 'granted');
      if (permission === 'granted') {
        toast.success('Push notifications enabled');
        // Register service worker for PWA push
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
          } catch {
            // SW registration is optional
          }
        }
      } else {
        toast.error('Push notifications denied');
      }
    } catch (err) {
      console.error('Push permission error:', err);
    }
  };

  const sendPushNotification = useCallback((alert: ThreatAlert) => {
    if (pushEnabled && pushPermission === 'granted') {
      try {
        new Notification(`🚨 ${alert.severity.toUpperCase()}: ${alert.title}`, {
          body: alert.description,
          icon: '/favicon.ico',
          tag: alert.id,
          requireInteraction: alert.severity === 'critical',
        });
      } catch (err) {
        console.error('Notification error:', err);
      }
    }
  }, [pushEnabled, pushPermission]);

  const playAlertSound = useCallback(() => {
    if (soundEnabled) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleBlAqvDAumMRD1e8/eSofCEKar3mtHouAAB5t+HKkzwAAGu03MCfURQKY7LRpGY0DA1lsdCiZjMNDmes');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {
        // Audio may not be available
      }
    }
  }, [soundEnabled]);

  const addAlert = useCallback((alert: Omit<ThreatAlert, 'id' | 'timestamp' | 'dismissed'>) => {
    const newAlert: ThreatAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date(),
      dismissed: false,
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 100));

    // Toast notification
    const toastType = alert.severity === 'critical' || alert.severity === 'high' ? 'error' : 'warning';
    toast[toastType](`${alert.title}`, {
      description: alert.description,
      duration: alert.severity === 'critical' ? 10000 : 5000,
    });

    // Push notification for critical/high
    if (alert.severity === 'critical' || alert.severity === 'high') {
      sendPushNotification(newAlert);
      playAlertSound();
    }
  }, [sendPushNotification, playAlertSound]);

  // Monitor IOCs for critical threats
  useEffect(() => {
    const criticalIOCs = iocs.filter(ioc => ioc.threat_level === 'critical' && ioc.is_active);
    criticalIOCs.forEach(ioc => {
      const existingAlert = alerts.find(a => a.source === `ioc-${ioc.id}`);
      if (!existingAlert) {
        addAlert({
          type: 'ioc',
          severity: 'critical',
          title: `Critical IOC Detected: ${ioc.ioc_type}`,
          description: `Active threat indicator: ${ioc.value.slice(0, 50)}...`,
          source: `ioc-${ioc.id}`,
          metadata: { iocId: ioc.id, value: ioc.value },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iocs]);

  // Monitor campaigns becoming active
  useEffect(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    activeCampaigns.forEach(campaign => {
      const existingAlert = alerts.find(a => a.source === `campaign-${campaign.id}`);
      if (!existingAlert) {
        addAlert({
          type: 'campaign',
          severity: 'high',
          title: `Campaign Active: ${campaign.name}`,
          description: campaign.description || 'Attack campaign has become active',
          source: `campaign-${campaign.id}`,
          metadata: { campaignId: campaign.id },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns]);

  // Monitor critical security events
  useEffect(() => {
    const criticalEvents = events.filter(e => e.severity === 'critical');
    criticalEvents.slice(0, 5).forEach(event => {
      const existingAlert = alerts.find(a => a.source === `event-${event.id}`);
      if (!existingAlert) {
        addAlert({
          type: 'event',
          severity: 'critical',
          title: `Critical Event: ${event.event_type}`,
          description: event.description,
          source: `event-${event.id}`,
          metadata: { eventId: event.id },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const clearAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const highCount = activeAlerts.filter(a => a.severity === 'high').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ioc': return <Shield className="w-4 h-4" />;
      case 'campaign': return <Activity className="w-4 h-4" />;
      case 'actor': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-950 border-l border-red-500/10">
      {/* Header */}
      <div className="p-3 border-b border-red-500/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              {activeAlerts.length > 0 ? (
                <BellRing className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <Bell className="w-5 h-5 text-neutral-500" />
              )}
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                  {activeAlerts.length > 99 ? '99+' : activeAlerts.length}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-neutral-200">Threat Alerts</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-green-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowPanel(!showPanel)}
            >
              <Settings className="w-4 h-4 text-neutral-400" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
              {criticalCount} CRITICAL
            </Badge>
          )}
          {highCount > 0 && (
            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
              {highCount} HIGH
            </Badge>
          )}
          {activeAlerts.length === 0 && (
            <span className="text-neutral-500">No active alerts</span>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showPanel && (
        <div className="p-3 border-b border-red-500/10 bg-neutral-900/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Push Notifications</span>
              <div className="flex items-center gap-2">
                {pushPermission !== 'granted' && (
                  <Button size="sm" variant="outline" onClick={requestPushPermission} className="h-6 text-[10px]">
                    Enable
                  </Button>
                )}
                <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} disabled={pushPermission !== 'granted'} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Alert Sounds</span>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
            {activeAlerts.length > 0 && (
              <Button size="sm" variant="destructive" onClick={clearAllAlerts} className="w-full h-7 text-xs">
                Dismiss All Alerts
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Alerts List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-8 h-8 mx-auto text-green-500/50 mb-2" />
              <p className="text-xs text-neutral-500">All clear - no active threats</p>
            </div>
          ) : (
            activeAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} relative group`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="w-3 h-3" />
                </Button>

                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[9px] uppercase ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </Badge>
                      <span className="text-[10px] text-neutral-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-200 truncate">{alert.title}</p>
                    <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2">{alert.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-red-500/10">
        <div className="flex items-center justify-between text-[9px] text-neutral-600">
          <span>Real-time monitoring active</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatAlertSystem;
