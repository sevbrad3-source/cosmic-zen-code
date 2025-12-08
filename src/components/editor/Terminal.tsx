import { ChevronUp, X, Plus, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TerminalLine {
  type: "command" | "output" | "error" | "success" | "warning";
  content: string;
  timestamp: string;
}

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState(200);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "output", content: "# Penetration Testing Framework v4.2.1", timestamp: "00:00:00" },
    { type: "output", content: "Initializing attack infrastructure...", timestamp: "00:00:01" },
    { type: "success", content: "[+] Nmap scan complete: 192.168.1.0/24 (47 hosts up)", timestamp: "00:00:03" },
    { type: "warning", content: "[!] Found 12 open HTTP ports, 8 SSH services, 3 SMB shares", timestamp: "00:00:04" },
    { type: "success", content: "[+] Vulnerability scan initiated on 192.168.1.10", timestamp: "00:00:05" },
    { type: "error", content: "[*] CRITICAL: SQL injection detected at /login.php (CVE-2024-1234)", timestamp: "00:00:07" },
    { type: "success", content: "[+] Exploiting target... Sending payload", timestamp: "00:00:09" },
    { type: "success", content: "[+] Shell opened: 192.168.1.10:4444 (www-data@web-server-01)", timestamp: "00:00:12" },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newHistory: TerminalLine[] = [
      ...history,
      { type: "command", content: `$ ${cmd}`, timestamp }
    ];

    // Command simulation
    if (cmd.startsWith("nmap")) {
      newHistory.push({ type: "success", content: `[+] Starting Nmap scan on ${cmd.split(" ")[1] || "target"}...`, timestamp });
      newHistory.push({ type: "output", content: `PORT     STATE SERVICE VERSION`, timestamp });
      newHistory.push({ type: "output", content: `22/tcp   open  ssh     OpenSSH 8.2p1`, timestamp });
      newHistory.push({ type: "output", content: `80/tcp   open  http    Apache 2.4.41`, timestamp });
      newHistory.push({ type: "output", content: `443/tcp  open  https   Apache 2.4.41`, timestamp });
      newHistory.push({ type: "success", content: `[+] Scan complete. 3 ports open`, timestamp });
    } else if (cmd.startsWith("exploit")) {
      newHistory.push({ type: "warning", content: `[!] Loading exploit module...`, timestamp });
      newHistory.push({ type: "success", content: `[+] Exploit loaded: ${cmd.split(" ")[1] || "generic"}`, timestamp });
      newHistory.push({ type: "success", content: `[+] Target acquired. Sending payload...`, timestamp });
      setTimeout(() => {
        setHistory(prev => [...prev, 
          { type: "success", content: `[+] Exploitation successful!`, timestamp },
          { type: "success", content: `[+] Meterpreter session opened`, timestamp }
        ]);
      }, 1500);
    } else if (cmd.startsWith("sessions")) {
      newHistory.push({ type: "output", content: `Active sessions: 5`, timestamp });
      newHistory.push({ type: "output", content: `  1  meterpreter  192.168.1.10:4444   www-data@web-server-01`, timestamp });
      newHistory.push({ type: "output", content: `  2  shell        192.168.1.25:445    SYSTEM@dc01`, timestamp });
      newHistory.push({ type: "output", content: `  3  meterpreter  192.168.1.50:1337   root@mail`, timestamp });
    } else if (cmd === "ls" || cmd === "dir") {
      newHistory.push({ type: "output", content: `exploits/  payloads/  recon/  loot/  reports/`, timestamp });
    } else if (cmd === "help") {
      newHistory.push({ type: "output", content: `Available commands:`, timestamp });
      newHistory.push({ type: "output", content: `  nmap <target>      - Scan target for open ports`, timestamp });
      newHistory.push({ type: "output", content: `  exploit <module>   - Execute exploit module`, timestamp });
      newHistory.push({ type: "output", content: `  sessions           - List active sessions`, timestamp });
      newHistory.push({ type: "output", content: `  scan <target>      - Run vulnerability scan`, timestamp });
      newHistory.push({ type: "output", content: `  listener <port>    - Start reverse shell listener`, timestamp });
      newHistory.push({ type: "output", content: `  clear              - Clear terminal`, timestamp });
    } else if (cmd === "clear") {
      setHistory([]);
      return;
    } else if (cmd.startsWith("scan")) {
      newHistory.push({ type: "warning", content: `[!] Starting vulnerability scan...`, timestamp });
      newHistory.push({ type: "success", content: `[+] Found 23 potential vulnerabilities`, timestamp });
      newHistory.push({ type: "error", content: `[*] CRITICAL: Remote code execution (CVE-2024-5678)`, timestamp });
    } else if (cmd.trim()) {
      newHistory.push({ type: "error", content: `Command not found: ${cmd}. Type 'help' for available commands.`, timestamp });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      executeCommand(command);
      setCommand("");
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-panel-bg">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-2 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "command" ? "text-primary font-semibold" :
              line.type === "success" ? "text-green-500" :
              line.type === "error" ? "text-red-500" :
              line.type === "warning" ? "text-yellow-500" :
              "text-text-secondary"
            } ${i > 0 ? "mt-1" : ""}`}
          >
            {line.content}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-syntax-keyword mr-1">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-text-primary"
            placeholder="Type 'help' for available commands"
            autoFocus
          />
        </form>
      </div>
      <div className="h-6 px-2 flex items-center justify-between text-xs text-text-muted border-t border-panel-border bg-statusbar-bg">
        <span>Sessions: 5 active | Listeners: 8 | Exfiltrated: 2.4 GB</span>
        <span>Uptime: 02:47:33</span>
      </div>
    </div>
  );
};

export default Terminal;
