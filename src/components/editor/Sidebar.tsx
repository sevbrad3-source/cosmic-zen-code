import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { useState } from "react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const mockFiles: FileItem[] = [
  {
    name: "exploits",
    type: "folder",
    children: [
      {
        name: "web",
        type: "folder",
        children: [
          { name: "sqli_auth_bypass.py", type: "file" },
          { name: "xss_reflected.js", type: "file" },
          { name: "rce_apache_struts.py", type: "file" },
        ],
      },
      {
        name: "network",
        type: "folder",
        children: [
          { name: "smb_eternalblue.py", type: "file" },
          { name: "ssh_bruteforce.py", type: "file" },
          { name: "rdp_bluekeep.rb", type: "file" },
        ],
      },
      {
        name: "privilege_escalation",
        type: "folder",
        children: [
          { name: "sudo_exploit.sh", type: "file" },
          { name: "kernel_exploit_4.15.c", type: "file" },
          { name: "token_impersonation.ps1", type: "file" },
        ],
      },
    ],
  },
  {
    name: "payloads",
    type: "folder",
    children: [
      { name: "reverse_shells", type: "folder", children: [
        { name: "tcp_shell.py", type: "file" },
        { name: "powershell_rev.ps1", type: "file" },
        { name: "bash_reverse.sh", type: "file" },
      ]},
      { name: "webshells", type: "folder", children: [
        { name: "php_webshell.php", type: "file" },
        { name: "aspx_shell.aspx", type: "file" },
        { name: "jsp_cmd.jsp", type: "file" },
      ]},
      { name: "meterpreter.rc", type: "file" },
    ],
  },
  {
    name: "reconnaissance",
    type: "folder",
    children: [
      { name: "nmap_scans.sh", type: "file" },
      { name: "subdomain_enum.py", type: "file" },
      { name: "osint_gather.py", type: "file" },
      { name: "port_scanner.go", type: "file" },
    ],
  },
  {
    name: "post_exploitation",
    type: "folder",
    children: [
      { name: "credential_dumper.ps1", type: "file" },
      { name: "lateral_movement.py", type: "file" },
      { name: "persistence.sh", type: "file" },
      { name: "data_exfil.py", type: "file" },
    ],
  },
  { name: "metasploit.rc", type: "file" },
  { name: "wordlists", type: "folder", children: [
    { name: "passwords.txt", type: "file" },
    { name: "usernames.txt", type: "file" },
    { name: "subdomains.txt", type: "file" },
  ]},
  { name: "reports", type: "folder", children: [
    { name: "pentest_2024-01.pdf", type: "file" },
    { name: "vuln_scan_results.json", type: "file" },
  ]},
];

interface FileTreeProps {
  items: FileItem[];
  level?: number;
}

const FileTree = ({ items, level = 0 }: FileTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    src: true,
    components: true,
  });

  const toggleExpand = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.name}>
          <button
            onClick={() => item.type === "folder" && toggleExpand(item.name)}
            className="w-full flex items-center gap-1 px-2 py-0.5 text-sm hover:bg-sidebar-hover transition-colors text-text-primary group"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {item.type === "folder" && (
              <span className="w-4 h-4 flex items-center justify-center text-text-secondary">
                {expanded[item.name] ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            )}
            {item.type === "folder" ? (
              <Folder className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-text-secondary flex-shrink-0 ml-4" />
            )}
            <span className="truncate">{item.name}</span>
          </button>
          {item.type === "folder" && expanded[item.name] && item.children && (
            <FileTree items={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

interface SidebarProps {
  activeView: string;
}

const Sidebar = ({ activeView }: SidebarProps) => {
  if (!activeView) return null;

  return (
    <div className="w-64 bg-sidebar-bg border-r border-border flex flex-col">
      <div className="h-9 px-3 flex items-center border-b border-border">
        <span className="text-xs uppercase tracking-wide font-semibold text-text-secondary">
          {activeView === "explorer" && "Exploit Database"}
          {activeView === "search" && "Target Search"}
          {activeView === "source" && "Version Control"}
          {activeView === "run" && "Attack Automation"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeView === "explorer" && (
          <div className="py-1">
            <FileTree items={mockFiles} />
          </div>
        )}
        {activeView === "search" && (
          <div className="p-3 space-y-2">
            <input 
              type="text" 
              placeholder="Search targets, CVEs, exploits..." 
              className="w-full h-7 bg-input-bg border border-input-border rounded px-2 text-xs text-text-primary"
            />
            <div className="text-xs text-text-muted mt-3">RECENT SEARCHES</div>
            <div className="space-y-1 text-xs">
              <div className="text-text-secondary hover:text-text-primary cursor-pointer">CVE-2024-23897</div>
              <div className="text-text-secondary hover:text-text-primary cursor-pointer">192.168.1.0/24</div>
              <div className="text-text-secondary hover:text-text-primary cursor-pointer">SMB exploits Windows Server</div>
            </div>
          </div>
        )}
        {activeView === "source" && (
          <div className="p-3 text-xs space-y-2">
            <div className="text-text-muted">MODIFIED FILES (3)</div>
            <div className="space-y-1">
              <div className="text-text-secondary">M exploits/web/sqli_auth_bypass.py</div>
              <div className="text-text-secondary">A payloads/reverse_shells/new_shell.py</div>
              <div className="text-text-secondary">M reconnaissance/port_scanner.go</div>
            </div>
            <button className="w-full h-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs mt-2">
              Commit Changes
            </button>
          </div>
        )}
        {activeView === "run" && (
          <div className="p-3 text-xs space-y-2">
            <div className="text-text-muted">AUTOMATED CAMPAIGNS</div>
            <div className="space-y-2">
              <div className="bg-panel-bg rounded p-2 border border-border">
                <div className="text-text-primary font-semibold">Full Network Scan</div>
                <div className="text-text-muted mt-0.5">192.168.1.0/24</div>
                <button className="w-full h-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded text-xs mt-2">
                  Run Campaign
                </button>
              </div>
              <div className="bg-panel-bg rounded p-2 border border-border">
                <div className="text-text-primary font-semibold">Credential Harvesting</div>
                <div className="text-text-muted mt-0.5">All compromised hosts</div>
                <button className="w-full h-6 bg-green-600 hover:bg-green-700 text-white rounded text-xs mt-2">
                  Running...
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
