 // ============================================================================
 // ORCHESTRATION KERNEL - Main execution loop and state machine
 // ============================================================================
 
 import {
   Task,
   Snapshot,
   Plan,
   PlanStep,
   ToolCall,
   ToolResult,
   VerificationResult,
   AuditResult,
   BudgetConfig,
   AutonomyMode,
   RiskyActionPolicy,
   KernelState,
 } from '../types';
 import { EventStore, getEventStore } from '../store/EventStore';
 import { SnapshotStore, getSnapshotStore } from '../store/SnapshotStore';
 import { TaskQueue } from '../queue/TaskQueue';
 import { ContextManager } from '../context/ContextManager';
 import { Verifier } from '../verification/Verifier';
 import { Auditor } from '../verification/Auditor';
 import { AutonomyGovernor } from '../governor/AutonomyGovernor';
 
 export interface KernelConfig {
   project_id: string;
   budgets: BudgetConfig;
   autonomy_mode: AutonomyMode;
   checkpoint_interval: number;
   risky_action_policy?: RiskyActionPolicy;
   maxWorkingContextTokens?: number;
 }
 
 export interface ExecutionResult {
   success: boolean;
   output?: string;
   error?: string;
   tokens_used?: number;
 }
 
 // Abstract tool executor interface - implement for actual tool calls
 export interface ToolExecutor {
   execute(call: ToolCall): Promise<ToolResult>;
   getAvailableTools(): string[];
 }
 
 // Abstract LLM interface - implement for actual LLM calls
 export interface LLMProvider {
   generatePlan(task: Task, context: string): Promise<Plan>;
   executeStep(step: PlanStep, context: string): Promise<ExecutionResult>;
   estimateTokens(text: string): number;
 }
 
 // Mock implementations for testing
 export class MockLLMProvider implements LLMProvider {
   async generatePlan(task: Task, context: string): Promise<Plan> {
     return {
       plan_id: crypto.randomUUID(),
       task_id: task.task_id,
       steps: [
         {
           step_id: crypto.randomUUID(),
           action_type: 'llm_call',
           description: `Execute task: ${task.title}`,
           config: {},
           status: 'pending',
         },
         {
           step_id: crypto.randomUUID(),
           action_type: 'verification',
           description: 'Verify output',
           config: {},
           status: 'pending',
         },
       ],
       reasoning: 'Generated mock plan for testing',
       created_at: new Date().toISOString(),
     };
   }
 
   async executeStep(step: PlanStep, context: string): Promise<ExecutionResult> {
     // Simulate execution
     await new Promise(resolve => setTimeout(resolve, 10));
     return {
       success: true,
       output: `Mock output for step: ${step.description}`,
       tokens_used: 100,
     };
   }
 
   estimateTokens(text: string): number {
     return Math.ceil(text.length / 4);
   }
 }
 
 export class MockToolExecutor implements ToolExecutor {
   private tools = ['read_file', 'write_file', 'list_files', 'search'];
 
   async execute(call: ToolCall): Promise<ToolResult> {
     await new Promise(resolve => setTimeout(resolve, 5));
     return {
       call_id: call.call_id,
       success: true,
       output: { result: `Mock result for ${call.tool_name}` },
       duration_ms: 5,
     };
   }
 
   getAvailableTools(): string[] {
     return this.tools;
   }
 }
 
 export class OrchestrationKernel {
   private run_id: string;
   private eventStore: EventStore;
   private snapshotStore: SnapshotStore;
   private taskQueue: TaskQueue;
   private contextManager: ContextManager;
   private verifier: Verifier;
   private auditor: Auditor;
   private governor: AutonomyGovernor;
   private llmProvider: LLMProvider;
   private toolExecutor: ToolExecutor;
   private config: KernelConfig;
   private currentSnapshot: Snapshot;
   private actionsSinceCheckpoint: number = 0;
   private isRunning: boolean = false;
 
   constructor(
     config: KernelConfig,
     llmProvider?: LLMProvider,
     toolExecutor?: ToolExecutor
   ) {
     this.config = config;
     this.run_id = crypto.randomUUID();
     this.eventStore = getEventStore();
     this.snapshotStore = getSnapshotStore();
     this.llmProvider = llmProvider || new MockLLMProvider();
     this.toolExecutor = toolExecutor || new MockToolExecutor();
 
     // Initialize snapshot
     this.currentSnapshot = this.snapshotStore.createInitialSnapshot(
       this.run_id,
       config.project_id,
       config.budgets,
       config.autonomy_mode,
       config.checkpoint_interval,
       config.risky_action_policy
     );
 
     // Initialize components
     this.taskQueue = new TaskQueue(this.run_id);
     this.contextManager = new ContextManager(
       this.run_id,
       config.maxWorkingContextTokens || 8000
     );
     this.verifier = new Verifier(this.run_id);
     this.auditor = new Auditor(this.run_id);
     this.governor = new AutonomyGovernor(
       this.run_id,
       config.autonomy_mode,
       this.currentSnapshot.budgets,
       this.currentSnapshot.run_metadata.risky_action_policy
     );
 
     // Log run start
     this.eventStore.append(this.run_id, 'RUN_STARTED', {
       project_id: config.project_id,
       budgets: config.budgets,
       autonomy_mode: config.autonomy_mode,
     });
   }
 
   // ========== Public API ==========
 
   getRunId(): string {
     return this.run_id;
   }
 
   addTask(task: Omit<Task, 'task_id' | 'created_at' | 'updated_at' | 'history' | 'iteration_count'>): Task {
     return this.taskQueue.addTask(task, 'Added via kernel API');
   }
 
   addPinnedConstraint(content: string): void {
     this.contextManager.addPinned({
       type: 'constraint',
       content,
       metadata: {},
       priority: 100,
     });
   }
 
   stop(): void {
     this.governor.requestStop();
     this.createCheckpoint('STOP requested');
   }
 
   async run(): Promise<{ completed: boolean; reason: string }> {
     if (this.isRunning) {
       return { completed: false, reason: 'Already running' };
     }
 
     this.isRunning = true;
 
     try {
       while (true) {
         // Check budgets and stop conditions
         const budgetCheck = this.governor.checkBudgets();
         if (!budgetCheck.canContinue) {
           const reason = this.governor.isStopRequested()
             ? 'STOP requested'
             : `Budget exhausted: ${budgetCheck.exhausted.join(', ')}`;
           this.createCheckpoint(reason);
           return { completed: false, reason };
         }
 
         // Get next task
         const task = this.taskQueue.getNextTask();
         if (!task) {
           // Check if there are blocked tasks
           const blocked = this.taskQueue.getBlockedTasks();
           if (blocked.length > 0) {
             return { completed: false, reason: `${blocked.length} tasks blocked on dependencies` };
           }
           return { completed: true, reason: 'All tasks completed' };
         }
 
         // Execute task
         await this.executeTask(task);
 
         // Consume iteration
         this.governor.consumeIteration();
         this.actionsSinceCheckpoint++;
 
         // Checkpoint if needed
         if (this.actionsSinceCheckpoint >= this.config.checkpoint_interval) {
           this.createCheckpoint('Periodic checkpoint');
           this.actionsSinceCheckpoint = 0;
         }
       }
     } finally {
       this.isRunning = false;
     }
   }
 
   async runSingleStep(): Promise<{ hasMore: boolean; task?: Task; result?: ExecutionResult }> {
     const budgetCheck = this.governor.checkBudgets();
     if (!budgetCheck.canContinue) {
       return { hasMore: false };
     }
 
     const task = this.taskQueue.getNextTask();
     if (!task) {
       return { hasMore: false };
     }
 
     const result = await this.executeTask(task);
     this.governor.consumeIteration();
     this.actionsSinceCheckpoint++;
 
     return {
       hasMore: this.taskQueue.getReadyTasks().length > 0,
       task,
       result,
     };
   }
 
   // ========== Task Execution ==========
 
   private async executeTask(task: Task): Promise<ExecutionResult> {
     // Mark task as active
     this.taskQueue.updateTask(task.task_id, { status: 'active' }, 'Starting execution');
 
     try {
       // Build context
       const context = this.contextManager.buildContextForTask(task.task_id, task.prompt);
 
       // Generate plan
       const plan = await this.llmProvider.generatePlan(task, context);
       this.eventStore.append(this.run_id, 'PLAN_CREATED', {
         task_id: task.task_id,
         plan_id: plan.plan_id,
         steps: plan.steps.length,
         reasoning: plan.reasoning,
       });
 
       // Execute plan steps
       let finalOutput = '';
       for (const step of plan.steps) {
         // Check for stop
         if (this.governor.isStopRequested()) {
           throw new Error('STOP requested');
         }
 
         step.status = 'executing';
 
         if (step.action_type === 'tool_call') {
           // Risk assessment
           const toolName = step.config.tool_name as string;
           const assessment = this.governor.assessAction(toolName);
 
           if (assessment.denied) {
             throw new Error(`Action denied: ${assessment.reason}`);
           }
 
           if (assessment.requires_approval) {
             // In a real system, this would wait for approval
             // For now, we auto-approve in autonomous mode
             if (this.governor.getMode() !== 'autonomous') {
               const request = this.governor.requestApproval(
                 toolName,
                 step.description,
                 assessment.risk_level as 'low' | 'medium' | 'high'
               );
               // Simulate approval for testing
               this.governor.approveRequest(request.request_id);
             }
           }
 
           // Execute tool
           const toolCall: ToolCall = {
             call_id: crypto.randomUUID(),
             tool_name: toolName,
             arguments: step.config.arguments as Record<string, unknown> || {},
             timestamp: new Date().toISOString(),
           };
 
           this.eventStore.append(this.run_id, 'TOOL_CALLED', { call: toolCall });
           
           const toolResult = await this.toolExecutor.execute(toolCall);
           this.governor.consumeToolCall();
 
           this.eventStore.append(this.run_id, 'TOOL_RESULT', { result: toolResult });
 
           if (!toolResult.success) {
             throw new Error(`Tool failed: ${toolResult.error}`);
           }
 
           finalOutput = JSON.stringify(toolResult.output);
         } else if (step.action_type === 'llm_call') {
           const result = await this.llmProvider.executeStep(step, context);
           
           if (result.tokens_used) {
             this.governor.consumeTokens(result.tokens_used);
           }
 
           this.eventStore.append(this.run_id, 'ACTION_EXECUTED', {
             task_id: task.task_id,
             step_id: step.step_id,
             action_type: step.action_type,
             success: result.success,
             tokens_used: result.tokens_used,
           });
 
           if (!result.success) {
             throw new Error(result.error || 'LLM call failed');
           }
 
           finalOutput = result.output || '';
         }
 
         step.status = 'completed';
       }
 
       // Verify output
       const verificationResults = await this.verifier.verify(task, finalOutput);
       const allPassed = verificationResults.every(r => r.passed);
 
       // Audit
       const auditResult = await this.auditor.audit(
         task,
         finalOutput,
         verificationResults,
         this.contextManager
       );
 
       // Handle verification failures
       if (!allPassed) {
         // Create fix task
         const failedCriteria = verificationResults.filter(r => !r.passed);
         this.taskQueue.addTask({
           title: `Fix: ${task.title}`,
           prompt: `Fix verification failures for task "${task.title}":\n${failedCriteria.map(c => `- ${c.message}`).join('\n')}`,
           acceptance_criteria: task.acceptance_criteria,
           dependencies: [],
           priority: task.priority + 10,
           status: 'queued',
           context_refs: [task.task_id],
         }, 'Auto-created to fix verification failures');
 
         this.taskQueue.updateTask(task.task_id, { status: 'failed' }, 'Verification failed');
 
         return {
           success: false,
           output: finalOutput,
           error: `Verification failed: ${failedCriteria.map(c => c.message).join('; ')}`,
         };
       }
 
       // Mark task as done
       this.taskQueue.updateTask(task.task_id, {
         status: 'done',
         result: {
           output: finalOutput,
           artifacts: [],
           verification_passed: true,
           verification_details: verificationResults,
           completed_at: new Date().toISOString(),
         },
       }, 'Task completed successfully');
 
       // Add to working context
       this.contextManager.addToWorking({
         type: 'artifact',
         content: `Task "${task.title}" completed with output: ${finalOutput.slice(0, 500)}`,
         metadata: { task_id: task.task_id },
         priority: 50,
       });
 
       return { success: true, output: finalOutput };
 
     } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
       
       this.eventStore.append(this.run_id, 'ERROR_RAISED', {
         task_id: task.task_id,
         error: errorMessage,
       });
 
       this.taskQueue.updateTask(task.task_id, { status: 'failed' }, `Error: ${errorMessage}`);
 
       return { success: false, error: errorMessage };
     }
   }
 
   // ========== Checkpointing ==========
 
   private createCheckpoint(reason: string): Snapshot {
     const lastEvent = this.eventStore.getLastEvent(this.run_id);
     
     // Update snapshot
     this.currentSnapshot = {
       ...this.currentSnapshot,
       snapshot_id: crypto.randomUUID(),
       timestamp: new Date().toISOString(),
       queue_state: this.taskQueue.getAllTasks(),
       dag_edges: this.taskQueue.getDagEdges(),
       pinned_context: this.contextManager.getPinned(),
       working_context: this.contextManager.getWorking(),
       budgets: this.governor.getBudgets(),
       last_event_id: lastEvent?.event_id || '',
       last_sequence_number: this.eventStore.getSequenceNumber(),
       run_metadata: {
         ...this.currentSnapshot.run_metadata,
         updated_at: new Date().toISOString(),
       },
     };
 
     this.snapshotStore.save(this.currentSnapshot);
 
     this.eventStore.append(this.run_id, 'CHECKPOINT_CREATED', {
       snapshot_id: this.currentSnapshot.snapshot_id,
       reason,
       queue_stats: this.taskQueue.getQueueStats(),
       budget_summary: this.governor.getCheckpointSummary(),
     });
 
     this.eventStore.append(this.run_id, 'SNAPSHOT_CREATED', {
       snapshot_id: this.currentSnapshot.snapshot_id,
     });
 
     this.actionsSinceCheckpoint = 0;
     return this.currentSnapshot;
   }
 
   // ========== State Access ==========
 
   getState(): KernelState {
     return {
       current_snapshot: this.currentSnapshot,
       pending_approvals: this.governor.getPendingApprovals(),
       stop_requested: this.governor.isStopRequested(),
       last_checkpoint_at: this.currentSnapshot.timestamp,
       actions_since_checkpoint: this.actionsSinceCheckpoint,
     };
   }
 
   getSnapshot(): Snapshot {
     return this.currentSnapshot;
   }
 
   getTaskQueue(): TaskQueue {
     return this.taskQueue;
   }
 
   getContextManager(): ContextManager {
     return this.contextManager;
   }
 
   getGovernor(): AutonomyGovernor {
     return this.governor;
   }
 
   getEvents(): import('../types').OrchestrationEvent[] {
     return this.eventStore.getEvents(this.run_id);
   }
 
   // ========== Replay ==========
 
   static async replay(
     events: import('../types').OrchestrationEvent[],
     config: KernelConfig
   ): Promise<OrchestrationKernel> {
     const kernel = new OrchestrationKernel(config);
     
     // Rebuild state from events
     for (const event of events) {
       switch (event.type) {
         case 'QUEUE_MUTATION':
           // Replay queue mutations
           const mutation = event.payload;
           if (mutation.mutation_type === 'ADD_TASK') {
             // Task already added via event, skip
           }
           break;
         case 'CONTEXT_UPDATED':
           // Context updates are logged but state is rebuilt
           break;
         case 'SNAPSHOT_CREATED':
           // Load snapshot state
           break;
       }
     }
 
     return kernel;
   }
 
   // ========== Export ==========
 
   exportBundle(): {
     events: string;
     snapshots: string;
     config: KernelConfig;
   } {
     return {
       events: this.eventStore.export(),
       snapshots: this.snapshotStore.export(this.run_id),
       config: this.config,
     };
   }
 }