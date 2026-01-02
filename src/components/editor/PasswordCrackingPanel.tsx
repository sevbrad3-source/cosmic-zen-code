import { useState } from "react";
import { Key, Hash, FileText, Upload, Play, Square, Settings, RotateCcw, Cpu, HardDrive, Zap, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PasswordCrackingPanel = () => {
  const [crackingActive, setCrackingActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const hashTypes = [
    { id: "md5", name: "MD5", speed: "Fast" },
    { id: "sha1", name: "SHA-1", speed: "Fast" },
    { id: "sha256", name: "SHA-256", speed: "Medium" },
    { id: "sha512", name: "SHA-512", speed: "Medium" },
    { id: "bcrypt", name: "bcrypt", speed: "Slow" },
    { id: "ntlm", name: "NTLM", speed: "Fast" },
    { id: "netlmv2", name: "NetNTLMv2", speed: "Medium" },
    { id: "wpa", name: "WPA/WPA2", speed: "Very Slow" },
    { id: "kerberos", name: "Kerberos TGS", speed: "Slow" },
  ];

  const wordlists = [
    { name: "rockyou.txt", size: "139 MB", entries: "14.3M" },
    { name: "darkweb2017.txt", size: "12 GB", entries: "1.4B" },
    { name: "hashesorg2019.txt", size: "31 GB", entries: "2.5B" },
    { name: "custom_corp.txt", size: "45 MB", entries: "4.2M" },
  ];

  const rules = [
    { name: "best64.rule", description: "Top 64 most effective rules" },
    { name: "dive.rule", description: "Extensive mutation rules" },
    { name: "toggles.rule", description: "Case toggling variations" },
    { name: "leetspeak.rule", description: "L33t speak substitutions" },
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
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded bg-[hsl(0,100%,25%)]">
            <Key className="w-4 h-4 text-[hsl(0,100%,70%)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(0,100%,85%)]">Password Cracking Lab</h3>
            <p className="text-xs text-[hsl(0,60%,50%)]">Hash Analysis & Recovery</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="crack" className="p-3">
          <TabsList className="w-full bg-[hsl(0,100%,10%)] border border-[hsl(0,100%,20%)]">
            <TabsTrigger value="crack" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Zap className="w-3 h-3 mr-1" /> Crack
            </TabsTrigger>
            <TabsTrigger value="identify" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <Hash className="w-3 h-3 mr-1" /> Identify
            </TabsTrigger>
            <TabsTrigger value="results" className="flex-1 text-xs data-[state=active]:bg-[hsl(0,100%,25%)]">
              <CheckCircle className="w-3 h-3 mr-1" /> Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crack" className="mt-3 space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Hash(es) to Crack</label>
              <Textarea 
                placeholder="Enter hashes (one per line)..."
                className="h-20 bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] font-mono text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                  <Upload className="w-3 h-3 mr-1" /> Import File
                </Button>
                <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                  <FileText className="w-3 h-3 mr-1" /> Paste from Clip
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Hash Type</label>
              <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                {hashTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.speed})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Attack Mode</label>
              <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                <option value="dict">Dictionary Attack</option>
                <option value="brute">Brute Force</option>
                <option value="hybrid">Hybrid (Dict + Mask)</option>
                <option value="rule">Rule-Based</option>
                <option value="combinator">Combinator</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Wordlist</label>
              <div className="space-y-1">
                {wordlists.map((wl, i) => (
                  <label key={i} className="flex items-center gap-2 p-2 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)] cursor-pointer hover:border-[hsl(0,100%,30%)]">
                    <input type="radio" name="wordlist" className="accent-[hsl(0,100%,50%)]" />
                    <span className="text-sm text-[hsl(0,100%,85%)]">{wl.name}</span>
                    <span className="text-xs text-[hsl(0,60%,50%)] ml-auto">{wl.entries} entries</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Rules (Optional)</label>
              <select className="w-full h-9 px-3 rounded bg-[hsl(0,100%,8%)] border border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] text-sm">
                <option value="">No rules</option>
                {rules.map((rule, i) => (
                  <option key={i} value={rule.name}>{rule.name} - {rule.description}</option>
                ))}
              </select>
            </div>

            {crackingActive && (
              <div className="p-3 bg-[hsl(0,100%,12%)] rounded border border-[hsl(0,100%,25%)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[hsl(0,100%,70%)]">Cracking in progress...</span>
                  <Loader2 className="w-4 h-4 text-[hsl(0,100%,50%)] animate-spin" />
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[hsl(0,60%,50%)]" />
                    <span className="text-[hsl(0,60%,50%)]">Speed:</span>
                    <span className="text-[hsl(0,100%,70%)]">2.4 GH/s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[hsl(0,60%,50%)]" />
                    <span className="text-[hsl(0,60%,50%)]">ETA:</span>
                    <span className="text-[hsl(0,100%,70%)]">~2m 34s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[hsl(0,60%,50%)]" />
                    <span className="text-[hsl(0,60%,50%)]">Recovered:</span>
                    <span className="text-green-500">4/12</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-[hsl(0,60%,50%)]" />
                    <span className="text-[hsl(0,60%,50%)]">Progress:</span>
                    <span className="text-[hsl(0,100%,70%)]">34%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setCrackingActive(!crackingActive);
                  if (!crackingActive) {
                    setProgress(0);
                    const interval = setInterval(() => {
                      setProgress(p => {
                        if (p >= 100) {
                          clearInterval(interval);
                          setCrackingActive(false);
                          return 100;
                        }
                        return p + 1;
                      });
                    }, 100);
                  }
                }}
                className={`flex-1 ${crackingActive ? "bg-red-600 hover:bg-red-700" : "bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)]"}`}
              >
                {crackingActive ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {crackingActive ? "Stop" : "Start Cracking"}
              </Button>
              <Button variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="identify" className="mt-3 space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-[hsl(0,60%,50%)] uppercase">Hash to Identify</label>
              <Input 
                placeholder="Paste a hash to identify its type..."
                className="bg-[hsl(0,100%,8%)] border-[hsl(0,100%,25%)] text-[hsl(0,100%,85%)] font-mono"
              />
            </div>
            <Button className="w-full bg-[hsl(0,100%,25%)] hover:bg-[hsl(0,100%,30%)]">
              <Hash className="w-4 h-4 mr-2" /> Identify Hash
            </Button>

            <div className="p-3 bg-[hsl(0,100%,10%)] rounded border border-[hsl(0,100%,20%)]">
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase mb-2">Possible Hash Types</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,15%)] rounded">
                  <span className="text-sm text-[hsl(0,100%,85%)]">MD5</span>
                  <Badge className="bg-green-600">95% match</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,15%)] rounded">
                  <span className="text-sm text-[hsl(0,100%,85%)]">NTLM</span>
                  <Badge className="bg-yellow-600">75% match</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-[hsl(0,100%,15%)] rounded">
                  <span className="text-sm text-[hsl(0,100%,85%)]">LM</span>
                  <Badge className="bg-orange-600">40% match</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase">Cracked Hashes</div>
              <Button size="sm" variant="outline" className="border-[hsl(0,100%,25%)] text-[hsl(0,100%,70%)]">
                Export
              </Button>
            </div>
            <div className="space-y-2">
              {crackedHashes.map((result, i) => (
                <div key={i} className="p-2.5 bg-[hsl(0,100%,8%)] rounded border border-[hsl(0,100%,20%)]">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-mono text-green-400">{result.plain}</span>
                    <Badge className="ml-auto text-xs">{result.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[hsl(0,60%,50%)] font-mono truncate max-w-[200px]">{result.hash}</span>
                    <span className="text-[hsl(0,60%,50%)]">{result.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[hsl(0,100%,10%)] rounded border border-[hsl(0,100%,20%)]">
              <div className="text-xs text-[hsl(0,60%,50%)] uppercase mb-2">Statistics</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[hsl(0,60%,50%)]">Total hashes:</span>
                  <span className="text-[hsl(0,100%,85%)]">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(0,60%,50%)]">Cracked:</span>
                  <span className="text-green-500">4 (33%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(0,60%,50%)]">Remaining:</span>
                  <span className="text-[hsl(0,100%,70%)]">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(0,60%,50%)]">Time elapsed:</span>
                  <span className="text-[hsl(0,100%,85%)]">2m 34s</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default PasswordCrackingPanel;
