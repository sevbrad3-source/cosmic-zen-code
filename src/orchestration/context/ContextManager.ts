 // ============================================================================
 // CONTEXT MANAGER - Three-tier context with drift detection
 // ============================================================================
 
 import { ContextItem, ContextTier, Contradiction, OrchestrationEvent } from '../types';
 import { getEventStore } from '../store/EventStore';
 
 export interface ContextStats {
   pinned_count: number;
   pinned_tokens: number;
   working_count: number;
   working_tokens: number;
   long_term_count: number;
   long_term_tokens: number;
   total_tokens: number;
 }
 
 export class ContextManager {
   private pinnedContext: Map<string, ContextItem> = new Map();
   private workingContext: Map<string, ContextItem> = new Map();
   private longTermContext: Map<string, ContextItem> = new Map();
   private run_id: string;
   private maxWorkingTokens: number;
   private maxLongTermItems: number;
 
   constructor(
     run_id: string,
     maxWorkingTokens: number = 8000,
     maxLongTermItems: number = 1000
   ) {
     this.run_id = run_id;
     this.maxWorkingTokens = maxWorkingTokens;
     this.maxLongTermItems = maxLongTermItems;
   }
 
   // Rough token estimation (4 chars per token)
   private estimateTokens(text: string): number {
     return Math.ceil(text.length / 4);
   }
 
   addPinned(item: Omit<ContextItem, 'id' | 'tier' | 'created_at' | 'token_count'>): ContextItem {
     const contextItem: ContextItem = {
       ...item,
       id: crypto.randomUUID(),
       tier: 'pinned',
       created_at: new Date().toISOString(),
       token_count: this.estimateTokens(item.content),
     };
 
     this.pinnedContext.set(contextItem.id, contextItem);
     this.logContextUpdate('ADD_PINNED', contextItem);
     return contextItem;
   }
 
   addToWorking(item: Omit<ContextItem, 'id' | 'tier' | 'created_at' | 'token_count'>): ContextItem {
     const contextItem: ContextItem = {
       ...item,
       id: crypto.randomUUID(),
       tier: 'working',
       created_at: new Date().toISOString(),
       token_count: this.estimateTokens(item.content),
     };
 
     // Check if we need to evict items
     this.enforceWorkingLimit(contextItem.token_count);
 
     this.workingContext.set(contextItem.id, contextItem);
     this.logContextUpdate('ADD_WORKING', contextItem);
     return contextItem;
   }
 
   addToLongTerm(item: Omit<ContextItem, 'id' | 'tier' | 'created_at' | 'token_count'>): ContextItem {
     const contextItem: ContextItem = {
       ...item,
       id: crypto.randomUUID(),
       tier: 'long_term',
       created_at: new Date().toISOString(),
       token_count: this.estimateTokens(item.content),
     };
 
     // Enforce limit by removing oldest items
     while (this.longTermContext.size >= this.maxLongTermItems) {
       const oldest = this.getOldestLongTermItem();
       if (oldest) {
         this.longTermContext.delete(oldest.id);
       }
     }
 
     this.longTermContext.set(contextItem.id, contextItem);
     this.logContextUpdate('ADD_LONG_TERM', contextItem);
     return contextItem;
   }
 
   private enforceWorkingLimit(newTokens: number): void {
     const currentTokens = this.getWorkingTokenCount();
     let tokensToFree = (currentTokens + newTokens) - this.maxWorkingTokens;
 
     if (tokensToFree <= 0) return;
 
     // Sort by priority (lowest first), then by age (oldest first)
     const items = Array.from(this.workingContext.values())
       .sort((a, b) => {
         if (a.priority !== b.priority) return a.priority - b.priority;
         return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
       });
 
     for (const item of items) {
       if (tokensToFree <= 0) break;
 
       // Move to long-term before removing
       this.addToLongTerm({
         type: item.type,
         content: item.content,
         metadata: { ...item.metadata, evicted_from: 'working' },
         priority: item.priority,
         expires_at: item.expires_at,
       });
 
       this.workingContext.delete(item.id);
       tokensToFree -= item.token_count;
       this.logContextUpdate('EVICT_WORKING', item);
     }
   }
 
   private getOldestLongTermItem(): ContextItem | undefined {
     let oldest: ContextItem | undefined;
     for (const item of this.longTermContext.values()) {
       if (!oldest || new Date(item.created_at) < new Date(oldest.created_at)) {
         oldest = item;
       }
     }
     return oldest;
   }
 
   private getWorkingTokenCount(): number {
     return Array.from(this.workingContext.values())
       .reduce((sum, item) => sum + item.token_count, 0);
   }
 
   remove(id: string): boolean {
     if (this.pinnedContext.has(id)) {
       const item = this.pinnedContext.get(id)!;
       this.pinnedContext.delete(id);
       this.logContextUpdate('REMOVE_PINNED', item);
       return true;
     }
     if (this.workingContext.has(id)) {
       const item = this.workingContext.get(id)!;
       this.workingContext.delete(id);
       this.logContextUpdate('REMOVE_WORKING', item);
       return true;
     }
     if (this.longTermContext.has(id)) {
       const item = this.longTermContext.get(id)!;
       this.longTermContext.delete(id);
       this.logContextUpdate('REMOVE_LONG_TERM', item);
       return true;
     }
     return false;
   }
 
   getPinned(): ContextItem[] {
     return Array.from(this.pinnedContext.values());
   }
 
   getWorking(): ContextItem[] {
     return Array.from(this.workingContext.values());
   }
 
   getLongTerm(): ContextItem[] {
     return Array.from(this.longTermContext.values());
   }
 
   getAll(): ContextItem[] {
     return [...this.getPinned(), ...this.getWorking(), ...this.getLongTerm()];
   }
 
   getById(id: string): ContextItem | undefined {
     return this.pinnedContext.get(id) 
       || this.workingContext.get(id) 
       || this.longTermContext.get(id);
   }
 
   // Search long-term context (simple text matching; would use vector search in production)
   searchLongTerm(query: string, limit: number = 10): ContextItem[] {
     const queryLower = query.toLowerCase();
     return Array.from(this.longTermContext.values())
       .filter(item => item.content.toLowerCase().includes(queryLower))
       .slice(0, limit);
   }
 
   // Detect contradictions between new content and pinned context
   detectDrift(newContent: string): Contradiction[] {
     const contradictions: Contradiction[] = [];
     const newContentLower = newContent.toLowerCase();
 
     for (const pinned of this.pinnedContext.values()) {
       if (pinned.type !== 'constraint') continue;
 
       const pinnedLower = pinned.content.toLowerCase();
 
       // Simple contradiction detection: look for negation patterns
       // In production, this would use semantic similarity and LLM-based detection
       
       // Check for direct negation patterns
       const negationPatterns = [
         { pattern: /must not/i, opposite: /must/i },
         { pattern: /never/i, opposite: /always/i },
         { pattern: /do not/i, opposite: /do/i },
         { pattern: /forbidden/i, opposite: /required/i },
       ];
 
       for (const { pattern, opposite } of negationPatterns) {
         if (pattern.test(pinnedLower) && opposite.test(newContentLower)) {
           // Extract the key subject
           const subject = this.extractSubject(pinned.content);
           if (newContentLower.includes(subject.toLowerCase())) {
             contradictions.push({
               type: 'constraint_violation',
               description: `New content may violate pinned constraint: "${pinned.content}"`,
               evidence: [pinned.content, newContent],
               severity: 'high',
             });
           }
         }
       }
     }
 
     if (contradictions.length > 0) {
       getEventStore().append(this.run_id, 'AUDIT_NOTE', {
         type: 'DRIFT_DETECTED',
         contradictions,
       });
     }
 
     return contradictions;
   }
 
   private extractSubject(constraint: string): string {
     // Simple extraction: take the main noun phrase after "must/never/always"
     const match = constraint.match(/(?:must|never|always|do not|forbidden|required)\s+(.+?)(?:\.|$)/i);
     return match ? match[1].trim() : constraint;
   }
 
   // Create a summary of working context for checkpointing
   summarizeWorking(): string {
     const items = this.getWorking();
     if (items.length === 0) return 'No working context items.';
 
     const summary = items
       .map(item => `[${item.type}] ${item.content.slice(0, 100)}${item.content.length > 100 ? '...' : ''}`)
       .join('\n');
 
     return summary;
   }
 
   // Build context for current task
   buildContextForTask(taskId: string, taskPrompt: string): string {
     const sections: string[] = [];
 
     // Pinned constraints (always included)
     const pinned = this.getPinned();
     if (pinned.length > 0) {
       sections.push('## Constraints & Definitions\n' + 
         pinned.map(p => `- ${p.content}`).join('\n'));
     }
 
     // Working context
     const working = this.getWorking();
     if (working.length > 0) {
       sections.push('## Current Context\n' + 
         working.map(w => `### ${w.type}\n${w.content}`).join('\n\n'));
     }
 
     // Relevant long-term items (search by task prompt)
     const relevant = this.searchLongTerm(taskPrompt, 5);
     if (relevant.length > 0) {
       sections.push('## Relevant History\n' + 
         relevant.map(r => `- ${r.content.slice(0, 200)}...`).join('\n'));
     }
 
     return sections.join('\n\n');
   }
 
   getStats(): ContextStats {
     const pinned = this.getPinned();
     const working = this.getWorking();
     const longTerm = this.getLongTerm();
 
     const pinnedTokens = pinned.reduce((sum, i) => sum + i.token_count, 0);
     const workingTokens = working.reduce((sum, i) => sum + i.token_count, 0);
     const longTermTokens = longTerm.reduce((sum, i) => sum + i.token_count, 0);
 
     return {
       pinned_count: pinned.length,
       pinned_tokens: pinnedTokens,
       working_count: working.length,
       working_tokens: workingTokens,
       long_term_count: longTerm.length,
       long_term_tokens: longTermTokens,
       total_tokens: pinnedTokens + workingTokens + longTermTokens,
     };
   }
 
   private logContextUpdate(action: string, item: ContextItem): void {
     getEventStore().append(this.run_id, 'CONTEXT_UPDATED', {
       action,
       item_id: item.id,
       tier: item.tier,
       type: item.type,
       token_count: item.token_count,
     });
   }
 
   clear(): void {
     this.pinnedContext.clear();
     this.workingContext.clear();
     this.longTermContext.clear();
   }
 
   loadFromSnapshot(pinned: ContextItem[], working: ContextItem[]): void {
     this.pinnedContext.clear();
     this.workingContext.clear();
     
     pinned.forEach(item => this.pinnedContext.set(item.id, item));
     working.forEach(item => this.workingContext.set(item.id, item));
   }
 }