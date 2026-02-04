import { useState, useSyncExternalStore } from 'react';
import { diagnostics, NetworkRequest } from '@/lib/diagnostics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Play,
  RefreshCw,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Loader2,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface ReplayResult {
  requestId: string;
  status: 'pending' | 'success' | 'error';
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    duration: number;
  };
  error?: string;
}

const StatusBadge = ({ status }: { status: number | null }) => {
  if (status === null) {
    return (
      <Badge variant="outline" className="text-[9px] px-1 py-0 border-yellow-500 text-yellow-500">
        pending
      </Badge>
    );
  }
  if (status >= 200 && status < 300) {
    return (
      <Badge variant="outline" className="text-[9px] px-1 py-0 border-green-500 text-green-500">
        {status}
      </Badge>
    );
  }
  if (status >= 400) {
    return (
      <Badge variant="outline" className="text-[9px] px-1 py-0 border-red-500 text-red-500">
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[9px] px-1 py-0 border-blue-500 text-blue-500">
      {status}
    </Badge>
  );
};

const RequestDetails = ({ 
  request, 
  onReplay,
  replayResult,
  isReplaying 
}: { 
  request: NetworkRequest;
  onReplay: () => void;
  replayResult?: ReplayResult;
  isReplaying: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAsCurl = () => {
    const curl = `curl -X ${request.method} "${request.url}"`;
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFailedRequest = request.status === null || (request.status && request.status >= 400) || request.error;

  return (
    <div className={`border-b border-neutral-800 ${isFailedRequest ? 'bg-red-950/10' : ''}`}>
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-900/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3 text-neutral-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-neutral-500" />
        )}
        <StatusBadge status={request.status} />
        <span className="text-[10px] font-mono text-neutral-500 w-10">{request.method}</span>
        <span className="text-[11px] font-mono text-neutral-300 truncate flex-1">{request.url}</span>
        {request.duration !== null && (
          <span className="text-[10px] text-neutral-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {request.duration}ms
          </span>
        )}
        {isFailedRequest && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-[10px] text-orange-400 hover:text-orange-300"
            onClick={(e) => {
              e.stopPropagation();
              onReplay();
            }}
            disabled={isReplaying}
          >
            {isReplaying ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Replay
              </>
            )}
          </Button>
        )}
      </div>

      {expanded && (
        <div className="px-6 pb-3 space-y-3">
          {/* Request Info */}
          <div className="bg-neutral-900 rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-neutral-400">Request</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-[10px]"
                  onClick={copyAsCurl}
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      cURL
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-[10px]"
                  onClick={() => window.open(request.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-[10px] font-mono text-neutral-300 break-all">
              {request.method} {request.url}
            </div>
          </div>

          {/* Error */}
          {request.error && (
            <div className="bg-red-950/30 border border-red-900/50 rounded p-2">
              <div className="flex items-center gap-2 text-[10px] text-red-400">
                <XCircle className="w-3 h-3" />
                <span className="font-semibold">Error</span>
              </div>
              <p className="text-[10px] font-mono text-red-300 mt-1">{request.error}</p>
            </div>
          )}

          {/* Replay Result */}
          {replayResult && (
            <div className={`rounded p-2 ${
              replayResult.status === 'success' 
                ? 'bg-green-950/30 border border-green-900/50' 
                : replayResult.status === 'error'
                ? 'bg-red-950/30 border border-red-900/50'
                : 'bg-yellow-950/30 border border-yellow-900/50'
            }`}>
              <div className="flex items-center gap-2 text-[10px] mb-2">
                {replayResult.status === 'success' ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : replayResult.status === 'error' ? (
                  <XCircle className="w-3 h-3 text-red-400" />
                ) : (
                  <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
                )}
                <span className={`font-semibold ${
                  replayResult.status === 'success' ? 'text-green-400' :
                  replayResult.status === 'error' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  Replay {replayResult.status === 'pending' ? 'in progress...' : replayResult.status}
                </span>
                {replayResult.response && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {replayResult.response.status} {replayResult.response.statusText}
                  </Badge>
                )}
                {replayResult.response?.duration && (
                  <span className="text-neutral-500">{replayResult.response.duration}ms</span>
                )}
              </div>
              {replayResult.error && (
                <p className="text-[10px] font-mono text-red-300">{replayResult.error}</p>
              )}
              {replayResult.response?.body && (
                <details>
                  <summary className="text-[10px] text-neutral-500 cursor-pointer hover:text-neutral-300">
                    Response Body
                  </summary>
                  <pre className="mt-2 bg-neutral-950 rounded p-2 text-[9px] font-mono text-neutral-400 overflow-x-auto max-h-32">
                    {replayResult.response.body}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const NetworkReplayPanel = () => {
  const [replayResults, setReplayResults] = useState<Map<string, ReplayResult>>(new Map());
  const [replayingIds, setReplayingIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'failed'>('failed');

  const requests = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getNetworkRequests()
  );

  const filteredRequests = filter === 'failed' 
    ? requests.filter(r => r.error || r.status === null || (r.status && r.status >= 400))
    : requests;

  const failedCount = requests.filter(r => r.error || r.status === null || (r.status && r.status >= 400)).length;

  const replayRequest = async (request: NetworkRequest) => {
    setReplayingIds(prev => new Set(prev).add(request.id));
    setReplayResults(prev => new Map(prev).set(request.id, { 
      requestId: request.id, 
      status: 'pending' 
    }));

    const startTime = performance.now();

    try {
      const response = await fetch(request.url, {
        method: request.method,
      });

      const endTime = performance.now();
      const body = await response.text();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      setReplayResults(prev => new Map(prev).set(request.id, {
        requestId: request.id,
        status: 'success',
        response: {
          status: response.status,
          statusText: response.statusText,
          headers,
          body: body.slice(0, 5000), // Limit body size
          duration: Math.round(endTime - startTime),
        },
      }));

      diagnostics.addLog({
        type: 'network',
        source: 'replay',
        message: `Replayed ${request.method} ${request.url} - ${response.status}`,
      });
    } catch (error) {
      setReplayResults(prev => new Map(prev).set(request.id, {
        requestId: request.id,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      }));

      diagnostics.addLog({
        type: 'error',
        source: 'replay',
        message: `Replay failed for ${request.url}: ${error instanceof Error ? error.message : error}`,
      });
    } finally {
      setReplayingIds(prev => {
        const next = new Set(prev);
        next.delete(request.id);
        return next;
      });
    }
  };

  const replayAllFailed = async () => {
    const failedRequests = requests.filter(r => r.error || (r.status && r.status >= 400));
    for (const request of failedRequests) {
      await replayRequest(request);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {['all', 'failed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as 'all' | 'failed')}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  filter === f
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {f === 'failed' ? `Failed (${failedCount})` : `All (${requests.length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {failedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-orange-400 hover:text-orange-300"
              onClick={replayAllFailed}
              disabled={replayingIds.size > 0}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${replayingIds.size > 0 ? 'animate-spin' : ''}`} />
              Replay All Failed
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setReplayResults(new Map())}
            title="Clear replay results"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Request List */}
      <ScrollArea className="flex-1">
        {filteredRequests.length === 0 ? (
          <div className="p-4 text-center text-neutral-500 text-xs">
            {filter === 'failed' ? 'No failed requests' : 'No requests captured yet'}
          </div>
        ) : (
          <div>
            {filteredRequests.map((request) => (
              <RequestDetails
                key={request.id}
                request={request}
                onReplay={() => replayRequest(request)}
                replayResult={replayResults.get(request.id)}
                isReplaying={replayingIds.has(request.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NetworkReplayPanel;
