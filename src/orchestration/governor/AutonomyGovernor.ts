 // ============================================================================
 // AUTONOMY GOVERNOR - Budget enforcement, mode control, and STOP semantics
 // ============================================================================
 
 import { 
   BudgetState, 
   BudgetConfig, 
   AutonomyMode, 
   ApprovalRequest,
   RiskyActionPolicy,
   Snapshot 
 } from '../types';
 import { getEventStore } from '../store/EventStore';
 
 export interface BudgetCheckResult {
   canContinue: boolean;
   warnings: string[];
   exhausted: string[];
   remaining: {
     wall_time_ms: number;
     output_tokens: number;
     tool_calls: number;
     iterations: number;
     risk_budget: number;
   };
 }
 
 export interface ActionRiskAssessment {
   action_type: string;
   risk_level: 'none' | 'low' | 'medium' | 'high';
   requires_approval: boolean;
   denied: boolean;
   reason?: string;
 }
 
 export class AutonomyGovernor {
   private run_id: string;
   private mode: AutonomyMode;
   private budgets: BudgetState;
   private policy: RiskyActionPolicy;
   private stopRequested: boolean = false;
   private pendingApprovals: Map<string, ApprovalRequest> = new Map();
   private warningThreshold: number = 0.8; // Warn at 80% usage
 
   constructor(
     run_id: string,
     mode: AutonomyMode,
     budgets: BudgetState,
     policy: RiskyActionPolicy
   ) {
     this.run_id = run_id;
     this.mode = mode;
     this.budgets = { ...budgets };
     this.policy = policy;
   }
 
   // ========== Budget Management ==========
 
   checkBudgets(): BudgetCheckResult {
     const now = Date.now();
     const elapsed = now - new Date(this.budgets.started_at).getTime();
     this.budgets.elapsed_wall_time_ms = elapsed;
 
     const warnings: string[] = [];
     const exhausted: string[] = [];
 
     // Check wall time
     const wallTimeRatio = elapsed / this.budgets.max_wall_time_ms;
     if (wallTimeRatio >= 1) {
       exhausted.push('wall_time');
     } else if (wallTimeRatio >= this.warningThreshold) {
       warnings.push(`Wall time at ${Math.round(wallTimeRatio * 100)}%`);
     }
 
     // Check output tokens
     const tokenRatio = this.budgets.used_output_tokens / this.budgets.max_output_tokens;
     if (tokenRatio >= 1) {
       exhausted.push('output_tokens');
     } else if (tokenRatio >= this.warningThreshold) {
       warnings.push(`Output tokens at ${Math.round(tokenRatio * 100)}%`);
     }
 
     // Check tool calls
     const toolRatio = this.budgets.used_tool_calls / this.budgets.max_tool_calls;
     if (toolRatio >= 1) {
       exhausted.push('tool_calls');
     } else if (toolRatio >= this.warningThreshold) {
       warnings.push(`Tool calls at ${Math.round(toolRatio * 100)}%`);
     }
 
     // Check iterations
     const iterRatio = this.budgets.used_iterations / this.budgets.max_iterations;
     if (iterRatio >= 1) {
       exhausted.push('iterations');
     } else if (iterRatio >= this.warningThreshold) {
       warnings.push(`Iterations at ${Math.round(iterRatio * 100)}%`);
     }
 
     // Check risk budget
     const riskRatio = this.budgets.used_risk_budget / this.budgets.risk_budget;
     if (riskRatio >= 1) {
       exhausted.push('risk_budget');
     } else if (riskRatio >= this.warningThreshold) {
       warnings.push(`Risk budget at ${Math.round(riskRatio * 100)}%`);
     }
 
     if (exhausted.length > 0) {
       getEventStore().append(this.run_id, 'BUDGET_EXHAUSTED', {
         exhausted,
         budgets: this.budgets,
       });
     } else if (warnings.length > 0) {
       getEventStore().append(this.run_id, 'BUDGET_TICK', {
         warnings,
         budgets: this.budgets,
       });
     }
 
     return {
       canContinue: exhausted.length === 0 && !this.stopRequested,
       warnings,
       exhausted,
       remaining: {
         wall_time_ms: Math.max(0, this.budgets.max_wall_time_ms - elapsed),
         output_tokens: Math.max(0, this.budgets.max_output_tokens - this.budgets.used_output_tokens),
         tool_calls: Math.max(0, this.budgets.max_tool_calls - this.budgets.used_tool_calls),
         iterations: Math.max(0, this.budgets.max_iterations - this.budgets.used_iterations),
         risk_budget: Math.max(0, this.budgets.risk_budget - this.budgets.used_risk_budget),
       },
     };
   }
 
   consumeTokens(count: number): void {
     this.budgets.used_output_tokens += count;
   }
 
   consumeToolCall(): void {
     this.budgets.used_tool_calls += 1;
   }
 
   consumeIteration(): void {
     this.budgets.used_iterations += 1;
   }
 
   consumeRisk(amount: number): void {
     this.budgets.used_risk_budget += amount;
   }
 
   getBudgets(): BudgetState {
     return { ...this.budgets };
   }
 
   // ========== STOP Semantics ==========
 
   requestStop(): void {
     this.stopRequested = true;
     getEventStore().append(this.run_id, 'RUN_STOPPED', {
       reason: 'STOP_REQUESTED',
       budgets: this.budgets,
       pending_approvals: Array.from(this.pendingApprovals.values()),
     });
   }
 
   isStopRequested(): boolean {
     return this.stopRequested;
   }
 
   clearStop(): void {
     this.stopRequested = false;
   }
 
   // ========== Mode Management ==========
 
   getMode(): AutonomyMode {
     return this.mode;
   }
 
   setMode(mode: AutonomyMode): void {
     const oldMode = this.mode;
     this.mode = mode;
     getEventStore().append(this.run_id, 'AUDIT_NOTE', {
       type: 'MODE_CHANGE',
       old_mode: oldMode,
       new_mode: mode,
     });
   }
 
   // ========== Risk Assessment & Approval ==========
 
   assessAction(action_type: string): ActionRiskAssessment {
     // Check deny list first
     if (this.policy.deny.includes(action_type)) {
       return {
         action_type,
         risk_level: 'high',
         requires_approval: false,
         denied: true,
         reason: 'Action is on deny list',
       };
     }
 
     // Check auto-approve list
     if (this.policy.auto_approve.includes(action_type)) {
       return {
         action_type,
         risk_level: 'none',
         requires_approval: false,
         denied: false,
       };
     }
 
     // Check require-approval list
     const requiresApproval = this.policy.require_approval.includes(action_type);
     
     // Determine risk level based on action type
     let risk_level: 'none' | 'low' | 'medium' | 'high' = 'low';
     if (action_type.includes('delete') || action_type.includes('drop')) {
       risk_level = 'high';
     } else if (action_type.includes('write') || action_type.includes('update')) {
       risk_level = 'medium';
     } else if (action_type.includes('external') || action_type.includes('api')) {
       risk_level = 'medium';
     }
 
     // In manual mode, always require approval
     // In supervised mode, require approval for risky actions
     // In autonomous mode, only require approval if explicitly required
     let needsApproval = false;
     if (this.mode === 'manual') {
       needsApproval = true;
     } else if (this.mode === 'supervised') {
       needsApproval = requiresApproval || risk_level === 'high' || risk_level === 'medium';
     } else {
       needsApproval = requiresApproval;
     }
 
     return {
       action_type,
       risk_level,
       requires_approval: needsApproval,
       denied: false,
     };
   }
 
   requestApproval(
     action_type: string,
     description: string,
     risk_level: 'low' | 'medium' | 'high'
   ): ApprovalRequest {
     const request: ApprovalRequest = {
       request_id: crypto.randomUUID(),
       action_type,
       description,
       risk_level,
       created_at: new Date().toISOString(),
       expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min expiry
       status: 'pending',
     };
 
     this.pendingApprovals.set(request.request_id, request);
 
     getEventStore().append(this.run_id, 'APPROVAL_REQUESTED', {
       request,
     });
 
     return request;
   }
 
   approveRequest(request_id: string): boolean {
     const request = this.pendingApprovals.get(request_id);
     if (!request || request.status !== 'pending') {
       return false;
     }
 
     request.status = 'approved';
     getEventStore().append(this.run_id, 'APPROVAL_GRANTED', {
       request_id,
       action_type: request.action_type,
     });
 
     return true;
   }
 
   denyRequest(request_id: string): boolean {
     const request = this.pendingApprovals.get(request_id);
     if (!request || request.status !== 'pending') {
       return false;
     }
 
     request.status = 'denied';
     getEventStore().append(this.run_id, 'APPROVAL_DENIED', {
       request_id,
       action_type: request.action_type,
     });
 
     return true;
   }
 
   getPendingApprovals(): ApprovalRequest[] {
     return Array.from(this.pendingApprovals.values())
       .filter(r => r.status === 'pending');
   }
 
   // ========== State Export ==========
 
   getCheckpointSummary(): {
     mode: AutonomyMode;
     budgets: BudgetState;
     stop_requested: boolean;
     pending_approvals: ApprovalRequest[];
     can_continue: boolean;
   } {
     const budgetCheck = this.checkBudgets();
     return {
       mode: this.mode,
       budgets: this.budgets,
       stop_requested: this.stopRequested,
       pending_approvals: this.getPendingApprovals(),
       can_continue: budgetCheck.canContinue,
     };
   }
 
   loadFromSnapshot(snapshot: Snapshot): void {
     this.budgets = { ...snapshot.budgets };
     this.mode = snapshot.run_metadata.autonomy_mode;
     this.policy = snapshot.run_metadata.risky_action_policy;
   }
 }