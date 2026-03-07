import { useState } from "react";
import { Key, Hash, FileText, Upload, Play, Square, Settings, RotateCcw, Cpu, HardDrive, Zap, Clock, CheckCircle, XCircle, Loader2, BarChart3, BookOpen, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InnerPanelTabs, { InnerTab } from "./InnerPanelTabs";

const tabs: InnerTab[] = [
  { id: "crack", icon: Zap, label: "Crack" },
  { id: "identify", icon: Hash, label: "Identify" },
  { id: "wordlists", icon: BookOpen, label: "Wordlists", badge: 4 },
  { id: "rules", icon: Settings, label: "Rules", badge: 4 },
  { id: "results", icon: CheckCircle, label: "Results", badge: 4, badgeVariant: "success" as const },
  { id: "stats", icon: BarChart3, label: "Stats" },
];

const PasswordCrackingPanel = () => {
  const [activeTab, setActiveTab] = useState("crack");
  const [crackingActive, setCrackingActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const hashTypes = [
    { id: "md5", name: "MD5", speed: "Fast", mode: 0 },
    { id: "sha1", name: "SHA-1", speed: "Fast", mode: 100 },
    { id: "sha256", name: "SHA-256", speed: "Medium", mode: 1400 },
    { id: "sha512", name: "SHA-512", speed: "Medium", mode: 1700 },
    { id: "bcrypt", name: "bcrypt", speed: "Slow", mode: 3200 },
    { id: "ntlm", name: "NTLM", speed: "Fast", mode: 1000 },
    { id: "netlmv2", name: "NetNTLMv2", speed: "Medium", mode: 5600 },
    { id: "wpa", name: "WPA/WPA2", speed: "Very Slow", mode: 22000 },
    { id: "kerberos", name: "Kerberos TGS", speed: "Slow", mode: 13100 },
  ];

  const wordlists = [
    { name: "rockyou.txt", size: "139 MB", entries: "14.3M", desc: "Classic leaked passwords" },
    { name: "darkweb2017.txt", size: "12 GB", entries: "1.4B", desc: "Dark web compilation" },
    { name: "hashesorg2019.txt", size: "31 GB", entries: "2.5B", desc: "Hashes.org recovered" },
    { name: "custom_corp.txt", size: "45 MB", entries: "4.2M", desc: "Custom corporate wordlist" },
  ];

  const rules = [
    { name: "best64.rule", description: "Top 64 most effective rules", mutations: "64" },
    { name: "dive.rule", description: "Extensive mutation rules", mutations: "99,092" },
    { name: "toggles.rule", description: "Case toggling variations", mutations: "4,096" },
    { name: "leetspeak.rule", description: "L33t speak substitutions", mutations: "1,024" },
  ];

  const crackedHashes = [
    { hash: "5f4dcc3b5aa765d61d8327deb882cf99", plain: "password", type: "MD5", time: "0.01s" },
    { hash: "e10adc3949ba59abbe56e057f20f883e", plain: "123456", type: "MD5", time: "0.01s" },
    { hash: "25d55ad283aa400af464c76d713c07ad", plain: "12345678", type: "MD5", time: "0.02s" },
    { hash: "d8578edf8458ce06fbc5bb76a58c5ca4", plain: "qwerty", type: "MD5", time: "0.01s" },
  ];

  return (
    <div className="h-full flex flex-col bg-[hsl(0,10%,5%)]">
      <div className="p-3 border-b border-[hsl(0,100%,20%)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[hsl(0,100%,25%)]"><Key className="w-4 h-4 text-[hsl(0,100%,70%)]" /></div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(0,100%,85%)]">Password Cracking Lab</h3>
            <p className="text-xs text-[hsl(0,60%,50%)]">Hash Analysis & Recovery</p>
          </div>
        </div>
      </div>

      <InnerPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="red" />

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {activeTab === "crack" && (
            <>
              <div className="space-y-2">
                <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Hash(es) to Crack</label>
                <Textarea placeholder="Enter hashes (one per line)..." className="h-20 bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] font-mono text-xs" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]"><Upload className="w-3 h-3 mr-1" />Import</Button>
                  <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]"><FileText className="w-3 h-3 mr-1" />Paste</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Hash Type</label>
                <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                  {hashTypes.map((type) => (<option key={type.id} value={type.id}>{type.name} (Mode {type.mode}) — {type.speed}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Attack Mode</label>
                <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                  <option>Dictionary Attack</option><option>Brute Force</option><option>Hybrid (Dict + Mask)</option><option>Rule-Based</option><option>Combinator</option><option>Prince Attack</option>
                </select>
              </div>
              {crackingActive && (
                <div className="p-3 bg-[hsl(0,100%,12%)] rounded border border-[hsl(0,100%,25%)]">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs text-[hsl(0,100%,70%)]">Cracking in progress...</span><Loader2 className="w-4 h-4 text-[hsl(0,100%,50%)] animate-spin" /></div>
                  <Progress value={progress} className="h-2 mb-2" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1"><Cpu className="w-3 h-3 text-[hsl(0,60%,50%)]" /><span className="text-[hsl(0,60%,50%)]">Speed:</span><span className="text-[hsl(0,100%,70%)]">2.4 GH/s</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-[hsl(0,60%,50%)]" /><span className="text-[hsl(0,60%,50%)]">ETA:</span><span className="text-[hsl(0,100%,70%)]">~2m 34s</span></div>
                    <div className="flex items-center gap-1"><Hash className="w-3 h-3 text-[hsl(0,60%,50%)]" /><span className="text-[hsl(0,60%,50%)]">Recovered:</span><span className="text-green-500">4/12</span></div>
                    <div className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-[hsl(0,60%,50%)]" /><span className="text-[hsl(0,60%,50%)]">Progress:</span><span className="text-[hsl(0,100%,70%)]">{progress}%</span></div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => { setCrackingActive(!crackingActive); if (!crackingActive) { setProgress(0); const interval = setInterval(() => { setProgress(p => { if (p >= 100) { clearInterval(interval); setCrackingActive(false); return 100; } return p + 1; }); }, 100); } }} className={`flex-1 ${crackingActive ? "bg-red-600 hover:bg-red-700" : "bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]"}`}>
                  {crackingActive ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}{crackingActive ? "Stop" : "Start Cracking"}
                </Button>
              </div>
            </>
          )}

          {activeTab === "identify" && (
            <>
              <div className="space-y-2">
                <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Hash to Identify</label>
                <Input placeholder="Paste a hash..." className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] font-mono" />
              </div>
              <Button className="w-full bg-[hsl(0,100%,25%)] hover:bg-[hsl(0,100%,30%)]"><Hash className="w-4 h-4 mr-2" />Identify Hash</Button>
              <div className="p-3 bg-[hsl(0,100%,10%)] rounded border border-[hsl(0,100%,20%)]">
                <div className="text-xs text-[hsl(0,60%,50%)] uppercase mb-2">Possible Types</div>
                {[{ name: "MD5", match: 95 }, { name: "NTLM", match: 75 }, { name: "LM", match: 40 }].map((h) => (
                  <div key={h.name} className="flex items-center justify-between p-2 bg-[hsl(0,100%,15%)] rounded mb-1">
                    <span className="text-sm text-[hsl(0,100%,85%)]">{h.name}</span>
                    <Badge className={h.match > 80 ? "bg-green-600" : h.match > 60 ? "bg-yellow-600" : "bg-orange-600"}>{h.match}% match</Badge>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "wordlists" && wordlists.map((wl, i) => (
            <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[hsl(0,100%,85%)] font-mono">{wl.name}</span>
                <Badge variant="outline" className="text-xs border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">{wl.entries}</Badge>
              </div>
              <div className="text-xs text-[hsl(0,60%,50%)]">{wl.desc} • {wl.size}</div>
            </div>
          ))}

          {activeTab === "rules" && rules.map((rule, i) => (
            <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[hsl(0,100%,85%)] font-mono">{rule.name}</span>
                <Badge variant="outline" className="text-xs border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">{rule.mutations}</Badge>
              </div>
              <div className="text-xs text-[hsl(0,60%,50%)]">{rule.description}</div>
            </div>
          ))}

          {activeTab === "results" && (
            <>
              <div className="flex items-center justify-between"><div className="text-xs text-[hsl(0,60%,50%)] uppercase">Cracked Hashes</div><Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">Export</Button></div>
              {crackedHashes.map((result, i) => (
                <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-mono text-green-400">{result.plain}</span><Badge className="ml-auto text-xs">{result.type}</Badge></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-[hsl(0,60%,50%)] font-mono truncate max-w-[200px]">{result.hash}</span><span className="text-[hsl(0,60%,50%)]">{result.time}</span></div>
                </div>
              ))}
            </>
          )}

          {activeTab === "stats" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[{ label: "Total hashes", val: "12" }, { label: "Cracked", val: "4 (33%)", color: "text-green-500" }, { label: "Remaining", val: "8", color: "text-[hsl(0,100%,70%)]" }, { label: "Time elapsed", val: "2m 34s" }].map((s) => (
                  <div key={s.label} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] text-center">
                    <div className={`text-lg font-bold ${s.color || "text-[hsl(0,100%,85%)]"}`}>{s.val}</div>
                    <div className="text-xs text-[hsl(0,60%,50%)]">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                <div className="text-xs text-[hsl(0,60%,50%)] uppercase mb-2">GPU Utilization</div>
                <Progress value={87} className="h-2 mb-1" />
                <div className="text-xs text-[hsl(0,60%,50%)] text-right">87% — NVIDIA RTX 4090</div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PasswordCrackingPanel;
