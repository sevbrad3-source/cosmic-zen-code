 // ============================================================================
 // EVENT STORE - Append-only event log with tamper-evident hashing
 // ============================================================================
 
 import { OrchestrationEvent, EventType } from '../types';
 import { createHash } from 'crypto';
 
 export class EventStore {
   private events: OrchestrationEvent[] = [];
   private listeners: Map<string, ((event: OrchestrationEvent) => void)[]> = new Map();
   private lastHash: string = '0'.repeat(64);
   private sequenceNumber: number = 0;
 
   constructor(initialEvents?: OrchestrationEvent[]) {
     if (initialEvents) {
       this.events = initialEvents;
       if (initialEvents.length > 0) {
         const lastEvent = initialEvents[initialEvents.length - 1];
         this.lastHash = lastEvent.hash_self;
         this.sequenceNumber = lastEvent.sequence_number;
       }
     }
   }
 
   private computeHash(data: string): string {
     return createHash('sha256').update(data).digest('hex');
   }
 
   private createEventHash(event: Omit<OrchestrationEvent, 'hash_self'>): string {
     const payload = JSON.stringify({
       event_id: event.event_id,
       run_id: event.run_id,
       timestamp: event.timestamp,
       type: event.type,
       payload: event.payload,
       hash_prev: event.hash_prev,
       sequence_number: event.sequence_number,
     });
     return this.computeHash(payload);
   }
 
   append(
     run_id: string,
     type: EventType,
     payload: Record<string, unknown>
   ): OrchestrationEvent {
     this.sequenceNumber++;
     
     const partialEvent: Omit<OrchestrationEvent, 'hash_self'> = {
       event_id: crypto.randomUUID(),
       run_id,
       timestamp: new Date().toISOString(),
       type,
       payload,
       hash_prev: this.lastHash,
       sequence_number: this.sequenceNumber,
     };
 
     const hash_self = this.createEventHash(partialEvent);
     const event: OrchestrationEvent = { ...partialEvent, hash_self };
     
     this.events.push(event);
     this.lastHash = hash_self;
 
     // Notify listeners
     const typeListeners = this.listeners.get(type) || [];
     const allListeners = this.listeners.get('*') || [];
     [...typeListeners, ...allListeners].forEach(listener => listener(event));
 
     return event;
   }
 
   getEvents(run_id?: string): OrchestrationEvent[] {
     if (run_id) {
       return this.events.filter(e => e.run_id === run_id);
     }
     return [...this.events];
   }
 
   getEventsByType(type: EventType, run_id?: string): OrchestrationEvent[] {
     return this.getEvents(run_id).filter(e => e.type === type);
   }
 
   getEventsAfter(sequence_number: number, run_id?: string): OrchestrationEvent[] {
     return this.getEvents(run_id).filter(e => e.sequence_number > sequence_number);
   }
 
   getEventById(event_id: string): OrchestrationEvent | undefined {
     return this.events.find(e => e.event_id === event_id);
   }
 
   getLastEvent(run_id?: string): OrchestrationEvent | undefined {
     const events = this.getEvents(run_id);
     return events[events.length - 1];
   }
 
   verifyChain(): { valid: boolean; brokenAt?: number; error?: string } {
     if (this.events.length === 0) {
       return { valid: true };
     }
 
     let expectedPrevHash = '0'.repeat(64);
 
     for (let i = 0; i < this.events.length; i++) {
       const event = this.events[i];
 
       // Verify hash_prev
       if (event.hash_prev !== expectedPrevHash) {
         return {
           valid: false,
           brokenAt: i,
           error: `Hash chain broken at event ${i}: expected prev ${expectedPrevHash}, got ${event.hash_prev}`,
         };
       }
 
       // Verify hash_self
       const computedHash = this.createEventHash({
         event_id: event.event_id,
         run_id: event.run_id,
         timestamp: event.timestamp,
         type: event.type,
         payload: event.payload,
         hash_prev: event.hash_prev,
         sequence_number: event.sequence_number,
       });
 
       if (event.hash_self !== computedHash) {
         return {
           valid: false,
           brokenAt: i,
           error: `Self-hash mismatch at event ${i}: expected ${computedHash}, got ${event.hash_self}`,
         };
       }
 
       expectedPrevHash = event.hash_self;
     }
 
     return { valid: true };
   }
 
   subscribe(type: EventType | '*', listener: (event: OrchestrationEvent) => void): () => void {
     if (!this.listeners.has(type)) {
       this.listeners.set(type, []);
     }
     this.listeners.get(type)!.push(listener);
 
     // Return unsubscribe function
     return () => {
       const typeListeners = this.listeners.get(type);
       if (typeListeners) {
         const index = typeListeners.indexOf(listener);
         if (index > -1) {
           typeListeners.splice(index, 1);
         }
       }
     };
   }
 
   export(): string {
     return JSON.stringify(this.events, null, 2);
   }
 
   static import(json: string): EventStore {
     const events = JSON.parse(json) as OrchestrationEvent[];
     return new EventStore(events);
   }
 
   getSequenceNumber(): number {
     return this.sequenceNumber;
   }
 
   getLastHash(): string {
     return this.lastHash;
   }
 
   clear(): void {
     this.events = [];
     this.lastHash = '0'.repeat(64);
     this.sequenceNumber = 0;
   }
 }
 
 // Singleton for global access
 let globalEventStore: EventStore | null = null;
 
 export function getEventStore(): EventStore {
   if (!globalEventStore) {
     globalEventStore = new EventStore();
   }
   return globalEventStore;
 }
 
 export function resetEventStore(): void {
   globalEventStore = new EventStore();
 }