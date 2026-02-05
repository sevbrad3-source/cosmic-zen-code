 // ============================================================================
 // VERIFIER - Deterministic checks for task outputs
 // ============================================================================
 
 import { AcceptanceCriterion, VerificationResult, Task } from '../types';
 import { getEventStore } from '../store/EventStore';
 
 export class Verifier {
   private run_id: string;
 
   constructor(run_id: string) {
     this.run_id = run_id;
   }
 
   async verify(task: Task, output: string): Promise<VerificationResult[]> {
     const results: VerificationResult[] = [];
 
     for (const criterion of task.acceptance_criteria) {
       const result = await this.checkCriterion(criterion, output);
       results.push(result);
 
       // Log each verification
       const eventType = result.passed ? 'VERIFICATION_PASSED' : 'VERIFICATION_FAILED';
       getEventStore().append(this.run_id, eventType, {
         task_id: task.task_id,
         criterion_id: criterion.id,
         criterion_type: criterion.type,
         passed: result.passed,
         message: result.message,
       });
     }
 
     // Log overall verification run
     getEventStore().append(this.run_id, 'VERIFICATION_RUN', {
       task_id: task.task_id,
       total_criteria: results.length,
       passed_count: results.filter(r => r.passed).length,
       failed_count: results.filter(r => !r.passed).length,
       all_passed: results.every(r => r.passed),
     });
 
     return results;
   }
 
   private async checkCriterion(
     criterion: AcceptanceCriterion,
     output: string
   ): Promise<VerificationResult> {
     try {
       switch (criterion.type) {
         case 'schema':
           return this.checkSchema(criterion, output);
         case 'contains':
           return this.checkContains(criterion, output);
         case 'not_contains':
           return this.checkNotContains(criterion, output);
         case 'word_limit':
           return this.checkWordLimit(criterion, output);
         case 'regex':
           return this.checkRegex(criterion, output);
         case 'custom':
           return this.checkCustom(criterion, output);
         default:
           return {
             criterion_id: criterion.id,
             passed: false,
             message: `Unknown criterion type: ${criterion.type}`,
           };
       }
     } catch (error) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
       };
     }
   }
 
   private checkSchema(criterion: AcceptanceCriterion, output: string): VerificationResult {
     const schema = criterion.config.schema as Record<string, unknown>;
     if (!schema) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: 'No schema provided in criterion config',
       };
     }
 
     try {
       // Try to parse output as JSON
       const parsed = JSON.parse(output);
       
       // Simple schema validation (required fields)
       const requiredFields = (schema.required as string[]) || [];
       const missingFields = requiredFields.filter(field => !(field in parsed));
 
       if (missingFields.length > 0) {
         return {
           criterion_id: criterion.id,
           passed: false,
           message: `Missing required fields: ${missingFields.join(', ')}`,
           details: { missingFields },
         };
       }
 
       // Type checking for properties
       const properties = (schema.properties as Record<string, { type: string }>) || {};
       const typeErrors: string[] = [];
 
       for (const [field, spec] of Object.entries(properties)) {
         if (field in parsed) {
           const expectedType = spec.type;
           const actualType = Array.isArray(parsed[field]) ? 'array' : typeof parsed[field];
           
           if (expectedType && actualType !== expectedType) {
             typeErrors.push(`${field}: expected ${expectedType}, got ${actualType}`);
           }
         }
       }
 
       if (typeErrors.length > 0) {
         return {
           criterion_id: criterion.id,
           passed: false,
           message: `Type errors: ${typeErrors.join('; ')}`,
           details: { typeErrors },
         };
       }
 
       return {
         criterion_id: criterion.id,
         passed: true,
         message: 'Schema validation passed',
       };
     } catch (e) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Failed to parse output as JSON: ${e instanceof Error ? e.message : 'Parse error'}`,
       };
     }
   }
 
   private checkContains(criterion: AcceptanceCriterion, output: string): VerificationResult {
     const patterns = criterion.config.patterns as string[];
     if (!patterns || patterns.length === 0) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: 'No patterns provided for contains check',
       };
     }
 
     const caseSensitive = criterion.config.caseSensitive !== false;
     const checkOutput = caseSensitive ? output : output.toLowerCase();
     
     const missingPatterns = patterns.filter(pattern => {
       const checkPattern = caseSensitive ? pattern : pattern.toLowerCase();
       return !checkOutput.includes(checkPattern);
     });
 
     if (missingPatterns.length > 0) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Missing required content: ${missingPatterns.join(', ')}`,
         details: { missingPatterns },
       };
     }
 
     return {
       criterion_id: criterion.id,
       passed: true,
       message: 'All required patterns found',
     };
   }
 
   private checkNotContains(criterion: AcceptanceCriterion, output: string): VerificationResult {
     const patterns = criterion.config.patterns as string[];
     if (!patterns || patterns.length === 0) {
       return {
         criterion_id: criterion.id,
         passed: true,
         message: 'No forbidden patterns specified',
       };
     }
 
     const caseSensitive = criterion.config.caseSensitive !== false;
     const checkOutput = caseSensitive ? output : output.toLowerCase();
     
     const foundPatterns = patterns.filter(pattern => {
       const checkPattern = caseSensitive ? pattern : pattern.toLowerCase();
       return checkOutput.includes(checkPattern);
     });
 
     if (foundPatterns.length > 0) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Found forbidden content: ${foundPatterns.join(', ')}`,
         details: { foundPatterns },
       };
     }
 
     return {
       criterion_id: criterion.id,
       passed: true,
       message: 'No forbidden patterns found',
     };
   }
 
   private checkWordLimit(criterion: AcceptanceCriterion, output: string): VerificationResult {
     const minWords = (criterion.config.minWords as number) || 0;
     const maxWords = (criterion.config.maxWords as number) || Infinity;
 
     const wordCount = output.trim().split(/\s+/).filter(w => w.length > 0).length;
 
     if (wordCount < minWords) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Word count ${wordCount} is below minimum ${minWords}`,
         details: { wordCount, minWords, maxWords },
       };
     }
 
     if (wordCount > maxWords) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Word count ${wordCount} exceeds maximum ${maxWords}`,
         details: { wordCount, minWords, maxWords },
       };
     }
 
     return {
       criterion_id: criterion.id,
       passed: true,
       message: `Word count ${wordCount} is within limits [${minWords}, ${maxWords}]`,
       details: { wordCount },
     };
   }
 
   private checkRegex(criterion: AcceptanceCriterion, output: string): VerificationResult {
     const pattern = criterion.config.pattern as string;
     const flags = (criterion.config.flags as string) || '';
     const shouldMatch = criterion.config.shouldMatch !== false;
 
     if (!pattern) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: 'No regex pattern provided',
       };
     }
 
     try {
       const regex = new RegExp(pattern, flags);
       const matches = regex.test(output);
 
       if (shouldMatch && !matches) {
         return {
           criterion_id: criterion.id,
           passed: false,
           message: `Output does not match required pattern: ${pattern}`,
         };
       }
 
       if (!shouldMatch && matches) {
         return {
           criterion_id: criterion.id,
           passed: false,
           message: `Output matches forbidden pattern: ${pattern}`,
         };
       }
 
       return {
         criterion_id: criterion.id,
         passed: true,
         message: shouldMatch ? 'Pattern matched' : 'Pattern correctly not matched',
       };
     } catch (e) {
       return {
         criterion_id: criterion.id,
         passed: false,
         message: `Invalid regex pattern: ${e instanceof Error ? e.message : 'Unknown error'}`,
       };
     }
   }
 
   private checkCustom(criterion: AcceptanceCriterion, output: string): VerificationResult {
     // Custom checks would be implemented as pluggable functions
     // For now, we support a few built-in custom checks
     const checkName = criterion.config.check as string;
 
     switch (checkName) {
       case 'valid_json':
         try {
           JSON.parse(output);
           return {
             criterion_id: criterion.id,
             passed: true,
             message: 'Valid JSON',
           };
         } catch {
           return {
             criterion_id: criterion.id,
             passed: false,
             message: 'Invalid JSON',
           };
         }
 
       case 'non_empty':
         return {
           criterion_id: criterion.id,
           passed: output.trim().length > 0,
           message: output.trim().length > 0 ? 'Output is non-empty' : 'Output is empty',
         };
 
       case 'no_tables':
         const hasTable = /\|.*\|/.test(output) || /<table/i.test(output);
         return {
           criterion_id: criterion.id,
           passed: !hasTable,
           message: hasTable ? 'Output contains tables' : 'No tables found',
         };
 
       default:
         return {
           criterion_id: criterion.id,
           passed: false,
           message: `Unknown custom check: ${checkName}`,
         };
     }
   }
 }