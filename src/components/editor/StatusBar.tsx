import { GitBranch, AlertCircle, CheckCircle2 } from "lucide-react";

const StatusBar = () => {
  return (
    <div className="h-6 bg-statusbar-bg border-t border-border flex items-center justify-between px-2 text-xs">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 hover:bg-sidebar-hover px-1.5 py-0.5 rounded transition-colors">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-sidebar-hover px-1.5 py-0.5 rounded transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>0</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-sidebar-hover px-1.5 py-0.5 rounded transition-colors">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>0</span>
        </button>
      </div>
      <div className="flex items-center gap-3 text-text-secondary">
        <span>Ln 16, Col 8</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>TypeScript React</span>
      </div>
    </div>
  );
};

export default StatusBar;
