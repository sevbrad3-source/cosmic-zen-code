import { useState } from "react";
import { ShieldCheck, Swords, Target, CheckCircle, XCircle, Play, Clock, Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PurpleTeamPanel = () => {
  const [activeExercise, setActiveExercise] = useState("ex-001");

  const exercises = [
    {
      id: "ex-001",
      name: "Credential Access Validation",
      status: "running",
      redTechnique: "T1003.001 - LSASS Memory",
      blueDetection: "Sysmon + YARA",
      detectionRate: 85,
    },
    {
      id: "ex-002",
      name: "Lateral Movement Test",
      status: "completed",
      redTechnique: "T1021.002 - SMB/Windows Admin Shares",
      blueDetection: "Network Flow Analysis",
      detectionRate: 92,
    },
    {
      id: "ex-003",
      name: "Data Exfiltration Drill",
      status: "scheduled",
      redTechnique: "T1048.003 - Exfil Over C2",
      blueDetection: "DLP + Network Monitor",
      detectionRate: 0,
    },
  ];

  const attackSteps = [
    { step: "Initial Access", redResult: "success", blueResult: "detected", time: "00:05:23" },
    { step: "Execution", redResult: "success", blueResult: "detected", time: "00:08:45" },
    { step: "Persistence", redResult: "success", blueResult: "missed", time: "00:12:30" },
    { step: "Privilege Escalation", redResult: "success", blueResult: "detected", time: "00:18:12" },
    { step: "Defense Evasion", redResult: "partial", blueResult: "partial", time: "00:25:00" },
    { step: "Credential Access", redResult: "running", blueResult: "pending", time: "-" },
  ];

  const metrics = {
    attacksAttempted: 24,
    attacksDetected: 19,
    meanTimeToDetect: "4m 32s",
    coverageGap: 3,
  };

  return (
    <div className="p-3 space-y-4 text-[hsl(210,100%,85%)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(0,100%,15%)] to-[hsl(210,100%,15%)] border border-[hsl(280,100%,30%)] rounded p-2 flex items-center gap-2">
        <Swords className="w-4 h-4 text-[hsl(280,100%,70%)]" />
        <span className="text-xs text-[hsl(280,100%,80%)]">PURPLE TEAM - Adversary Emulation & Detection Validation</span>
      </div>

      {/* Exercise List */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Active Exercises</span>
        <div className="space-y-1">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex.id)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                activeExercise === ex.id
                  ? "bg-[hsl(280,50%,12%)] border-[hsl(280,100%,40%)]"
                  : "bg-[hsl(210,100%,8%)] border-[hsl(210,100%,18%)] hover:border-[hsl(280,100%,30%)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{ex.name}</span>
                <Badge
                  variant="outline"
                  className={`text-[8px] ${
                    ex.status === "running"
                      ? "border-[hsl(280,100%,50%)] text-[hsl(280,100%,70%)]"
                      : ex.status === "completed"
                      ? "border-[hsl(120,100%,40%)] text-[hsl(120,100%,60%)]"
                      : "border-[hsl(210,60%,40%)] text-[hsl(210,60%,60%)]"
                  }`}
                >
                  {ex.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[9px]">
                <div className="p-1 bg-[hsl(0,100%,10%)] rounded">
                  <span className="text-[hsl(0,100%,60%)]">RED:</span> {ex.redTechnique.split(" - ")[1]}
                </div>
                <div className="p-1 bg-[hsl(210,100%,10%)] rounded">
                  <span className="text-[hsl(210,100%,60%)]">BLUE:</span> {ex.blueDetection}
                </div>
              </div>
              {ex.status !== "scheduled" && (
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={ex.detectionRate} className="h-1 flex-1" />
                  <span className="text-[9px]">{ex.detectionRate}% detected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attack Chain Progress */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[hsl(210,100%,70%)] uppercase tracking-wide">Kill Chain Progress</span>
        <div className="space-y-1">
          {attackSteps.map((step, i) => (
            <div
              key={i}
              className="p-2 bg-[hsl(210,100%,8%)] border border-[hsl(210,100%,18%)] rounded"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">{step.step}</span>
                <span className="text-[9px] text-[hsl(210,60%,45%)]">{step.time}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {step.redResult === "success" ? (
                    <CheckCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />
                  ) : step.redResult === "running" ? (
                    <div className="w-3 h-3 border border-[hsl(0,100%,50%)] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Activity className="w-3 h-3 text-[hsl(45,100%,50%)]" />
                  )}
                  <span className="text-[9px] text-[hsl(0,100%,60%)]">Red: {step.redResult}</span>
                </div>
                <div className="flex items-center gap-1">
                  {step.blueResult === "detected" ? (
                    <CheckCircle className="w-3 h-3 text-[hsl(210,100%,50%)]" />
                  ) : step.blueResult === "missed" ? (
                    <XCircle className="w-3 h-3 text-[hsl(0,100%,50%)]" />
                  ) : step.blueResult === "pending" ? (
                    <Clock className="w-3 h-3 text-[hsl(210,60%,40%)]" />
                  ) : (
                    <Activity className="w-3 h-3 text-[hsl(45,100%,50%)]" />
                  )}
                  <span className="text-[9px] text-[hsl(210,100%,60%)]">Blue: {step.blueResult}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(280,100%,70%)]">{metrics.attacksDetected}/{metrics.attacksAttempted}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Detection Rate</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center">
          <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{metrics.meanTimeToDetect}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">MTTD</div>
        </div>
        <div className="p-2 bg-[hsl(210,100%,10%)] border border-[hsl(210,100%,20%)] rounded text-center col-span-2">
          <div className="text-lg font-bold text-[hsl(30,100%,60%)]">{metrics.coverageGap}</div>
          <div className="text-[9px] text-[hsl(210,60%,50%)]">Coverage Gaps Identified</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 text-xs py-1.5 bg-[hsl(0,100%,30%)] hover:bg-[hsl(0,100%,35%)] rounded text-white flex items-center justify-center gap-1">
          <Play className="w-3 h-3" /> Red Attack
        </button>
        <button className="flex-1 text-xs py-1.5 bg-[hsl(210,100%,30%)] hover:bg-[hsl(210,100%,35%)] rounded text-white flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Blue Validate
        </button>
      </div>
    </div>
  );
};

export default PurpleTeamPanel;
