import { useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { Search, ShieldAlert, Activity, Network, Map, Brain, FileSearch, Terminal, Globe, Crosshair } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: string, payload?: unknown) => void;
}

export const CommandPalette = ({ open, onOpenChange, onAction }: CommandPaletteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  if (!open) return null;
  const run = (a: string, p?: unknown) => { onAction(a, p); onOpenChange(false); };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-start justify-center pt-[14vh] animate-in fade-in duration-150" onClick={() => onOpenChange(false)}>
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-[640px] max-w-[92vw] rounded-lg border border-primary/30 bg-panel-bg shadow-elevated ring-glow overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/20">
          <Search className="w-4 h-4 text-primary" />
          <Command.Input
            ref={inputRef}
            value={value}
            onValueChange={setValue}
            placeholder="Run a command, jump to a module, query the AI…"
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-text-muted font-mono"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-text-muted">ESC</kbd>
        </div>
        <Command.List className="max-h-[420px] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-text-muted">No matches.</Command.Empty>

          <Command.Group heading="Navigate" className="text-[10px] uppercase tracking-wider text-text-muted px-2 pt-2">
            <PaletteItem icon={Globe} label="Open World Map" onSelect={() => run("main", "map")} />
            <PaletteItem icon={Network} label="Open Network Graph" onSelect={() => run("main", "network")} />
            <PaletteItem icon={Activity} label="Open Attack Timeline" onSelect={() => run("main", "timeline")} />
            <PaletteItem icon={Terminal} label="Open Code Editor" onSelect={() => run("main", "editor")} />
            <PaletteItem icon={Map} label="Open Exploit Flow" onSelect={() => run("main", "exploit")} />
          </Command.Group>

          <Command.Group heading="Autonomous AI" className="text-[10px] uppercase tracking-wider text-text-muted px-2 pt-2">
            <PaletteItem icon={Brain} label="Trigger SOC Analyst on latest event" onSelect={() => run("ai-triage-latest")} />
            <PaletteItem icon={Crosshair} label="Run Threat Hunter cycle now" onSelect={() => run("ai-run-hunt")} />
            <PaletteItem icon={Brain} label="Toggle Autonomous Mode" onSelect={() => run("ai-toggle-auto")} />
            <PaletteItem icon={FileSearch} label="Generate situation brief" onSelect={() => run("ai-brief")} />
          </Command.Group>

          <Command.Group heading="Drawers" className="text-[10px] uppercase tracking-wider text-text-muted px-2 pt-2">
            <PaletteItem icon={ShieldAlert} label="Open SOC Dashboard (Blue)" onSelect={() => run("blue", "soc")} />
            <PaletteItem icon={ShieldAlert} label="Open Threat Hunting (Blue)" onSelect={() => run("blue", "hunting")} />
            <PaletteItem icon={ShieldAlert} label="Open Incident Response (Blue)" onSelect={() => run("blue", "incident")} />
            <PaletteItem icon={Activity} label="Open C2 Framework (Red)" onSelect={() => run("red", "c2")} />
            <PaletteItem icon={Activity} label="Open Payload Builder (Red)" onSelect={() => run("red", "payload")} />
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};

const PaletteItem = ({ icon: Icon, label, onSelect }: { icon: React.ComponentType<{ className?: string }>; label: string; onSelect: () => void }) => (
  <Command.Item
    onSelect={onSelect}
    className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer text-sm text-foreground/90 data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary aria-selected:bg-primary/15"
  >
    <Icon className="w-4 h-4 text-primary" />
    <span>{label}</span>
  </Command.Item>
);

export default CommandPalette;
