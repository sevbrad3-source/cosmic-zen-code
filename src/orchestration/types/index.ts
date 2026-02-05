 // ============================================================================
 // ORCHESTRATION SYSTEM - CORE TYPE DEFINITIONS
 // ============================================================================
 
 // Task Types
 export type TaskStatus = 'queued' | 'active' | 'blocked' | 'done' | 'failed' | 'canceled';
 
 export interface AcceptanceCriterion {
   id: string;
   type: 'schema' | 'contains' | 'not_contains' | 'word_limit' | 'regex' | 'custom';
   description: string;
   config: Record<string, unknown>;
   passed?: boolean;
   error?: string;
 }
 
 export interface TaskHistoryEntry {
   timestamp: string;
   field: string;
   oldValue: unknown;
   newValue: unknown;
   reason: string;
 }
 
 export interface Task {
   task_id: string;
   title: string;
   prompt: string;
   acceptance_criteria: AcceptanceCriterion[];
   dependencies: string[];
   priority: number; // 0-100
   status: TaskStatus;
   context_refs: string[];
   history: TaskHistoryEntry[];
   created_at: string;
   updated_at: string;
   result?: TaskResult;
   blocked_by?: string[];
   iteration_count: number;
   parent_task_id?: string;
 }
 
 export interface TaskResult {
   output: string;
   artifacts: string[];
   verification_passed: boolean;
   verification_details: VerificationResult[];
   completed_at: string;
 }
 
 // Event Types
 export type EventType =
   | 'RUN_STARTED'
   | 'RUN_STOPPED'
   | 'PLAN_CREATED'
   | 'ACTION_EXECUTED'
   | 'TOOL_CALLED'
   | 'TOOL_RESULT'
   | 'VERIFICATION_RUN'
   | 'VERIFICATION_FAILED'
   | 'VERIFICATION_PASSED'
   | 'AUDIT_NOTE'
   | 'CHECKPOINT_CREATED'
   | 'QUEUE_MUTATION'
   | 'SNAPSHOT_CREATED'
   | 'BUDGET_TICK'
   | 'BUDGET_EXHAUSTED'
   | 'ERROR_RAISED'
   | 'CONTEXT_UPDATED'
   | 'APPROVAL_REQUESTED'
   | 'APPROVAL_GRANTED'
   | 'APPROVAL_DENIED';
 
 export interface OrchestrationEvent {
   event_id: string;
   run_id: string;
   timestamp: string;
   type: EventType;
   payload: Record<string, unknown>;
   hash_prev: string;
   hash_self: string;
   sequence_number: number;
 }
 
 // Snapshot Types
 export interface Snapshot {
   snapshot_id: string;
   run_id: string;
   timestamp: string;
   queue_state: Task[];
   dag_edges: DagEdge[];
   pinned_context: ContextItem[];
   working_context: ContextItem[];
   artifacts_index: ArtifactRef[];
   budgets: BudgetState;
   run_metadata: RunMetadata;
   last_event_id: string;
   last_sequence_number: number;
 }
 
 export interface DagEdge {
   from_task_id: string;
   to_task_id: string;
   type: 'depends_on' | 'blocks';
 }
 
 // Context Types
 export type ContextTier = 'pinned' | 'working' | 'long_term';
 
 export interface ContextItem {
   id: string;
   tier: ContextTier;
   type: 'constraint' | 'definition' | 'artifact' | 'summary' | 'event_ref';
   content: string;
   metadata: Record<string, unknown>;
   token_count: number;
   created_at: string;
   expires_at?: string;
   priority: number;
 }
 
 export interface ArtifactRef {
   artifact_id: string;
   name: string;
   type: string;
   version: number;
   path: string;
   hash: string;
   created_at: string;
   task_id?: string;
 }
 
 // Budget Types
 export interface BudgetState {
   max_wall_time_ms: number;
   elapsed_wall_time_ms: number;
   max_output_tokens: number;
   used_output_tokens: number;
   max_tool_calls: number;
   used_tool_calls: number;
   max_iterations: number;
   used_iterations: number;
   risk_budget: number;
   used_risk_budget: number;
   started_at: string;
 }
 
 export interface BudgetConfig {
   max_wall_time_ms: number;
   max_output_tokens: number;
   max_tool_calls: number;
   max_iterations: number;
   risk_budget: number;
 }
 
 // Run Types
 export type RunStatus = 'running' | 'paused' | 'completed' | 'failed' | 'stopped';
 export type AutonomyMode = 'manual' | 'supervised' | 'autonomous';
 
 export interface RunMetadata {
   run_id: string;
   project_id: string;
   status: RunStatus;
   autonomy_mode: AutonomyMode;
   created_at: string;
   updated_at: string;
   checkpoint_interval: number;
   risky_action_policy: RiskyActionPolicy;
 }
 
 export interface RiskyActionPolicy {
   require_approval: string[];
   auto_approve: string[];
   deny: string[];
 }
 
 // Verification Types
 export interface VerificationResult {
   criterion_id: string;
   passed: boolean;
   message: string;
   details?: Record<string, unknown>;
 }
 
 export interface AuditResult {
   passed: boolean;
   rubric_scores: RubricScore[];
   notes: string[];
   contradictions: Contradiction[];
 }
 
 export interface RubricScore {
   criterion: string;
   score: number;
   max_score: number;
   rationale: string;
 }
 
 export interface Contradiction {
   type: 'context_drift' | 'decision_reversal' | 'constraint_violation';
   description: string;
   evidence: string[];
   severity: 'low' | 'medium' | 'high';
 }
 
 // Test Harness Types
 export interface TestSpec {
   test_id: string;
   category: string;
   difficulty: 'easy' | 'medium' | 'hard';
   description: string;
   initial_context: InitialContext;
   initial_queue: Task[];
   queued_injections: QueuedInjection[];
   budgets: BudgetConfig;
   must_do: string[];
   must_not_do: string[];
   acceptance_criteria: TestAcceptanceCriterion[];
   scoring_rubric: ScoringRubric[];
   expected_artifacts?: ExpectedArtifact[];
   timeout_ms: number;
 }
 
 export interface InitialContext {
   text: string;
   files: ContextFile[];
   pinned_constraints: string[];
 }
 
 export interface ContextFile {
   path: string;
   content: string;
 }
 
 export interface QueuedInjection {
   trigger: InjectionTrigger;
   task: Partial<Task>;
 }
 
 export interface InjectionTrigger {
   type: 'action_count' | 'time_elapsed' | 'event_type';
   value: number | string;
 }
 
 export interface TestAcceptanceCriterion {
   id: string;
   description: string;
   check_type: 'deterministic' | 'rubric';
   config: Record<string, unknown>;
 }
 
 export interface ScoringRubric {
   id: string;
   criterion: string;
   weight: number;
   max_score: number;
 }
 
 export interface ExpectedArtifact {
   name: string;
   type: string;
   golden_content?: string;
   schema?: Record<string, unknown>;
 }
 
 export interface TestResult {
   test_id: string;
   passed: boolean;
   score: number;
   max_score: number;
   breakdown: ScoreBreakdown[];
   run_id: string;
   duration_ms: number;
   event_log_path: string;
   artifacts_path: string;
   diff_report?: DiffReport;
   errors: string[];
 }
 
 export interface ScoreBreakdown {
   rubric_id: string;
   criterion: string;
   score: number;
   max_score: number;
   weight: number;
   weighted_score: number;
   notes: string;
 }
 
 export interface DiffReport {
   artifact_name: string;
   expected_hash: string;
   actual_hash: string;
   diff_lines: string[];
 }
 
 // Kernel Types
 export interface KernelState {
   current_snapshot: Snapshot;
   pending_approvals: ApprovalRequest[];
   stop_requested: boolean;
   last_checkpoint_at: string;
   actions_since_checkpoint: number;
 }
 
 export interface ApprovalRequest {
   request_id: string;
   action_type: string;
   description: string;
   risk_level: 'low' | 'medium' | 'high';
   created_at: string;
   expires_at: string;
   status: 'pending' | 'approved' | 'denied';
 }
 
 export interface Plan {
   plan_id: string;
   task_id: string;
   steps: PlanStep[];
   reasoning: string;
   created_at: string;
 }
 
 export interface PlanStep {
   step_id: string;
   action_type: 'llm_call' | 'tool_call' | 'verification' | 'checkpoint';
   description: string;
   config: Record<string, unknown>;
   status: 'pending' | 'executing' | 'completed' | 'failed';
 }
 
 // Tool Types
 export interface ToolDefinition {
   name: string;
   description: string;
   parameters: Record<string, unknown>;
   risk_level: 'none' | 'low' | 'medium' | 'high';
   requires_approval: boolean;
 }
 
 export interface ToolCall {
   call_id: string;
   tool_name: string;
   arguments: Record<string, unknown>;
   timestamp: string;
 }
 
 export interface ToolResult {
   call_id: string;
   success: boolean;
   output: unknown;
   error?: string;
   duration_ms: number;
 }