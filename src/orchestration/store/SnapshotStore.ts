 // ============================================================================
 // SNAPSHOT STORE - Materialized state snapshots for fast recovery
 // ============================================================================
 
 import { Snapshot, Task, DagEdge, ContextItem, ArtifactRef, BudgetState, RunMetadata, BudgetConfig, AutonomyMode, RiskyActionPolicy } from '../types';
 
 export class SnapshotStore {
   private snapshots: Map<string, Snapshot> = new Map();
   private latestByRun: Map<string, string> = new Map();
 
   createInitialSnapshot(
     run_id: string,
     project_id: string,
     budgets: BudgetConfig,
     autonomyMode: AutonomyMode = 'autonomous',
     checkpointInterval: number = 10,
     riskyActionPolicy?: RiskyActionPolicy
   ): Snapshot {
     const now = new Date().toISOString();
     
     const snapshot: Snapshot = {
       snapshot_id: crypto.randomUUID(),
       run_id,
       timestamp: now,
       queue_state: [],
       dag_edges: [],
       pinned_context: [],
       working_context: [],
       artifacts_index: [],
       budgets: {
         max_wall_time_ms: budgets.max_wall_time_ms,
         elapsed_wall_time_ms: 0,
         max_output_tokens: budgets.max_output_tokens,
         used_output_tokens: 0,
         max_tool_calls: budgets.max_tool_calls,
         used_tool_calls: 0,
         max_iterations: budgets.max_iterations,
         used_iterations: 0,
         risk_budget: budgets.risk_budget,
         used_risk_budget: 0,
         started_at: now,
       },
       run_metadata: {
         run_id,
         project_id,
         status: 'running',
         autonomy_mode: autonomyMode,
         created_at: now,
         updated_at: now,
         checkpoint_interval: checkpointInterval,
         risky_action_policy: riskyActionPolicy || {
           require_approval: ['delete_file', 'external_api_call', 'database_write'],
           auto_approve: ['read_file', 'list_files'],
           deny: [],
         },
       },
       last_event_id: '',
       last_sequence_number: 0,
     };
 
     this.save(snapshot);
     return snapshot;
   }
 
   save(snapshot: Snapshot): void {
     this.snapshots.set(snapshot.snapshot_id, snapshot);
     this.latestByRun.set(snapshot.run_id, snapshot.snapshot_id);
   }
 
   get(snapshot_id: string): Snapshot | undefined {
     return this.snapshots.get(snapshot_id);
   }
 
   getLatest(run_id: string): Snapshot | undefined {
     const snapshotId = this.latestByRun.get(run_id);
     if (snapshotId) {
       return this.snapshots.get(snapshotId);
     }
     return undefined;
   }
 
   getAllForRun(run_id: string): Snapshot[] {
     return Array.from(this.snapshots.values())
       .filter(s => s.run_id === run_id)
       .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
   }
 
   createCheckpoint(
     currentSnapshot: Snapshot,
     lastEventId: string,
     lastSequenceNumber: number
   ): Snapshot {
     const newSnapshot: Snapshot = {
       ...currentSnapshot,
       snapshot_id: crypto.randomUUID(),
       timestamp: new Date().toISOString(),
       last_event_id: lastEventId,
       last_sequence_number: lastSequenceNumber,
       run_metadata: {
         ...currentSnapshot.run_metadata,
         updated_at: new Date().toISOString(),
       },
     };
 
     this.save(newSnapshot);
     return newSnapshot;
   }
 
   updateQueue(snapshot: Snapshot, tasks: Task[]): Snapshot {
     return {
       ...snapshot,
       queue_state: tasks,
       timestamp: new Date().toISOString(),
     };
   }
 
   updateDag(snapshot: Snapshot, edges: DagEdge[]): Snapshot {
     return {
       ...snapshot,
       dag_edges: edges,
       timestamp: new Date().toISOString(),
     };
   }
 
   updateContext(
     snapshot: Snapshot,
     pinned?: ContextItem[],
     working?: ContextItem[]
   ): Snapshot {
     return {
       ...snapshot,
       pinned_context: pinned ?? snapshot.pinned_context,
       working_context: working ?? snapshot.working_context,
       timestamp: new Date().toISOString(),
     };
   }
 
   updateBudgets(snapshot: Snapshot, budgets: Partial<BudgetState>): Snapshot {
     return {
       ...snapshot,
       budgets: { ...snapshot.budgets, ...budgets },
       timestamp: new Date().toISOString(),
     };
   }
 
   addArtifact(snapshot: Snapshot, artifact: ArtifactRef): Snapshot {
     return {
       ...snapshot,
       artifacts_index: [...snapshot.artifacts_index, artifact],
       timestamp: new Date().toISOString(),
     };
   }
 
   export(run_id: string): string {
     const snapshots = this.getAllForRun(run_id);
     return JSON.stringify(snapshots, null, 2);
   }
 
   import(json: string): void {
     const snapshots = JSON.parse(json) as Snapshot[];
     snapshots.forEach(s => this.save(s));
   }
 
   clear(): void {
     this.snapshots.clear();
     this.latestByRun.clear();
   }
 }
 
 // Singleton
 let globalSnapshotStore: SnapshotStore | null = null;
 
 export function getSnapshotStore(): SnapshotStore {
   if (!globalSnapshotStore) {
     globalSnapshotStore = new SnapshotStore();
   }
   return globalSnapshotStore;
 }
 
 export function resetSnapshotStore(): void {
   globalSnapshotStore = new SnapshotStore();
 }