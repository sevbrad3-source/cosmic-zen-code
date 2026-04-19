 // ============================================================================
 // EVENT STORE - Append-only event log with tamper-evident hashing
 // ============================================================================
 
import { OrchestrationEvent, EventType } from '../types';

// Browser-safe synchronous SHA-256 (FIPS 180-4). Used for tamper-evident chaining
// of in-memory orchestration events; not used for cryptographic security.
function sha256Hex(message: string): string {
  function rotr(n: number, x: number) { return (x >>> n) | (x << (32 - n)); }
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const utf8 = unescape(encodeURIComponent(message));
  const bytes = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) bytes[i] = utf8.charCodeAt(i);
  const bitLen = bytes.length * 8;
  const padLen = ((bytes.length + 9 + 63) & ~63);
  const buf = new Uint8Array(padLen);
  buf.set(bytes); buf[bytes.length] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(padLen - 4, bitLen >>> 0); dv.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000));
  for (let i = 0; i < padLen; i += 64) {
    const W = new Uint32Array(64);
    for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(7, W[t-15]) ^ rotr(18, W[t-15]) ^ (W[t-15] >>> 3);
      const s1 = rotr(17, W[t-2]) ^ rotr(19, W[t-2]) ^ (W[t-2] >>> 10);
      W[t] = (W[t-16] + s0 + W[t-7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const T1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const mj = (a & b) ^ (a & c) ^ (b & c);
      const T2 = (S0 + mj) >>> 0;
      h = g; g = f; f = e; e = (d + T1) >>> 0; d = c; c = b; b = a; a = (T1 + T2) >>> 0;
    }
    H = [(H[0]+a)>>>0,(H[1]+b)>>>0,(H[2]+c)>>>0,(H[3]+d)>>>0,(H[4]+e)>>>0,(H[5]+f)>>>0,(H[6]+g)>>>0,(H[7]+h)>>>0];
  }
  return H.map(v => v.toString(16).padStart(8, '0')).join('');
}
 
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
    return sha256Hex(data);
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