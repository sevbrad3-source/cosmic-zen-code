import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertCircle, CheckCircle, XCircle, FileText } from "lucide-react";

interface ComplianceFramework {
  id: string;
  name: string;
  score: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
  status: "compliant" | "partial" | "non-compliant";
}

interface ComplianceControl {
  id: string;
  control: string;
  description: string;
  status: "pass" | "fail" | "partial";
  findings: string[];
  remediation: string;
}

const ComplianceChecker = () => {
  const [frameworks] = useState<ComplianceFramework[]>([
    {
      id: "pci-dss",
      name: "PCI-DSS v4.0",
      score: 78,
      totalControls: 12,
      compliantControls: 9,
      nonCompliantControls: 3,
      status: "partial"
    },
    {
      id: "hipaa",
      name: "HIPAA",
      score: 92,
      totalControls: 18,
      compliantControls: 17,
      nonCompliantControls: 1,
      status: "compliant"
    },
    {
      id: "soc2",
      name: "SOC 2 Type II",
      score: 65,
      totalControls: 64,
      compliantControls: 42,
      nonCompliantControls: 22,
      status: "partial"
    },
    {
      id: "iso27001",
      name: "ISO 27001",
      score: 85,
      totalControls: 114,
      compliantControls: 97,
      nonCompliantControls: 17,
      status: "partial"
    }
  ]);

  const [selectedFramework, setSelectedFramework] = useState("pci-dss");

  const pciControls: ComplianceControl[] = [
    {
      id: "1",
      control: "1.2.1 - Firewall Configuration",
      description: "Install and maintain network security controls",
      status: "pass",
      findings: [],
      remediation: "N/A - Control is compliant"
    },
    {
      id: "2",
      control: "2.2.1 - Configuration Standards",
      description: "Configuration standards are defined and implemented",
      status: "fail",
      findings: [
        "Default passwords found on 3 servers",
        "Unnecessary services running on web servers"
      ],
      remediation: "Change all default passwords, disable unnecessary services"
    },
    {
      id: "3",
      control: "4.1.1 - Strong Cryptography",
      description: "Use strong cryptography and security protocols",
      status: "partial",
      findings: [
        "TLS 1.0 still enabled on payment gateway",
        "Weak cipher suites detected"
      ],
      remediation: "Disable TLS 1.0, configure strong cipher suites only"
    },
    {
      id: "4",
      control: "6.2.1 - Bespoke Software",
      description: "Manage and implement software securely",
      status: "pass",
      findings: [],
      remediation: "N/A - Control is compliant"
    },
    {
      id: "5",
      control: "8.3.1 - Multi-Factor Authentication",
      description: "MFA for all non-console access",
      status: "fail",
      findings: [
        "MFA not enforced for admin accounts",
        "15 users without MFA enabled"
      ],
      remediation: "Enforce MFA for all privileged access, enable for all users"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "text-green-500";
      case "fail": return "text-red-500";
      case "partial": return "text-yellow-500";
      default: return "text-text-secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle className="w-4 h-4" />;
      case "fail": return <XCircle className="w-4 h-4" />;
      case "partial": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getFrameworkStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-500/20 text-green-500";
      case "partial": return "bg-yellow-500/20 text-yellow-500";
      case "non-compliant": return "bg-red-500/20 text-red-500";
      default: return "";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Compliance Checker</h3>
        <Button size="sm" className="h-7">
          <FileText className="w-3 h-3 mr-1" />
          Export Report
        </Button>
      </div>

      <Tabs value={selectedFramework} onValueChange={setSelectedFramework} className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 h-auto bg-panel-bg">
          {frameworks.map((fw) => (
            <TabsTrigger
              key={fw.id}
              value={fw.id}
              className="text-xs data-[state=active]:bg-activitybar-active/10"
            >
              {fw.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {frameworks.map((framework) => (
          <TabsContent key={framework.id} value={framework.id} className="space-y-4 mt-4">
            <Card className="p-4 bg-panel-bg border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-activitybar-active" />
                  <h4 className="text-sm font-semibold text-text-primary">{framework.name}</h4>
                </div>
                <Badge className={getFrameworkStatusColor(framework.status)}>
                  {framework.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Compliance Score</span>
                  <span className="font-semibold text-text-primary">{framework.score}%</span>
                </div>
                <Progress value={framework.score} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-text-primary">{framework.totalControls}</div>
                  <div className="text-xs text-text-secondary">Total Controls</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-green-500">{framework.compliantControls}</div>
                  <div className="text-xs text-text-secondary">Compliant</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-red-500">{framework.nonCompliantControls}</div>
                  <div className="text-xs text-text-secondary">Non-Compliant</div>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-text-secondary">Control Details</h4>
              {pciControls.map((control) => (
                <Card key={control.id} className="p-3 bg-panel-bg border-border">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={getStatusColor(control.status)}>
                      {getStatusIcon(control.status)}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-semibold text-text-primary mb-0.5">
                        {control.control}
                      </h5>
                      <p className="text-xs text-text-secondary">{control.description}</p>
                    </div>
                  </div>

                  {control.findings.length > 0 && (
                    <div className="ml-6 space-y-1 mb-2">
                      <div className="text-xs font-medium text-text-secondary">Findings:</div>
                      {control.findings.map((finding, idx) => (
                        <div key={idx} className="text-xs text-text-secondary flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="ml-6 text-xs">
                    <span className="font-medium text-text-secondary">Remediation: </span>
                    <span className="text-text-primary">{control.remediation}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ComplianceChecker;
