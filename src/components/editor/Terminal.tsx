import { ChevronUp, X, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState(200);

  if (!isOpen) return null;

  return (
    <div 
      className="border-t border-border bg-panel-bg flex flex-col"
      style={{ height: `${height}px` }}
    >
      <div className="h-9 flex items-center justify-between px-2 border-b border-panel-border">
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors text-text-primary border-b-2 border-primary">
            Terminal
          </button>
          <button className="px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors text-text-secondary">
            Problems
          </button>
          <button className="px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors text-text-secondary">
            Output
          </button>
          <button className="px-2 py-1 text-xs hover:bg-sidebar-hover rounded transition-colors text-text-secondary">
            Debug Console
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 font-mono text-sm">
        <div className="text-syntax-comment">$ npm run dev</div>
        <div className="text-text-primary mt-1">
          <span className="text-syntax-keyword">{'>'}</span> vite dev
        </div>
        <div className="text-text-secondary mt-1">
          VITE v5.0.0  ready in 234 ms
        </div>
        <div className="text-text-secondary mt-1">
          <span className="text-syntax-keyword">➜</span>  Local:   <span className="text-primary underline">http://localhost:5173/</span>
        </div>
        <div className="text-text-secondary">
          <span className="text-syntax-keyword">➜</span>  Network: use --host to expose
        </div>
      </div>
    </div>
  );
};

export default Terminal;
