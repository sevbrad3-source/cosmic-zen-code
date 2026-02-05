 // ============================================================================
 // AUDITOR - Rubric-based evaluation and contradiction detection
 // ============================================================================
 
 import { 
   AuditResult, 
   RubricScore, 
   Contradiction, 
   Task, 
   VerificationResult,
   OrchestrationEvent 
 } from '../types';
 import { getEventStore } from '../store/EventStore';
 import { ContextManager } from '../context/ContextManager';
 
 export interface AuditCriterion {
   id: string;
   name: string;
   description: string;
   weight: number;
   maxScore: number;
   evaluator: (task: Task, output: string, context: AuditContext) => RubricScore;
 }
 
 export interface AuditContext {
   events: OrchestrationEvent[];
   verificationResults: VerificationResult[];
   contextManager: ContextManager;
   previousDecisions: OrchestrationEvent[];
 }
 
 export class Auditor {
   private run_id: string;
   private criteria: AuditCriterion[] = [];
 
   constructor(run_id: string) {
     this.run_id = run_id;
     this.initializeDefaultCriteria();
   }
 
   private initializeDefaultCriteria(): void {
     this.criteria = [
       {
         id: 'acceptance_met',
         name: 'Acceptance Criteria Met',
         description: 'Did the output meet the stated acceptance criteria?',
         weight: 3,
         maxScore: 10,
         evaluator: (task, output, context) => {
           const passed = context.verificationResults.filter(r => r.passed).length;
           const total = context.verificationResults.length;
           const ratio = total > 0 ? passed / total : 0;
           return {
             criterion: 'Acceptance Criteria Met',
             score: Math.round(ratio * 10),
             max_score: 10,
             rationale: `${passed}/${total} criteria passed`,
           };
         },
       },
       {
         id: 'no_contradictions',
         name: 'No Contradictions',
         description: 'Does the output avoid contradicting earlier decisions?',
         weight: 2,
         maxScore: 10,
         evaluator: (task, output, context) => {
           const contradictions = this.detectDecisionContradictions(output, context);
           const score = Math.max(0, 10 - contradictions.length * 3);
           return {
             criterion: 'No Contradictions',
             score,
             max_score: 10,
             rationale: contradictions.length === 0 
               ? 'No contradictions detected' 
               : `Found ${contradictions.length} potential contradictions`,
           };
         },
       },
       {
         id: 'follow_up_created',
         name: 'Follow-up Tasks Created',
         description: 'Were appropriate follow-up tasks created for failures?',
         weight: 2,
         maxScore: 10,
         evaluator: (task, output, context) => {
           const failures = context.verificationResults.filter(r => !r.passed);
           if (failures.length === 0) {
             return {
               criterion: 'Follow-up Tasks Created',
               score: 10,
               max_score: 10,
               rationale: 'No failures requiring follow-up',
             };
           }
 
           // Check if QUEUE_MUTATION events created fix tasks
           const queueMutations = context.events.filter(e => 
             e.type === 'QUEUE_MUTATION' && 
             e.payload.mutation_type === 'ADD_TASK' &&
             (e.payload.justification as string || '').toLowerCase().includes('fix')
           );
 
           const ratio = Math.min(1, queueMutations.length / failures.length);
           return {
             criterion: 'Follow-up Tasks Created',
             score: Math.round(ratio * 10),
             max_score: 10,
             rationale: `${queueMutations.length} fix tasks created for ${failures.length} failures`,
           };
         },
       },
       {
         id: 'constraint_compliance',
         name: 'Constraint Compliance',
         description: 'Does the output comply with pinned constraints?',
         weight: 3,
         maxScore: 10,
         evaluator: (task, output, context) => {
           const driftDetected = context.contextManager.detectDrift(output);
           const score = Math.max(0, 10 - driftDetected.length * 4);
           return {
             criterion: 'Constraint Compliance',
             score,
             max_score: 10,
             rationale: driftDetected.length === 0
               ? 'All constraints respected'
               : `${driftDetected.length} constraint violations detected`,
           };
         },
       },
       {
         id: 'completeness',
         name: 'Completeness',
         description: 'Is the output complete and not cut off?',
         weight: 1,
         maxScore: 10,
         evaluator: (task, output, context) => {
           // Check for common incompleteness indicators
           const incompletePatterns = [
             /\.\.\.$/,
             /\[continued\]/i,
             /\[truncated\]/i,
             /to be continued/i,
             /etc\.?$/i,
           ];
 
           const isIncomplete = incompletePatterns.some(p => p.test(output.trim()));
           
           return {
             criterion: 'Completeness',
             score: isIncomplete ? 5 : 10,
             max_score: 10,
             rationale: isIncomplete 
               ? 'Output appears incomplete' 
               : 'Output appears complete',
           };
         },
       },
     ];
   }
 
   private detectDecisionContradictions(
     output: string, 
     context: AuditContext
   ): Contradiction[] {
     const contradictions: Contradiction[] = [];
 
     // Get previous ACTION_EXECUTED and PLAN_CREATED events
     const previousActions = context.previousDecisions.filter(e => 
       e.type === 'ACTION_EXECUTED' || e.type === 'PLAN_CREATED'
     );
 
     // Simple check: look for explicit reversals
     const reversalPatterns = [
       /(?:actually|instead|on second thought|i was wrong|disregard|ignore previous)/i,
     ];
 
     for (const pattern of reversalPatterns) {
       if (pattern.test(output)) {
         contradictions.push({
           type: 'decision_reversal',
           description: 'Output contains language suggesting a reversal of previous decisions',
           evidence: [output.slice(0, 200)],
           severity: 'medium',
         });
       }
     }
 
     return contradictions;
   }
 
   async audit(
     task: Task,
     output: string,
     verificationResults: VerificationResult[],
     contextManager: ContextManager
   ): Promise<AuditResult> {
     const events = getEventStore().getEvents(this.run_id);
     const previousDecisions = events.filter(e => 
       e.type === 'ACTION_EXECUTED' || e.type === 'PLAN_CREATED'
     );
 
     const context: AuditContext = {
       events,
       verificationResults,
       contextManager,
       previousDecisions,
     };
 
     const rubricScores: RubricScore[] = [];
     const notes: string[] = [];
     const allContradictions: Contradiction[] = [];
 
     // Run all criteria evaluators
     for (const criterion of this.criteria) {
       const score = criterion.evaluator(task, output, context);
       rubricScores.push(score);
 
       if (score.score < score.max_score * 0.7) {
         notes.push(`${criterion.name}: ${score.rationale}`);
       }
     }
 
     // Collect contradictions
     const driftContradictions = contextManager.detectDrift(output);
     const decisionContradictions = this.detectDecisionContradictions(output, context);
     allContradictions.push(...driftContradictions, ...decisionContradictions);
 
     // Calculate overall pass/fail
     const totalWeight = this.criteria.reduce((sum, c) => sum + c.weight, 0);
     const weightedScore = rubricScores.reduce((sum, score, i) => {
       const criterion = this.criteria[i];
       return sum + (score.score / score.max_score) * criterion.weight;
     }, 0);
     const normalizedScore = weightedScore / totalWeight;
 
     const passed = normalizedScore >= 0.7 && allContradictions.filter(c => c.severity === 'high').length === 0;
 
     // Log audit result
     getEventStore().append(this.run_id, 'AUDIT_NOTE', {
       task_id: task.task_id,
       passed,
       normalized_score: normalizedScore,
       rubric_scores: rubricScores,
       contradiction_count: allContradictions.length,
       notes,
     });
 
     return {
       passed,
       rubric_scores: rubricScores,
       notes,
       contradictions: allContradictions,
     };
   }
 
   addCriterion(criterion: AuditCriterion): void {
     this.criteria.push(criterion);
   }
 
   removeCriterion(id: string): boolean {
     const index = this.criteria.findIndex(c => c.id === id);
     if (index > -1) {
       this.criteria.splice(index, 1);
       return true;
     }
     return false;
   }
 
   getCriteria(): AuditCriterion[] {
     return [...this.criteria];
   }
 }