 // ============================================================================
 // TEST RUNNER - Execute test specifications and produce scoring reports
 // ============================================================================
 
 import {
   TestSpec,
   TestResult,
   ScoreBreakdown,
   Task,
   OrchestrationEvent,
 } from '../types';
 import { OrchestrationKernel, KernelConfig } from '../kernel/OrchestrationKernel';
 import { resetEventStore, getEventStore } from '../store/EventStore';
 import { resetSnapshotStore } from '../store/SnapshotStore';
 import { getTestSpec, getAllTestSpecs } from './TestSpec';
 
 export interface TestRunOptions {
   timeout_override?: number;
   stop_at_action?: number;
   verbose?: boolean;
 }
 
 export interface SuiteResult {
   suite_name: string;
   total_tests: number;
   passed: number;
   failed: number;
   total_score: number;
   max_score: number;
   results: TestResult[];
   duration_ms: number;
 }
 
 export class TestRunner {
   private verbose: boolean = false;
 
   constructor(verbose: boolean = false) {
     this.verbose = verbose;
   }
 
   async runTest(test_id: string, options: TestRunOptions = {}): Promise<TestResult> {
     const spec = getTestSpec(test_id);
     if (!spec) {
       return {
         test_id,
         passed: false,
         score: 0,
         max_score: 0,
         breakdown: [],
         run_id: '',
         duration_ms: 0,
         event_log_path: '',
         artifacts_path: '',
         errors: [`Test specification not found: ${test_id}`],
       };
     }
 
     return this.executeSpec(spec, options);
   }
 
   async runSuite(category?: string): Promise<SuiteResult> {
     const startTime = Date.now();
     const specs = category 
       ? getAllTestSpecs().filter(s => s.category === category)
       : getAllTestSpecs();
 
     const results: TestResult[] = [];
 
     for (const spec of specs) {
       if (this.verbose) {
         console.log(`Running test: ${spec.test_id}`);
       }
 
       const result = await this.executeSpec(spec, {});
       results.push(result);
 
       if (this.verbose) {
         console.log(`  ${result.passed ? '✓' : '✗'} Score: ${result.score}/${result.max_score}`);
       }
     }
 
     const passed = results.filter(r => r.passed).length;
     const failed = results.filter(r => !r.passed).length;
     const totalScore = results.reduce((sum, r) => sum + r.score, 0);
     const maxScore = results.reduce((sum, r) => sum + r.max_score, 0);
 
     return {
       suite_name: category || 'all',
       total_tests: specs.length,
       passed,
       failed,
       total_score: totalScore,
       max_score: maxScore,
       results,
       duration_ms: Date.now() - startTime,
     };
   }
 
   private async executeSpec(spec: TestSpec, options: TestRunOptions): Promise<TestResult> {
     const startTime = Date.now();
     const errors: string[] = [];
 
     // Reset stores for clean test
     resetEventStore();
     resetSnapshotStore();
 
     // Create kernel with test configuration
     const config: KernelConfig = {
       project_id: `test-${spec.test_id}`,
       budgets: spec.budgets,
       autonomy_mode: 'autonomous',
       checkpoint_interval: 5,
     };
 
     const kernel = new OrchestrationKernel(config);
     const run_id = kernel.getRunId();
 
     // Add pinned constraints
     for (const constraint of spec.initial_context.pinned_constraints) {
       kernel.addPinnedConstraint(constraint);
     }
 
     // Add initial tasks
     for (const task of spec.initial_queue) {
       kernel.addTask({
         title: task.title,
         prompt: task.prompt,
         acceptance_criteria: task.acceptance_criteria,
         dependencies: task.dependencies,
         priority: task.priority,
         status: 'queued',
         context_refs: [],
       });
     }
 
     // Set up timeout
     const timeout = options.timeout_override || spec.timeout_ms;
     let timedOut = false;
     const timeoutPromise = new Promise<void>((_, reject) => {
       setTimeout(() => {
         timedOut = true;
         kernel.stop();
         reject(new Error('Test timed out'));
       }, timeout);
     });
 
     // Set up STOP trigger if specified
     if (options.stop_at_action) {
       const stopAction = options.stop_at_action;
       let actionCount = 0;
       
       getEventStore().subscribe('ACTION_EXECUTED', () => {
         actionCount++;
         if (actionCount >= stopAction) {
           kernel.stop();
         }
       });
     }
 
     // Set up injection triggers
     let actionCount = 0;
     for (const injection of spec.queued_injections) {
       if (injection.trigger.type === 'action_count') {
         getEventStore().subscribe('ACTION_EXECUTED', () => {
           actionCount++;
           if (actionCount === injection.trigger.value) {
             kernel.addTask({
               title: injection.task.title || 'Injected task',
               prompt: injection.task.prompt || '',
               acceptance_criteria: injection.task.acceptance_criteria || [],
               dependencies: injection.task.dependencies || [],
               priority: injection.task.priority || 50,
               status: 'queued',
               context_refs: [],
             });
           }
         });
       }
     }
 
     // Run kernel
     try {
       await Promise.race([
         kernel.run(),
         timeoutPromise,
       ]);
     } catch (error) {
       if (!timedOut) {
         errors.push(error instanceof Error ? error.message : 'Unknown error');
       }
     }
 
     // Get events for evaluation
     const events = kernel.getEvents();
 
     // Evaluate acceptance criteria
     const criteriaResults = this.evaluateCriteria(spec, events, kernel);
 
     // Calculate scores
     const breakdown = this.calculateScores(spec, events, kernel, criteriaResults);
     const totalScore = breakdown.reduce((sum, b) => sum + b.weighted_score, 0);
     const maxScore = breakdown.reduce((sum, b) => sum + (b.max_score * b.weight), 0);
 
     // Determine pass/fail
     const passed = criteriaResults.every(r => r.passed) && errors.length === 0;
 
     return {
       test_id: spec.test_id,
       passed,
       score: Math.round(totalScore * 100) / 100,
       max_score: maxScore,
       breakdown,
       run_id,
       duration_ms: Date.now() - startTime,
       event_log_path: `/runs/${run_id}/events.json`,
       artifacts_path: `/runs/${run_id}/artifacts/`,
       errors,
     };
   }
 
   private evaluateCriteria(
     spec: TestSpec,
     events: OrchestrationEvent[],
     kernel: OrchestrationKernel
   ): { id: string; passed: boolean; message: string }[] {
     const results: { id: string; passed: boolean; message: string }[] = [];
 
     for (const criterion of spec.acceptance_criteria) {
       if (criterion.check_type === 'deterministic') {
         const result = this.checkDeterministic(criterion, events, kernel);
         results.push(result);
       } else {
         // Rubric checks are evaluated in scoring
         results.push({ id: criterion.id, passed: true, message: 'Rubric check' });
       }
     }
 
     return results;
   }
 
   private checkDeterministic(
     criterion: { id: string; description: string; config: Record<string, unknown> },
     events: OrchestrationEvent[],
     kernel: OrchestrationKernel
   ): { id: string; passed: boolean; message: string } {
     const config = criterion.config;
 
     // Check for specific event type
     if (config.event_type) {
       const found = events.some(e => e.type === config.event_type);
       return {
         id: criterion.id,
         passed: found,
         message: found 
           ? `Event ${config.event_type} found` 
           : `Event ${config.event_type} not found`,
       };
     }
 
     // Check event order
     if (config.event_order) {
       const order = config.event_order as string[];
       const taskEvents = events
         .filter(e => e.type === 'ACTION_EXECUTED')
         .map(e => e.payload.task_id as string);
       
       let lastIndex = -1;
       let inOrder = true;
       for (const taskId of order) {
         const index = taskEvents.findIndex((t, i) => i > lastIndex && t.includes(taskId));
         if (index === -1) {
           inOrder = false;
           break;
         }
         lastIndex = index;
       }
 
       return {
         id: criterion.id,
         passed: inOrder,
         message: inOrder ? 'Events in correct order' : 'Events out of order',
       };
     }
 
     // Check constraint count
     if (config.constraint_count) {
       const contextManager = kernel.getContextManager();
       const pinned = contextManager.getPinned();
       const passed = pinned.length >= (config.constraint_count as number);
       return {
         id: criterion.id,
         passed,
         message: `${pinned.length} constraints (expected >= ${config.constraint_count})`,
       };
     }
 
     // Check max tool calls
     if (config.max_tool_calls) {
       const toolCalls = events.filter(e => e.type === 'TOOL_CALLED').length;
       const passed = toolCalls <= (config.max_tool_calls as number);
       return {
         id: criterion.id,
         passed,
         message: `${toolCalls} tool calls (max: ${config.max_tool_calls})`,
       };
     }
 
     // Check minimum completed tasks
     if (config.min_completed) {
       const completed = kernel.getTaskQueue().getTasksByStatus('done').length;
       const passed = completed >= (config.min_completed as number);
       return {
         id: criterion.id,
         passed,
         message: `${completed} tasks completed (min: ${config.min_completed})`,
       };
     }
 
     // Check for specific mutation type
     if (config.mutation_type) {
       const found = events.some(e => 
         e.type === 'QUEUE_MUTATION' && 
         e.payload.mutation_type === config.mutation_type
       );
       return {
         id: criterion.id,
         passed: found,
         message: found 
           ? `Mutation ${config.mutation_type} found` 
           : `Mutation ${config.mutation_type} not found`,
       };
     }
 
     return {
       id: criterion.id,
       passed: false,
       message: 'Unknown check type',
     };
   }
 
   private calculateScores(
     spec: TestSpec,
     events: OrchestrationEvent[],
     kernel: OrchestrationKernel,
     criteriaResults: { id: string; passed: boolean; message: string }[]
   ): ScoreBreakdown[] {
     const breakdown: ScoreBreakdown[] = [];
 
     for (const rubric of spec.scoring_rubric) {
       let score = 0;
       let notes = '';
 
       // Score based on criterion
       switch (rubric.criterion.toLowerCase()) {
         case 'priority ordering correct':
           const orderCorrect = criteriaResults.find(r => r.id === 'tc-1')?.passed;
           score = orderCorrect ? rubric.max_score : 0;
           notes = orderCorrect ? 'Correct priority order' : 'Incorrect priority order';
           break;
 
         case 'all tasks completed':
           const queue = kernel.getTaskQueue();
           const total = queue.getAllTasks().length;
           const done = queue.getTasksByStatus('done').length;
           score = Math.round((done / Math.max(1, total)) * rubric.max_score);
           notes = `${done}/${total} tasks completed`;
           break;
 
         case 'constraints preserved':
           const contextManager = kernel.getContextManager();
           const pinned = contextManager.getPinned();
           const expected = spec.initial_context.pinned_constraints.length;
           score = pinned.length >= expected ? rubric.max_score : 
             Math.round((pinned.length / expected) * rubric.max_score);
           notes = `${pinned.length}/${expected} constraints preserved`;
           break;
 
         case 'budget respected':
           const exhausted = events.some(e => e.type === 'BUDGET_EXHAUSTED');
           const exceeded = kernel.getGovernor().getBudgets().used_iterations > spec.budgets.max_iterations;
           score = !exceeded ? rubric.max_score : 0;
           notes = exceeded ? 'Budget exceeded' : 'Budget respected';
           break;
 
         case 'immediate halt':
           const stopped = events.some(e => e.type === 'RUN_STOPPED');
           score = stopped ? rubric.max_score : 0;
           notes = stopped ? 'Halted on STOP' : 'Did not halt';
           break;
 
         case 'checkpoint saved':
           const checkpointed = events.some(e => e.type === 'CHECKPOINT_CREATED');
           score = checkpointed ? rubric.max_score : 0;
           notes = checkpointed ? 'Checkpoint created' : 'No checkpoint';
           break;
 
         case 'verification executed':
           const verified = events.some(e => e.type === 'VERIFICATION_RUN');
           score = verified ? rubric.max_score : 0;
           notes = verified ? 'Verification ran' : 'Verification skipped';
           break;
 
         case 'fix task created':
         case 'fix task created on failure':
           const fixCreated = events.some(e => 
             e.type === 'QUEUE_MUTATION' && 
             (e.payload.justification as string || '').toLowerCase().includes('fix')
           );
           score = fixCreated ? rubric.max_score : 0;
           notes = fixCreated ? 'Fix task created' : 'No fix task';
           break;
 
         case 'failure detected':
           const failed = events.some(e => e.type === 'VERIFICATION_FAILED');
           score = failed ? rubric.max_score : 0;
           notes = failed ? 'Failure detected' : 'Failure not detected';
           break;
 
         default:
           // Generic scoring based on whether related criteria passed
           const relatedCriteria = criteriaResults.filter(r => r.passed);
           score = Math.round((relatedCriteria.length / Math.max(1, criteriaResults.length)) * rubric.max_score);
           notes = `${relatedCriteria.length}/${criteriaResults.length} criteria passed`;
       }
 
       breakdown.push({
         rubric_id: rubric.id,
         criterion: rubric.criterion,
         score,
         max_score: rubric.max_score,
         weight: rubric.weight,
         weighted_score: score * rubric.weight,
         notes,
       });
     }
 
     return breakdown;
   }
 
   formatResult(result: TestResult): string {
     const lines: string[] = [
       `\n${'='.repeat(60)}`,
       `TEST: ${result.test_id}`,
       `${'='.repeat(60)}`,
       `Status: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`,
       `Score: ${result.score} / ${result.max_score}`,
       `Duration: ${result.duration_ms}ms`,
       `Run ID: ${result.run_id}`,
       '',
       'Score Breakdown:',
     ];
 
     for (const item of result.breakdown) {
       const status = item.score === item.max_score ? '✓' : item.score > 0 ? '~' : '✗';
       lines.push(`  ${status} ${item.criterion}: ${item.score}/${item.max_score} (×${item.weight}) = ${item.weighted_score}`);
       lines.push(`      ${item.notes}`);
     }
 
     if (result.errors.length > 0) {
       lines.push('');
       lines.push('Errors:');
       for (const error of result.errors) {
         lines.push(`  - ${error}`);
       }
     }
 
     lines.push(`${'='.repeat(60)}\n`);
 
     return lines.join('\n');
   }
 
   formatSuiteResult(result: SuiteResult): string {
     const lines: string[] = [
       `\n${'#'.repeat(60)}`,
       `SUITE: ${result.suite_name}`,
       `${'#'.repeat(60)}`,
       `Total Tests: ${result.total_tests}`,
       `Passed: ${result.passed}`,
       `Failed: ${result.failed}`,
       `Total Score: ${result.total_score} / ${result.max_score}`,
       `Duration: ${result.duration_ms}ms`,
       '',
       'Results:',
     ];
 
     for (const testResult of result.results) {
       const status = testResult.passed ? '✓' : '✗';
       lines.push(`  ${status} ${testResult.test_id}: ${testResult.score}/${testResult.max_score}`);
     }
 
     lines.push(`${'#'.repeat(60)}\n`);
 
     return lines.join('\n');
   }
 }