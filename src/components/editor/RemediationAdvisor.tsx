import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Code, FileText, Wrench, Copy, Download } from "lucide-react";
import { useState } from "react";

interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  cve?: string;
  description: string;
  remediation: string;
  patch?: {
    language: string;
    code: string;
  };
  references: string[];
}

const RemediationAdvisor = () => {
  const [selectedVuln, setSelectedVuln] = useState<string | null>("1");

  const vulnerabilities: Vulnerability[] = [
    {
      id: "1",
      title: "SQL Injection in User Authentication",
      severity: "critical",
      cve: "CWE-89",
      description: "The login endpoint uses string concatenation to build SQL queries, allowing attackers to bypass authentication and access the database.",
      remediation: "Use parameterized queries or prepared statements to prevent SQL injection. Never concatenate user input directly into SQL queries.",
      patch: {
        language: "python",
        code: `# Before (Vulnerable)
query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"

# After (Secure)
query = "SELECT * FROM users WHERE username=%s AND password=%s"
cursor.execute(query, (username, hashed_password))`
      },
      references: [
        "https://owasp.org/www-community/attacks/SQL_Injection",
        "https://cwe.mitre.org/data/definitions/89.html"
      ]
    },
    {
      id: "2",
      title: "Weak Password Policy",
      severity: "high",
      description: "System accepts passwords with minimum 6 characters and no complexity requirements, making brute-force attacks feasible.",
      remediation: "Implement strong password policy: minimum 12 characters, require uppercase, lowercase, numbers, and special characters. Implement rate limiting and account lockout.",
      patch: {
        language: "javascript",
        code: `// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$/;

if (!passwordRegex.test(password)) {
  throw new Error('Password must be at least 12 characters with uppercase, lowercase, number, and special character');
}`
      },
      references: [
        "https://pages.nist.gov/800-63-3/sp800-63b.html",
        "https://owasp.org/www-community/Authentication_Cheat_Sheet"
      ]
    },
    {
      id: "3",
      title: "Missing CSRF Protection",
      severity: "medium",
      cve: "CWE-352",
      description: "State-changing operations lack CSRF tokens, allowing attackers to forge requests on behalf of authenticated users.",
      remediation: "Implement CSRF tokens for all state-changing operations. Use SameSite cookie attribute and validate tokens on the server side.",
      patch: {
        language: "javascript",
        code: `// Express.js middleware
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.post('/api/transfer', csrfProtection, (req, res) => {
  // Token automatically validated
  // Process transfer
});

// Frontend
<form method="POST">
  <input type="hidden" name="_csrf" value="{{csrfToken}}" />
  <!-- form fields -->
</form>`
      },
      references: [
        "https://owasp.org/www-community/attacks/csrf",
        "https://cwe.mitre.org/data/definitions/352.html"
      ]
    }
  ];

  const selectedVulnerability = vulnerabilities.find(v => v.id === selectedVuln);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex h-full">
      {/* Vulnerability List */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Vulnerabilities</h3>
          <p className="text-xs text-text-secondary mt-1">
            {vulnerabilities.length} findings requiring remediation
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {vulnerabilities.map((vuln) => (
              <button
                key={vuln.id}
                onClick={() => setSelectedVuln(vuln.id)}
                className={`w-full text-left p-2 rounded border transition-colors ${
                  selectedVuln === vuln.id
                    ? "bg-activitybar-active/10 border-activitybar-active"
                    : "bg-panel-bg border-border hover:bg-activitybar-bg"
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-foreground" />
                  <p className="text-xs font-medium text-foreground line-clamp-2">{vuln.title}</p>
                </div>
                <Badge className={`${getSeverityColor(vuln.severity)} text-white text-xs mt-1`}>
                  {vuln.severity}
                </Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Details Panel */}
      <div className="flex-1 flex flex-col">
        {selectedVulnerability ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {selectedVulnerability.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getSeverityColor(selectedVulnerability.severity)} text-white`}>
                      {selectedVulnerability.severity.toUpperCase()}
                    </Badge>
                    {selectedVulnerability.cve && (
                      <Badge variant="outline">{selectedVulnerability.cve}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Description</h3>
                  </div>
                  <p className="text-sm text-text-secondary bg-panel-bg p-3 rounded border border-border">
                    {selectedVulnerability.description}
                  </p>
                </div>

                <Separator />

                {/* Remediation */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Remediation Steps</h3>
                  </div>
                  <p className="text-sm text-foreground bg-activitybar-bg p-3 rounded">
                    {selectedVulnerability.remediation}
                  </p>
                </div>

                {/* Code Patch */}
                {selectedVulnerability.patch && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-foreground" />
                          <h3 className="text-sm font-semibold text-foreground">
                            Suggested Patch ({selectedVulnerability.patch.language})
                          </h3>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(selectedVulnerability.patch!.code)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-panel-bg p-3 rounded border border-border overflow-x-auto">
                        <code className="text-foreground">{selectedVulnerability.patch.code}</code>
                      </pre>
                    </div>
                  </>
                )}

                {/* References */}
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">References</h3>
                  </div>
                  <div className="space-y-1">
                    {selectedVulnerability.references.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-activitybar-active hover:underline"
                      >
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Full Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Mark as Fixed
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary">
            Select a vulnerability to view remediation advice
          </div>
        )}
      </div>
    </div>
  );
};

export default RemediationAdvisor;
