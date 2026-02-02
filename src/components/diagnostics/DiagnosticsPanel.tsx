import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  Terminal,
  Activity,
  Wifi,
  Cpu,
  HardDrive,
  AlertTriangle,
  Info,
  Bug,
  Globe,
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Clock,
  Zap,
  Map,
} from 'lucide-react';
import { diagnostics, DiagnosticLog } from '@/lib/diagnostics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DiagnosticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogIcon = ({ type }: { type: DiagnosticLog['type'] }) => {
  switch (type) {
    case 'error':
      return <AlertTriangle className="w-3 h-3 text-red-500" />;
    case 'warn':
      return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    case 'info':
      return <Info className="w-3 h-3 text-blue-400" />;
    case 'debug':
      return <Bug className="w-3 h-3 text-purple-400" />;
    case 'network':
      return <Wifi className="w-3 h-3 text-green-400" />;
    case 'lifecycle':
      return <Activity className="w-3 h-3 text-cyan-400" />;
    case 'performance':
      return <Zap className="w-3 h-3 text-orange-400" />;
    case 'mapbox':
      return <Map className="w-3 h-3 text-red-400" />;
    default:
      return <Terminal className="w-3 h-3 text-gray-400" />;
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
};

const LogEntry = ({ log, expanded, onToggle }: { log: DiagnosticLog; expanded: boolean; onToggle: () => void }) => {
  const hasData = log.data !== undefined || log.stack;

  return (
    <div
      className={`border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors ${
        log.type === 'error' ? 'bg-red-950/20' : log.type === 'warn' ? 'bg-yellow-950/20' : ''
      }`}
    >
      <div
        className="flex items-start gap-2 px-2 py-1 cursor-pointer"
        onClick={hasData ? onToggle : undefined}
      >
        {hasData ? (
          expanded ? (
            <ChevronDown className="w-3 h-3 mt-0.5 text-neutral-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3 h-3 mt-0.5 text-neutral-500 flex-shrink-0" />
          )
        ) : (
          <div className="w-3" />
        )}
        <LogIcon type={log.type} />
        <span className="text-[10px] text-neutral-500 font-mono flex-shrink-0">{formatTime(log.timestamp)}</span>
        <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0 w-16">[{log.source}]</span>
        <span className="text-[11px] text-neutral-300 font-mono break-all flex-1">{log.message}</span>
      </div>
      {expanded && hasData && (
        <div className="px-8 pb-2 text-[10px] font-mono text-neutral-500">
          {log.data && (
            <pre className="bg-neutral-950 p-2 rounded border border-neutral-800 overflow-x-auto max-h-40">
              {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
            </pre>
          )}
          {log.stack && (
            <pre className="bg-red-950/30 p-2 rounded border border-red-900/50 overflow-x-auto max-h-32 mt-1 text-red-400">
              {log.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

const SystemInfoPanel = () => {
  const [info, setInfo] = useState(diagnostics.getSystemInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(diagnostics.getSystemInfo());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 space-y-4 text-xs font-mono">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-400">
            <Globe className="w-3.5 h-3.5" />
            <span>Browser</span>
          </div>
          <div className="bg-neutral-900 rounded p-2 space-y-1 text-neutral-300">
            <div>Platform: {info.platform}</div>
            <div>Language: {info.language}</div>
            <div>Online: {info.onLine ? '✓ Yes' : '✗ No'}</div>
            <div>Cookies: {info.cookieEnabled ? '✓ Enabled' : '✗ Disabled'}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware</span>
          </div>
          <div className="bg-neutral-900 rounded p-2 space-y-1 text-neutral-300">
            <div>Cores: {info.hardwareConcurrency}</div>
            <div>Memory: {info.deviceMemory}GB</div>
            <div>Screen: {info.screen.width}x{info.screen.height}</div>
            <div>Pixel Ratio: {info.screen.pixelRatio}x</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Viewport</span>
          </div>
          <div className="bg-neutral-900 rounded p-2 space-y-1 text-neutral-300">
            <div>Width: {info.viewport.width}px</div>
            <div>Height: {info.viewport.height}px</div>
            <div>Color Depth: {info.screen.colorDepth}bit</div>
          </div>
        </div>

        {info.performance.memory && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Memory</span>
            </div>
            <div className="bg-neutral-900 rounded p-2 space-y-1 text-neutral-300">
              <div>Used: {info.performance.memory.usedJSHeapSize}MB</div>
              <div>Total: {info.performance.memory.totalJSHeapSize}MB</div>
              <div>Limit: {info.performance.memory.jsHeapSizeLimit}MB</div>
              <div className="pt-1">
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all"
                    style={{
                      width: `${(info.performance.memory.usedJSHeapSize / info.performance.memory.jsHeapSizeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {info.connection && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <Wifi className="w-3.5 h-3.5" />
              <span>Network</span>
            </div>
            <div className="bg-neutral-900 rounded p-2 space-y-1 text-neutral-300">
              <div>Type: {info.connection.effectiveType}</div>
              <div>Downlink: {info.connection.downlink} Mbps</div>
              <div>RTT: {info.connection.rtt}ms</div>
            </div>
          </div>
        )}

        {info.performance.timing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Load Times</span>
            </div>
            <div className="bg-neutral-900 rounded p-2 space-y-1 text-neutral-300">
              <div>Page Load: {info.performance.timing.loadTime}ms</div>
              <div>DOM Ready: {info.performance.timing.domReady}ms</div>
              {info.performance.timing.firstPaint && (
                <div>First Paint: {Math.round(info.performance.timing.firstPaint)}ms</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NetworkPanel = () => {
  const requests = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getNetworkRequests()
  );

  return (
    <div className="text-xs font-mono">
      {requests.length === 0 ? (
        <div className="p-4 text-center text-neutral-500">No network requests captured yet</div>
      ) : (
        <div className="divide-y divide-neutral-800">
          {requests.map((req) => (
            <div key={req.id} className="px-3 py-2 hover:bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[9px] px-1 py-0 ${
                    req.status === null
                      ? 'border-yellow-500 text-yellow-500'
                      : req.status >= 200 && req.status < 300
                      ? 'border-green-500 text-green-500'
                      : req.status >= 400
                      ? 'border-red-500 text-red-500'
                      : 'border-blue-500 text-blue-500'
                  }`}
                >
                  {req.status ?? '...'}
                </Badge>
                <span className="text-neutral-500 w-8">{req.method}</span>
                <span className="text-neutral-300 truncate flex-1">{req.url}</span>
                {req.duration !== null && (
                  <span className="text-neutral-500">{req.duration}ms</span>
                )}
              </div>
              {req.error && (
                <div className="mt-1 text-red-400 text-[10px]">{req.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LifecyclePanel = () => {
  const events = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getLifecycle()
  );

  return (
    <div className="text-xs font-mono">
      {events.length === 0 ? (
        <div className="p-4 text-center text-neutral-500">No lifecycle events captured yet</div>
      ) : (
        <div className="divide-y divide-neutral-800">
          {events.map((event, i) => (
            <div key={i} className="px-3 py-1.5 hover:bg-neutral-900/50 flex items-center gap-2">
              <span className="text-neutral-500">{formatTime(event.timestamp)}</span>
              <Badge
                variant="outline"
                className={`text-[9px] px-1 py-0 ${
                  event.event === 'mount'
                    ? 'border-green-500 text-green-500'
                    : event.event === 'unmount'
                    ? 'border-red-500 text-red-500'
                    : event.event === 'error'
                    ? 'border-red-600 text-red-600 bg-red-950/30'
                    : 'border-blue-500 text-blue-500'
                }`}
              >
                {event.event}
              </Badge>
              <span className="text-neutral-300">{event.component}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DiagnosticsPanel = ({ isOpen, onClose }: DiagnosticsPanelProps) => {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [isMaximized, setIsMaximized] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const logs = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getLogs()
  );

  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.type === filter);

  const errorCount = logs.filter((l) => l.type === 'error').length;
  const warnCount = logs.filter((l) => l.type === 'warn').length;
  const mapboxCount = logs.filter((l) => l.type === 'mapbox').length;

  const toggleExpanded = (id: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExport = () => {
    const data = diagnostics.exportLogs();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 bg-black/95 border border-neutral-800 rounded-lg shadow-2xl flex flex-col backdrop-blur-sm ${
        isMaximized
          ? 'inset-4'
          : 'bottom-4 right-4 w-[600px] h-[450px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-neutral-200">Diagnostics Console</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {errorCount > 0 && (
              <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                {errorCount} errors
              </Badge>
            )}
            {warnCount > 0 && (
              <Badge className="bg-yellow-600 px-1.5 py-0 text-[10px]">{warnCount} warnings</Badge>
            )}
            {mapboxCount > 0 && (
              <Badge className="bg-red-600 px-1.5 py-0 text-[10px]">{mapboxCount} mapbox</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
          >
            {autoScroll ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleExport} title="Export logs">
            <Download className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => diagnostics.clear()}
            title="Clear logs"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="console" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-2 mt-2 bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="console" className="text-xs">Console</TabsTrigger>
          <TabsTrigger value="network" className="text-xs">Network</TabsTrigger>
          <TabsTrigger value="lifecycle" className="text-xs">Lifecycle</TabsTrigger>
          <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="flex-1 flex flex-col overflow-hidden m-0 p-0">
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800">
            <Filter className="w-3 h-3 text-neutral-500" />
            <div className="flex gap-1">
              {['all', 'error', 'warn', 'info', 'log', 'mapbox', 'network'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                    filter === f
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-neutral-800">
              {filteredLogs.length === 0 ? (
                <div className="p-4 text-center text-neutral-500 text-sm">No logs yet</div>
              ) : (
                filteredLogs.map((log) => (
                  <LogEntry
                    key={log.id}
                    log={log}
                    expanded={expandedLogs.has(log.id)}
                    onToggle={() => toggleExpanded(log.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="network" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <NetworkPanel />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="lifecycle" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <LifecyclePanel />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="system" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <SystemInfoPanel />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 text-[10px] text-neutral-500 border-t border-neutral-800 bg-neutral-900/30">
        <span>{logs.length} logs captured</span>
        <span>Press F12 for browser DevTools</span>
      </div>
    </div>
  );
};

export default DiagnosticsPanel;
