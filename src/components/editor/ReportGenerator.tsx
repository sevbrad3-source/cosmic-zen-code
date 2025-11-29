import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, CheckCircle, AlertCircle, Clock } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

const ReportGenerator = () => {
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportTitle, setReportTitle] = useState("Security Assessment Report");
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

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
      case "critical": return "bg-red-500/20 text-red-500";
      case "high": return "bg-orange-500/20 text-orange-500";
      case "medium": return "bg-yellow-500/20 text-yellow-500";
      default: return "bg-blue-500/20 text-blue-500";
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const reportElement = document.getElementById("report-content");
      if (!reportElement) {
        throw new Error("Report content not found");
      }

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        backgroundColor: "#1a1a1a",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);

      toast({
        title: "Export Successful",
        description: "PDF report has been downloaded.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportDOCX = () => {
    toast({
      title: "Coming Soon",
      description: "DOCX export will be available in the next update.",
    });
  };

  const handleExport = () => {
    if (reportFormat === "pdf") {
      handleExportPDF();
    } else if (reportFormat === "docx") {
      handleExportDOCX();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Report Generator</h3>
        <Button 
          size="sm" 
          className="h-7"
          onClick={handleExport}
          disabled={exporting}
        >
          <FileDown className="w-3 h-3 mr-1" />
          {exporting ? "Exporting..." : "Export"}
        </Button>
      </div>

      <Card className="p-4 space-y-3 bg-panel-bg border-border">
        <div className="space-y-2">
          <Label className="text-xs text-text-secondary">Report Title</Label>
          <Input
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="h-8 text-xs bg-input-bg border-border text-text-primary"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-text-secondary">Output Format</Label>
          <Select value={reportFormat} onValueChange={setReportFormat}>
            <SelectTrigger className="h-8 text-xs bg-input-bg border-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="docx">Word Document (DOCX)</SelectItem>
              <SelectItem value="html">HTML Report</SelectItem>
              <SelectItem value="json">JSON Export</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div id="report-content" className="space-y-3">
        <h4 className="text-xs font-semibold text-text-secondary">Security Findings</h4>
        {findings.map((finding) => (
          <Card key={finding.id} className="p-3 bg-panel-bg border-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getSeverityColor(finding.severity)}>
                    {finding.severity.toUpperCase()}
                  </Badge>
                  {finding.status === "exploited" && (
                    <Badge variant="destructive" className="text-xs">Exploited</Badge>
                  )}
                </div>
                <p className="text-xs font-medium text-text-primary">{finding.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{finding.cve}</p>
              </div>
              {finding.status === "exploited" ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </Card>
        ))}

        <h4 className="text-xs font-semibold text-text-secondary mt-4">Exploits Used</h4>
        {exploitsUsed.map((exploit, idx) => (
          <Card key={idx} className="p-3 bg-panel-bg border-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-text-primary">{exploit.name}</span>
              {exploit.success ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              )}
            </div>
            <div className="text-xs text-text-muted space-y-0.5">
              <p>Target: {exploit.target}</p>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{exploit.timestamp}</span>
              </div>
            </div>
          </Card>
        ))}

        <h4 className="text-xs font-semibold text-text-secondary mt-4">Exfiltrated Data</h4>
        {exfiltratedData.map((data, idx) => (
          <Card key={idx} className="p-3 bg-panel-bg border-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-text-primary">{data.type}</span>
              <Badge variant="outline" className="text-xs">
                {data.size || data.count}
              </Badge>
            </div>
            <div className="text-xs text-text-muted space-y-0.5">
              <p>Source: {data.source}</p>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{data.timestamp}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportGenerator;
