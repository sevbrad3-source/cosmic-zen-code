import { useState } from 'react';
import { FileText, Download, Loader2, Shield, Users, Activity, Target, Database, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useThreatActors, useAttackCampaigns } from '@/hooks/useThreatActors';
import { useIOCs, useSecurityEvents } from '@/hooks/useSecurityData';
import { useNetworkAssets } from '@/hooks/useNetworkAssets';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ReportSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const ThreatIntelReportGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState('Threat Intelligence Report');
  const [reportAuthor, setReportAuthor] = useState('Security Operations Center');
  const [sections, setSections] = useState<ReportSection[]>([
    { id: 'executive', name: 'Executive Summary', icon: <FileText className="w-4 h-4" />, enabled: true },
    { id: 'actors', name: 'Threat Actor Profiles', icon: <Users className="w-4 h-4" />, enabled: true },
    { id: 'campaigns', name: 'Attack Campaigns', icon: <Activity className="w-4 h-4" />, enabled: true },
    { id: 'iocs', name: 'Indicators of Compromise', icon: <Target className="w-4 h-4" />, enabled: true },
    { id: 'assets', name: 'Compromised Assets', icon: <Database className="w-4 h-4" />, enabled: true },
    { id: 'mitre', name: 'MITRE ATT&CK Mapping', icon: <Shield className="w-4 h-4" />, enabled: true },
  ]);

  const { actors } = useThreatActors();
  const { campaigns } = useAttackCampaigns();
  const { iocs } = useIOCs();
  const { events } = useSecurityEvents();
  const { assets } = useNetworkAssets();

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      const addPage = () => {
        pdf.addPage();
        yPos = margin;
      };

      const checkPageBreak = (height: number) => {
        if (yPos + height > pageHeight - margin) {
          addPage();
        }
      };

      const addSectionTitle = (title: string) => {
        checkPageBreak(15);
        pdf.setFontSize(14);
        pdf.setTextColor(220, 38, 38);
        pdf.text(title, margin, yPos);
        yPos += 8;
        pdf.setDrawColor(220, 38, 38);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
      };

      // Title page
      pdf.setFillColor(15, 15, 15);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(28);
      pdf.text(reportTitle, pageWidth / 2, 80, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Prepared by: ${reportAuthor}`, pageWidth / 2, 100, { align: 'center' });
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 110, { align: 'center' });
      pdf.text('CONFIDENTIAL - FOR AUTHORIZED PERSONNEL ONLY', pageWidth / 2, 140, { align: 'center' });

      addPage();

      // Executive Summary
      if (sections.find(s => s.id === 'executive')?.enabled) {
        addSectionTitle('EXECUTIVE SUMMARY');
        pdf.setFontSize(10);
        const criticalIOCs = iocs.filter(i => i.threat_level === 'critical').length;
        const activeActors = actors.filter(a => a.is_active).length;
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        const compromisedAssets = assets.filter(a => a.is_compromised).length;

        const summaryLines = [
          `This report provides a comprehensive analysis of the current threat landscape.`,
          ``,
          `Key Findings:`,
          `• ${criticalIOCs} Critical Indicators of Compromise identified`,
          `• ${activeActors} Active Threat Actors being tracked`,
          `• ${activeCampaigns} Ongoing Attack Campaigns detected`,
          `• ${compromisedAssets} Compromised Assets requiring attention`,
          ``,
          `Risk Level: ${criticalIOCs > 5 ? 'CRITICAL' : criticalIOCs > 2 ? 'HIGH' : 'MODERATE'}`,
        ];

        summaryLines.forEach(line => {
          checkPageBreak(6);
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 10;
      }

      // Threat Actors
      if (sections.find(s => s.id === 'actors')?.enabled && actors.length > 0) {
        addSectionTitle('THREAT ACTOR PROFILES');
        actors.forEach(actor => {
          checkPageBreak(40);
          pdf.setFontSize(11);
          pdf.setTextColor(220, 38, 38);
          pdf.text(actor.name, margin, yPos);
          yPos += 6;
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          const actorDetails = [
            `Sophistication: ${actor.sophistication || 'Unknown'}`,
            `Origin: ${actor.country_of_origin || 'Unknown'}`,
            `Motivation: ${actor.motivation || 'Unknown'}`,
            `Status: ${actor.is_active ? 'ACTIVE' : 'Inactive'}`,
            `Target Industries: ${actor.target_industries?.join(', ') || 'Unknown'}`,
            `Known TTPs: ${actor.known_ttps?.slice(0, 5).join(', ') || 'None documented'}`,
          ];
          actorDetails.forEach(detail => {
            checkPageBreak(5);
            pdf.text(detail, margin + 5, yPos);
            yPos += 4;
          });
          if (actor.description) {
            checkPageBreak(10);
            const desc = pdf.splitTextToSize(actor.description, pageWidth - margin * 2 - 5);
            desc.slice(0, 3).forEach((line: string) => {
              checkPageBreak(5);
              pdf.text(line, margin + 5, yPos);
              yPos += 4;
            });
          }
          yPos += 8;
        });
      }

      // Campaigns
      if (sections.find(s => s.id === 'campaigns')?.enabled && campaigns.length > 0) {
        addSectionTitle('ATTACK CAMPAIGNS');
        campaigns.forEach(campaign => {
          checkPageBreak(35);
          pdf.setFontSize(11);
          pdf.setTextColor(234, 88, 12);
          pdf.text(campaign.name, margin, yPos);
          yPos += 6;
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Status: ${campaign.status?.toUpperCase()}`, margin + 5, yPos);
          yPos += 4;
          if (campaign.start_time) {
            pdf.text(`Start: ${new Date(campaign.start_time).toLocaleDateString()}`, margin + 5, yPos);
            yPos += 4;
          }
          if (campaign.techniques_used?.length) {
            pdf.text(`Techniques: ${campaign.techniques_used.slice(0, 5).join(', ')}`, margin + 5, yPos);
            yPos += 4;
          }
          if (campaign.description) {
            const desc = pdf.splitTextToSize(campaign.description, pageWidth - margin * 2 - 5);
            desc.slice(0, 2).forEach((line: string) => {
              checkPageBreak(5);
              pdf.text(line, margin + 5, yPos);
              yPos += 4;
            });
          }
          yPos += 6;
        });
      }

      // IOCs
      if (sections.find(s => s.id === 'iocs')?.enabled && iocs.length > 0) {
        addSectionTitle('INDICATORS OF COMPROMISE');
        pdf.setFontSize(9);

        // Table header
        pdf.setTextColor(150, 150, 150);
        pdf.text('Type', margin, yPos);
        pdf.text('Value', margin + 25, yPos);
        pdf.text('Threat Level', margin + 100, yPos);
        pdf.text('Status', margin + 130, yPos);
        yPos += 5;
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 4;

        iocs.slice(0, 30).forEach(ioc => {
          checkPageBreak(6);
          pdf.setTextColor(100, 100, 100);
          pdf.text(ioc.ioc_type, margin, yPos);
          const truncatedValue = ioc.value.length > 40 ? ioc.value.slice(0, 37) + '...' : ioc.value;
          pdf.text(truncatedValue, margin + 25, yPos);
          pdf.setTextColor(
            ioc.threat_level === 'critical' ? 220 : ioc.threat_level === 'high' ? 234 : 100,
            ioc.threat_level === 'critical' ? 38 : ioc.threat_level === 'high' ? 88 : 100,
            ioc.threat_level === 'critical' ? 38 : ioc.threat_level === 'high' ? 12 : 100
          );
          pdf.text(ioc.threat_level.toUpperCase(), margin + 100, yPos);
          pdf.setTextColor(ioc.is_active ? 34 : 100, ioc.is_active ? 197 : 100, ioc.is_active ? 94 : 100);
          pdf.text(ioc.is_active ? 'ACTIVE' : 'Inactive', margin + 130, yPos);
          yPos += 5;
        });
        yPos += 10;
      }

      // Compromised Assets
      if (sections.find(s => s.id === 'assets')?.enabled) {
        const compromised = assets.filter(a => a.is_compromised);
        if (compromised.length > 0) {
          addSectionTitle('COMPROMISED ASSETS');
          compromised.forEach(asset => {
            checkPageBreak(20);
            pdf.setFontSize(10);
            pdf.setTextColor(220, 38, 38);
            pdf.text(`${asset.hostname || asset.ip_address}`, margin, yPos);
            yPos += 5;
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`IP: ${asset.ip_address} | Type: ${asset.asset_type} | Zone: ${asset.zone || 'Unknown'}`, margin + 5, yPos);
            yPos += 4;
            pdf.text(`OS: ${asset.operating_system || 'Unknown'} | Risk Score: ${asset.risk_score || 'N/A'}`, margin + 5, yPos);
            yPos += 6;
          });
        }
      }

      // MITRE Mapping
      if (sections.find(s => s.id === 'mitre')?.enabled) {
        addSectionTitle('MITRE ATT&CK MAPPING');
        const allTTPs = new Set<string>();
        actors.forEach(a => a.known_ttps?.forEach(t => allTTPs.add(t)));
        campaigns.forEach(c => c.techniques_used?.forEach(t => allTTPs.add(t)));
        events.forEach(e => e.mitre_technique && allTTPs.add(e.mitre_technique));

        if (allTTPs.size > 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Total Techniques Observed: ${allTTPs.size}`, margin, yPos);
          yPos += 6;

          const ttpsArray = Array.from(allTTPs);
          const ttpsText = ttpsArray.join(', ');
          const wrappedTTPs = pdf.splitTextToSize(ttpsText, pageWidth - margin * 2);
          wrappedTTPs.slice(0, 10).forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin, yPos);
            yPos += 4;
          });
        } else {
          pdf.text('No MITRE techniques documented.', margin, yPos);
        }
      }

      // Footer on all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text('CONFIDENTIAL', pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      pdf.save(`threat-intel-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report generated successfully');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const enabledCount = sections.filter(s => s.enabled).length;

  return (
    <div className="h-full flex flex-col bg-neutral-950">
      <div className="p-4 border-b border-red-500/10">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-red-400" />
          <h2 className="text-sm font-semibold text-neutral-200">Threat Intelligence Report Generator</h2>
        </div>
        <p className="text-[10px] text-neutral-500">Generate comprehensive PDF reports with actor profiles, campaigns, and MITRE mappings</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Report Settings */}
          <Card className="bg-neutral-900/50 border-red-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-neutral-400">Report Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-[10px] text-neutral-500">Report Title</Label>
                <Input
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="h-8 bg-neutral-800 border-neutral-700 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] text-neutral-500">Author / Team</Label>
                <Input
                  value={reportAuthor}
                  onChange={(e) => setReportAuthor(e.target.value)}
                  className="h-8 bg-neutral-800 border-neutral-700 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section Selection */}
          <Card className="bg-neutral-900/50 border-red-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Report Sections</span>
                <Badge variant="outline" className="text-[9px]">{enabledCount} selected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map(section => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800/50 cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <Checkbox checked={section.enabled} />
                  <div className="text-neutral-500">{section.icon}</div>
                  <span className="text-sm text-neutral-300">{section.name}</span>
                  {section.enabled && <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Preview */}
          <Card className="bg-neutral-900/50 border-red-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-neutral-400">Data Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-neutral-800/50 rounded">
                  <div className="text-neutral-500">Threat Actors</div>
                  <div className="text-lg font-bold text-red-400">{actors.length}</div>
                </div>
                <div className="p-2 bg-neutral-800/50 rounded">
                  <div className="text-neutral-500">Campaigns</div>
                  <div className="text-lg font-bold text-orange-400">{campaigns.length}</div>
                </div>
                <div className="p-2 bg-neutral-800/50 rounded">
                  <div className="text-neutral-500">IOCs</div>
                  <div className="text-lg font-bold text-yellow-400">{iocs.length}</div>
                </div>
                <div className="p-2 bg-neutral-800/50 rounded">
                  <div className="text-neutral-500">Assets</div>
                  <div className="text-lg font-bold text-blue-400">{assets.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="p-4 border-t border-red-500/10">
        <Button
          onClick={generatePDF}
          disabled={generating || enabledCount === 0}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate PDF Report
            </>
          )}
        </Button>
        <p className="text-[9px] text-neutral-600 text-center mt-2">
          Report will include all selected sections with live data
        </p>
      </div>
    </div>
  );
};

export default ThreatIntelReportGenerator;
