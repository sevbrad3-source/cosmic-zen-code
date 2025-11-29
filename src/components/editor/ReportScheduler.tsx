import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Clock, FileText, Trash2 } from "lucide-react";

interface ScheduledReport {
  id: string;
  name: string;
  template: string;
  frequency: string;
  recipients: string[];
  lastSent: string;
  nextScheduled: string;
  status: "active" | "paused";
}

const ReportScheduler = () => {
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Weekly Security Summary",
      template: "Executive Summary",
      frequency: "Weekly",
      recipients: ["ciso@company.com", "security-team@company.com"],
      lastSent: "2024-03-15 09:00",
      nextScheduled: "2024-03-22 09:00",
      status: "active"
    },
    {
      id: "2",
      name: "Monthly Compliance Report",
      template: "Compliance Audit",
      frequency: "Monthly",
      recipients: ["compliance@company.com"],
      lastSent: "2024-03-01 08:00",
      nextScheduled: "2024-04-01 08:00",
      status: "active"
    }
  ]);

  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    template: "",
    frequency: "",
    recipients: "",
    includeVulns: true,
    includeExploits: true,
    includeRemediation: true
  });

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Report Scheduler</h3>
        <Button
          size="sm"
          onClick={() => setShowNewSchedule(!showNewSchedule)}
          className="h-7"
        >
          {showNewSchedule ? "Cancel" : "+ New Schedule"}
        </Button>
      </div>

      {showNewSchedule && (
        <Card className="p-4 space-y-4 bg-panel-bg border-border">
          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Schedule Name</Label>
            <Input
              placeholder="e.g., Weekly Security Report"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
              className="h-8 text-xs bg-input-bg border-border text-text-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Template</Label>
            <Select value={newSchedule.template} onValueChange={(value) => setNewSchedule({ ...newSchedule, template: value })}>
              <SelectTrigger className="h-8 text-xs bg-input-bg border-border text-text-primary">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive Summary</SelectItem>
                <SelectItem value="technical">Technical Deep Dive</SelectItem>
                <SelectItem value="compliance">Compliance Audit</SelectItem>
                <SelectItem value="remediation">Remediation Tracker</SelectItem>
                <SelectItem value="custom">Custom Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Frequency</Label>
            <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}>
              <SelectTrigger className="h-8 text-xs bg-input-bg border-border text-text-primary">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Recipients (comma-separated emails)</Label>
            <Input
              placeholder="security@company.com, ciso@company.com"
              value={newSchedule.recipients}
              onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
              className="h-8 text-xs bg-input-bg border-border text-text-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">Include Sections</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vulns"
                  checked={newSchedule.includeVulns}
                  onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, includeVulns: checked as boolean })}
                />
                <label htmlFor="vulns" className="text-xs text-text-primary cursor-pointer">
                  Vulnerability Findings
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exploits"
                  checked={newSchedule.includeExploits}
                  onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, includeExploits: checked as boolean })}
                />
                <label htmlFor="exploits" className="text-xs text-text-primary cursor-pointer">
                  Exploits & Attack Chains
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remediation"
                  checked={newSchedule.includeRemediation}
                  onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, includeRemediation: checked as boolean })}
                />
                <label htmlFor="remediation" className="text-xs text-text-primary cursor-pointer">
                  Remediation Steps
                </label>
              </div>
            </div>
          </div>

          <Button className="w-full h-8 text-xs" onClick={() => setShowNewSchedule(false)}>
            Create Schedule
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="p-3 bg-panel-bg border-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-text-primary">{schedule.name}</h4>
                  <Badge variant={schedule.status === "active" ? "default" : "secondary"} className="text-xs">
                    {schedule.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <FileText className="w-3 h-3" />
                  <span>{schedule.template}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Calendar className="w-3 h-3" />
                <span>{schedule.frequency}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>Last: {schedule.lastSent}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>Next: {schedule.nextScheduled}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Mail className="w-3 h-3" />
                <span>{schedule.recipients.length} recipient(s)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                Send Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportScheduler;
