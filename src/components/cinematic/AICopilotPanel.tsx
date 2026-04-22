import { useState } from "react";
import {
  Brain,
  Zap,
  Sparkles,
  ShieldCheck,
  Loader2,
  Power,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnalystRun } from "./useAutonomousAnalyst";

interface Props {
  runs: AnalystRun[];
  busy: boolean;
  autonomous: boolean;
  onToggleAutonomous: () => void;
  onTriageLatest: () => void;
  /** Render compact when sharing the drawer with another panel. */
  compact?: boolean;
}

const sevColor = (s: string) =>
  s === "critical"
    ? "text-danger border-danger/50 bg-danger/10"
    : s === "high"
    ? "text-warning border-warning/50 bg-warning/10"
    : s === "medium"
    ? "text-accent border-accent/50 bg-accent/10"
    : "text-primary border-primary/40 bg-primary/10";

export const AICopilotPanel = ({
  runs,
  busy,
  autonomous,
  onToggleAutonomous,
  onTriageLatest,
  compact = false,
}: Props) => {
  const [openRun, setOpenRun] = useState<string | null>(runs[0]?.id ?? null);

  return (
    <div className="flex flex-col h-full bg-panel-bg/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-primary/20 bg-deep shrink-0">
        <div className="relative">
          <Brain className="w-4 h-4 text-primary" />
          {busy && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-glow text-primary truncate">
            Autonomous SOC
          </div>
          {!compact && (
            <div className="text-[9px] text-text-muted font-mono truncate">
              {autonomous ? "AUTO • watching real-time stream" : "MANUAL • on-demand triage"}
            </div>
          )}
        </div>
        <button
          onClick={onToggleAutonomous}
          className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border transition-all ${
            autonomous
              ? "bg-success/20 border-success/50 text-success"
              : "bg-panel-bg border-border text-text-muted hover:text-foreground"
          }`}
          title={autonomous ? "Autonomous ON" : "Autonomous OFF"}
        >
          <Power className="w-2.5 h-2.5 inline mr-0.5" />
          {autonomous ? "AUTO" : "OFF"}
        </button>
        <button
          onClick={onTriageLatest}
          disabled={busy}
          className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="w-2.5 h-2.5 inline animate-spin" />
          ) : (
            <>
              <Zap className="w-2.5 h-2.5 inline mr-0.5" />
              Triage
            </>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {runs.length === 0 ? (
          <div className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-primary/50 mx-auto mb-2" />
            <div className="text-xs text-text-muted">
              {autonomous
                ? "Waiting for the next qualifying threat event…"
                : "Click Triage to analyze the latest event."}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {runs.map((run) => {
              const open = openRun === run.id;
              return (
                <div
                  key={run.id}
                  className="px-3 py-2 hover:bg-primary/5 transition-colors"
                >
                  <button
                    onClick={() => setOpenRun(open ? null : run.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold uppercase font-mono border rounded ${sevColor(
                          run.decision.severity
                        )}`}
                      >
                        {run.decision.severity}
                      </span>
                      <span className="text-[11px] font-mono text-text-secondary truncate flex-1">
                        {run.event_type}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">
                        {Math.round(run.decision.confidence * 100)}%
                      </span>
                      {open ? (
                        <ChevronUp className="w-3 h-3 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-text-muted" />
                      )}
                    </div>
                    <div className="text-[11px] text-foreground/90 leading-snug line-clamp-2">
                      {run.decision.narrative}
                    </div>
                  </button>
                  {open && (
                    <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
                      <Row
                        label="MITRE"
                        value={`${run.decision.mitre_technique_id} • ${run.decision.mitre_technique_name}`}
                      />
                      {run.decision.correlated_ioc_ids.length > 0 && (
                        <Row
                          label="IOCs"
                          value={`${run.decision.correlated_ioc_ids.length} correlated`}
                        />
                      )}
                      {run.decision.affected_asset_ids.length > 0 && (
                        <Row
                          label="Assets"
                          value={`${run.decision.affected_asset_ids.length} impacted`}
                        />
                      )}
                      {run.investigation_id && (
                        <div className="flex items-center gap-1.5 text-[11px] text-success">
                          <ShieldCheck className="w-3 h-3" /> Investigation opened
                        </div>
                      )}
                      <div className="space-y-1 mt-1.5">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted">
                          Response Playbook
                        </div>
                        {run.decision.playbook.map((step) => (
                          <div key={step.step} className="flex gap-2 text-[11px]">
                            <span className="text-primary font-mono w-4 shrink-0">
                              {step.step}.
                            </span>
                            <div className="flex-1">
                              <div className="text-foreground/90">
                                <span className="font-semibold">{step.action}</span>
                                <span className="text-text-muted"> → {step.target}</span>
                                {step.auto_executable && (
                                  <span className="ml-1 text-[9px] text-success">
                                    [AUTO]
                                  </span>
                                )}
                              </div>
                              <div className="text-text-muted">{step.rationale}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 text-[11px]">
    <span className="text-text-muted uppercase tracking-wider w-14 shrink-0">
      {label}
    </span>
    <span className="text-foreground/90 font-mono break-all">{value}</span>
  </div>
);

export default AICopilotPanel;
