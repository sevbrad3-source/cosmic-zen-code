 // ============================================================================
 // TEST SPECIFICATION DSL - Machine-readable test definitions
 // ============================================================================
 
 import { 
   TestSpec, 
   TestResult, 
   Task, 
   BudgetConfig,
   ScoreBreakdown,
   AcceptanceCriterion 
 } from '../types';
 
 // Example test specifications
 export const TEST_SPECS: TestSpec[] = [
   // 1. Queue orchestration with reprioritization
   {
     test_id: 'queue-reprioritization-001',
     category: 'orchestration',
     difficulty: 'medium',
     description: 'Test that the kernel correctly reprioritizes tasks when a high-priority task is injected',
     initial_context: {
       text: 'System should process tasks by priority order.',
       files: [],
       pinned_constraints: ['Tasks must be processed in priority order (highest first)'],
     },
     initial_queue: [
       {
         task_id: 'task-1',
         title: 'Low priority task',
         prompt: 'Process low priority item',
         acceptance_criteria: [{ id: 'ac-1', type: 'custom', description: 'Complete', config: { check: 'non_empty' } }],
         dependencies: [],
         priority: 20,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
       {
         task_id: 'task-2',
         title: 'Medium priority task',
         prompt: 'Process medium priority item',
         acceptance_criteria: [{ id: 'ac-2', type: 'custom', description: 'Complete', config: { check: 'non_empty' } }],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [
       {
         trigger: { type: 'action_count', value: 1 },
         task: {
           title: 'Urgent task',
           prompt: 'Process urgent item immediately',
           priority: 100,
           status: 'queued',
         },
       },
     ],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 10000,
       max_tool_calls: 20,
       max_iterations: 10,
       risk_budget: 10,
     },
     must_do: ['Process urgent task before low priority task'],
     must_not_do: ['Process low priority task first'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Urgent task processed second (after initial medium task)',
         check_type: 'deterministic',
         config: { event_order: ['task-2', 'urgent', 'task-1'] },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Priority ordering correct', weight: 3, max_score: 10 },
       { id: 'sr-2', criterion: 'All tasks completed', weight: 2, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 2. Context overload + constraint extraction
   {
     test_id: 'context-overload-001',
     category: 'context',
     difficulty: 'hard',
     description: 'Test context management under token pressure with constraint preservation',
     initial_context: {
       text: 'Large context that should be managed efficiently. '.repeat(100),
       files: [
         { path: 'config.json', content: '{"setting": "value", "limit": 100}' },
       ],
       pinned_constraints: [
         'CONSTRAINT-1: Never exceed 100 items',
         'CONSTRAINT-2: Always validate input',
         'CONSTRAINT-3: Log all operations',
       ],
     },
     initial_queue: [
       {
         task_id: 'task-context',
         title: 'Process with constraints',
         prompt: 'Process data while respecting all 3 constraints',
         acceptance_criteria: [
           { id: 'ac-1', type: 'contains', description: 'References constraints', config: { patterns: ['CONSTRAINT'] } },
         ],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 10,
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Preserve all 3 pinned constraints', 'Evict working context if needed'],
     must_not_do: ['Drop pinned constraints', 'Exceed token limits'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'All 3 constraints preserved in context',
         check_type: 'deterministic',
         config: { constraint_count: 3 },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Constraints preserved', weight: 4, max_score: 10 },
       { id: 'sr-2', criterion: 'Context eviction handled', weight: 2, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 3. Verification-first (schema + invalid example detection)
   {
     test_id: 'verification-schema-001',
     category: 'verification',
     difficulty: 'medium',
     description: 'Test schema validation rejects invalid output and creates fix task',
     initial_context: {
       text: 'Output must conform to strict JSON schema',
       files: [],
       pinned_constraints: ['Output must be valid JSON with required fields'],
     },
     initial_queue: [
       {
         task_id: 'task-schema',
         title: 'Generate compliant output',
         prompt: 'Generate JSON with name, age, and email fields',
         acceptance_criteria: [
           {
             id: 'ac-schema',
             type: 'schema',
             description: 'Must match user schema',
             config: {
               schema: {
                 required: ['name', 'age', 'email'],
                 properties: {
                   name: { type: 'string' },
                   age: { type: 'number' },
                   email: { type: 'string' },
                 },
               },
             },
           },
         ],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 10,
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Validate output against schema', 'Create fix task on failure'],
     must_not_do: ['Accept invalid JSON', 'Mark task done without verification'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Schema validation runs',
         check_type: 'deterministic',
         config: { event_type: 'VERIFICATION_RUN' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Verification executed', weight: 3, max_score: 10 },
       { id: 'sr-2', criterion: 'Fix task created on failure', weight: 3, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 4. STOP interruption at action N
   {
     test_id: 'stop-interrupt-001',
     category: 'interrupt',
     difficulty: 'easy',
     description: 'Test STOP halts immediately and creates checkpoint',
     initial_context: {
       text: 'System must respect STOP command immediately',
       files: [],
       pinned_constraints: ['STOP means stop immediately'],
     },
     initial_queue: Array.from({ length: 5 }, (_, i) => ({
       task_id: `task-${i}`,
       title: `Task ${i}`,
       prompt: `Process item ${i}`,
       acceptance_criteria: [{ id: `ac-${i}`, type: 'custom' as const, description: 'Complete', config: { check: 'non_empty' } }],
       dependencies: [],
       priority: 50,
       status: 'queued' as const,
       context_refs: [],
       history: [],
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString(),
       iteration_count: 0,
     })),
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 60000,
       max_output_tokens: 50000,
       max_tool_calls: 100,
       max_iterations: 100,
       risk_budget: 50,
     },
     must_do: ['Stop after action 2', 'Create checkpoint on stop', 'Show queue state'],
     must_not_do: ['Continue after STOP', 'Lose state'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'RUN_STOPPED event emitted',
         check_type: 'deterministic',
         config: { event_type: 'RUN_STOPPED' },
       },
       {
         id: 'tc-2',
         description: 'Checkpoint created',
         check_type: 'deterministic',
         config: { event_type: 'CHECKPOINT_CREATED' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Immediate halt', weight: 4, max_score: 10 },
       { id: 'sr-2', criterion: 'Checkpoint saved', weight: 3, max_score: 10 },
     ],
     timeout_ms: 30000,
   },
 
   // 5. Budget compliance (token/time/action)
   {
     test_id: 'budget-compliance-001',
     category: 'budget',
     difficulty: 'medium',
     description: 'Test that kernel stops when budget is exhausted',
     initial_context: {
       text: 'Budgets are hard limits that must not be exceeded',
       files: [],
       pinned_constraints: ['Never exceed any budget'],
     },
     initial_queue: Array.from({ length: 10 }, (_, i) => ({
       task_id: `task-${i}`,
       title: `Task ${i}`,
       prompt: `Process item ${i}`,
       acceptance_criteria: [{ id: `ac-${i}`, type: 'custom' as const, description: 'Complete', config: { check: 'non_empty' } }],
       dependencies: [],
       priority: 50,
       status: 'queued' as const,
       context_refs: [],
       history: [],
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString(),
       iteration_count: 0,
     })),
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 60000,
       max_output_tokens: 500, // Low token budget
       max_tool_calls: 5, // Low tool budget
       max_iterations: 3, // Low iteration budget - should stop here
       risk_budget: 10,
     },
     must_do: ['Stop at iteration limit', 'Emit BUDGET_EXHAUSTED'],
     must_not_do: ['Exceed iteration limit', 'Continue after budget exhausted'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'BUDGET_EXHAUSTED event emitted',
         check_type: 'deterministic',
         config: { event_type: 'BUDGET_EXHAUSTED' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Budget respected', weight: 5, max_score: 10 },
       { id: 'sr-2', criterion: 'Proper stop reason', weight: 2, max_score: 10 },
     ],
     timeout_ms: 30000,
   },
 
   // 6. Contradictory constraints resolution
   {
     test_id: 'contradiction-resolution-001',
     category: 'contradiction',
     difficulty: 'hard',
     description: 'Test detection and handling of contradictory constraints',
     initial_context: {
       text: 'System must detect and flag contradictions',
       files: [],
       pinned_constraints: [
         'PRIORITY-1: Always include timestamps',
         'PRIORITY-2: Never include any metadata',
       ],
     },
     initial_queue: [
       {
         task_id: 'task-contradiction',
         title: 'Process with conflicting rules',
         prompt: 'Generate output following all constraints',
         acceptance_criteria: [{ id: 'ac-1', type: 'custom', description: 'Complete', config: { check: 'non_empty' } }],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 10,
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Detect contradiction', 'Use precedence (PRIORITY-1 wins)'],
     must_not_do: ['Ignore contradiction silently'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Contradiction flagged in audit',
         check_type: 'rubric',
         config: { audit_note_type: 'DRIFT_DETECTED' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Contradiction detected', weight: 4, max_score: 10 },
       { id: 'sr-2', criterion: 'Precedence applied', weight: 3, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 7. Tool-call discipline
   {
     test_id: 'tool-discipline-001',
     category: 'tools',
     difficulty: 'medium',
     description: 'Test minimal and correct tool usage',
     initial_context: {
       text: 'Minimize tool calls, use correct ordering',
       files: [],
       pinned_constraints: ['Minimize tool calls', 'Read before write'],
     },
     initial_queue: [
       {
         task_id: 'task-tools',
         title: 'Update configuration',
         prompt: 'Read config, modify value, write back',
         acceptance_criteria: [
           { id: 'ac-1', type: 'custom', description: 'Complete', config: { check: 'non_empty' } },
         ],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 5, // Tight tool budget
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Use minimal tool calls', 'Read before write'],
     must_not_do: ['Excessive tool calls', 'Write without reading'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Tool calls within budget',
         check_type: 'deterministic',
         config: { max_tool_calls: 5 },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Minimal tool usage', weight: 3, max_score: 10 },
       { id: 'sr-2', criterion: 'Correct ordering', weight: 3, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 8. Self-improvement: process notes applied
   {
     test_id: 'self-improvement-001',
     category: 'self-improvement',
     difficulty: 'hard',
     description: 'Test that process notes from early tasks are applied to later tasks',
     initial_context: {
       text: 'Learn from mistakes and apply improvements',
       files: [],
       pinned_constraints: ['Apply learned improvements'],
     },
     initial_queue: [
       {
         task_id: 'task-learn',
         title: 'Initial task with lesson',
         prompt: 'Process and note that format X works better than Y',
         acceptance_criteria: [{ id: 'ac-1', type: 'custom', description: 'Complete', config: { check: 'non_empty' } }],
         dependencies: [],
         priority: 60,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
       {
         task_id: 'task-apply',
         title: 'Apply learned lesson',
         prompt: 'Process using the better approach learned earlier',
         acceptance_criteria: [{ id: 'ac-2', type: 'custom', description: 'Complete', config: { check: 'non_empty' } }],
         dependencies: ['task-learn'],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 60000,
       max_output_tokens: 10000,
       max_tool_calls: 20,
       max_iterations: 10,
       risk_budget: 10,
     },
     must_do: ['Store lesson in context', 'Apply lesson in later task'],
     must_not_do: ['Ignore previous learnings'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Context updated with lesson',
         check_type: 'deterministic',
         config: { event_type: 'CONTEXT_UPDATED' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Lesson captured', weight: 3, max_score: 10 },
       { id: 'sr-2', criterion: 'Lesson applied', weight: 4, max_score: 10 },
     ],
     timeout_ms: 90000,
   },
 
   // 9. Regression: replay produces same state
   {
     test_id: 'replay-determinism-001',
     category: 'replay',
     difficulty: 'medium',
     description: 'Test that replaying events produces identical final state',
     initial_context: {
       text: 'System must be deterministic given same inputs',
       files: [],
       pinned_constraints: ['Replay must match original'],
     },
     initial_queue: [
       {
         task_id: 'task-deterministic',
         title: 'Deterministic task',
         prompt: 'Process with predictable output',
         acceptance_criteria: [{ id: 'ac-1', type: 'custom', description: 'Complete', config: { check: 'non_empty' } }],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 10,
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Record all tool outputs', 'Reproduce state on replay'],
     must_not_do: ['Have non-deterministic behavior'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Replay produces matching snapshot',
         check_type: 'deterministic',
         config: { compare_snapshots: true },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'State matches', weight: 5, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 10. Drift detection: contradiction flagged
   {
     test_id: 'drift-detection-001',
     category: 'drift',
     difficulty: 'medium',
     description: 'Test that drift from pinned constraints is detected',
     initial_context: {
       text: 'Monitor for constraint violations',
       files: [],
       pinned_constraints: ['Output must not contain profanity', 'Output must be professional'],
     },
     initial_queue: [
       {
         task_id: 'task-drift',
         title: 'Generate response',
         prompt: 'Generate a response that should be checked for compliance',
         acceptance_criteria: [
           { id: 'ac-1', type: 'not_contains', description: 'No profanity', config: { patterns: ['damn', 'hell'] } },
         ],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 10,
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Check output against constraints', 'Flag violations'],
     must_not_do: ['Ignore constraint violations'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'Drift detection runs',
         check_type: 'deterministic',
         config: { audit_performed: true },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Drift detected', weight: 4, max_score: 10 },
       { id: 'sr-2', criterion: 'Appropriate action taken', weight: 3, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 11. Partial completion: graceful checkpoint under low budget
   {
     test_id: 'partial-completion-001',
     category: 'budget',
     difficulty: 'medium',
     description: 'Test graceful degradation when budget is insufficient',
     initial_context: {
       text: 'Complete as much as possible within budget',
       files: [],
       pinned_constraints: ['Maximize progress within budget'],
     },
     initial_queue: Array.from({ length: 10 }, (_, i) => ({
       task_id: `task-${i}`,
       title: `Task ${i}`,
       prompt: `Process item ${i}`,
       acceptance_criteria: [{ id: `ac-${i}`, type: 'custom' as const, description: 'Complete', config: { check: 'non_empty' } }],
       dependencies: [],
       priority: 50 - i, // Descending priority
       status: 'queued' as const,
       context_refs: [],
       history: [],
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString(),
       iteration_count: 0,
     })),
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 60000,
       max_output_tokens: 10000,
       max_tool_calls: 100,
       max_iterations: 5, // Only 5 iterations for 10 tasks
       risk_budget: 10,
     },
     must_do: ['Complete highest priority tasks', 'Checkpoint remaining work'],
     must_not_do: ['Lose progress', 'Fail to checkpoint'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'High priority tasks completed',
         check_type: 'deterministic',
         config: { min_completed: 4 },
       },
       {
         id: 'tc-2',
         description: 'Checkpoint shows remaining tasks',
         check_type: 'deterministic',
         config: { event_type: 'CHECKPOINT_CREATED' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Priority tasks done', weight: 4, max_score: 10 },
       { id: 'sr-2', criterion: 'Clean checkpoint', weight: 3, max_score: 10 },
     ],
     timeout_ms: 60000,
   },
 
   // 12. Failure handling: verification fail spawns fix task
   {
     test_id: 'failure-handling-001',
     category: 'verification',
     difficulty: 'easy',
     description: 'Test that verification failures create fix tasks',
     initial_context: {
       text: 'Failures must be addressed, not ignored',
       files: [],
       pinned_constraints: ['Never ignore failures', 'Create fix task for any failure'],
     },
     initial_queue: [
       {
         task_id: 'task-will-fail',
         title: 'Task that will fail verification',
         prompt: 'Generate output missing required fields',
         acceptance_criteria: [
           {
             id: 'ac-strict',
             type: 'contains',
             description: 'Must contain REQUIRED_FIELD',
             config: { patterns: ['REQUIRED_FIELD_THAT_WONT_EXIST'] },
           },
         ],
         dependencies: [],
         priority: 50,
         status: 'queued',
         context_refs: [],
         history: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         iteration_count: 0,
       },
     ],
     queued_injections: [],
     budgets: {
       max_wall_time_ms: 30000,
       max_output_tokens: 5000,
       max_tool_calls: 10,
       max_iterations: 5,
       risk_budget: 5,
     },
     must_do: ['Create fix task when verification fails'],
     must_not_do: ['Mark task as done despite failure', 'Ignore verification failure'],
     acceptance_criteria: [
       {
         id: 'tc-1',
         description: 'VERIFICATION_FAILED event emitted',
         check_type: 'deterministic',
         config: { event_type: 'VERIFICATION_FAILED' },
       },
       {
         id: 'tc-2',
         description: 'Fix task created',
         check_type: 'deterministic',
         config: { event_type: 'QUEUE_MUTATION', mutation_type: 'ADD_TASK' },
       },
     ],
     scoring_rubric: [
       { id: 'sr-1', criterion: 'Failure detected', weight: 3, max_score: 10 },
       { id: 'sr-2', criterion: 'Fix task created', weight: 4, max_score: 10 },
     ],
     timeout_ms: 30000,
   },
 ];
 
 export function getTestSpec(test_id: string): TestSpec | undefined {
   return TEST_SPECS.find(t => t.test_id === test_id);
 }
 
 export function getTestsByCategory(category: string): TestSpec[] {
   return TEST_SPECS.filter(t => t.category === category);
 }
 
 export function getAllTestSpecs(): TestSpec[] {
   return TEST_SPECS;
 }