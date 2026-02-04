import { useState, useSyncExternalStore } from 'react';
import { diagnostics, MemoryLeakSuspect } from '@/lib/diagnostics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Clock, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronDown,
  Activity,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

interface RenderMetric {
  component: string;
  renderCount: number;
  totalTime: number;
  avgTime: number;
  lastRenderTime: number;
  trend: 'up' | 'down' | 'stable';
}

const TrendIcon = ({ trend }: { trend: RenderMetric['trend'] }) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-red-400" />;
    case 'down':
      return <TrendingDown className="w-3 h-3 text-green-400" />;
    default:
      return <Minus className="w-3 h-3 text-neutral-500" />;
  }
};

interface ComponentNode {
  name: string;
  children: ComponentNode[];
  metrics?: RenderMetric;
  expanded?: boolean;
}

const ComponentTreeNode = ({ 
  node, 
  depth = 0,
  onToggle 
}: { 
  node: ComponentNode; 
  depth?: number;
  onToggle: (name: string) => void;
}) => {
  const hasChildren = node.children.length > 0;
  const isExpanded = node.expanded !== false;

  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-1 px-2 hover:bg-neutral-900/50 cursor-pointer transition-colors`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && onToggle(node.name)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          ) : (
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          )
        ) : (
          <div className="w-3" />
        )}
        <span className="text-xs font-mono text-neutral-300">{node.name}</span>
        {node.metrics && (
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="text-[9px] px-1 py-0 border-neutral-700">
              {node.metrics.renderCount}x
            </Badge>
            <span className="text-[10px] text-neutral-500">
              {node.metrics.avgTime.toFixed(1)}ms avg
            </span>
            <TrendIcon trend={node.metrics.trend} />
          </div>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, i) => (
            <ComponentTreeNode 
              key={`${child.name}-${i}`} 
              node={child} 
              depth={depth + 1}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const PerformanceProfiler = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['App', 'Index']));

  const renderMetrics = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getRenderMetrics()
  );

  const componentCrashes = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getComponentCrashes()
  );

  const performanceMetrics = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getMetrics()
  );

  const memoryLeakSuspects = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getMemoryLeakSuspects()
  );

  // Build component tree from metrics
  const buildTree = (): ComponentNode => {
    const root: ComponentNode = { name: 'App', children: [], expanded: true };
    
    renderMetrics.forEach((metric) => {
      // Simple tree - just add as children of root for now
      root.children.push({
        name: metric.component,
        children: [],
        metrics: metric,
        expanded: expandedNodes.has(metric.component),
      });
    });

    return root;
  };

  const tree = buildTree();

  const toggleNode = (name: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const totalRenders = renderMetrics.reduce((sum, m) => sum + m.renderCount, 0);
  const avgRenderTime = renderMetrics.length > 0
    ? renderMetrics.reduce((sum, m) => sum + m.avgTime, 0) / renderMetrics.length
    : 0;
  const slowComponents = renderMetrics.filter((m) => m.avgTime > 16);

  return (
    <div className="h-full flex flex-col">
      {/* Summary Bar */}
      <div className="flex items-center gap-4 px-3 py-2 border-b border-neutral-800 bg-neutral-900/30">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isRecording ? 'text-green-500 animate-pulse' : 'text-neutral-500'}`} />
          <span className="text-xs text-neutral-400">
            {isRecording ? 'Recording' : 'Paused'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-neutral-400">Total Renders:</span>
            <span className="text-neutral-200 font-mono">{totalRenders}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-blue-400" />
            <span className="text-neutral-400">Avg Time:</span>
            <span className="text-neutral-200 font-mono">{avgRenderTime.toFixed(2)}ms</span>
          </div>
          {slowComponents.length > 0 && (
            <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
              {slowComponents.length} slow
            </Badge>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => diagnostics.clearRenderMetrics()}
            title="Clear metrics"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Component Tree */}
        <div className="flex-1 border-r border-neutral-800">
          <div className="px-3 py-2 border-b border-neutral-800 bg-neutral-900/20">
            <span className="text-xs font-semibold text-neutral-400">Component Tree</span>
          </div>
          <ScrollArea className="h-[calc(100%-32px)]">
            {renderMetrics.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 text-xs">
                No render metrics captured yet.
                <br />
                <span className="text-neutral-600">Use useProfiler hook to track components.</span>
              </div>
            ) : (
              <div className="py-1">
                <ComponentTreeNode node={tree} onToggle={toggleNode} />
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Panel - Leaks, Crashes & Core Web Vitals */}
        <div className="w-64 flex flex-col">
          {/* Memory Leak Detector */}
          <div className="border-b border-neutral-800">
            <div className="px-3 py-2 border-b border-neutral-800 bg-neutral-900/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Memory Leaks</span>
              <div className="flex items-center gap-1">
                {memoryLeakSuspects.length > 0 && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-orange-500 text-orange-400">
                    {memoryLeakSuspects.length} suspects
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5"
                  onClick={() => diagnostics.clearLeakTracking()}
                  title="Clear tracking"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-36">
              {memoryLeakSuspects.length === 0 ? (
                <div className="p-3 text-center text-neutral-600 text-[10px]">
                  No leaks detected
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {memoryLeakSuspects.slice(0, 10).map((suspect, i) => (
                    <MemoryLeakItem key={i} suspect={suspect} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Component Crashes */}
          <div className="border-b border-neutral-800">
            <div className="px-3 py-2 border-b border-neutral-800 bg-neutral-900/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Component Crashes</span>
              {componentCrashes.length > 0 && (
                <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                  {componentCrashes.length}
                </Badge>
              )}
            </div>
            <ScrollArea className="h-28">
              {componentCrashes.length === 0 ? (
                <div className="p-3 text-center text-neutral-600 text-[10px]">
                  No crashes recorded
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {componentCrashes.slice(0, 10).map((crash, i) => (
                    <div key={i} className="px-3 py-2 hover:bg-neutral-900/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-red-400">{crash.component}</span>
                      </div>
                      <p className="text-[9px] text-neutral-500 mt-1 truncate">{crash.error}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Core Web Vitals */}
          <div className="flex-1">
            <div className="px-3 py-2 border-b border-neutral-800 bg-neutral-900/20">
              <span className="text-xs font-semibold text-neutral-400">Core Web Vitals</span>
            </div>
            <ScrollArea className="h-[calc(100%-32px)]">
              <div className="p-3 space-y-2">
                {performanceMetrics.length === 0 ? (
                  <div className="text-center text-neutral-600 text-[10px]">
                    Collecting metrics...
                  </div>
                ) : (
                  performanceMetrics.slice(0, 4).map((metric, i) => (
                    <div key={i} className="bg-neutral-900 rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 uppercase">{metric.name}</span>
                        <span className={`text-xs font-mono ${
                          metric.value < 100 ? 'text-green-400' : 
                          metric.value < 300 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {metric.value}{metric.unit}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoryLeakItem = ({ suspect }: { suspect: MemoryLeakSuspect }) => {
  const getPatternColor = (pattern: MemoryLeakSuspect['pattern']) => {
    switch (pattern) {
      case 'rapid-remount': return 'text-red-400 border-red-500';
      case 'orphaned': return 'text-orange-400 border-orange-500';
      case 'accumulating': return 'text-yellow-400 border-yellow-500';
      default: return 'text-neutral-400 border-neutral-500';
    }
  };

  const orphaned = suspect.mountCount - suspect.unmountCount;

  return (
    <div className="px-3 py-2 hover:bg-neutral-900/50">
      <div className="flex items-center gap-2">
        <AlertTriangle className={`w-3 h-3 ${suspect.leakScore > 30 ? 'text-red-400' : 'text-orange-400'}`} />
        <span className="text-[10px] font-mono text-neutral-300 truncate flex-1">{suspect.component}</span>
        <Badge variant="outline" className={`text-[8px] px-1 py-0 ${getPatternColor(suspect.pattern)}`}>
          {suspect.pattern}
        </Badge>
      </div>
      <div className="flex items-center gap-3 mt-1 text-[9px] text-neutral-500">
        <span>↑{suspect.mountCount} ↓{suspect.unmountCount}</span>
        {orphaned > 0 && <span className="text-orange-400">+{orphaned} orphaned</span>}
        <span className="ml-auto">Score: {suspect.leakScore}</span>
      </div>
    </div>
  );
};

export default PerformanceProfiler;
