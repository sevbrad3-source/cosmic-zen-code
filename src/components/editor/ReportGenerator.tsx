import { useState } from "react";
import { FileText, Download, Settings, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ReportGenerator = () => {
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportTitle, setReportTitle] = useState("Penetration Test Report");

  const findings = [
    { id: 1, severity: "critical", title: "SQL Injection in Login Form", cve: "CVE-2024-1234", status: "exploited" },
    { id: 2, severity: "high", title: "Weak SSH Configuration", cve: "N/A", status: "verified" },
    { id: 3, severity: "medium", title: "Outdated Software Version", cve: "CVE-2023-5678", status: "identified" },
    { id: 4, severity: "critical", title: "Remote Code Execution", cve: "CVE-2024-9012", status: "exploited" },
  ];

  const exploitsUsed = [
    { name: "SQLMap", target: "192.168.1.100:3306", success: true, timestamp: "2024-03-15 14:23" },
    { name: "Metasploit (EternalBlue)", target: "192.168.1.105", success: true, timestamp: "2024-03-15 15:45" },
    { name: "Hydra SSH Brute Force", target: "192.168.1.110", success: false, timestamp: "2024-03-15 16:12" },
  ];

  const exfiltratedData = [
    { type: "Database Dump", size: "2.4 GB", source: "MySQL Server", timestamp: "2024-03-15 14:30" },
    { type: "User Credentials", count: "1,247 entries", source: "Active Directory", timestamp: "2024-03-15 15:50" },
    { type: "SSH Private Keys", count: "12 keys", source: "Various Servers", timestamp: "2024-03-15 16:05" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Report Generator</h3>
        </div>
        <Button size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Title</label>
          <Input 
            value={reportTitle} 
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="Enter report title"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select value={reportFormat} onValueChange={setReportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="html">HTML Report</SelectItem>
              <SelectItem value="docx">Word Document</SelectItem>
              <SelectItem value="json">JSON Export</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Include executive summary, methodology, and remediation steps</span>
        </div>
      </Card>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          Security Findings
          <Badge variant="secondary">{findings.length}</Badge>
        </h4>
        {findings.map((finding) => (
          <Card key={finding.id} className="p-3 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getSeverityColor(finding.severity)}>
                    {finding.severity.toUpperCase()}
                  </Badge>
                  {finding.status === "exploited" && (
                    <Badge variant="destructive" className="text-xs">Exploited</Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{finding.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{finding.cve}</p>
              </div>
              {finding.status === "exploited" ? (
                <XCircle className="w-5 h-5 text-destructive" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          Exploits Used
          <Badge variant="secondary">{exploitsUsed.length}</Badge>
        </h4>
        {exploitsUsed.map((exploit, idx) => (
          <Card key={idx} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{exploit.name}</span>
              {exploit.success ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Target: {exploit.target}</p>
              <p>Time: {exploit.timestamp}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          Exfiltrated Data
          <Badge variant="secondary">{exfiltratedData.length}</Badge>
        </h4>
        {exfiltratedData.map((data, idx) => (
          <Card key={idx} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{data.type}</span>
              <Badge variant="outline" className="text-xs">
                {data.size || data.count}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Source: {data.source}</p>
              <p>Time: {data.timestamp}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportGenerator;
