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
        <div className="text-syntax-comment"># Penetration Testing Framework v4.2.1</div>
        <div className="text-text-secondary mt-1">Initializing attack infrastructure...</div>
        <div className="text-green-500 mt-1">
          <span className="text-syntax-keyword">[+]</span> Nmap scan complete: 192.168.1.0/24 (47 hosts up)
        </div>
        <div className="text-yellow-500 mt-0.5">
          <span className="text-syntax-keyword">[!]</span> Found 12 open HTTP ports, 8 SSH services, 3 SMB shares
        </div>
        <div className="text-green-500 mt-0.5">
          <span className="text-syntax-keyword">[+]</span> Vulnerability scan initiated on 192.168.1.10
        </div>
        <div className="text-red-500 mt-0.5">
          <span className="text-syntax-keyword">[*]</span> CRITICAL: SQL injection detected at /login.php (CVE-2024-1234)
        </div>
        <div className="text-green-500 mt-0.5">
          <span className="text-syntax-keyword">[+]</span> Exploiting target... Sending payload
        </div>
        <div className="text-green-500 mt-0.5 animate-pulse">
          <span className="text-syntax-keyword">[+]</span> Shell opened: 192.168.1.10:4444 (www-data@web-server-01)
        </div>
        <div className="text-text-secondary mt-1">
          <span className="text-syntax-keyword">www-data@web-server-01:~$</span> <span className="animate-pulse">_</span>
        </div>
        <div className="text-text-muted mt-2 text-xs">
          Sessions: 5 active | Listeners: 8 | Exfiltrated: 2.4 GB | Uptime: 02:47:33
        </div>
      </div>
    </div>
  );
};

export default Terminal;
