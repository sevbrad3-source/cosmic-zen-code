import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Shield } from "lucide-react";

interface AIRecommendation {
  id: string;
  category: "strategic" | "tactical" | "remediation" | "optimization";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  effort: string;
  recommendations: string[];
}

const AISecurityAdvisor = () => {
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [recommendations] = useState<AIRecommendation[]>([
    {
      id: "1",
      category: "strategic",
      priority: "critical",
      title: "Critical Attack Surface Reduction Needed",
      description: "Analysis of 127 vulnerabilities shows 68% are related to exposed services and misconfigurations. Your organization has a significantly larger attack surface than industry benchmarks.",
      impact: "Reducing exposed services by 60% would eliminate 43 high/critical vulnerabilities",
      effort: "6-8 weeks with dedicated security team",
      recommendations: [
        "Implement network segmentation to isolate critical assets",
        "Deploy zero-trust architecture for internal services",
        "Conduct comprehensive service inventory and disable unused services",
        "Implement API gateway with rate limiting and authentication"
      ]
    },
    {
      id: "2",
      category: "tactical",
      priority: "high",
      title: "Authentication Weaknesses Pattern Detected",
      description: "AI analysis identified a recurring pattern of weak authentication across 23 different systems. This suggests a systemic issue rather than isolated incidents.",
      impact: "Fixing authentication issues would address 31% of all findings",
      effort: "3-4 weeks with proper planning",
      recommendations: [
        "Enforce MFA organization-wide, starting with privileged accounts",
        "Implement password policy with minimum 14 characters",
        "Deploy SSO solution to centralize authentication",
        "Regular password rotation for service accounts"
      ]
    },
    {
      id: "3",
      category: "remediation",
      priority: "high",
      title: "Prioritize CVE-2024-1234 Exploitation Chain",
      description: "Three discovered vulnerabilities (CVE-2024-1234, CVE-2024-5678, CVE-2024-9012) can be chained together to achieve remote code execution. This combination is being actively exploited in the wild.",
      impact: "Eliminates the most severe attack vector identified",
      effort: "1-2 weeks for emergency patching",
      recommendations: [
        "Immediately patch CVE-2024-1234 on all public-facing servers",
        "Deploy WAF rules to block exploitation attempts",
        "Monitor for indicators of compromise using provided IOCs",
        "Conduct forensic analysis on potentially affected systems"
      ]
    },
    {
      id: "4",
      category: "optimization",
      priority: "medium",
      title: "Security Team Efficiency Improvements",
      description: "Based on remediation patterns, your team spends 40% of time on low-priority issues. Optimizing triage could improve remediation velocity by 2.5x.",
      impact: "Accelerate critical vulnerability remediation by 150%",
      effort: "2 weeks to implement new processes",
      recommendations: [
        "Implement risk-based vulnerability prioritization",
        "Automate remediation for common configuration issues",
        "Create playbooks for top 10 vulnerability types",
        "Deploy SOAR platform for automated response workflows"
      ]
    },
    {
      id: "5",
      category: "strategic",
      priority: "medium",
      title: "Third-Party Risk Management Gap",
      description: "33% of critical findings are in third-party components and libraries. Current vendor risk management processes are insufficient.",
      impact: "Reduce supply chain attack risk by 70%",
      effort: "4-6 weeks to establish program",
      recommendations: [
        "Implement Software Composition Analysis (SCA) tools",
        "Establish vendor security assessment program",
        "Create allowlist of approved libraries and components",
        "Deploy SBOM tracking for all applications"
      ]
    }
  ]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strategic": return <Target className="w-4 h-4" />;
      case "tactical": return <Shield className="w-4 h-4" />;
      case "remediation": return <AlertTriangle className="w-4 h-4" />;
      case "optimization": return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-500";
      case "high": return "bg-orange-500/20 text-orange-500";
      case "medium": return "bg-yellow-500/20 text-yellow-500";
      case "low": return "bg-blue-500/20 text-blue-500";
      default: return "";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strategic": return "bg-purple-500/20 text-purple-500";
      case "tactical": return "bg-blue-500/20 text-blue-500";
      case "remediation": return "bg-orange-500/20 text-orange-500";
      case "optimization": return "bg-green-500/20 text-green-500";
      default: return "";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-activitybar-active" />
          <h3 className="text-sm font-semibold text-text-primary">AI Security Advisor</h3>
        </div>
      </div>

      <Card className="p-4 bg-panel-bg border-border space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary">Ask the AI Advisor</label>
          <Textarea
            placeholder="Example: What should we prioritize first? How can we reduce our attack surface? What are the biggest risks?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px] text-xs bg-input-bg border-border text-text-primary resize-none"
          />
        </div>
        <Button
          className="w-full h-8 text-xs"
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? "Analyzing..." : "Get AI Recommendations"}
        </Button>
      </Card>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-text-secondary">Strategic Recommendations</h4>
        {recommendations.map((rec) => (
          <Card key={rec.id} className="p-4 bg-panel-bg border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 text-activitybar-active">
                {getCategoryIcon(rec.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h5 className="text-sm font-semibold text-text-primary">{rec.title}</h5>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <Badge className={getCategoryColor(rec.category)}>
                    {rec.category.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary mb-3">{rec.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-3 p-2 bg-background/50 rounded border border-border/50">
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-0.5">Impact</div>
                    <div className="text-xs text-text-primary">{rec.impact}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-0.5">Effort</div>
                    <div className="text-xs text-text-primary">{rec.effort}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-text-secondary">Recommended Actions:</div>
                  {rec.recommendations.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-text-primary">
                      <span className="text-activitybar-active mt-0.5">•</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                Create Action Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AISecurityAdvisor;
